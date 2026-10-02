import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { SESSION_COOKIE, signInWithIdToken } from "@/modules/identity";
import { route } from "@/shared/infrastructure/http";

export const POST = route(async (req: Request) => {
  const { idToken } = z.object({ idToken: z.string().min(10) }).parse(await req.json());
  const { user, sessionCookie, maxAgeMs } = await signInWithIdToken(idToken);

  (await cookies()).set(SESSION_COOKIE, sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(maxAgeMs / 1000),
  });
  return NextResponse.json({ user: { id: user.id, role: user.role } });
});

export const DELETE = route(async () => {
  (await cookies()).delete(SESSION_COOKIE);
  return NextResponse.json({ success: true });
});
