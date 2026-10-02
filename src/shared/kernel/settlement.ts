// Decouples the payments context from the contexts that react to money moving.
// Payments announces a settled payment/payout; rentals, management and media
// register what to do about it. Handlers are registered in modules/bootstrap.ts.

export type PaymentPurpose =
  | "BUY_NOW"
  | "INSTALLMENTS"
  | "INVEST"
  | "RENT"
  | "SUBSCRIPTION"
  | "MEDIA_CAPTURE";

export interface SettledPayment {
  id: string;
  userId: string;
  propertyId: string;
  planType: PaymentPurpose;
  amount: number;
  sublistingId: string | null;
  subscriptionId: string | null;
  captureTaskId: string | null;
}

export type PayoutKind = "CONTRACTOR_TASK" | "TENANT_COMMISSION";

export interface SettledPayout {
  id: string;
  kind: PayoutKind;
  captureTaskId: string | null;
  sublistingId: string | null;
}

type PaymentHandler = (payment: SettledPayment) => Promise<void>;
type PayoutHandler = (payout: SettledPayout) => Promise<void>;

const paymentHandlers = new Map<PaymentPurpose, PaymentHandler[]>();
const payoutHandlers = new Map<PayoutKind, PayoutHandler[]>();

export function onPaymentSettled(purpose: PaymentPurpose, handler: PaymentHandler) {
  paymentHandlers.set(purpose, [...(paymentHandlers.get(purpose) ?? []), handler]);
}

export function onPayoutPaid(kind: PayoutKind, handler: PayoutHandler) {
  payoutHandlers.set(kind, [...(payoutHandlers.get(kind) ?? []), handler]);
}

export async function publishPaymentSettled(payment: SettledPayment) {
  for (const h of paymentHandlers.get(payment.planType) ?? []) await h(payment);
}

export async function publishPayoutPaid(payout: SettledPayout) {
  for (const h of payoutHandlers.get(payout.kind) ?? []) await h(payout);
}

// ---- Paystack subscription lifecycle (management context reacts) ----------

export interface SubscriptionEvent {
  type: "created" | "renewed" | "payment_failed" | "disabled";
  subscriptionCode: string;
  planCode?: string;
  customerEmail?: string;
  nextPaymentDate?: Date;
}

type SubscriptionHandler = (e: SubscriptionEvent) => Promise<void>;
const subscriptionHandlers: SubscriptionHandler[] = [];

export const onSubscriptionEvent = (h: SubscriptionHandler) => subscriptionHandlers.push(h);
export async function publishSubscriptionEvent(e: SubscriptionEvent) {
  for (const h of subscriptionHandlers) await h(e);
}
