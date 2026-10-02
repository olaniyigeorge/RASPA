import type { CaptureKind, CaptureTask, Contractor } from "./capture-task";
import type { MediaKind, MediaMeta } from "./media-spec";

export interface NewMedia extends MediaMeta {
  propertyId: string;
  uploadedById: string;
  source: "SELF" | "PROFESSIONAL";
  publicId: string;
  url: string;
  resourceType: string;
  captureTaskId?: string;
}

export interface MediaRepository {
  add(m: NewMedia): Promise<{ id: string }>;
  remove(id: string): Promise<{ propertyId: string; uploadedById: string } | null>;
}

export interface TaskRepository {
  create(i: {
    propertyId: string;
    requestedById: string;
    kind: CaptureKind;
    payoutAmount: number;
    status: "AWAITING_PAYMENT" | "OPEN";
    instructions?: string;
    scheduledFor?: Date;
  }): Promise<CaptureTask>;
  findById(id: string): Promise<CaptureTask | null>;
  save(t: CaptureTask, reviewNote?: string): Promise<void>;
}

export interface ContractorRepository {
  findByUserId(userId: string): Promise<Contractor | null>;
  findById(id: string): Promise<Contractor | null>;
  apply(userId: string, skills: CaptureKind[], city?: string, state?: string): Promise<Contractor>;
  save(c: Contractor): Promise<void>;
}

/** Who may add media to a listing: its lister, or an active tenant (implemented via listings/rentals). */
export interface PropertyAccess {
  canContribute(propertyId: string, userId: string): Promise<boolean>;
}

export interface PayoutPort {
  createContractorPayout(i: { recipientId: string; amount: number; captureTaskId: string }): Promise<void>;
}

export interface UploadSigner {
  sign(params: Record<string, string | number>): { signature: string; timestamp: number; apiKey: string; cloudName: string };
}

export type { MediaKind };
