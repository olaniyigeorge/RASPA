import { ConflictError, DomainError } from "../../../shared/kernel/errors";

export type SublistingStatus = "LISTED" | "RENTER_PAID" | "APPROVED" | "COMMISSION_PAID" | "CANCELLED";

export interface Sublisting {
  id: string;
  propertyId: string;
  tenantId: string;
  status: SublistingStatus;
  commissionAmount: number;
  requiresCriticalReview: boolean;
  incomingRenterId: string | null;
  renterPaymentId: string | null;
  renterPaid: boolean;
  platformApproved: boolean;
  criticalReviewPassed: boolean;
  ownerApproved: boolean;
}

// Placeholder commission policy: share of the rent paid to the re-listing tenant,
// capped. To be set by the business.
export const COMMISSION_RATE = 0.05;
export const COMMISSION_CAP = 250_000;

export const commissionFor = (rent: number) => Math.min(Math.round(rent * COMMISSION_RATE), COMMISSION_CAP);

/**
 * A tenant who is also the lister of a property that has no verified CofO is
 * the one case staff must approve critically before commission is released.
 */
export function needsCriticalReview(i: {
  tenantId: string;
  listerId: string;
  cofoVerified: boolean;
}): boolean {
  return i.tenantId === i.listerId && !i.cofoVerified;
}

export function recordRenterPayment(s: Sublisting, renterId: string, paymentId: string): Sublisting {
  if (s.status !== "LISTED") throw new ConflictError("This re-listing already has a renter");
  if (renterId === s.tenantId) throw new DomainError("You cannot rent your own re-listing", "SELF_RENT", 422);
  return { ...s, status: "RENTER_PAID", incomingRenterId: renterId, renterPaymentId: paymentId, renterPaid: true };
}

export function approveByOwner(s: Sublisting): Sublisting {
  assertActive(s);
  return { ...s, ownerApproved: true };
}

export function approveByPlatform(s: Sublisting, opts: { criticalReviewPassed: boolean }): Sublisting {
  assertActive(s);
  if (s.requiresCriticalReview && !opts.criticalReviewPassed) {
    throw new DomainError(
      "This tenant listed the property without a verified CofO: critical review must be confirmed",
      "CRITICAL_REVIEW_REQUIRED"
    );
  }
  return { ...s, platformApproved: true, criticalReviewPassed: opts.criticalReviewPassed };
}

/** Commission is released only when the renter has paid AND both the platform and the owner approved. */
export const isCommissionReleasable = (s: Sublisting) =>
  s.status === "RENTER_PAID" &&
  s.renterPaid &&
  s.ownerApproved &&
  s.platformApproved &&
  (!s.requiresCriticalReview || s.criticalReviewPassed);

export const release = (s: Sublisting): Sublisting => {
  if (!isCommissionReleasable(s)) throw new DomainError("Commission is not releasable yet", "NOT_RELEASABLE");
  return { ...s, status: "APPROVED" };
};

export const markCommissionPaid = (s: Sublisting): Sublisting =>
  s.status === "APPROVED" ? { ...s, status: "COMMISSION_PAID" } : s;

export function cancel(s: Sublisting): Sublisting {
  if (s.status !== "LISTED") throw new DomainError("Only open re-listings can be cancelled", "NOT_CANCELLABLE");
  return { ...s, status: "CANCELLED" };
}

function assertActive(s: Sublisting) {
  if (s.status === "CANCELLED" || s.status === "COMMISSION_PAID") {
    throw new DomainError("This re-listing is closed", "SUBLISTING_CLOSED");
  }
}
