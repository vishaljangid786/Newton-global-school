import { SignJWT, jwtVerify } from "jose";
import type { SessionUser } from "./admin-types";

/**
 * Session token crypto (jose HS256). Kept free of `next/headers` so it can be
 * imported by both Server Components and the Proxy without pulling cookie APIs
 * into the proxy bundle.
 */

export const SESSION_COOKIE_NAME = "sunrise_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "SESSION_SECRET is missing or too short — set it in .env.local"
    );
  }
  return new TextEncoder().encode(secret);
}

export async function encryptSession(user: SessionUser): Promise<string> {
  return new SignJWT({ user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getKey());
}

export async function decryptSession(
  token: string | undefined
): Promise<SessionUser | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getKey(), {
      algorithms: ["HS256"],
    });
    return (payload.user as SessionUser) ?? null;
  } catch {
    return null;
  }
}
