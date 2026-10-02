import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/modules/identity";
import { media } from "@/modules/media";
import { route } from "@/shared/infrastructure/http";

const registerSchema = z.object({
  propertyId: z.string(),
  kind: z.enum(["PHOTO", "VIDEO", "SCAN_3D"]),
  publicId: z.string(),
  url: z.string().url(),
  format: z.string().optional(),
  width: z.number().int().optional(),
  height: z.number().int().optional(),
  durationSec: z.number().optional(),
  bytes: z.number().int().optional(),
});

/** Register an asset the lister/tenant uploaded themselves (checked against the capture spec). */
export const POST = route(async (req: NextRequest) => {
  const user = await requireUser();
  const asset = await media.registerSelfCaptured(user, registerSchema.parse(await req.json()));
  return NextResponse.json({ media: asset }, { status: 201 });
});
