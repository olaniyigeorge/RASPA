import { NextResponse } from "next/server";
import { management } from "@/modules/management";
import { route } from "@/shared/infrastructure/http";

export const GET = route(async () => NextResponse.json({ plans: await management.listPlans() }));
