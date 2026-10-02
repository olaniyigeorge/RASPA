import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/modules/identity";
import { listOpenSublistings, rentals } from "@/modules/rentals";
import { route } from "@/shared/infrastructure/http";

export const GET = route(async (req: NextRequest) => {
  const propertyId = new URL(req.url).searchParams.get("propertyId") ?? undefined;
  return NextResponse.json({ sublistings: await listOpenSublistings(propertyId) });
});

/** A tenant re-lists ("retweets") the rental they occupy for the next tenant. */
export const POST = route(async (req: NextRequest) => {
  const user = await requireUser();
  const { propertyId } = z.object({ propertyId: z.string() }).parse(await req.json());
  return NextResponse.json({ sublisting: await rentals.relist(user, propertyId) }, { status: 201 });
});
