import test from "node:test";
import assert from "node:assert/strict";
import * as L from "./listing";

const listing: L.Listing = {
  id: "p1", slug: "s", title: "t", status: "DRAFT", type: "RESIDENTIAL", purpose: "RENT", price: 1,
  address: "1 A St", addressKey: "k", city: "Lagos", state: "Lagos",
  listerId: "u1", listerCapacity: "OWNER", ownerUserId: "u1", owner: null, cofoVerified: false,
};

test("lifecycle: DRAFT -> UNVERIFIED -> VERIFIED", () => {
  const u = L.submit(listing);
  assert.equal(u.status, "UNVERIFIED");
  const v = L.markVerified(u, { cofoVerified: true });
  assert.equal(v.status, "VERIFIED");
  assert.equal(v.cofoVerified, true);
  assert.equal(L.revokeVerification(v).cofoVerified, false);
});

test("a draft cannot be verified directly", () => {
  assert.throws(() => L.markVerified(listing, { cofoVerified: true }), /cannot move/);
});

test("drafts are not public, unverified and verified are", () => {
  assert.equal(L.isPubliclyVisible("DRAFT"), false);
  assert.equal(L.isPubliclyVisible("UNVERIFIED"), true);
  assert.equal(L.isPubliclyVisible("VERIFIED"), true);
  assert.equal(L.isPubliclyVisible("SUSPENDED"), false);
});

test("tenant listers must name the owner; agents have no capacity", () => {
  assert.throws(() => L.assertValidLister("TENANT", null), /owner's details/);
  assert.doesNotThrow(() => L.assertValidLister("TENANT", { name: "Chief A" }));
  assert.doesNotThrow(() => L.assertValidLister("OWNER", null));
});

test("address normalisation catches formatting variants", () => {
  assert.equal(
    L.normalizeAddress("12 Admiralty Way,", "Lekki", "Lagos"),
    L.normalizeAddress("12  admiralty way", "LEKKI", "lagos")
  );
});
