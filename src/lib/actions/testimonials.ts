"use server";

import { revalidatePath } from "next/cache";
import { mutate, query } from "@/lib/db";
import { authorizeAction } from "@/lib/dal";
import { canManageBranch } from "@/lib/rbac";
import { isValidBranchRef } from "@/lib/branches-store";
import { isTestimonialRole } from "@/lib/testimonials-store";

export interface TestimonialFormState {
  error?: string;
  ok?: boolean;
}

function revalidateTestimonialPages(branchRef: string) {
  revalidatePath("/admin/testimonials");
  revalidatePath("/admin");
  if (branchRef === "all") {
    revalidatePath("/branches/[slug]", "page");
  } else {
    revalidatePath(`/branches/${branchRef}`);
  }
}

export async function createTestimonial(
  _prev: TestimonialFormState | undefined,
  formData: FormData
): Promise<TestimonialFormState> {
  const user = await authorizeAction();

  const authorName = String(formData.get("author_name") ?? "").trim();
  const authorRole = String(formData.get("author_role") ?? "");
  const roleDetail = String(formData.get("role_detail") ?? "").trim();
  const quote = String(formData.get("quote") ?? "").trim();
  const ref = String(formData.get("branch_ref") ?? "");

  if (!authorName) return { error: "The author's name is required." };
  if (!isTestimonialRole(authorRole)) {
    return { error: "Choose whether this voice is a student, parent or teacher." };
  }
  if (quote.length < 20) {
    return { error: "The quote is required (at least 20 characters)." };
  }
  if (!(await isValidBranchRef(ref))) {
    return { error: "Please choose a valid campus." };
  }
  if (!canManageBranch(user, ref)) {
    return { error: "You can only add testimonials for your own branch." };
  }

  await mutate(
    `INSERT INTO testimonials
       (branch_ref, author_name, author_role, role_detail, quote, status, created_by)
     VALUES (?, ?, ?, ?, ?, 'published', ?)`,
    [ref, authorName, authorRole, roleDetail, quote, user.id]
  );

  revalidateTestimonialPages(ref);
  return { ok: true };
}

/** Load the row and check the user may manage its branch. */
async function authorizeRow(id: number) {
  const user = await authorizeAction();
  const rows = await query<{ branch_ref: string }>(
    "SELECT branch_ref FROM testimonials WHERE id = ? LIMIT 1",
    [id]
  );
  const row = rows[0];
  if (!row || !canManageBranch(user, row.branch_ref)) return null;
  return row;
}

export async function toggleTestimonial(
  id: number,
  publish: boolean
): Promise<void> {
  const row = await authorizeRow(id);
  if (!row) return;
  await mutate("UPDATE testimonials SET status = ? WHERE id = ?", [
    publish ? "published" : "draft",
    id,
  ]);
  revalidateTestimonialPages(row.branch_ref);
}

export async function deleteTestimonial(id: number): Promise<void> {
  const row = await authorizeRow(id);
  if (!row) return;
  await mutate("DELETE FROM testimonials WHERE id = ?", [id]);
  revalidateTestimonialPages(row.branch_ref);
}
