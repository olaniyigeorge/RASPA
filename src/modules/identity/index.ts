// Public API of the identity context.
import "server-only";
import { makeSignInWithIdToken } from "./application/sign-in";
import { firebaseIdentityProvider } from "./infrastructure/firebase-identity";
import { prismaUserRepository } from "./infrastructure/prisma-user-repository";

export type { User, UserRole } from "./domain/user";
export { isAdmin } from "./domain/user";
export { SESSION_COOKIE, getCurrentUser, requireUser, requireRole } from "./infrastructure/session";

export const signInWithIdToken = makeSignInWithIdToken({
  identity: firebaseIdentityProvider,
  users: prismaUserRepository,
});

export const setUserRole = prismaUserRepository.setRole;
export const findUserById = prismaUserRepository.findById;
