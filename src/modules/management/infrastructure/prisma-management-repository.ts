import type { ManagementPlan, ManagementTicket } from "../../../../prisma/prisma-client";
import { prisma } from "../../../shared/infrastructure/prisma";
import { fromDecimal } from "../../../shared/kernel/money";
import type { ManagementRepository, Plan, TicketRecord } from "../domain/management";

// Decimals become plain numbers here so the application layer never sees Prisma types.
const toPlan = (p: ManagementPlan): Plan => ({ ...p, amount: fromDecimal(p.amount) });

const toTicket = (t: ManagementTicket): TicketRecord => ({
  ...t,
  amountDue: t.amountDue === null ? null : fromDecimal(t.amountDue),
});

export const prismaManagementRepository: ManagementRepository = {
  async listActivePlans() {
    const rows = await prisma.managementPlan.findMany({ where: { active: true }, orderBy: { amount: "asc" } });
    return rows.map(toPlan);
  },

  async findPlanByCode(code) {
    const row = await prisma.managementPlan.findUnique({ where: { code } });
    return row ? toPlan(row) : null;
  },

  findActiveSubscription: (propertyId) =>
    prisma.managementSubscription.findFirst({
      where: { propertyId, status: { in: ["ACTIVE", "PAST_DUE"] } },
      orderBy: { createdAt: "desc" },
    }),

  createSubscription: (i) => prisma.managementSubscription.create({ data: i }),

  async findSubscriptionWithPlan(id) {
    const row = await prisma.managementSubscription.findUnique({ where: { id }, include: { plan: true } });
    return row ? { ...row, plan: toPlan(row.plan) } : null;
  },

  async updateSubscription(id, data) {
    await prisma.managementSubscription.update({ where: { id }, data });
  },

  findPendingSubscription: (customerEmail, paystackPlanCode) =>
    prisma.managementSubscription.findFirst({
      where: {
        paystackSubscriptionCode: null,
        subscriber: { email: customerEmail },
        plan: { paystackPlanCode },
      },
      orderBy: { createdAt: "desc" },
    }),

  async linkPaystackSubscription(id, subscriptionCode, currentPeriodEnd) {
    await prisma.managementSubscription.update({
      where: { id },
      data: { paystackSubscriptionCode: subscriptionCode, currentPeriodEnd },
    });
  },

  async updateSubscriptionsByPaystackCode(subscriptionCode, data) {
    await prisma.managementSubscription.updateMany({ where: { paystackSubscriptionCode: subscriptionCode }, data });
  },

  async listTickets(propertyId) {
    const rows = await prisma.managementTicket.findMany({ where: { propertyId }, orderBy: { createdAt: "desc" } });
    return rows.map(toTicket);
  },

  async createTicket(i) {
    return toTicket(await prisma.managementTicket.create({ data: i }));
  },

  async findTicket(id) {
    const row = await prisma.managementTicket.findUnique({ where: { id } });
    return row ? toTicket(row) : null;
  },

  async updateTicket(id, data) {
    await prisma.managementTicket.update({ where: { id }, data });
  },

  async canManage(propertyId, userId) {
    const p = await prisma.property.findFirst({
      where: {
        id: propertyId,
        OR: [
          { listerId: userId },
          { ownerUserId: userId },
          { tenancies: { some: { tenantId: userId, status: "ACTIVE" } } },
        ],
      },
      select: { id: true },
    });
    return !!p;
  },
};
