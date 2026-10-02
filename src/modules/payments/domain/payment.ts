import type { PaymentPurpose, PayoutKind } from "../../../shared/kernel/settlement";

export type PaymentStatus = "PENDING" | "PROCESSING" | "SUCCESSFUL" | "FAILED" | "REFUNDED";

export interface Payment {
  id: string;
  userId: string;
  propertyId: string;
  planType: PaymentPurpose;
  status: PaymentStatus;
  amount: number;
  currency: string;
  providerRef: string | null;
  sublistingId: string | null;
  subscriptionId: string | null;
  captureTaskId: string | null;
}

/** Idempotent: webhooks are delivered at least once. */
export function markSuccessful(p: Payment): { payment: Payment; changed: boolean } {
  if (p.status === "SUCCESSFUL" || p.status === "REFUNDED") return { payment: p, changed: false };
  return { payment: { ...p, status: "SUCCESSFUL" }, changed: true };
}

/**
 * Plan-based charges (subscriptions) are priced by Paystack's plan, so the
 * amount can only be checked as a floor; everything else must match exactly.
 */
export function amountMatches(p: Pick<Payment, "planType" | "amount">, paidKobo: number): boolean {
  const expected = Math.round(p.amount * 100);
  return p.planType === "SUBSCRIPTION" ? paidKobo >= expected : paidKobo === expected;
}

export type PayoutStatus = "PENDING" | "PROCESSING" | "PAID" | "FAILED";

export interface Payout {
  id: string;
  recipientId: string;
  kind: PayoutKind;
  status: PayoutStatus;
  amount: number;
  currency: string;
  captureTaskId: string | null;
  sublistingId: string | null;
}

export interface PayoutAccount {
  userId: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  recipientCode: string;
}
