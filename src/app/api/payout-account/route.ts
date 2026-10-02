import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/modules/identity";
import { payments } from "@/modules/payments";
import { route } from "@/shared/infrastructure/http";

const schema = z.object({
  bankCode: z.string().min(2),
  accountNumber: z.string().regex(/^\d{10}$/),
  accountName: z.string().min(2),
});

/** Where commissions and contractor earnings are sent. */
export const POST = route(async (req: NextRequest) => {
  const user = await requireUser();
  await payments.setPayoutAccount(user, schema.parse(await req.json()));
  return NextResponse.json({ success: true });
});
