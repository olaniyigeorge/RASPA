import { ForbiddenError, NotFoundError } from "../../../shared/kernel/errors";
import type { SubscriptionEvent } from "../../../shared/kernel/settlement";
import * as M from "../domain/management";
import type { TicketCategory, TicketStatus } from "../domain/management";
import { prisma } from "../../../shared/infrastructure/prisma";
import { fromDecimal } from "../../../shared/kernel/money";

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
  /** Lister or active tenant of the property. */
  canManage(propertyId: string, userId: string): Promise<boolean>;
}

export const makeManagementUseCases = (d: Deps) => {
  const assertAccess = async (a: Actor, propertyId: string) => {
    if (a.role !== "ADMIN" && !(await d.canManage(propertyId, a.id))) throw new ForbiddenError();
  };

  const activeSubscription = (propertyId: string) =>
    prisma.managementSubscription.findFirst({
      where: { propertyId, status: { in: ["ACTIVE", "PAST_DUE"] } },
      orderBy: { createdAt: "desc" },
    });

  return {
    listPlans: () => prisma.managementPlan.findMany({ where: { active: true }, orderBy: { amount: "asc" } }),

    async subscribe(actor: Required<Actor>, propertyId: string, planCode: string) {
      await assertAccess(actor, propertyId);
      const plan = await prisma.managementPlan.findUnique({ where: { code: planCode } });
      if (!plan || !plan.active) throw new NotFoundError("Plan");

      const sub = await prisma.managementSubscription.create({
        data: { propertyId, subscriberId: actor.id, planId: plan.id },
      });
      return d.payments.initiate(actor, {
        propertyId,
        planType: "SUBSCRIPTION",
        amount: fromDecimal(plan.amount),
        subscriptionId: sub.id,
        paystackPlan: plan.paystackPlanCode ?? undefined,
      });
    },

    /** First payment settled: the subscription starts. */
    async activateFromPayment(subscriptionId: string) {
      const row = await prisma.managementSubscription.findUnique({
        where: { id: subscriptionId },
        include: { plan: true },
      });
      if (!row) throw new NotFoundError("Subscription");
      const next = M.activate(
        { ...row, paystackSubscriptionCode: row.paystackSubscriptionCode },
        M.periodEndFor(row.plan.interval)
      );
      await prisma.managementSubscription.update({
        where: { id: row.id },
        data: { status: next.status, currentPeriodEnd: next.currentPeriodEnd },
      });
    },

    /** Paystack subscription lifecycle events (renewal, failure, cancellation). */
    async onSubscriptionEvent(e: SubscriptionEvent) {
      if (!e.subscriptionCode) return;
      if (e.type === "created") {
        // match the pending/active subscription of this customer on that plan
        const sub = await prisma.managementSubscription.findFirst({
          where: {
            paystackSubscriptionCode: null,
            subscriber: { email: e.customerEmail },
            plan: { paystackPlanCode: e.planCode },
          },
          orderBy: { createdAt: "desc" },
        });
        if (sub) {
          await prisma.managementSubscription.update({
            where: { id: sub.id },
            data: { paystackSubscriptionCode: e.subscriptionCode, currentPeriodEnd: e.nextPaymentDate },
          });
        }
        return;
      }
      const data =
        e.type === "renewed"
          ? { status: "ACTIVE" as const, currentPeriodEnd: e.nextPaymentDate }
          : e.type === "payment_failed"
            ? { status: "PAST_DUE" as const }
            : { status: "CANCELLED" as const };
      await prisma.managementSubscription.updateMany({
        where: { paystackSubscriptionCode: e.subscriptionCode },
        data,
      });
    },

    // ---- the per-property dashboard ----------------------------------------

    async dashboard(actor: Actor, propertyId: string) {
      await assertAccess(actor, propertyId);
      const [subscription, tickets] = await Promise.all([
        activeSubscription(propertyId),
        prisma.managementTicket.findMany({ where: { propertyId }, orderBy: { createdAt: "desc" } }),
      ]);
      const outstanding = tickets
        .filter((t) => t.status !== "RESOLVED" && t.amountDue)
        .reduce((sum, t) => sum + fromDecimal(t.amountDue), 0);
      return { entitled: M.isEntitled(subscription), subscription, tickets, outstanding };
    },

    async raiseTicket(
      actor: Actor,
      propertyId: string,
      i: { category: TicketCategory; title: string; description?: string; amountDue?: number; dueDate?: Date }
    ) {
      await assertAccess(actor, propertyId);
      M.assertEntitled(await activeSubscription(propertyId));
      return prisma.managementTicket.create({ data: { ...i, propertyId, raisedById: actor.id } });
    },

    async updateTicket(actor: Actor, ticketId: string, to: TicketStatus) {
      const t = await prisma.managementTicket.findUnique({ where: { id: ticketId } });
      if (!t) throw new NotFoundError("Ticket");
      await assertAccess(actor, t.propertyId);
      const next = M.moveTicket(t, to);
      await prisma.managementTicket.update({
        where: { id: t.id },
        data: { status: next.status, resolvedAt: next.status === "RESOLVED" ? new Date() : null },
      });
    },
  };
};
