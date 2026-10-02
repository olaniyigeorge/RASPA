import test from "node:test";
import assert from "node:assert/strict";
import * as S from "./sublisting";

const base: S.Sublisting = {
  id: "s1",
  propertyId: "p1",
  tenantId: "t1",
  status: "LISTED",
  commissionAmount: 1000,
  requiresCriticalReview: false,
  incomingRenterId: null,
  renterPaymentId: null,
  renterPaid: false,
  platformApproved: false,
  criticalReviewPassed: false,
  ownerApproved: false,
};

test("commission needs renter payment + owner + platform approval", () => {
  let s = S.recordRenterPayment(base, "r1", "pay1");
  assert.equal(S.isCommissionReleasable(s), false);
  s = S.approveByOwner(s);
  assert.equal(S.isCommissionReleasable(s), false);
  s = S.approveByPlatform(s, { criticalReviewPassed: false });
  assert.equal(S.isCommissionReleasable(s), true);
  assert.equal(S.release(s).status, "APPROVED");
});

test("approvals alone do not release commission before the renter pays", () => {
  const s = S.approveByPlatform(S.approveByOwner(base), { criticalReviewPassed: false });
  assert.equal(S.isCommissionReleasable(s), false);
  assert.throws(() => S.release(s), /not releasable/);
});

test("tenant-who-listed without CofO requires critical review", () => {
  assert.equal(S.needsCriticalReview({ tenantId: "t1", listerId: "t1", cofoVerified: false }), true);
  assert.equal(S.needsCriticalReview({ tenantId: "t1", listerId: "t1", cofoVerified: true }), false);
  assert.equal(S.needsCriticalReview({ tenantId: "t1", listerId: "owner", cofoVerified: false }), false);

  const s = { ...base, requiresCriticalReview: true };
  assert.throws(() => S.approveByPlatform(s, { criticalReviewPassed: false }), /critical review/);
  const ok = S.approveByPlatform(s, { criticalReviewPassed: true });
  assert.equal(ok.platformApproved, true);
});

test("only one renter per re-listing; no self-rent", () => {
  assert.throws(() => S.recordRenterPayment(base, "t1", "p"), /own re-listing/);
  const paid = S.recordRenterPayment(base, "r1", "p");
  assert.throws(() => S.recordRenterPayment(paid, "r2", "p2"), /already has a renter/);
});

test("commission is capped", () => {
  assert.equal(S.commissionFor(1_000_000), 50_000);
  assert.equal(S.commissionFor(100_000_000), S.COMMISSION_CAP);
});
