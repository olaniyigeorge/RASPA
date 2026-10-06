import { ForbiddenError, NotFoundError } from "../../../shared/kernel/errors";
import type { SubscriptionEvent } from "../../../shared/kernel/settlement";
import * as M from "../domain/management";
import type { ManagementRepository, TicketCategory, TicketStatus } from "../domain/management";

interface Actor {
  id: string;
  role: string;
  email?: string;
}

interface Deps {
  payments: {
    initiate(
      actor: { id: string; email: string },
      i: { propertyId: string; planType: "SUBSCRIPTION"; amount: number; subscriptionId: string; paystackPlan?: string }
    ): Promise<{ paymentId: string; authorizationUrl: string }>;
  };
  repo: ManagementRepository;
}

export const makeManagementUseCases = (d: Deps) => {
  const assertAccess = async (a: Actor, propertyId: string) => {
    if (a.role !== "ADMIN" && !(await d.repo.canManage(propertyId, a.id))) throw new ForbiddenError();
  };

  return {
    listPlans: () => d.repo.listActivePlans(),

    async subscribe(actor: Required<Actor>, propertyId: string, planCode: string) {
      await assertAccess(actor, propertyId);
      const plan = await d.repo.findPlanByCode(planCode);
      if (!plan || !plan.active) throw new NotFoundError("Plan");

      const sub = await d.repo.createSubscription({ propertyId, subscriberId: actor.id, planId: plan.id });
      return d.payments.initiate(actor, {
        propertyId,
        planType: "SUBSCRIPTION",
        amount: plan.amount,
        subscriptionId: sub.id,
        paystackPlan: plan.paystackPlanCode ?? undefined,
      });
    },

    /** First payment settled: the subscription starts. */
    async activateFromPayment(subscriptionId: string) {
      const row = await d.repo.findSubscriptionWithPlan(subscriptionId);
      if (!row) throw new NotFoundError("Subscription");
      const next = M.activate(row, M.periodEndFor(row.plan.interval));
      await d.repo.updateSubscription(row.id, { status: next.status, currentPeriodEnd: next.currentPeriodEnd });
    },

    /** Paystack subscription lifecycle events (renewal, failure, cancellation). */
    async onSubscriptionEvent(e: SubscriptionEvent) {
      if (!e.subscriptionCode) return;
      if (e.type === "created") {
        // match the pending/active subscription of this customer on that plan
        const sub = await d.repo.findPendingSubscription(e.customerEmail, e.planCode);
        if (sub) await d.repo.linkPaystackSubscription(sub.id, e.subscriptionCode, e.nextPaymentDate);
        return;
      }
      const data =
        e.type === "renewed"
          ? { status: "ACTIVE" as const, currentPeriodEnd: e.nextPaymentDate }
          : e.type === "payment_failed"
            ? { status: "PAST_DUE" as const }
            : { status: "CANCELLED" as const };
      await d.repo.updateSubscriptionsByPaystackCode(e.subscriptionCode, data);
    },

    // ---- the per-property dashboard ----------------------------------------

    async dashboard(actor: Actor, propertyId: string) {
      await assertAccess(actor, propertyId);
      const [subscription, tickets] = await Promise.all([
        d.repo.findActiveSubscription(propertyId),
        d.repo.listTickets(propertyId),
      ]);
      const outstanding = tickets
        .filter((t) => t.status !== "RESOLVED" && t.amountDue)
        .reduce((sum, t) => sum + (t.amountDue ?? 0), 0);
      return { entitled: M.isEntitled(subscription), subscription, tickets, outstanding };
    },

    async raiseTicket(
      actor: Actor,
      propertyId: string,
      i: { category: TicketCategory; title: string; description?: string; amountDue?: number; dueDate?: Date }
    ) {
      await assertAccess(actor, propertyId);
      M.assertEntitled(await d.repo.findActiveSubscription(propertyId));
      return d.repo.createTicket({ ...i, propertyId, raisedById: actor.id });
    },

    async updateTicket(actor: Actor, ticketId: string, to: TicketStatus) {
      const t = await d.repo.findTicket(ticketId);
      if (!t) throw new NotFoundError("Ticket");
      await assertAccess(actor, t.propertyId);
      const next = M.moveTicket(t, to);
      await d.repo.updateTicket(t.id, { status: next.status, resolvedAt: next.status === "RESOLVED" ? new Date() : null });
    },
  };
};
