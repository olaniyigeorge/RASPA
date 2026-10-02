import { DomainError } from "../../../shared/kernel/errors";
import type { MediaKind } from "./media-spec";

export type CaptureKind = "PHOTOS" | "VIDEO" | "DRONE_VIDEO" | "SCAN_3D";
export type CaptureTaskStatus = "AWAITING_PAYMENT" | "OPEN" | "CLAIMED" | "SUBMITTED" | "APPROVED" | "CANCELLED";
export type ContractorStatus = "APPLIED" | "ACTIVE" | "SUSPENDED";

export interface Contractor {
  id: string;
  userId: string;
  status: ContractorStatus;
  skills: CaptureKind[];
}

export interface CaptureTask {
  id: string;
  propertyId: string;
  kind: CaptureKind;
  status: CaptureTaskStatus;
  contractorId: string | null;
  payoutAmount: number;
  mediaCount: number;
}

export const mediaKindFor = (k: CaptureKind): MediaKind =>
  k === "PHOTOS" ? "PHOTO" : k === "SCAN_3D" ? "SCAN_3D" : "VIDEO";

// Placeholder rate card (NGN): what a lister pays, and what the contractor earns.
// To be set by the business; kept here so pricing is one edit.
export const CAPTURE_RATES: Record<CaptureKind, { price: number; payout: number }> = {
  PHOTOS: { price: 15_000, payout: 8_000 },
  VIDEO: { price: 35_000, payout: 20_000 },
  DRONE_VIDEO: { price: 60_000, payout: 40_000 },
  SCAN_3D: { price: 90_000, payout: 60_000 },
};

const bad = (message: string, code: string) => new DomainError(message, code);

export function claim(task: CaptureTask, contractor: Contractor): CaptureTask {
  if (task.status !== "OPEN") throw bad("Task is no longer open", "TASK_NOT_OPEN");
  if (contractor.status !== "ACTIVE") throw bad("Contractor account is not active", "CONTRACTOR_INACTIVE");
  if (!contractor.skills.includes(task.kind)) throw bad("You are not approved for this kind of task", "SKILL_MISSING");
  return { ...task, status: "CLAIMED", contractorId: contractor.id };
}

export function submit(task: CaptureTask, contractor: Contractor): CaptureTask {
  if (task.status !== "CLAIMED" || task.contractorId !== contractor.id) {
    throw bad("Only the assigned contractor can submit a claimed task", "TASK_NOT_CLAIMED");
  }
  if (task.mediaCount < 1) throw bad("Upload the captured media before submitting", "NO_MEDIA");
  return { ...task, status: "SUBMITTED" };
}

export function approve(task: CaptureTask): CaptureTask {
  if (task.status !== "SUBMITTED") throw bad("Only submitted tasks can be approved", "TASK_NOT_SUBMITTED");
  return { ...task, status: "APPROVED" };
}

/** Sends the work back to the contractor to redo. */
export function reject(task: CaptureTask, note: string): CaptureTask {
  if (task.status !== "SUBMITTED") throw bad("Only submitted tasks can be rejected", "TASK_NOT_SUBMITTED");
  if (!note.trim()) throw bad("Say what needs fixing", "NOTE_REQUIRED");
  return { ...task, status: "CLAIMED" };
}

export function openAfterPayment(task: CaptureTask): CaptureTask {
  return task.status === "AWAITING_PAYMENT" ? { ...task, status: "OPEN" } : task;
}
