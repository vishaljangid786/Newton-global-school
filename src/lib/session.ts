import "server-only";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  decryptSession,
  encryptSession,
} from "./session-crypto";
import type { SessionUser } from "./admin-types";

/**
 * Cookie-backed session management. Crypto lives in ./session-crypto so the
 * Proxy can verify tokens without importing next/headers.
 */

/** Create the session cookie after a successful login. */
export async function createSession(user: SessionUser): Promise<void> {
  const token = await encryptSession(user);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/** Read + verify the current session user, or null if unauthenticated. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return decryptSession(token);
}

export { SESSION_COOKIE_NAME, decryptSession } from "./session-crypto";
