import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { ForbiddenError, UnauthorizedError } from "../../../shared/kernel/errors";
import { makeResolveSessionUser } from "../application/sign-in";
import type { User, UserRole } from "../domain/user";
import { firebaseIdentityProvider } from "./firebase-identity";
import { prismaUserRepository } from "./prisma-user-repository";

export const SESSION_COOKIE = "raspa_session";

const resolve = makeResolveSessionUser({
  identity: firebaseIdentityProvider,
  users: prismaUserRepository,
});

/** The signed-in user for this request, or null. Memoised per request. */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const jar = await cookies();
  return resolve(jar.get(SESSION_COOKIE)?.value);
});

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) throw new UnauthorizedError();
  return user;
}

export async function requireRole(...roles: UserRole[]): Promise<User> {
  const user = await requireUser();
  if (!roles.includes(user.role)) throw new ForbiddenError();
  return user;
}
