import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireRole, setUserRole } from "@/modules/identity";
import { media } from "@/modules/media";
import { route } from "@/shared/infrastructure/http";

const schema = z.object({ status: z.enum(["ACTIVE", "SUSPENDED"]) });

/** Onboard (or suspend) a contractor; activating also grants the CONTRACTOR role. */
export const POST = route(async (req: NextRequest, { params }: { params: Promise<{ contractorId: string }> }) => {
  const admin = await requireRole("ADMIN");
  const { contractorId } = await params;
  const { status } = schema.parse(await req.json());
  const userId = await media.setContractorStatus(admin, contractorId, status);
  await setUserRole(userId, status === "ACTIVE" ? "CONTRACTOR" : "USER");
  return NextResponse.json({ success: true });
});
