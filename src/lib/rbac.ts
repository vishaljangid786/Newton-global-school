import type { BranchSlug } from "@/data/types";
import type { BranchRef, Role, SessionUser } from "./admin-types";

/**
 * Pure RBAC predicates — no I/O, safe to use anywhere. The rule set:
 *   • super_admin  → full access to every branch + user management
 *   • branch_admin → limited to their own branch_slug; group-wide ('all')
 *                    content is read-only to them and managed by super_admin.
 */

export function isSuperAdmin(user: SessionUser): boolean {
  return user.role === "super_admin";
}

/** Can this user view/manage content scoped to the given branch ref? */
export function canAccessBranch(user: SessionUser, ref: BranchRef): boolean {
  if (isSuperAdmin(user)) return true;
  return ref === user.branchSlug;
}

/** Can this user create/edit content for the given branch ref? */
export function canManageBranch(user: SessionUser, ref: BranchRef): boolean {
  if (isSuperAdmin(user)) return true;
  // Branch admins cannot author group-wide ('all') items.
  return ref !== "all" && ref === user.branchSlug;
}

/** The set of branch refs a user may target when creating content. */
export function targetableBranchRefs(
  user: SessionUser,
  allSlugs: BranchSlug[]
): BranchRef[] {
  if (isSuperAdmin(user)) return ["all", ...allSlugs];
  return user.branchSlug ? [user.branchSlug] : [];
}

/**
 * Build a SQL WHERE fragment + params that scopes a query to what the user may
 * see. Super admins get no restriction; branch admins see their branch, plus
 * group-wide rows when `includeAll` is set (e.g. notifications/blogs they can
 * read but not edit).
 */
export function branchScopeFilter(
  user: SessionUser,
  column: string,
  includeAll = false
): { clause: string; params: string[] } {
  if (isSuperAdmin(user)) return { clause: "1=1", params: [] };
  if (!user.branchSlug) return { clause: "1=0", params: [] };
  if (includeAll) {
    return {
      clause: `(${column} = ? OR ${column} = 'all')`,
      params: [user.branchSlug],
    };
  }
  return { clause: `${column} = ?`, params: [user.branchSlug] };
}

export function roleLabel(role: Role): string {
  return role === "super_admin" ? "Super Admin" : "Branch Admin";
}
