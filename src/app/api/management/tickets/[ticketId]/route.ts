import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/modules/identity";
import { management } from "@/modules/management";
import { route } from "@/shared/infrastructure/http";

const schema = z.object({ status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED"]) });

export const PATCH = route(async (req: NextRequest, { params }: { params: Promise<{ ticketId: string }> }) => {
  const user = await requireUser();
  const { ticketId } = await params;
  await management.updateTicket(user, ticketId, schema.parse(await req.json()).status);
  return NextResponse.json({ success: true });
});
