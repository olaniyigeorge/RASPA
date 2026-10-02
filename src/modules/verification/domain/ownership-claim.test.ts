import test from "node:test";
import assert from "node:assert/strict";
import * as C from "./ownership-claim";

const ev = (type: C.EvidenceType): C.Evidence => ({ id: type, type, publicId: type, url: "u", resourceType: "image" });
const claim = (over: Partial<C.OwnershipClaim> = {}): C.OwnershipClaim => ({
  id: "c1",
  propertyId: "p1",
  claimantId: "u1",
  capacity: "OWNER",
  status: "UNDER_REVIEW",
  evidence: [ev("COFO")],
  disputeId: null,
  ...over,
});

test("photos alone are not proof", () => {
  assert.throws(() => C.assertSubmittable({ capacity: "OWNER", evidence: [ev("IMAGE"), ev("VIDEO")] }), /proof document/);
  assert.doesNotThrow(() => C.assertSubmittable({ capacity: "OWNER", evidence: [ev("COFO")] }));
});

test("tenants need a tenancy agreement or utility bill", () => {
  assert.throws(() => C.assertSubmittable({ capacity: "TENANT", evidence: [ev("COFO")] }), /Tenants must attach/);
  assert.doesNotThrow(() => C.assertSubmittable({ capacity: "TENANT", evidence: [ev("UTILITY_BILL")] }));
});

test("no CofO means approval needs explicit critical review", () => {
  const c = claim({ evidence: [ev("UTILITY_BILL")] });
  assert.equal(C.requiresCriticalReview(c), true);
  assert.throws(() => C.approve(c, { criticalReview: false }), /critical review/);
  assert.equal(C.approve(c, { criticalReview: true }).status, "APPROVED");
  assert.equal(C.approve(claim(), { criticalReview: false }).status, "APPROVED");
});

test("disputed claims cannot be approved until resolved", () => {
  assert.throws(() => C.approve(claim({ status: "DISPUTED" }), { criticalReview: false }), /dispute/);
});

test("dispute resolution: winner back to review, rivals rejected", () => {
  const a = claim({ id: "a", status: "DISPUTED" });
  const b = claim({ id: "b", status: "DISPUTED", claimantId: "u2" });
  const [ra, rb] = C.resolveDispute([a, b], "a");
  assert.equal(ra.status, "UNDER_REVIEW");
  assert.equal(rb.status, "REJECTED");
  assert.throws(() => C.resolveDispute([a, b], "zzz"));
});

test("rejection requires a reason", () => {
  assert.throws(() => C.reject(claim(), "  "), /reason/);
});
