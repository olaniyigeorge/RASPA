import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/modules/identity";
import { media } from "@/modules/media";
import { route } from "@/shared/infrastructure/http";
import { rateLimit } from "@/shared/infrastructure/rate-limit";

const schema = z.object({
  propertyId: z.string(),
  kind: z.enum(["PHOTO", "VIDEO", "SCAN_3D"]),
  scope: z.enum(["media", "evidence"]).default("media"),
  taskId: z.string().optional(),
});

export const POST = route(async (req: NextRequest) => {
  await rateLimit(req, { key: "media:upload-signature", limit: 60, windowMs: 60_000 });
  const user = await requireUser();
  return NextResponse.json(await media.uploadSignature(user, schema.parse(await req.json())));
});
