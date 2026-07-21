import "server-only";
import { query, tryQuery } from "@/lib/db";

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
