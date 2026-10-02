import "server-only";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import type { IdentityProvider, VerifiedIdentity } from "../domain/user";

function adminAuth() {
  const app =
    getApps()[0] ??
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  return getAuth(app);
}

const toIdentity = (d: {
  uid: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
}): VerifiedIdentity => ({
  uid: d.uid,
  email: d.email ?? "",
  emailVerified: d.email_verified ?? false,
  name: d.name,
  picture: d.picture,
});

export const firebaseIdentityProvider: IdentityProvider = {
  async verifyIdToken(idToken) {
    return toIdentity(await adminAuth().verifyIdToken(idToken));
  },
  createSessionCookie(idToken, expiresInMs) {
    return adminAuth().createSessionCookie(idToken, { expiresIn: expiresInMs });
  },
  async verifySessionCookie(cookie) {
    // checkRevoked: true so signing out everywhere actually ends sessions
    return toIdentity(await adminAuth().verifySessionCookie(cookie, true));
  },
};
