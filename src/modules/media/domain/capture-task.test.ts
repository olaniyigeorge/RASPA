import test from "node:test";
import assert from "node:assert/strict";
import * as T from "./capture-task";
import { validateAgainstSpec } from "./media-spec";

const task: T.CaptureTask = { id: "t", propertyId: "p", kind: "VIDEO", status: "OPEN", contractorId: null, payoutAmount: 1, mediaCount: 0 };
const c: T.Contractor = { id: "c1", userId: "u", status: "ACTIVE", skills: ["VIDEO"] };

test("task workflow: claim -> submit (needs media) -> approve", () => {
  const claimed = T.claim(task, c);
  assert.equal(claimed.status, "CLAIMED");
  assert.throws(() => T.submit(claimed, c), /Upload/);
  const submitted = T.submit({ ...claimed, mediaCount: 2 }, c);
  assert.equal(T.approve(submitted).status, "APPROVED");
  assert.equal(T.reject(submitted, "too dark").status, "CLAIMED");
});

test("only active, skilled contractors can claim", () => {
  assert.throws(() => T.claim(task, { ...c, status: "APPLIED" }), /not active/);
  assert.throws(() => T.claim(task, { ...c, skills: ["PHOTOS"] }), /not approved/);
  assert.throws(() => T.claim({ ...task, status: "CLAIMED" }, c), /no longer open/);
});

test("video spec enforcement", () => {
  assert.deepEqual(validateAgainstSpec({ kind: "VIDEO", format: "mp4", width: 1920, height: 1080, durationSec: 120 }), []);
  const issues = validateAgainstSpec({ kind: "VIDEO", format: "avi", width: 1280, height: 720, durationSec: 10 });
  assert.equal(issues.length, 3);
  assert.ok(validateAgainstSpec({ kind: "SCAN_3D", format: "obj" }).length === 1);
});
