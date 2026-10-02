import { DomainError } from "../../../shared/kernel/errors";

export type ClaimStatus = "SUBMITTED" | "UNDER_REVIEW" | "DISPUTED" | "APPROVED" | "REJECTED";
export type ClaimCapacity = "OWNER" | "TENANT";
export type EvidenceType =
  | "COFO"
  | "UTILITY_BILL"
  | "OWNER_ID"
  | "TENANCY_AGREEMENT"
  | "VIDEO"
  | "SCAN_3D"
  | "IMAGE"
  | "OTHER";

export interface Evidence {
  id: string;
  type: EvidenceType;
  publicId: string;
  url: string;
  resourceType: string;
}

export interface OwnershipClaim {
  id: string;
  propertyId: string;
  claimantId: string;
  capacity: ClaimCapacity;
  status: ClaimStatus;
  evidence: Evidence[];
  disputeId: string | null;
}

/** Only these count as proof; photos/video/scans support a claim but cannot carry it alone. */
const PROOF_TYPES: EvidenceType[] = ["COFO", "UTILITY_BILL", "OWNER_ID", "TENANCY_AGREEMENT"];

export const hasProof = (c: { evidence: { type: EvidenceType }[] }) =>
  c.evidence.some((e) => PROOF_TYPES.includes(e.type));

export const hasCofo = (c: Pick<OwnershipClaim, "evidence">) =>
  c.evidence.some((e) => e.type === "COFO");

/**
 * Without a Certificate of Occupancy (typical for a tenant listing), staff must
 * explicitly confirm they reviewed the remaining evidence critically.
 */
export const requiresCriticalReview = (c: Pick<OwnershipClaim, "evidence">) => !hasCofo(c);

const OPEN: ClaimStatus[] = ["SUBMITTED", "UNDER_REVIEW", "DISPUTED"];
export const isOpen = (c: Pick<OwnershipClaim, "status">) => OPEN.includes(c.status);

export function assertSubmittable(c: { capacity: ClaimCapacity; evidence: { type: EvidenceType }[] }) {
  if (!hasProof(c)) {
    throw new DomainError(
      "Attach at least one proof document (CofO, utility bill, owner ID or tenancy agreement)",
      "PROOF_REQUIRED",
      400
    );
  }
  if (c.capacity === "TENANT" && !c.evidence.some((e) => e.type === "TENANCY_AGREEMENT" || e.type === "UTILITY_BILL")) {
    throw new DomainError(
      "Tenants must attach a tenancy agreement or a utility bill in their name",
      "TENANT_PROOF_REQUIRED",
      400
    );
  }
}

export function startReview(c: OwnershipClaim): OwnershipClaim {
  if (c.status !== "SUBMITTED") throw new DomainError("Only submitted claims can enter review", "INVALID_CLAIM_STATE");
  return { ...c, status: "UNDER_REVIEW" };
}

export function approve(c: OwnershipClaim, opts: { criticalReview: boolean }): OwnershipClaim {
  if (c.status === "DISPUTED") {
    throw new DomainError("Resolve the dispute before approving this claim", "CLAIM_DISPUTED");
  }
  if (c.status !== "UNDER_REVIEW") {
    throw new DomainError("Claim must be under review to be approved", "INVALID_CLAIM_STATE");
  }
  if (requiresCriticalReview(c) && !opts.criticalReview) {
    throw new DomainError(
      "No CofO on this claim: confirm a critical review before approving",
      "CRITICAL_REVIEW_REQUIRED"
    );
  }
  return { ...c, status: "APPROVED" };
}

export function reject(c: OwnershipClaim, note: string): OwnershipClaim {
  if (!note.trim()) throw new DomainError("A rejection needs a reason", "NOTE_REQUIRED", 400);
  if (!isOpen(c)) throw new DomainError("Claim is already decided", "INVALID_CLAIM_STATE");
  return { ...c, status: "REJECTED" };
}

export const markDisputed = (c: OwnershipClaim, disputeId: string): OwnershipClaim => ({
  ...c,
  status: "DISPUTED",
  disputeId,
});

/**
 * Staff pick the rightful claimant among competing listers. The winner returns
 * to review (it still has to be approved on its evidence); the rest are rejected.
 */
export function resolveDispute(claims: OwnershipClaim[], winningClaimId: string) {
  if (!claims.some((c) => c.id === winningClaimId)) {
    throw new DomainError("Winning claim is not part of this dispute", "INVALID_DISPUTE_RESOLUTION", 400);
  }
  return claims.map((c) =>
    c.id === winningClaimId
      ? ({ ...c, status: "UNDER_REVIEW" } satisfies OwnershipClaim)
      : ({ ...c, status: "REJECTED" } satisfies OwnershipClaim)
  );
}
