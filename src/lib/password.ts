import "server-only";
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

/**
 * Password hashing with Node's built-in scrypt — no native build step, works
 * on Windows out of the box. Stored format: `scrypt$<saltHex>$<hashHex>`.
 * The same algorithm is mirrored in db/seed.mjs for the seed script.
 */

const scryptAsync = promisify(scrypt);
const KEYLEN = 64;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = (await scryptAsync(password, salt, KEYLEN)) as Buffer;
  return `scrypt$${salt.toString("hex")}$${derived.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  const [scheme, saltHex, hashHex] = stored.split("$");
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false;

  const salt = Buffer.from(saltHex, "hex");
  const expected = Buffer.from(hashHex, "hex");
  const derived = (await scryptAsync(password, salt, expected.length)) as Buffer;

  // Constant-time comparison to avoid leaking timing information.
  return expected.length === derived.length && timingSafeEqual(expected, derived);
}
