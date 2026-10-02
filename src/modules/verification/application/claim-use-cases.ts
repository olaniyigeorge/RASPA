import { ForbiddenError, NotFoundError } from "../../../shared/kernel/errors";
import * as Claim from "../domain/ownership-claim";
import type { EvidenceType } from "../domain/ownership-claim";
import type { ClaimRepository, ListingGateway } from "../domain/ports";

interface Actor {
  id: string;
  role: string;
}

const assertStaff = (a: Actor) => {
  if (a.role !== "ADMIN") throw new ForbiddenError("Staff only");
};

export interface EvidenceInput {
  type: EvidenceType;
  publicId: string;
  url: string;
  resourceType?: string;
  note?: string;
}

export const makeClaimUseCases = (claims: ClaimRepository, listings: ListingGateway) => {
  const load = async (id: string) => {
    const c = await claims.findById(id);
    if (!c) throw new NotFoundError("Claim");
    return c;
  };

  return {
    /** Lister submits proof for a listing. Competing claims on the same address open a dispute. */
    async submit(actor: Actor, propertyId: string, evidence: EvidenceInput[]) {
      const listing = await listings.get(propertyId);
      if (listing.listerId !== actor.id) throw new ForbiddenError("Only the lister can claim this listing");

      Claim.assertSubmittable({ capacity: listing.listerCapacity, evidence });

      const created = await claims.create({
        propertyId,
        claimantId: actor.id,
        capacity: listing.listerCapacity,
      });
      for (const e of evidence) {
        await claims.addEvidence(created.id, actor.id, { resourceType: "image", ...e });
      }
      const claim = await load(created.id);

      await listings.submitForVerification(actor, propertyId);

      const rivals = (await claims.findOpenByAddressKey(listing.addressKey)).filter(
        (c) => c.claimantId !== actor.id
      );
      if (rivals.length === 0) return claim;

      // Same address, different listers: staff decide between them.
      const ids = [claim.id, ...rivals.map((c) => c.id)];
      const disputeId = await claims.createDispute(listing.addressKey, ids);
      for (const c of [claim, ...rivals]) await claims.save(Claim.markDisputed(c, disputeId));
      return load(claim.id);
    },

    async addEvidence(actor: Actor, claimId: string, e: EvidenceInput) {
      const claim = await load(claimId);
      if (claim.claimantId !== actor.id) throw new ForbiddenError();
      if (!Claim.isOpen(claim)) throw new ForbiddenError("This claim is already decided");
      return claims.addEvidence(claimId, actor.id, { resourceType: "image", ...e });
    },

    async startReview(actor: Actor, claimId: string) {
      assertStaff(actor);
      await claims.save(Claim.startReview(await load(claimId)), { reviewerId: actor.id });
    },

    /** Approving promotes the listing to VERIFIED. */
    async approve(actor: Actor, claimId: string, opts: { criticalReview: boolean; note?: string }) {
      assertStaff(actor);
      const claim = await load(claimId);
      const approved = Claim.approve(claim, opts);
      await claims.save(approved, { reviewerId: actor.id, note: opts.note });
      await listings.markVerified(claim.propertyId, {
        cofoVerified: Claim.hasCofo(claim),
        ownerUserId: claim.capacity === "OWNER" ? claim.claimantId : null,
      });
    },

    async reject(actor: Actor, claimId: string, note: string) {
      assertStaff(actor);
      await claims.save(Claim.reject(await load(claimId), note), { reviewerId: actor.id, note });
    },

    async resolveDispute(actor: Actor, disputeId: string, winningClaimId: string, note?: string) {
      assertStaff(actor);
      const disputed = await claims.findDisputeClaims(disputeId);
      const resolved = Claim.resolveDispute(disputed, winningClaimId);
      for (const c of resolved) {
        await claims.save(c, { reviewerId: actor.id, note: c.status === "REJECTED" ? note : undefined });
        if (c.status === "REJECTED") await listings.suspend(c.propertyId).catch(() => undefined);
      }
      await claims.closeDispute(disputeId, { winningClaimId, resolvedById: actor.id, note });
    },

    get: load,
  };
};
