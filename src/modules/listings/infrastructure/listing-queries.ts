// Read side: shaped for the UI, so it returns Prisma payloads directly.
import { prisma } from "../../../shared/infrastructure/prisma";
import { PUBLIC_STATUSES } from "../domain/listing";
import type { ListingSearch } from "../domain/listing-repository";

export async function searchListings(filters: ListingSearch = {}, take = 24, skip = 0) {
  return prisma.property.findMany({
    where: {
      status: { in: filters.statuses ?? PUBLIC_STATUSES },
      ...(filters.purpose && { purpose: filters.purpose }),
      ...(filters.type && { type: filters.type }),
      ...(filters.city && { city: { equals: filters.city, mode: "insensitive" } }),
      ...(filters.featured !== undefined && { featured: filters.featured }),
      ...(filters.q && {
        OR: [
          { title: { contains: filters.q, mode: "insensitive" } },
          { description: { contains: filters.q, mode: "insensitive" } },
          { city: { contains: filters.q, mode: "insensitive" } },
        ],
      }),
      ...((filters.minPrice || filters.maxPrice) && {
        price: {
          ...(filters.minPrice && { gte: filters.minPrice }),
          ...(filters.maxPrice && { lte: filters.maxPrice }),
        },
      }),
    },
    include: {
      // first asset of each kind: a cover photo plus whether a video / 3D scan exists
      media: { distinct: ["kind"], orderBy: [{ kind: "asc" }, { position: "asc" }], select: { kind: true, url: true } },
      lister: { select: { id: true, name: true, image: true } },
    },
    // verified first, then newest
    orderBy: [{ status: "desc" }, { createdAt: "desc" }],
    take,
    skip,
  });
}

export async function getListingDetail(idOrSlug: string) {
  return prisma.property.findFirst({
    where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
    include: {
      media: { orderBy: [{ kind: "asc" }, { position: "asc" }] },
      amenities: { include: { amenity: true } },
      lister: { select: { id: true, name: true, image: true, phone: true, email: true } },
      reviews: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export const getFeaturedListings = (take = 6) => searchListings({ featured: true }, take);

/** Candidate pool for the discovery context's recommender. */
export async function listCandidates(take = 300) {
  return prisma.property.findMany({
    where: { status: { in: PUBLIC_STATUSES } },
    select: {
      id: true,
      city: true,
      type: true,
      purpose: true,
      price: true,
      latitude: true,
      longitude: true,
      status: true,
      featured: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function listListingsByIds(ids: string[]) {
  const rows = await prisma.property.findMany({
    where: { id: { in: ids } },
    include: {
      // first asset of each kind: a cover photo plus whether a video / 3D scan exists
      media: { distinct: ["kind"], orderBy: [{ kind: "asc" }, { position: "asc" }], select: { kind: true, url: true } },
      lister: { select: { id: true, name: true, image: true } },
    },
  });
  const byId = new Map(rows.map((r) => [r.id, r]));
  return ids.map((id) => byId.get(id)).filter((r): r is NonNullable<typeof r> => !!r);
}
