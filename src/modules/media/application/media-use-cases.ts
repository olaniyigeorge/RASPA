import { DomainError, ForbiddenError, NotFoundError } from "../../../shared/kernel/errors";
import * as Task from "../domain/capture-task";
import type { CaptureKind } from "../domain/capture-task";
import { mediaKindFor, CAPTURE_RATES } from "../domain/capture-task";
import { resourceTypeFor, validateAgainstSpec, type MediaKind } from "../domain/media-spec";
import type {
  ContractorRepository,
  MediaRepository,
  PayoutPort,
  PropertyAccess,
  TaskRepository,
  UploadSigner,
} from "../domain/ports";

interface Actor {
  id: string;
  role: string;
}

interface Deps {
  media: MediaRepository;
  tasks: TaskRepository;
  contractors: ContractorRepository;
  access: PropertyAccess;
  payouts: PayoutPort;
  signer: UploadSigner;
}

export interface RegisterMediaInput {
  propertyId: string;
  kind: MediaKind;
  publicId: string;
  url: string;
  format?: string;
  width?: number;
  height?: number;
  durationSec?: number;
  bytes?: number;
}

export const makeMediaUseCases = (d: Deps) => {
  const loadTask = async (id: string) => {
    const t = await d.tasks.findById(id);
    if (!t) throw new NotFoundError("Task");
    return t;
  };
  const contractorFor = async (actor: Actor) => {
    const c = await d.contractors.findByUserId(actor.id);
    if (!c) throw new ForbiddenError("Apply as a contractor first");
    return c;
  };
  const assertStaff = (a: Actor) => {
    if (a.role !== "ADMIN") throw new ForbiddenError("Staff only");
  };

  return {
    /** Signed params so the browser uploads straight to Cloudinary; we never proxy the bytes. */
    async uploadSignature(
      actor: Actor,
      i: { propertyId: string; kind: MediaKind; scope: "media" | "evidence"; taskId?: string }
    ) {
      let allowed = actor.role === "ADMIN" || (await d.access.canContribute(i.propertyId, actor.id));
      if (!allowed && i.taskId && i.scope === "media") {
        // a contractor may upload to the property of a task they have claimed
        const [task, contractor] = await Promise.all([d.tasks.findById(i.taskId), d.contractors.findByUserId(actor.id)]);
        allowed = !!task && !!contractor && task.status === "CLAIMED" && task.contractorId === contractor.id && task.propertyId === i.propertyId;
      }
      if (!allowed) throw new ForbiddenError();
      const folder = `raspa/${i.scope}/${i.propertyId}`;
      // Ownership documents are private (authenticated delivery); property media is public.
      const type = i.scope === "evidence" ? "authenticated" : "upload";
      const params = { folder, type };
      return {
        ...d.signer.sign(params),
        folder,
        type,
        resourceType: i.scope === "evidence" ? "auto" : resourceTypeFor(i.kind),
      };
    },

    /** Records an asset the lister/tenant uploaded themselves. */
    async registerSelfCaptured(actor: Actor, input: RegisterMediaInput) {
      if (!(await d.access.canContribute(input.propertyId, actor.id)) && actor.role !== "ADMIN") {
        throw new ForbiddenError();
      }
      const issues = validateAgainstSpec(input);
      if (issues.length) throw new DomainError(issues.join("; "), "MEDIA_SPEC", 422);
      return d.media.add({
        ...input,
        uploadedById: actor.id,
        source: "SELF",
        resourceType: resourceTypeFor(input.kind),
      });
    },

    async requestCapture(
      actor: Actor,
      i: { propertyId: string; kind: CaptureKind; instructions?: string; scheduledFor?: Date }
    ) {
      const isStaff = actor.role === "ADMIN";
      if (!isStaff && !(await d.access.canContribute(i.propertyId, actor.id))) throw new ForbiddenError();
      const rate = CAPTURE_RATES[i.kind];
      const task = await d.tasks.create({
        ...i,
        requestedById: actor.id,
        payoutAmount: rate.payout,
        // staff-created tasks (special occasions) are free to the lister; everyone else pays first
        status: isStaff ? "OPEN" : "AWAITING_PAYMENT",
      });
      return { task, price: isStaff ? 0 : rate.price };
    },

    /** Called when the lister's MEDIA_CAPTURE payment settles. */
    async openAfterPayment(taskId: string) {
      const t = await loadTask(taskId);
      await d.tasks.save(Task.openAfterPayment(t));
    },

    // ---- contractor side ---------------------------------------------------

    applyAsContractor: (actor: Actor, i: { skills: CaptureKind[]; city?: string; state?: string }) =>
      d.contractors.apply(actor.id, i.skills, i.city, i.state),

    async setContractorStatus(actor: Actor, contractorId: string, status: "ACTIVE" | "SUSPENDED") {
      assertStaff(actor);
      const c = await d.contractors.findById(contractorId);
      if (!c) throw new NotFoundError("Contractor");
      await d.contractors.save({ ...c, status });
      return c.userId;
    },

    async claimTask(actor: Actor, taskId: string) {
      const c = await contractorFor(actor);
      await d.tasks.save(Task.claim(await loadTask(taskId), c));
    },

    async submitTaskMedia(actor: Actor, taskId: string, input: Omit<RegisterMediaInput, "propertyId">) {
      const c = await contractorFor(actor);
      const task = await loadTask(taskId);
      if (task.status !== "CLAIMED" || task.contractorId !== c.id) throw new ForbiddenError();
      if (mediaKindFor(task.kind) !== input.kind) {
        throw new DomainError(`This task needs ${mediaKindFor(task.kind)} media`, "WRONG_MEDIA_KIND", 422);
      }
      const issues = validateAgainstSpec(input);
      if (issues.length) throw new DomainError(issues.join("; "), "MEDIA_SPEC", 422);
      return d.media.add({
        ...input,
        propertyId: task.propertyId,
        uploadedById: actor.id,
        source: "PROFESSIONAL",
        resourceType: resourceTypeFor(input.kind),
        captureTaskId: task.id,
      });
    },

    async submitTask(actor: Actor, taskId: string) {
      const c = await contractorFor(actor);
      await d.tasks.save(Task.submit(await loadTask(taskId), c));
    },

    // ---- staff review ------------------------------------------------------

    /** Approval releases the contractor's payout. */
    async approveTask(actor: Actor, taskId: string) {
      assertStaff(actor);
      const task = Task.approve(await loadTask(taskId));
      await d.tasks.save(task);
      const contractor = task.contractorId ? await d.contractors.findById(task.contractorId) : null;
      if (!contractor) throw new DomainError("Task has no contractor", "NO_CONTRACTOR");
      await d.payouts.createContractorPayout({
        recipientId: contractor.userId,
        amount: task.payoutAmount,
        captureTaskId: task.id,
      });
    },

    async rejectTask(actor: Actor, taskId: string, note: string) {
      assertStaff(actor);
      await d.tasks.save(Task.reject(await loadTask(taskId), note), note);
    },
  };
};
