import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/modules/identity";
import { media } from "@/modules/media";
import { route } from "@/shared/infrastructure/http";

const schema = z.object({
  skills: z.array(z.enum(["PHOTOS", "VIDEO", "DRONE_VIDEO", "SCAN_3D"])).min(1),
  city: z.string().optional(),
  state: z.string().optional(),
});

export const POST = route(async (req: NextRequest) => {
  const user = await requireUser();
  const contractor = await media.applyAsContractor(user, schema.parse(await req.json()));
  return NextResponse.json({ contractor }, { status: 201 });
});
