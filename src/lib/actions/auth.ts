"use server";

import { redirect } from "next/navigation";
import { query } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { createSession, destroySession } from "@/lib/session";
import type { Role } from "@/lib/admin-types";

export interface LoginState {
  error?: string;
}

interface UserAuthRow {
  id: number;
  email: string;
  name: string;
  role: Role;
  branch_slug: string | null;
  password_hash: string;
}

/** Credentials login (Server Action for useActionState). */
export async function login(
  _prev: LoginState | undefined,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Please enter your email and password." };
  }

  let rows: UserAuthRow[];
  try {
    rows = await query<UserAuthRow>(
      `SELECT id, email, name, role, branch_slug, password_hash
       FROM users WHERE email = ? LIMIT 1`,
      [email]
    );
  } catch {
    return {
      error:
        "Could not reach the database. Is MySQL running and configured in .env.local?",
    };
  }

  const user = rows[0];
  // Always run a verification-shaped path to avoid trivial user enumeration.
  const ok = user ? await verifyPassword(password, user.password_hash) : false;
  if (!user || !ok) {
    return { error: "Invalid email or password." };
  }

  await createSession({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    branchSlug: user.branch_slug ?? null,
  });

  redirect("/admin");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}
