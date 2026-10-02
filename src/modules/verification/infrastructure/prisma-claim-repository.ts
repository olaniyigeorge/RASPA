import { prisma } from "../../../shared/infrastructure/prisma";
import type { OwnershipClaim } from "../domain/ownership-claim";
import type { ClaimRepository } from "../domain/ports";
import type { EvidenceDocument, OwnershipClaim as Row } from "../../../../prisma/prisma-client";

const toClaim = (r: Row & { evidence: EvidenceDocument[] }): OwnershipClaim => ({
  id: r.id,
  propertyId: r.propertyId,
  claimantId: r.claimantId,
  capacity: r.capacity,
  status: r.status,
  disputeId: r.disputeId,
  evidence: r.evidence.map((e) => ({
    id: e.id,
    type: e.type,
    publicId: e.publicId,
    url: e.url,
    resourceType: e.resourceType,
  })),
});

const include = { evidence: true } as const;

export const prismaClaimRepository: ClaimRepository = {
  async findById(id) {
    const r = await prisma.ownershipClaim.findUnique({ where: { id }, include });
    return r ? toClaim(r) : null;
  },
  async findOpenByAddressKey(addressKey) {
    const rows = await prisma.ownershipClaim.findMany({
      where: {
        status: { in: ["SUBMITTED", "UNDER_REVIEW", "DISPUTED"] },
        property: { addressKey },
      },
      include,
    });
    return rows.map((r) => ({ ...toClaim(r), addressKey }));
  },
  async create(input) {
    return toClaim(await prisma.ownershipClaim.create({ data: input, include }));
  },
  async addEvidence(claimId, uploadedById, e) {
    const row = await prisma.evidenceDocument.create({ data: { claimId, uploadedById, ...e } });
    return { id: row.id, type: row.type, publicId: row.publicId, url: row.url, resourceType: row.resourceType };
  },
  async save(c, review) {
    await prisma.ownershipClaim.update({
      where: { id: c.id },
      data: {
        status: c.status,
        disputeId: c.disputeId,
        ...(review && {
          reviewerId: review.reviewerId,
          reviewNote: review.note,
          decidedAt: c.status === "APPROVED" || c.status === "REJECTED" ? new Date() : undefined,
        }),
      },
    });
  },
  async createDispute(addressKey, claimIds) {
    const d = await prisma.claimDispute.create({
      data: { addressKey, claims: { connect: claimIds.map((id) => ({ id })) } },
    });
    return d.id;
  },
  async findDisputeClaims(disputeId) {
    const rows = await prisma.ownershipClaim.findMany({ where: { disputeId }, include });
    return rows.map(toClaim);
  },
  async closeDispute(disputeId, r) {
    await prisma.claimDispute.update({
      where: { id: disputeId },
      data: {
        winningClaimId: r.winningClaimId,
        resolvedById: r.resolvedById,
        resolutionNote: r.note,
        resolvedAt: new Date(),
      },
    });
  },
};

/** Admin review queue (read side). */
export function listClaimsForReview() {
  return prisma.ownershipClaim.findMany({
    where: { status: { in: ["SUBMITTED", "UNDER_REVIEW", "DISPUTED"] } },
    include: {
      evidence: true,
      property: { select: { id: true, title: true, address: true, city: true, listerCapacity: true } },
      claimant: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "asc" },
  });
}
