import type { Evidence, EvidenceType, OwnershipClaim, ClaimCapacity } from "./ownership-claim";

export interface ClaimRepository {
  findById(id: string): Promise<OwnershipClaim | null>;
  findOpenByAddressKey(addressKey: string): Promise<(OwnershipClaim & { addressKey: string })[]>;
  create(input: { propertyId: string; claimantId: string; capacity: ClaimCapacity }): Promise<OwnershipClaim>;
  addEvidence(
    claimId: string,
    uploadedById: string,
    e: { type: EvidenceType; publicId: string; url: string; resourceType: string; note?: string }
  ): Promise<Evidence>;
  save(claim: OwnershipClaim, review?: { reviewerId: string; note?: string }): Promise<void>;
  createDispute(addressKey: string, claimIds: string[]): Promise<string>;
  findDisputeClaims(disputeId: string): Promise<OwnershipClaim[]>;
  closeDispute(disputeId: string, r: { winningClaimId: string; resolvedById: string; note?: string }): Promise<void>;
}

/** What verification needs to know about a listing; implemented by the listings context. */
export interface ListingGateway {
  get(id: string): Promise<{
    id: string;
    listerId: string;
    listerCapacity: ClaimCapacity;
    addressKey: string;
    status: string;
  }>;
  submitForVerification(actor: { id: string; role: string }, id: string): Promise<void>;
  markVerified(id: string, opts: { cofoVerified: boolean; ownerUserId?: string | null }): Promise<void>;
  suspend(id: string): Promise<void>;
}
