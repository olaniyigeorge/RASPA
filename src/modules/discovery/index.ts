// Public API of the discovery context.
import { listCandidates, listListingsByIds } from "../listings";
import { fromDecimal } from "../../shared/kernel/money";
import { makeDiscoveryUseCases } from "./application/discovery-use-cases";
import { prismaActivityRepository } from "./infrastructure/prisma-activity-repository";

export type { ActivityInput } from "./application/discovery-use-cases";

export const discovery = makeDiscoveryUseCases({
  activities: prismaActivityRepository,
  async candidates() {
    return (await listCandidates()).map((c) => ({
      ...c,
      price: fromDecimal(c.price),
      latitude: c.latitude === null ? null : fromDecimal(c.latitude),
      longitude: c.longitude === null ? null : fromDecimal(c.longitude),
    }));
  },
  hydrate: listListingsByIds,
});
