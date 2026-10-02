import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/modules/identity";
import { media } from "@/modules/media";
import { route } from "@/shared/infrastructure/http";

const schema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("approve") }),
  z.object({ action: z.literal("reject"), note: z.string().min(1) }),
]);

export const POST = route(async (req: NextRequest, { params }: { params: Promise<{ taskId: string }> }) => {
  const admin = await requireRole("ADMIN");
  const { taskId } = await params;
  const body = schema.parse(await req.json());
  if (body.action === "approve") await media.approveTask(admin, taskId);
  else await media.rejectTask(admin, taskId, body.note);
  return NextResponse.json({ success: true });
});
