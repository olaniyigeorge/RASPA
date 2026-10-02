import { prisma } from "../../../shared/infrastructure/prisma";
import { fromDecimal } from "../../../shared/kernel/money";
import type { Payment, Payout } from "../domain/payment";
import type { PaymentRepository, PayoutAccountRepository, PayoutRepository } from "../domain/ports";
import type { Payment as PaymentRow, Payout as PayoutRow } from "../../../../prisma/prisma-client";

const toPayment = (r: PaymentRow): Payment => ({
  id: r.id,
  userId: r.userId,
  propertyId: r.propertyId,
  planType: r.planType,
  status: r.status,
  amount: fromDecimal(r.amount),
  currency: r.currency,
  providerRef: r.providerRef,
  sublistingId: r.sublistingId,
  subscriptionId: r.subscriptionId,
  captureTaskId: r.captureTaskId,
});

const toPayout = (r: PayoutRow): Payout => ({
  id: r.id,
  recipientId: r.recipientId,
  kind: r.kind,
  status: r.status,
  amount: fromDecimal(r.amount),
  currency: r.currency,
  captureTaskId: r.captureTaskId,
  sublistingId: r.sublistingId,
});

export const prismaPaymentRepository: PaymentRepository = {
  async create(input) {
    return toPayment(await prisma.payment.create({ data: { ...input, provider: "paystack" } }));
  },
  async findById(id) {
    const r = await prisma.payment.findUnique({ where: { id } });
    return r ? toPayment(r) : null;
  },
  async findByReference(ref) {
    const r = await prisma.payment.findUnique({ where: { providerRef: ref } });
    return r ? toPayment(r) : null;
  },
  async setStatus(id, status, providerRef) {
    await prisma.payment.update({ where: { id }, data: { status, ...(providerRef && { providerRef }) } });
  },
};

export const prismaPayoutRepository: PayoutRepository = {
  async create({ recipientId, kind, amount, captureTaskId, sublistingId }) {
    return toPayout(await prisma.payout.create({ data: { recipientId, kind, amount, captureTaskId, sublistingId } }));
  },
  async findById(id) {
    const r = await prisma.payout.findUnique({ where: { id } });
    return r ? toPayout(r) : null;
  },
  async setStatus(id, status, extra) {
    await prisma.payout.update({ where: { id }, data: { status, ...extra } });
  },
  async findPendingFor(recipientId) {
    return (await prisma.payout.findMany({ where: { recipientId, status: "PENDING" } })).map(toPayout);
  },
};

export const prismaPayoutAccountRepository: PayoutAccountRepository = {
  async findByUser(userId) {
    return prisma.payoutAccount.findUnique({ where: { userId } });
  },
  async upsert(a) {
    await prisma.payoutAccount.upsert({ where: { userId: a.userId }, create: a, update: a });
  },
};
