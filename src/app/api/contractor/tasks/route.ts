import { NextResponse } from "next/server";
import { requireRole } from "@/modules/identity";
import { contractors, listOpenTasks, listTasksForContractor } from "@/modules/media";
import { ForbiddenError } from "@/shared/kernel/errors";
import { route } from "@/shared/infrastructure/http";

/** Contractor dashboard feed: open work matching their skills, and their own tasks. */
export const GET = route(async () => {
  const user = await requireRole("CONTRACTOR");
  const contractor = await contractors.findByUserId(user.id);
  if (!contractor || contractor.status !== "ACTIVE") throw new ForbiddenError("Contractor account is not active");
  const [open, mine] = await Promise.all([listOpenTasks(contractor.skills), listTasksForContractor(contractor.id)]);
  return NextResponse.json({ open, mine });
});
