import { prisma } from "../../../shared/infrastructure/prisma";
import { fromDecimal } from "../../../shared/kernel/money";
import type { Sublisting } from "../domain/sublisting";
import type { SublistingRepository, TenancyRepository } from "../domain/ports";
import type { Sublisting as Row } from "../../../../prisma/prisma-client";

const toSub = (r: Row): Sublisting => ({
  id: r.id,
  propertyId: r.propertyId,
  tenantId: r.tenantId,
  status: r.status,
  commissionAmount: fromDecimal(r.commissionAmount),
  requiresCriticalReview: r.requiresCriticalReview,
  incomingRenterId: r.incomingRenterId,
  renterPaymentId: r.renterPaymentId,
  renterPaid: r.renterPaidAt !== null,
  platformApproved: r.platformApprovedAt !== null,
  criticalReviewPassed: r.criticalReviewPassed,
  ownerApproved: r.ownerApprovedAt !== null,
});

export const prismaSublistingRepository: SublistingRepository = {
  async create(i) {
    return toSub(await prisma.sublisting.create({ data: i }));
  },
  async findById(id) {
    const r = await prisma.sublisting.findUnique({ where: { id } });
    return r ? toSub(r) : null;
  },
  async save(s, extra) {
    const now = new Date();
    const prev = await prisma.sublisting.findUniqueOrThrow({ where: { id: s.id } });
    await prisma.sublisting.update({
      where: { id: s.id },
      data: {
        status: s.status,
        incomingRenterId: s.incomingRenterId,
        renterPaymentId: s.renterPaymentId,
        renterPaidAt: s.renterPaid ? (prev.renterPaidAt ?? now) : null,
        ownerApprovedAt: s.ownerApproved ? (prev.ownerApprovedAt ?? now) : null,
        platformApprovedAt: s.platformApproved ? (prev.platformApprovedAt ?? now) : null,
        platformApprovedById: extra?.platformApprovedById ?? prev.platformApprovedById,
        criticalReviewPassed: s.criticalReviewPassed,
      },
    });
  },
  async hasOpenForTenant(propertyId, tenantId) {
    return (
      (await prisma.sublisting.count({
        where: { propertyId, tenantId, status: { in: ["LISTED", "RENTER_PAID", "APPROVED"] } },
      })) > 0
    );
  },
};

export const prismaTenancyRepository: TenancyRepository = {
  async hasActive(propertyId, tenantId) {
    return (await prisma.tenancy.count({ where: { propertyId, tenantId, status: "ACTIVE" } })) > 0;
  },
  async start(propertyId, tenantId) {
    const exists = await prisma.tenancy.count({ where: { propertyId, tenantId, status: "ACTIVE" } });
    if (!exists) await prisma.tenancy.create({ data: { propertyId, tenantId } });
  },
  async transfer(propertyId, fromTenantId, toTenantId) {
    await prisma.$transaction([
      prisma.tenancy.updateMany({
        where: { propertyId, tenantId: fromTenantId, status: "ACTIVE" },
        data: { status: "ENDED", endsAt: new Date() },
      }),
      prisma.tenancy.create({ data: { propertyId, tenantId: toTenantId } }),
    ]);
  },
};

/** Marketplace read side: re-listings seekers can take over. */
export function listOpenSublistings(propertyId?: string) {
  return prisma.sublisting.findMany({
    where: { status: "LISTED", ...(propertyId && { propertyId }) },
    include: {
      property: { select: { id: true, title: true, city: true, price: true, status: true } },
      tenant: { select: { id: true, name: true, image: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export function listSublistingsAwaitingApproval() {
  return prisma.sublisting.findMany({
    where: { status: "RENTER_PAID" },
    include: { property: { select: { id: true, title: true, ownerUserId: true } } },
    orderBy: { updatedAt: "asc" },
  });
}
