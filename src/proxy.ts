import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Optimistic check only: the cookie must exist. The signature/revocation check
// happens server-side in getCurrentUser(), where the identity provider can verify the token.
const SESSION_COOKIE = "raspa_session";

export function proxy(req: NextRequest) {
  if (!req.cookies.has(SESSION_COOKIE)) {
    const signInUrl = new URL("/accounts", req.nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/portfolio/:path*", "/accounts/profile/:path*", "/contractor/:path*", "/admin/:path*"],
};
