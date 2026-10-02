import { NextResponse } from "next/server";
import { requireUser } from "@/modules/identity";
import { rentals } from "@/modules/rentals";
import { route } from "@/shared/infrastructure/http";

/** Owner sign-off on the takeover. */
export const POST = route(async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireUser();
  const { id } = await params;
  const s = await rentals.approveAsOwner(user, id);
  return NextResponse.json({ status: s.status });
});
