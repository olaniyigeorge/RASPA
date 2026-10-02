// Public API of the rentals context.
import { listings } from "../listings";
import { payments } from "../payments";
import { makeRentalUseCases } from "./application/rental-use-cases";
import { prismaSublistingRepository, prismaTenancyRepository } from "./infrastructure/prisma-repositories";

export { listOpenSublistings, listSublistingsAwaitingApproval } from "./infrastructure/prisma-repositories";
export { COMMISSION_RATE, COMMISSION_CAP } from "./domain/sublisting";

export const rentals = makeRentalUseCases({
  subs: prismaSublistingRepository,
  tenancies: prismaTenancyRepository,
  listings: { get: listings.get },
  payments: {
    initiate: (actor, i) => payments.initiate(actor, i),
    async createCommissionPayout(i) {
      await payments.createPayout({ ...i, kind: "TENANT_COMMISSION" });
    },
  },
});
