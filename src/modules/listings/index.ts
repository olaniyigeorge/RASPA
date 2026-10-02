// Public API of the listings context.
import { makeListingUseCases } from "./application/listing-use-cases";
import { prismaListingRepository } from "./infrastructure/prisma-listing-repository";

export type { Listing, ListingStatus, ListerCapacity, ListingPurpose, PropertyType } from "./domain/listing";
export { PUBLIC_STATUSES, canManage, isPubliclyVisible } from "./domain/listing";
export type { CreateListingInput } from "./application/listing-use-cases";
export {
  searchListings,
  getListingDetail,
  getFeaturedListings,
  listCandidates,
  listListingsByIds,
} from "./infrastructure/listing-queries";

export const listings = makeListingUseCases(prismaListingRepository);
