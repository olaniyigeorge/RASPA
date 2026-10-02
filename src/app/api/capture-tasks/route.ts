import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/modules/identity";
import { media } from "@/modules/media";
import { payments } from "@/modules/payments";
import { route } from "@/shared/infrastructure/http";

const schema = z.object({
  propertyId: z.string(),
  kind: z.enum(["PHOTOS", "VIDEO", "DRONE_VIDEO", "SCAN_3D"]),
  instructions: z.string().optional(),
  scheduledFor: z.coerce.date().optional(),
});

/** Request professional capture. Non-staff pay first; the task opens to contractors once paid. */
export const POST = route(async (req: NextRequest) => {
  const user = await requireUser();
  const { task, price } = await media.requestCapture(user, schema.parse(await req.json()));
  if (price === 0) return NextResponse.json({ task }, { status: 201 });

  const payment = await payments.initiate(user, {
    propertyId: task.propertyId,
    planType: "MEDIA_CAPTURE",
    amount: price,
    captureTaskId: task.id,
  });
  return NextResponse.json({ task, ...payment }, { status: 201 });
});
