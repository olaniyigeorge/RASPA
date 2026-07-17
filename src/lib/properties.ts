import { prisma } from "@/lib/prisma";
import { ListingPurpose, PropertyType } from "../../prisma/prisma-client";


export interface PropertyFilters {
  purpose?: ListingPurpose;
  type?: PropertyType;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  q?: string;
}

export async function listProperties(filters: PropertyFilters = {}, take = 24, skip = 0) {
  return prisma.property.findMany({
    where: {
      status: "PUBLISHED",
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
      images: { orderBy: { position: "asc" }, take: 1 },
      agent: { select: { id: true, name: true, image: true } },
    },
    orderBy: { createdAt: "desc" },
    take,
    skip,
  });
}

export async function getPropertyBySlugOrId(propId: string) {
  return prisma.property.findFirst({
    where: { OR: [{ id: propId }, { slug: propId }] },
    include: {
      images: { orderBy: { position: "asc" } },
      amenities: { include: { amenity: true } },
      agent: { select: { id: true, name: true, image: true, phone: true, email: true } },
      reviews: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function getFeaturedProperties(take = 6) {
  return listProperties({ featured: true }, take);
}
