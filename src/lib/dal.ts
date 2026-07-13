import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getSessionUser } from "./session";
import { isSuperAdmin } from "./rbac";
import type { SessionUser } from "./admin-types";

/**
 * Data Access Layer — the single choke point for admin authorization. Every
 * admin page, Server Action and Route Handler calls one of these before
 * touching data. `cache()` de-dupes the session read within a render pass.
 */

/** Returns the session user or redirects to the login page. */
export const requireUser = cache(async (): Promise<SessionUser> => {
  const user = await getSessionUser();
  if (!user) {
    redirect("/admin/login");
  }
  return user;
});

/** Require a Super Admin; branch admins are sent back to the dashboard. */
export const requireSuperAdmin = cache(async (): Promise<SessionUser> => {
  const user = await requireUser();
  if (!isSuperAdmin(user)) {
    redirect("/admin?denied=1");
  }
  return user;
});

/** Non-redirecting variant for optional rendering (e.g. nav links). */
export async function getOptionalUser(): Promise<SessionUser | null> {
  return getSessionUser();
}

/**
 * Authorization guard for Server Actions. Throws (rather than redirecting) so
 * the action fails loudly if an unauthorized call slips through. Optionally
 * enforces Super Admin.
 */
export async function authorizeAction(options?: {
  superAdmin?: boolean;
}): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new Error("Not authenticated");
  if (options?.superAdmin && !isSuperAdmin(user)) {
    throw new Error("Forbidden: requires Super Admin");
  }
  return user;
}
