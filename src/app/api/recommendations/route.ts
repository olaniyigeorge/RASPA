import { NextRequest, NextResponse } from "next/server";
import { discovery } from "@/modules/discovery";
import { getCurrentUser } from "@/modules/identity";
import { route } from "@/shared/infrastructure/http";

/** Listings ranked for the caller: search/filter history, location, verification, freshness. */
export const GET = route(async (req: NextRequest) => {
  const sp = new URL(req.url).searchParams;
  const user = await getCurrentUser();
  const lat = Number(sp.get("lat"));
  const lng = Number(sp.get("lng"));
  const properties = await discovery.recommend(user?.id ?? null, {
    limit: Number(sp.get("limit") ?? 12),
    location: sp.has("lat") && sp.has("lng") && !Number.isNaN(lat + lng) ? { lat, lng } : undefined,
  });
  return NextResponse.json({ properties });
});
