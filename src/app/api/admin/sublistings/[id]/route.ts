import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/modules/identity";
import { rentals } from "@/modules/rentals";
import { route } from "@/shared/infrastructure/http";

const schema = z.object({ criticalReviewPassed: z.boolean().default(false) });

/** Platform sign-off. For a tenant-listed property without CofO, `criticalReviewPassed` must be true. */
export const POST = route(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const admin = await requireRole("ADMIN");
  const { id } = await params;
  const s = await rentals.approveAsPlatform(admin, id, schema.parse(await req.json()));
  return NextResponse.json({ status: s.status });
});
