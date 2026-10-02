import { DomainError, UnauthorizedError } from "../../../shared/kernel/errors";
import type { IdentityProvider, User, UserRepository } from "../domain/user";

export const SESSION_MAX_AGE_MS = 5 * 24 * 60 * 60 * 1000;

interface Deps {
  identity: IdentityProvider;
  users: UserRepository;
}

/** Exchanges a Firebase ID token (from Google sign-in) for a server session cookie. */
export const makeSignInWithIdToken =
  ({ identity, users }: Deps) =>
  async (idToken: string): Promise<{ user: User; sessionCookie: string; maxAgeMs: number }> => {
    const verified = await identity.verifyIdToken(idToken).catch(() => {
      throw new UnauthorizedError("Invalid or expired sign-in token");
    });
    if (!verified.email) throw new DomainError("Google account has no email", "NO_EMAIL", 400);

    const user = await users.upsertFromIdentity(verified);
    const sessionCookie = await identity.createSessionCookie(idToken, SESSION_MAX_AGE_MS);
    return { user, sessionCookie, maxAgeMs: SESSION_MAX_AGE_MS };
  };

export const makeResolveSessionUser =
  ({ identity, users }: Deps) =>
  async (cookie: string | undefined): Promise<User | null> => {
    if (!cookie) return null;
    try {
      const verified = await identity.verifySessionCookie(cookie);
      return await users.findByFirebaseUid(verified.uid);
    } catch {
      return null;
    }
  };
