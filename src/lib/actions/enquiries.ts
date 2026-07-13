"use server";

import { revalidatePath } from "next/cache";
import { mutate } from "@/lib/db";
import { authorizeAction } from "@/lib/dal";
import { isValidBranchRef } from "@/lib/branches-store";

export interface EnquiryInput {
  studentName: string;
  parentName: string;
  phone: string;
  email: string;
  branch: string;
  grade: string;
  message: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9]{10,15}$/;

/**
 * Public submission from the admission InquiryForm. Validates server-side and
 * persists to the enquiries table. Throws a user-facing message on bad input
 * or DB failure (surfaced by the form).
 */
export async function submitEnquiry(input: EnquiryInput): Promise<void> {
  const studentName = input.studentName?.trim();
  const parentName = input.parentName?.trim();
  const phone = input.phone?.trim();
  const email = input.email?.trim().toLowerCase();
  const branch = input.branch?.trim();
  const grade = input.grade?.trim();
  const message = input.message?.trim() || null;

  if (!studentName || !parentName || !grade) {
    throw new Error("Please complete all required fields.");
  }
  if (!PHONE_RE.test(phone.replace(/[\s()-]/g, ""))) {
    throw new Error("Please enter a valid phone number.");
  }
  if (!EMAIL_RE.test(email)) {
    throw new Error("Please enter a valid email address.");
  }
  if (branch === "all" || !(await isValidBranchRef(branch))) {
    throw new Error("Please select a valid campus.");
  }

  try {
    await mutate(
      `INSERT INTO enquiries
         (student_name, parent_name, phone, email, branch_slug, grade, message)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [studentName, parentName, phone, email, branch, grade, message]
    );
  } catch {
    throw new Error(
      "We couldn't submit your enquiry right now. Please try again shortly."
    );
  }

  revalidatePath("/admin/enquiries");
}

/* ————————————————— Admin actions ————————————————— */

const STATUSES = ["new", "contacted", "closed"] as const;
type Status = (typeof STATUSES)[number];

export async function updateEnquiryStatus(
  id: number,
  status: string
): Promise<void> {
  const user = await authorizeAction();
  if (!STATUSES.includes(status as Status)) {
    throw new Error("Invalid status.");
  }

  // Scope the update so a branch admin can't modify another branch's row.
  if (user.role === "super_admin") {
    await mutate("UPDATE enquiries SET status = ? WHERE id = ?", [status, id]);
  } else {
    await mutate(
      "UPDATE enquiries SET status = ? WHERE id = ? AND branch_slug = ?",
      [status, id, user.branchSlug]
    );
  }
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
}

export async function deleteEnquiry(id: number): Promise<void> {
  const user = await authorizeAction();
  if (user.role === "super_admin") {
    await mutate("DELETE FROM enquiries WHERE id = ?", [id]);
  } else {
    await mutate("DELETE FROM enquiries WHERE id = ? AND branch_slug = ?", [
      id,
      user.branchSlug,
    ]);
  }
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
}
