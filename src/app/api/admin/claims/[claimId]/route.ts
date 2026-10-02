import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/modules/identity";
import { verification } from "@/modules/verification";
import { route } from "@/shared/infrastructure/http";

const schema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("start_review") }),
  z.object({ action: z.literal("approve"), criticalReview: z.boolean().default(false), note: z.string().optional() }),
  z.object({ action: z.literal("reject"), note: z.string().min(1) }),
]);

export const POST = route(async (req: NextRequest, { params }: { params: Promise<{ claimId: string }> }) => {
  const admin = await requireRole("ADMIN");
  const { claimId } = await params;
  const body = schema.parse(await req.json());
  if (body.action === "start_review") await verification.startReview(admin, claimId);
  else if (body.action === "approve") await verification.approve(admin, claimId, body);
  else await verification.reject(admin, claimId, body.note);
  return NextResponse.json({ success: true });
});
