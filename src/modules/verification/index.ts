// Public API of the verification context.
import { listings } from "../listings";
import { makeClaimUseCases } from "./application/claim-use-cases";
import { prismaClaimRepository } from "./infrastructure/prisma-claim-repository";

export type { EvidenceType, ClaimStatus } from "./domain/ownership-claim";
export type { EvidenceInput } from "./application/claim-use-cases";
export { listClaimsForReview } from "./infrastructure/prisma-claim-repository";

export const verification = makeClaimUseCases(prismaClaimRepository, {
  get: listings.get,
  submitForVerification: listings.submitForVerification,
  markVerified: listings.markVerified,
  suspend: listings.suspend,
});
