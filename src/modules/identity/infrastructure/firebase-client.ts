"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut } from "firebase/auth";

function clientAuth() {
  const app = getApps().length
    ? getApp()
    : initializeApp({
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      });
  return getAuth(app);
}

/** Google popup -> Firebase ID token -> server session cookie. */
export async function signInWithGoogle(): Promise<void> {
  const auth = clientAuth();
  const cred = await signInWithPopup(auth, new GoogleAuthProvider());
  const idToken = await cred.user.getIdToken();
  const res = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  // The server session cookie is what the app trusts; drop the client SDK state.
  await signOut(auth);
  if (!res.ok) throw new Error((await res.json().catch(() => null))?.error ?? "Sign-in failed");
}
