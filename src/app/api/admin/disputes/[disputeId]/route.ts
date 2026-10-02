import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireRole } from "@/modules/identity";
import { verification } from "@/modules/verification";
import { route } from "@/shared/infrastructure/http";

const schema = z.object({ winningClaimId: z.string(), note: z.string().optional() });

/** Staff pick the rightful claimant when several listers claim the same address. */
export const POST = route(async (req: NextRequest, { params }: { params: Promise<{ disputeId: string }> }) => {
  const admin = await requireRole("ADMIN");
  const { disputeId } = await params;
  const { winningClaimId, note } = schema.parse(await req.json());
  await verification.resolveDispute(admin, disputeId, winningClaimId, note);
  return NextResponse.json({ success: true });
});
