import "server-only";
import { tryQuery, query } from "@/lib/db";
import { getBranchBySlugAsync } from "@/lib/branches-store";
import type { Branch } from "@/data/types";
import type { BranchOverrideRow } from "@/lib/admin-types";

/**
 * Merges admin-edited overrides (branch_overrides table) over the static
 * branch defaults from src/data/branches.ts. Any NULL/absent override column
 * keeps the static value, so the public site degrades gracefully when MySQL is
 * offline (returns the pure static branch).
 */

/**
 * Normalise the facilities column. MySQL 8 returns a parsed array from a JSON
 * column; MariaDB (JSON = LONGTEXT) returns a string — parse it here so both
 * work. Returns null when empty/invalid (keeps the static default).
 */
function parseFacilities(value: unknown): string[] | null {
  if (Array.isArray(value)) return value as string[];
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? (parsed as string[]) : null;
    } catch {
      return null;
    }
  }
  return null;
}

function mergeOverride(base: Branch, o: BranchOverrideRow | undefined): Branch {
  if (!o) return base;
  const facilities = parseFacilities(o.facilities);
  return {
    ...base,
    grades: o.grades ?? base.grades,
    phone: o.phone ?? base.phone,
    email: o.email ?? base.email,
    address: o.address ?? base.address,
    principal: {
      name: o.principal_name ?? base.principal.name,
      message: o.principal_message ?? base.principal.message,
      photoUrl: o.principal_photo_url ?? base.principal.photoUrl,
    },
    quickFacts: {
      students: o.students ?? base.quickFacts.students,
      campusSize: o.campus_size ?? base.quickFacts.campusSize,
    },
    facilities:
      facilities && facilities.length > 0 ? facilities : base.facilities,
    heroImageUrl: o.hero_image_url ?? base.heroImageUrl ?? null,
  };
}

/** Public read: branch (built-in or custom) with overrides applied. */
export async function getBranchContent(
  slug: string,
  opts?: { includeUnpublished?: boolean }
): Promise<Branch | undefined> {
  const base = await getBranchBySlugAsync(slug, opts);
  if (!base) return undefined;

  const rows = await tryQuery<BranchOverrideRow>(
    `SELECT branch_slug, principal_name, principal_message, principal_photo_url, hero_image_url, students,
            campus_size, grades, phone, email, address, facilities, updated_at
     FROM branch_overrides WHERE branch_slug = ? LIMIT 1`,
    [slug]
  );
  return mergeOverride(base, rows[0]);
}

/** Admin read: the raw override row (or null when none saved yet). Throws on DB error. */
export async function getBranchOverride(
  slug: string
): Promise<BranchOverrideRow | null> {
  const rows = await query<BranchOverrideRow>(
    `SELECT branch_slug, principal_name, principal_message, principal_photo_url, hero_image_url, students,
            campus_size, grades, phone, email, address, facilities, updated_at
     FROM branch_overrides WHERE branch_slug = ? LIMIT 1`,
    [slug]
  );
  return rows[0] ?? null;
}
