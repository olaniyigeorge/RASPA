import { DomainError, ForbiddenError, NotFoundError, UnauthorizedError } from "../../../shared/kernel/errors";
import { toKobo } from "../../../shared/kernel/money";
import {
  publishPayoutPaid,
  publishPaymentSettled,
  publishSubscriptionEvent,
  type PaymentPurpose,
  type PayoutKind,
} from "../../../shared/kernel/settlement";
import { amountMatches, markSuccessful } from "../domain/payment";
import type {
  PaymentGateway,
  PaymentRepository,
  PayoutAccountRepository,
  PayoutRepository,
} from "../domain/ports";

interface Deps {
  payments: PaymentRepository;
  payouts: PayoutRepository;
  accounts: PayoutAccountRepository;
  gateway: PaymentGateway;
  appUrl: string;
  /** Price lookup so the server, not the client, decides what a property costs. */
  listingPrice(propertyId: string): Promise<{ price: number; currency: string }>;
}

export interface InitiatePaymentInput {
  propertyId: string;
  planType: PaymentPurpose;
  amount: number;
  sublistingId?: string;
  subscriptionId?: string;
  captureTaskId?: string;
  paystackPlan?: string;
}

export const makePaymentUseCases = (d: Deps) => {
  async function initiate(actor: { id: string; email: string }, input: InitiatePaymentInput) {
    if (!(input.amount > 0)) throw new DomainError("Amount must be positive", "INVALID_AMOUNT", 400);
    const { currency } = await d.listingPrice(input.propertyId);

    const payment = await d.payments.create({
      userId: actor.id,
      propertyId: input.propertyId,
      planType: input.planType,
      amount: input.amount,
      currency,
      sublistingId: input.sublistingId ?? null,
      subscriptionId: input.subscriptionId ?? null,
      captureTaskId: input.captureTaskId ?? null,
    });

    try {
      const { authorizationUrl } = await d.gateway.initialize({
        email: actor.email,
        amountKobo: toKobo(input.amount),
        reference: payment.id,
        callbackUrl: `${d.appUrl}/confirm-payment/${payment.id}`,
        plan: input.paystackPlan,
        metadata: { paymentId: payment.id, planType: input.planType },
      });
      await d.payments.setStatus(payment.id, "PENDING", payment.id);
      return { paymentId: payment.id, authorizationUrl };
    } catch (err) {
      await d.payments.setStatus(payment.id, "FAILED");
      throw err;
    }
  }

  /** Plain property payment (buy / rent / installment / invest) from a seeker. */
  async function initiateForProperty(
    actor: { id: string; email: string },
    input: { propertyId: string; planType: "BUY_NOW" | "INSTALLMENTS" | "INVEST" | "RENT"; amount: number }
  ) {
    const { price } = await d.listingPrice(input.propertyId);
    const partial = input.planType === "INSTALLMENTS" || input.planType === "INVEST";
    const amount = partial ? Math.min(input.amount, price) : price;
    return initiate(actor, { ...input, amount });
  }

  async function processPayout(payoutId: string): Promise<"processing" | "no_account" | "skipped"> {
    const payout = await d.payouts.findById(payoutId);
    if (!payout || payout.status !== "PENDING") return "skipped";
    const account = await d.accounts.findByUser(payout.recipientId);
    if (!account) return "no_account";

    await d.gateway.transfer({
      amountKobo: toKobo(payout.amount),
      recipientCode: account.recipientCode,
      reference: payout.id,
      reason: payout.kind === "TENANT_COMMISSION" ? "RASPA tenant commission" : "RASPA capture task payout",
    });
    await d.payouts.setStatus(payout.id, "PROCESSING", { providerRef: payout.id });
    return "processing";
  }

  return {
    initiate,
    initiateForProperty,
    processPayout,

    async getPayment(actor: { id: string; role: string }, id: string) {
      const p = await d.payments.findById(id);
      if (!p) throw new NotFoundError("Payment");
      if (p.userId !== actor.id && actor.role !== "ADMIN") throw new ForbiddenError();
      return p;
    },

    /** Queue a payout; it is sent immediately if the recipient already has a payout account. */
    async createPayout(input: {
      recipientId: string;
      kind: PayoutKind;
      amount: number;
      captureTaskId?: string;
      sublistingId?: string;
    }) {
      const payout = await d.payouts.create(input);
      await processPayout(payout.id).catch((err) => console.error("payout transfer failed", err));
      return payout;
    },

    async setPayoutAccount(
      actor: { id: string; name?: string | null },
      input: { bankCode: string; accountNumber: string; accountName: string }
    ) {
      if (!actor.id) throw new UnauthorizedError();
      const { recipientCode } = await d.gateway.createRecipient({
        name: input.accountName,
        accountNumber: input.accountNumber,
        bankCode: input.bankCode,
      });
      await d.accounts.upsert({ userId: actor.id, ...input, recipientCode });
      // anything that was waiting on bank details can go out now
      for (const p of await d.payouts.findPendingFor(actor.id)) {
        await processPayout(p.id).catch((err) => console.error("payout transfer failed", err));
      }
    },

    async handleWebhook(rawBody: string, signature: string | null) {
      if (!d.gateway.verifyWebhookSignature(rawBody, signature)) {
        throw new DomainError("Invalid signature", "BAD_SIGNATURE", 401);
      }
      // Paystack payloads vary per event; fields are read defensively below.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const event = JSON.parse(rawBody) as { event: string; data: Record<string, any> };
      const data = event.data ?? {};

      switch (event.event) {
        case "charge.success": {
          const payment = await d.payments.findByReference(String(data.reference));
          if (!payment) return; // not ours (e.g. a plan renewal charge, handled via invoice events)
          const { payment: next, changed } = markSuccessful(payment);
          if (!changed) return;
          if (!amountMatches(payment, Number(data.amount))) {
            await d.payments.setStatus(payment.id, "FAILED");
            console.error(`Paystack amount mismatch for payment ${payment.id}: got ${data.amount}`);
            return;
          }
          await d.payments.setStatus(next.id, "SUCCESSFUL");
          await publishPaymentSettled({
            id: next.id,
            userId: next.userId,
            propertyId: next.propertyId,
            planType: next.planType,
            amount: next.amount,
            sublistingId: next.sublistingId,
            subscriptionId: next.subscriptionId,
            captureTaskId: next.captureTaskId,
          });
          return;
        }
        case "transfer.success":
        case "transfer.failed":
        case "transfer.reversed": {
          const payout = await d.payouts.findById(String(data.reference));
          if (!payout || payout.status === "PAID") return;
          if (event.event === "transfer.success") {
            await d.payouts.setStatus(payout.id, "PAID");
            await publishPayoutPaid({
              id: payout.id,
              kind: payout.kind,
              captureTaskId: payout.captureTaskId,
              sublistingId: payout.sublistingId,
            });
          } else {
            await d.payouts.setStatus(payout.id, "FAILED", { failureReason: String(data.reason ?? event.event) });
          }
          return;
        }
        case "subscription.create":
          return publishSubscriptionEvent({
            type: "created",
            subscriptionCode: data.subscription_code,
            planCode: data.plan?.plan_code,
            customerEmail: data.customer?.email,
            nextPaymentDate: data.next_payment_date ? new Date(data.next_payment_date) : undefined,
          });
        case "invoice.update":
          // fires on every billing attempt; only a paid invoice is a renewal
          if (data.paid !== true && data.status !== "success") return;
          return publishSubscriptionEvent({
            type: "renewed",
            subscriptionCode: data.subscription?.subscription_code,
            nextPaymentDate: data.subscription?.next_payment_date
              ? new Date(data.subscription.next_payment_date)
              : undefined,
          });
        case "invoice.payment_failed":
          return publishSubscriptionEvent({
            type: "payment_failed",
            subscriptionCode: data.subscription?.subscription_code,
          });
        case "subscription.disable":
        case "subscription.not_renew":
          return publishSubscriptionEvent({ type: "disabled", subscriptionCode: data.subscription_code });
      }
    },
  };
};
