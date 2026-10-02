import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/modules/identity";
import { management } from "@/modules/management";
import { route } from "@/shared/infrastructure/http";

type Ctx = { params: Promise<{ propId: string }> };

const schema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("subscribe"), planCode: z.string() }),
  z.object({
    action: z.literal("raise_ticket"),
    category: z.enum(["DISPUTE", "BILL", "WASTE", "UTILITY", "MAINTENANCE", "OTHER"]),
    title: z.string().min(3),
    description: z.string().optional(),
    amountDue: z.number().positive().optional(),
    dueDate: z.coerce.date().optional(),
  }),
]);

/** Dashboard for one property: subscription state, tickets (disputes, bills, waste, utilities…). */
export const GET = route(async (_req: NextRequest, { params }: Ctx) => {
  const user = await requireUser();
  const { propId } = await params;
  return NextResponse.json(await management.dashboard(user, propId));
});

export const POST = route(async (req: NextRequest, { params }: Ctx) => {
  const user = await requireUser();
  const { propId } = await params;
  const body = schema.parse(await req.json());
  if (body.action === "subscribe") {
    return NextResponse.json(
      await management.subscribe({ id: user.id, role: user.role, email: user.email }, propId, body.planCode),
      { status: 201 }
    );
  }
  const { action: _a, ...ticket } = body;
  void _a;
  return NextResponse.json({ ticket: await management.raiseTicket(user, propId, ticket) }, { status: 201 });
});
