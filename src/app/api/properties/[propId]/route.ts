import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { discovery } from "@/modules/discovery";
import { getCurrentUser, requireUser } from "@/modules/identity";
import { getListingDetail, listings } from "@/modules/listings";
import { NotFoundError } from "@/shared/kernel/errors";
import { route } from "@/shared/infrastructure/http";

type Ctx = { params: Promise<{ propId: string }> };

const patchSchema = z
  .object({
    title: z.string().min(3),
    description: z.string().min(10),
    type: z.enum(["RESIDENTIAL", "COMMERCIAL", "INDUSTRIAL", "LANDED"]),
    purpose: z.enum(["SALE", "RENT", "INVEST", "INSTALLMENT"]),
    price: z.number().positive(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    bedrooms: z.number().int(),
    bathrooms: z.number().int(),
    areaSqm: z.number(),
    latitude: z.number(),
    longitude: z.number(),
  })
  .partial()
  .strict(); // status, verification and ownership fields are not editable here

export const GET = route(async (_req: NextRequest, { params }: Ctx) => {
  const { propId } = await params;
  const property = await getListingDetail(propId);
  if (!property) throw new NotFoundError("Property");

  const user = await getCurrentUser();
  const isPublic = property.status === "UNVERIFIED" || property.status === "VERIFIED";
  if (!isPublic && property.listerId !== user?.id && user?.role !== "ADMIN") throw new NotFoundError("Property");
  if (user) await discovery.record(user.id, { kind: "VIEW", propertyId: property.id, city: property.city });
  return NextResponse.json({ property });
});

export const PATCH = route(async (req: NextRequest, { params }: Ctx) => {
  const user = await requireUser();
  const { propId } = await params;
  await listings.update(user, propId, patchSchema.parse(await req.json()));
  return NextResponse.json({ success: true });
});

export const DELETE = route(async (_req: NextRequest, { params }: Ctx) => {
  const user = await requireUser();
  const { propId } = await params;
  await listings.remove(user, propId);
  return NextResponse.json({ success: true });
});
