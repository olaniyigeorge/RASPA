import { NextResponse } from "next/server";
import { requireUser } from "@/modules/identity";
import { rentals } from "@/modules/rentals";
import { route } from "@/shared/infrastructure/http";

/** The incoming renter pays the rent for a re-listing (via Paystack). */
export const POST = route(async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireUser();
  const { id } = await params;
  return NextResponse.json(await rentals.startRenterPayment({ id: user.id, role: user.role, email: user.email }, id));
});
