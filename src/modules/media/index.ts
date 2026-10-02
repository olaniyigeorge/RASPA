// Public API of the media context.
import { prisma } from "../../shared/infrastructure/prisma";
import { payments } from "../payments";
import { makeMediaUseCases } from "./application/media-use-cases";
import { cloudinarySigner } from "./infrastructure/cloudinary";
import {
  prismaContractorRepository,
  prismaMediaRepository,
  prismaTaskRepository,
} from "./infrastructure/prisma-repositories";

export { MEDIA_SPECS, validateAgainstSpec } from "./domain/media-spec";
export { CAPTURE_RATES } from "./domain/capture-task";
export { signedEvidenceUrl } from "./infrastructure/cloudinary";
export { listOpenTasks, listTasksForContractor, listTasksAwaitingReview, listContractorApplications } from "./infrastructure/prisma-repositories";
export { prismaContractorRepository as contractors };

export const media = makeMediaUseCases({
  media: prismaMediaRepository,
  tasks: prismaTaskRepository,
  contractors: prismaContractorRepository,
  signer: cloudinarySigner,
  access: {
    // the lister, or someone with an active tenancy on the property
    async canContribute(propertyId, userId) {
      const p = await prisma.property.findFirst({
        where: {
          id: propertyId,
          OR: [{ listerId: userId }, { tenancies: { some: { tenantId: userId, status: "ACTIVE" } } }],
        },
        select: { id: true },
      });
      return !!p;
    },
  },
  payouts: {
    async createContractorPayout(i) {
      await payments.createPayout({ ...i, kind: "CONTRACTOR_TASK" });
    },
  },
});
