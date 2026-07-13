import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, decryptSession } from "@/lib/session-crypto";

/**
 * Optimistic auth gate for the admin area (Next.js 16 "Proxy", formerly
 * Middleware). This is a fast cookie-only check to redirect obvious cases —
 * the authoritative RBAC checks still run in the DAL on every admin page and
 * Server Action.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/login";
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const user = await decryptSession(token);

  // Unauthenticated visitor to any admin page (except login) → login.
  if (!user && !isLogin) {
    const url = new URL("/admin/login", request.url);
    return NextResponse.redirect(url);
  }

  // Authenticated visitor hitting the login page → dashboard.
  if (user && isLogin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
