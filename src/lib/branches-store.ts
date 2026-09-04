import "server-only";
import { query } from "@/lib/db";
import {
  branches as staticBranches,
  getBranchBySlug as getStaticBranch,
  isBranchSlug as isStaticBranchSlug,
} from "@/data/branches";
import type { Branch, PlaceholderTone } from "@/data/types";

/**
 * Unified branch source. Every branch — including the three founding campuses,
 * which `npm run db:seed` writes into the DB — lives in the `branches` table
 * and is fully editable/deletable. `src/data/branches.ts` is kept only as the
 * seed source and an offline fallback: when the DB is unreachable we serve the
 * built-ins so the public site still renders. When the DB IS reachable it is
 * authoritative (a deleted branch stays deleted; it is not resurrected).
 * Drafts are returned only when `includeUnpublished` is set (admin surfaces).
 */

export interface CustomBranchRow {
  slug: string;
  name: string;
  area: string;
  address: string;
  phone: string;
  email: string;
  established: number | null;
  grades: string;
  principal_name: string;
  principal_message: string | null;
  principal_photo_url: string | null;
  hero_image_url: string | null;
  students: number | null;
  campus_size: string;
  facilities: unknown;
  hero_tone: string;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
}

const COLS = `slug, name, area, address, phone, email, established, grades,
  principal_name, principal_message, principal_photo_url, hero_image_url, students,
  campus_size, facilities, hero_tone, status, created_at, updated_at`;

function parseFacilities(value: unknown): string[] {
  if (Array.isArray(value)) return value as string[];
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? (parsed as string[]) : [];
    } catch {
      return [];
    }
  }
  return [];
}

/** Map a custom-branch DB row to the shared Branch shape used across the site. */
export function mapCustomBranch(r: CustomBranchRow): Branch {
  const facilities = parseFacilities(r.facilities);
  return {
    slug: r.slug,
    name: r.name,
    area: r.area,
    address: r.address,
    phone: r.phone,
    email: r.email,
    established: r.established ?? new Date().getFullYear(),
    grades: r.grades || "Nursery – Grade 12",
    principal: {
      name: r.principal_name || "The Principal",
      message:
        r.principal_message ||
        "Welcome to our campus. We look forward to sharing more about our school community here soon.",
      photoUrl: r.principal_photo_url,
    },
    quickFacts: {
      students: r.students ?? 0,
      campusSize: r.campus_size || "—",
    },
    facilities: facilities.length > 0 ? facilities : ["Smart Classrooms", "Library", "Sports Ground"],
    heroImage: `branch-${r.slug}-hero`,
    galleryCategoryKey: r.slug,
    heroTone: (r.hero_tone as PlaceholderTone) || "primary",
    heroImageUrl: r.hero_image_url,
  };
}

interface BranchOpts {
  includeUnpublished?: boolean;
}

/**
 * Load branches from the DB. Returns `{ reachable }` so callers can tell an
 * empty-but-healthy DB (authoritative) from an offline one (use fallback).
 */
async function loadFromDb(
  opts?: BranchOpts
): Promise<{ reachable: boolean; list: Branch[] }> {
  const where = opts?.includeUnpublished ? "1=1" : "status = 'published'";
  try {
    const rows = await query<CustomBranchRow>(
      `SELECT ${COLS} FROM branches WHERE ${where} ORDER BY established, created_at`
    );
    return { reachable: true, list: rows.map(mapCustomBranch) };
  } catch {
    return { reachable: false, list: [] };
  }
}

/** All branches (DB-authoritative; built-ins served only when DB is offline). */
export async function getAllBranches(opts?: BranchOpts): Promise<Branch[]> {
  const { reachable, list } = await loadFromDb(opts);
  return reachable ? list : staticBranches;
}

/** All slugs — used by generateStaticParams. */
export async function getAllBranchSlugs(opts?: BranchOpts): Promise<string[]> {
  return (await getAllBranches(opts)).map((b) => b.slug);
}

/** Resolve a branch by slug. DB-authoritative; static fallback when offline. */
export async function getBranchBySlugAsync(
  slug: string,
  opts?: BranchOpts
): Promise<Branch | undefined> {
  try {
    const rows = await query<CustomBranchRow>(
      `SELECT ${COLS} FROM branches WHERE slug = ? LIMIT 1`,
      [slug]
    );
    const row = rows[0];
    if (!row) return undefined; // reachable + absent → truly gone (deleted)
    if (!opts?.includeUnpublished && row.status !== "published") {
      return undefined;
    }
    return mapCustomBranch(row);
  } catch {
    // DB offline — fall back to the built-in static data.
    return getStaticBranch(slug);
  }
}

/** True when the ref is "all", a built-in, or an existing (published) branch. */
export async function isValidBranchRef(
  ref: string,
  opts?: BranchOpts
): Promise<boolean> {
  if (ref === "all") return true;
  return Boolean(await getBranchBySlugAsync(ref, opts));
}

export function isBuiltInBranch(slug: string): boolean {
  return isStaticBranchSlug(slug);
}
