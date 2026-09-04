import "server-only";
import { query, tryQuery } from "@/lib/db";
import { testimonialSeed } from "@/data/testimonials-seed";
import { getAllBranches } from "@/lib/branches-store";

/**
 * Testimonials — branch-wise voices from students, parents and teachers.
 * Public reads never throw (empty list when MySQL is offline); admin reads
 * use `query` so errors surface loudly.
 */

export const TESTIMONIAL_ROLES = ["student", "parent", "teacher"] as const;
export type TestimonialRole = (typeof TESTIMONIAL_ROLES)[number];

export interface TestimonialRow {
  id: number;
  branch_ref: string;
  author_name: string;
  author_role: TestimonialRole;
  role_detail: string;
  quote: string;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
}

const COLS =
  "id, branch_ref, author_name, author_role, role_detail, quote, status, created_at, updated_at";

/**
 * Published testimonials for one branch page — branch-specific rows plus
 * group-wide ('all') ones, grouped by author role. Safe when DB is offline.
 */
export async function getPublishedTestimonials(
  branchSlug: string
): Promise<Record<TestimonialRole, TestimonialRow[]>> {
  const rows = await tryQuery<TestimonialRow>(
    `SELECT ${COLS} FROM testimonials
     WHERE status = 'published' AND (branch_ref = ? OR branch_ref = 'all')
     ORDER BY created_at DESC`,
    [branchSlug]
  );
  const grouped: Record<TestimonialRole, TestimonialRow[]> = {
    student: [],
    parent: [],
    teacher: [],
  };
  for (const row of rows) {
    if (row.author_role in grouped) grouped[row.author_role].push(row);
  }
  return grouped;
}

/* ——————————————————————————————————————————————————————————————
 * Public feed — the shape every public surface consumes (the home slider and
 * the branch pages). Flat and already resolved, so nothing downstream has to
 * know about branch slugs or database columns.
 * —————————————————————————————————————————————————————————————— */

export interface PublicTestimonial {
  /** Row id as a string, or a `seed-…` id for the document's own quotes. */
  id: string;
  quote: string;
  authorName: string;
  role: TestimonialRole;
  /** Free-text line under the name, e.g. "Parent of two". May be empty. */
  roleDetail: string;
  /** Campus name, already resolved. Empty for group-wide and seed rows. */
  branchName: string;
  /** True for the fallback quotes, so callers can tell real ones apart. */
  isSeed: boolean;
}

export interface TestimonialFeedOptions {
  /** Restrict to one campus (its rows plus the group-wide ones). */
  branch?: string;
  /** Cap the result — applied after the seed is merged in. */
  limit?: number;
  /**
   * Drop the document's fallback quotes even when nothing is published.
   * They are only ever used when the query comes back empty; a surface that
   * would rather show nothing at all than a placeholder can opt out here.
   */
  includeSeed?: boolean;
}

/**
 * Published testimonials for the public site, newest first, with the seed
 * quotes appended behind them.
 *
 * Group-wide rows ('all') always qualify; a `branch` narrows the rest to that
 * campus. Never throws — an unreachable database yields the seed alone.
 */
export async function getTestimonialFeed(
  options: TestimonialFeedOptions = {}
): Promise<PublicTestimonial[]> {
  const { branch, limit, includeSeed = true } = options;

  const rows = await tryQuery<TestimonialRow>(
    branch
      ? `SELECT ${COLS} FROM testimonials
         WHERE status = 'published' AND (branch_ref = ? OR branch_ref = 'all')
         ORDER BY created_at DESC`
      : `SELECT ${COLS} FROM testimonials
         WHERE status = 'published'
         ORDER BY created_at DESC`,
    branch ? [branch] : []
  );

  // Resolve slugs to campus names once, rather than per row. Branch reads are
  // themselves fallback-safe, so this cannot break the page either.
  let nameOf: (ref: string) => string = () => "";
  if (rows.some((row) => row.branch_ref !== "all")) {
    const branches = await getAllBranches();
    const byslug = new Map(branches.map((b) => [b.slug, b.name]));
    nameOf = (ref) => byslug.get(ref) ?? "";
  }

  const live: PublicTestimonial[] = rows.map((row) => ({
    id: String(row.id),
    quote: row.quote,
    authorName: row.author_name,
    role: row.author_role,
    roleDetail: row.role_detail,
    branchName: row.branch_ref === "all" ? "" : nameOf(row.branch_ref),
    isSeed: false,
  }));

  /* The seed is a stand-in, not content: the moment the school has published
     a real voice, the placeholder pair must stop appearing next to it. */
  const seed: PublicTestimonial[] = includeSeed && live.length === 0
    ? testimonialSeed.map((item) => ({
        id: item.id,
        quote: item.quote,
        authorName: item.authorName,
        role: item.role,
        roleDetail: item.roleDetail,
        branchName: "",
        isSeed: true,
      }))
    : [];

  const feed = [...live, ...seed];
  return typeof limit === "number" ? feed.slice(0, limit) : feed;
}

/** Admin list, scoped by a WHERE fragment from rbac.branchScopeFilter. */
export async function listTestimonialsForAdmin(
  clause: string,
  params: string[]
): Promise<TestimonialRow[]> {
  return query<TestimonialRow>(
    `SELECT ${COLS} FROM testimonials WHERE ${clause}
     ORDER BY created_at DESC`,
    params
  );
}

export function isTestimonialRole(value: string): value is TestimonialRole {
  return (TESTIMONIAL_ROLES as readonly string[]).includes(value);
}

export function roleTitle(role: TestimonialRole): string {
  return role === "student"
    ? "Student"
    : role === "parent"
      ? "Parent"
      : "Teacher";
}
