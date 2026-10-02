import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { discovery } from "@/modules/discovery";
import { getCurrentUser, requireUser } from "@/modules/identity";
import { listings, searchListings } from "@/modules/listings";
import { route } from "@/shared/infrastructure/http";

const createSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3).optional(),
  description: z.string().min(10),
  type: z.enum(["RESIDENTIAL", "COMMERCIAL", "INDUSTRIAL", "LANDED"]),
  purpose: z.enum(["SALE", "RENT", "INVEST", "INSTALLMENT"]),
  price: z.number().positive(),
  currency: z.string().default("NGN"),
  address: z.string().min(3),
  city: z.string().min(2),
  state: z.string().min(2),
  bedrooms: z.number().int().optional(),
  bathrooms: z.number().int().optional(),
  areaSqm: z.number().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  // who is listing: the owner, or a tenant who must name the owner
  capacity: z.enum(["OWNER", "TENANT"]),
  owner: z.object({ name: z.string(), phone: z.string().optional(), email: z.string().email().optional() }).optional(),
});

export const GET = route(async (req: NextRequest) => {
  const sp = new URL(req.url).searchParams;
  const filters = {
    purpose: (sp.get("purpose") as never) ?? undefined,
    type: (sp.get("type") as never) ?? undefined,
    city: sp.get("city") ?? undefined,
    q: sp.get("q") ?? undefined,
    minPrice: sp.get("minPrice") ? Number(sp.get("minPrice")) : undefined,
    maxPrice: sp.get("maxPrice") ? Number(sp.get("maxPrice")) : undefined,
  };
  const properties = await searchListings(filters);

  // search + filter history feeds recommendations
  const user = await getCurrentUser();
  const lat = sp.get("lat");
  const lng = sp.get("lng");
  if (user && (filters.q || filters.city || filters.type || filters.purpose || filters.minPrice || filters.maxPrice)) {
    await discovery.record(user.id, {
      kind: filters.q ? "SEARCH" : "FILTER",
      query: filters.q,
      city: filters.city,
      latitude: lat ? Number(lat) : undefined,
      longitude: lng ? Number(lng) : undefined,
      filters: { type: filters.type, purpose: filters.purpose, minPrice: filters.minPrice, maxPrice: filters.maxPrice },
    });
  }
  return NextResponse.json({ properties });
});

export const POST = route(async (req: NextRequest) => {
  const user = await requireUser();
  const input = createSchema.parse(await req.json());
  const listing = await listings.create(user, input);
  return NextResponse.json({ property: listing }, { status: 201 });
});
