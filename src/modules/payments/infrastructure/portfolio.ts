import { prisma } from "../../../shared/infrastructure/prisma";
import type { SettledPayment } from "../../../shared/kernel/settlement";

/** Keeps the buyer's portfolio in step with settled property payments. */
export async function recordPortfolioPayment(p: SettledPayment) {
  const property = await prisma.property.findUnique({ where: { id: p.propertyId }, select: { price: true } });
  if (!property) return;
  await prisma.portfolioItem.upsert({
    where: { userId_propertyId: { userId: p.userId, propertyId: p.propertyId } },
    create: { userId: p.userId, propertyId: p.propertyId, planType: p.planType, totalPaid: p.amount, totalDue: property.price },
    update: { totalPaid: { increment: p.amount } },
  });
}
