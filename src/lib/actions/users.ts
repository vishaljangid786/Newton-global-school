"use server";

import { revalidatePath } from "next/cache";
import { mutate, query } from "@/lib/db";
import { authorizeAction } from "@/lib/dal";
import { hashPassword } from "@/lib/password";
import { isValidBranchRef } from "@/lib/branches-store";
import type { Role } from "@/lib/admin-types";

export interface UserFormState {
  error?: string;
  ok?: boolean;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function createUser(
  _prev: UserFormState | undefined,
  formData: FormData
): Promise<UserFormState> {
  await authorizeAction({ superAdmin: true });

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "") as Role;
  const branchSlugRaw = String(formData.get("branch_slug") ?? "").trim();

  if (!name) return { error: "Name is required." };
  if (!EMAIL_RE.test(email)) return { error: "Enter a valid email." };
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (role !== "super_admin" && role !== "branch_admin") {
    return { error: "Choose a valid role." };
  }

  let branchSlug: string | null = null;
  if (role === "branch_admin") {
    if (
      branchSlugRaw === "all" ||
      !(await isValidBranchRef(branchSlugRaw, { includeUnpublished: true }))
    ) {
      return { error: "Branch admins must be assigned a valid campus." };
    }
    branchSlug = branchSlugRaw;
  }

  const existing = await query<{ id: number }>(
    "SELECT id FROM users WHERE email = ? LIMIT 1",
    [email]
  );
  if (existing[0]) return { error: "A user with that email already exists." };

  const passwordHash = await hashPassword(password);
  await mutate(
    `INSERT INTO users (email, password_hash, name, role, branch_slug)
     VALUES (?, ?, ?, ?, ?)`,
    [email, passwordHash, name, role, branchSlug]
  );

  revalidatePath("/admin/users");
  return { ok: true };
}

export async function resetUserPassword(
  id: number,
  password: string
): Promise<void> {
  await authorizeAction({ superAdmin: true });
  if (password.length < 8) throw new Error("Password too short.");
  const passwordHash = await hashPassword(password);
  await mutate("UPDATE users SET password_hash = ? WHERE id = ?", [
    passwordHash,
    id,
  ]);
  revalidatePath("/admin/users");
}

export async function deleteUser(id: number): Promise<void> {
  const actor = await authorizeAction({ superAdmin: true });
  if (actor.id === id) {
    throw new Error("You can't delete your own account.");
  }
  await mutate("DELETE FROM users WHERE id = ?", [id]);
  revalidatePath("/admin/users");
}
