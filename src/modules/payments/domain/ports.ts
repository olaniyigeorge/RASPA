import type { Payment, PaymentStatus, Payout, PayoutAccount, PayoutStatus } from "./payment";
import type { PayoutKind } from "../../../shared/kernel/settlement";

export interface PaymentRepository {
  create(input: Omit<Payment, "id" | "status" | "providerRef">): Promise<Payment>;
  findById(id: string): Promise<Payment | null>;
  findByReference(ref: string): Promise<Payment | null>;
  setStatus(id: string, status: PaymentStatus, providerRef?: string): Promise<void>;
}

export interface PayoutRepository {
  create(input: {
    recipientId: string;
    kind: PayoutKind;
    amount: number;
    captureTaskId?: string;
    sublistingId?: string;
  }): Promise<Payout>;
  findById(id: string): Promise<Payout | null>;
  setStatus(id: string, status: PayoutStatus, extra?: { providerRef?: string; failureReason?: string }): Promise<void>;
  findPendingFor(recipientId: string): Promise<Payout[]>;
}

export interface PayoutAccountRepository {
  findByUser(userId: string): Promise<PayoutAccount | null>;
  upsert(a: PayoutAccount): Promise<void>;
}

export interface PaymentGateway {
  initialize(i: {
    email: string;
    amountKobo: number;
    reference: string;
    callbackUrl: string;
    plan?: string;
    metadata?: Record<string, unknown>;
  }): Promise<{ authorizationUrl: string }>;
  verifyWebhookSignature(rawBody: string, signature: string | null): boolean;
  createRecipient(i: { name: string; accountNumber: string; bankCode: string }): Promise<{ recipientCode: string }>;
  transfer(i: {
    amountKobo: number;
    recipientCode: string;
    reference: string;
    reason: string;
  }): Promise<void>;
}
