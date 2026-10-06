// Public API of the management context.
import { payments } from "../payments";
import { makeManagementUseCases } from "./application/management-use-cases";
import { prismaManagementRepository } from "./infrastructure/prisma-management-repository";

export const management = makeManagementUseCases({
  payments: { initiate: (actor, i) => payments.initiate(actor, i) },
  repo: prismaManagementRepository,
});
