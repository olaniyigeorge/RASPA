import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/modules/identity";
import { payments } from "@/modules/payments";
import { route } from "@/shared/infrastructure/http";
import { rateLimit } from "@/shared/infrastructure/rate-limit";

const schema = z.object({
  propertyId: z.string(),
  planType: z.enum(["BUY_NOW", "INSTALLMENTS", "INVEST", "RENT"]),
  amount: z.number().positive(),
});

export const POST = route(async (req: NextRequest) => {
  await rateLimit(req, { key: "payments:initiate", limit: 10, windowMs: 60_000 });
  const user = await requireUser();
  const result = await payments.initiateForProperty(user, schema.parse(await req.json()));
  return NextResponse.json(result, { status: 201 });
});
