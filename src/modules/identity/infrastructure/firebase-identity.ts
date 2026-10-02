import "server-only";
import { SignJWT, createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";
import type { IdentityProvider, VerifiedIdentity } from "../domain/user";

// Firebase ID tokens are RS256 JWTs signed with Google's public keys, so the
// server can verify them with no service-account secret. Once verified we mint
// our own session token, signed with AUTH_SECRET.

const GOOGLE_JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com")
);

/** A sign-in must be fresh: the ID token has to have been issued in the last few minutes. */
const MAX_ID_TOKEN_AGE_SEC = 5 * 60;

function projectId() {
  const id = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? process.env.FIREBASE_PROJECT_ID;
  if (!id) throw new Error("NEXT_PUBLIC_FIREBASE_PROJECT_ID is not set");
  return id;
}

function sessionKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32 || secret.toLowerCase().startsWith("generate")) {
    throw new Error("AUTH_SECRET is missing or still a placeholder. Generate one with: openssl rand -base64 32");
  }
  return new TextEncoder().encode(secret);
}

const SESSION_ISSUER = "raspa";

function toIdentity(p: JWTPayload & { email?: string; email_verified?: boolean; name?: string; picture?: string }): VerifiedIdentity {
  return {
    uid: String(p.sub),
    email: p.email ?? "",
    emailVerified: p.email_verified ?? false,
    name: p.name,
    picture: p.picture,
  };
}

export const firebaseIdentityProvider: IdentityProvider = {
  async verifyIdToken(idToken) {
    const pid = projectId();
    const { payload } = await jwtVerify(idToken, GOOGLE_JWKS, {
      issuer: `https://securetoken.google.com/${pid}`,
      audience: pid,
      algorithms: ["RS256"],
    });
    if (!payload.sub) throw new Error("Token has no subject");
    return toIdentity(payload);
  },

  async createSessionCookie(idToken, expiresInMs) {
    const { payload } = await jwtVerify(idToken, GOOGLE_JWKS, {
      issuer: `https://securetoken.google.com/${projectId()}`,
      audience: projectId(),
      algorithms: ["RS256"],
    });
    if (!payload.iat || Date.now() / 1000 - payload.iat > MAX_ID_TOKEN_AGE_SEC) {
      throw new Error("Recent sign-in required");
    }
    const identity = toIdentity(payload);
    return new SignJWT({ email: identity.email })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(identity.uid)
      .setIssuer(SESSION_ISSUER)
      .setIssuedAt()
      .setExpirationTime(Math.floor((Date.now() + expiresInMs) / 1000))
      .sign(sessionKey());
  },

  async verifySessionCookie(cookie) {
    const { payload } = await jwtVerify(cookie, sessionKey(), { issuer: SESSION_ISSUER, algorithms: ["HS256"] });
    return { uid: String(payload.sub), email: String(payload.email ?? ""), emailVerified: true };
  },
};
