import { NextRequest, NextResponse } from "next/server";
import { bootstrap } from "@/modules/bootstrap";
import { payments } from "@/modules/payments";
import { route } from "@/shared/infrastructure/http";

/** Paystack webhook: the source of truth for payment and payout state. */
export const POST = route(async (req: NextRequest) => {
  bootstrap();
  const raw = await req.text(); // signature is over the exact raw body
  await payments.handleWebhook(raw, req.headers.get("x-paystack-signature"));
  return NextResponse.json({ received: true });
});
