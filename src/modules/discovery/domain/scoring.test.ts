import test from "node:test";
import assert from "node:assert/strict";
import { buildProfile, rank, type Activity, type Candidate } from "./scoring";

const now = new Date("2026-10-01T00:00:00Z");
const cand = (id: string, o: Partial<Candidate> = {}): Candidate => ({
  id, city: "Lagos", type: "RESIDENTIAL", purpose: "RENT", price: 1_000_000,
  latitude: null, longitude: null, status: "UNVERIFIED", featured: false, createdAt: now, ...o,
});
const act = (o: Partial<Activity>): Activity => ({ kind: "FILTER", createdAt: now, ...o });

test("search/filter history pulls matching listings up", () => {
  const profile = buildProfile([act({ city: "Abuja", filters: { type: "COMMERCIAL", purpose: "SALE" } })], now);
  const ids = rank([cand("lagos"), cand("abuja", { city: "Abuja", type: "COMMERCIAL", purpose: "SALE" })], profile, 2, now);
  assert.equal(ids[0], "abuja");
});

test("location: nearer listing wins when there is no history", () => {
  const profile = buildProfile([], now, { lat: 6.45, lng: 3.43 });
  const near = cand("near", { latitude: 6.46, longitude: 3.44 });
  const far = cand("far", { latitude: 9.06, longitude: 7.49 });
  assert.equal(rank([far, near], profile, 2, now)[0], "near");
});

test("verified listings rank above otherwise-equal unverified ones", () => {
  const ids = rank([cand("u"), cand("v", { status: "VERIFIED" })], buildProfile([], now), 2, now);
  assert.equal(ids[0], "v");
});

test("recent activity outweighs old activity", () => {
  const old = new Date("2026-05-01T00:00:00Z");
  const profile = buildProfile([act({ city: "Abuja", createdAt: old }), act({ city: "Lagos" })], now);
  assert.ok((profile.cities.get("lagos") ?? 0) > (profile.cities.get("abuja") ?? 0));
});

test("already-viewed listings are nudged down", () => {
  const profile = buildProfile([act({ kind: "VIEW", propertyId: "seen" })], now);
  assert.equal(rank([cand("seen"), cand("fresh")], profile, 2, now)[0], "fresh");
});
