import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/modules/identity";
import { verification } from "@/modules/verification";
import { route } from "@/shared/infrastructure/http";

const schema = z.object({
  type: z.enum(["COFO", "UTILITY_BILL", "OWNER_ID", "TENANCY_AGREEMENT", "VIDEO", "SCAN_3D", "IMAGE", "OTHER"]),
  publicId: z.string(),
  url: z.string().url(),
  resourceType: z.string().optional(),
  note: z.string().optional(),
});

export const POST = route(async (req: NextRequest, { params }: { params: Promise<{ claimId: string }> }) => {
  const user = await requireUser();
  const { claimId } = await params;
  const evidence = await verification.addEvidence(user, claimId, schema.parse(await req.json()));
  return NextResponse.json({ evidence }, { status: 201 });
});
