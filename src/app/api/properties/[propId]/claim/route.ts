import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/modules/identity";
import { verification } from "@/modules/verification";
import { route } from "@/shared/infrastructure/http";

const schema = z.object({
  evidence: z
    .array(
      z.object({
        type: z.enum(["COFO", "UTILITY_BILL", "OWNER_ID", "TENANCY_AGREEMENT", "VIDEO", "SCAN_3D", "IMAGE", "OTHER"]),
        publicId: z.string(),
        url: z.string().url(),
        resourceType: z.string().optional(),
        note: z.string().optional(),
      })
    )
    .min(1),
});

/** Submit proof of ownership; this also takes the listing from DRAFT to UNVERIFIED. */
export const POST = route(async (req: NextRequest, { params }: { params: Promise<{ propId: string }> }) => {
  const user = await requireUser();
  const { propId } = await params;
  const { evidence } = schema.parse(await req.json());
  const claim = await verification.submit(user, propId, evidence);
  return NextResponse.json({ claim: { id: claim.id, status: claim.status } }, { status: 201 });
});
