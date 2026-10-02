import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/modules/identity";
import { media } from "@/modules/media";
import { route } from "@/shared/infrastructure/http";

const schema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("claim") }),
  z.object({
    action: z.literal("add_media"),
    kind: z.enum(["PHOTO", "VIDEO", "SCAN_3D"]),
    publicId: z.string(),
    url: z.string().url(),
    format: z.string().optional(),
    width: z.number().int().optional(),
    height: z.number().int().optional(),
    durationSec: z.number().optional(),
    bytes: z.number().int().optional(),
  }),
  z.object({ action: z.literal("submit") }),
]);

export const POST = route(async (req: NextRequest, { params }: { params: Promise<{ taskId: string }> }) => {
  const user = await requireRole("CONTRACTOR");
  const { taskId } = await params;
  const body = schema.parse(await req.json());
  if (body.action === "claim") await media.claimTask(user, taskId);
  else if (body.action === "submit") await media.submitTask(user, taskId);
  else {
    const { action: _a, ...asset } = body;
    void _a;
    await media.submitTaskMedia(user, taskId, asset);
  }
  return NextResponse.json({ success: true });
});
