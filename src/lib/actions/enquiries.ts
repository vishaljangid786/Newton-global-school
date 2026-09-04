"use server";

import { revalidatePath } from "next/cache";
import { mutate } from "@/lib/db";
import { authorizeAction } from "@/lib/dal";
import { isValidBranchRef } from "@/lib/branches-store";
import { LIMITS, checkEmail, checkPhone, checkText, collect } from "@/lib/validate";

export interface EnquiryInput {
  studentName: string;
  parentName: string;
  phone: string;
  email: string;
  branch: string;
  grade: string;
  message: string;
}

/**
 * Public submission from the admission InquiryForm. Validates server-side and
 * persists to the enquiries table. Throws a user-facing message on bad input
 * or DB failure (surfaced by the form).
 */
export async function submitEnquiry(input: EnquiryInput): Promise<void> {
  const checked = collect({
    studentName: checkText(input.studentName, {
      label: "Student name",
      max: LIMITS.personName,
      required: true,
    }),
    parentName: checkText(input.parentName, {
      label: "Parent or guardian name",
      max: LIMITS.personName,
      required: true,
    }),
    grade: checkText(input.grade, {
      label: "Grade",
      max: LIMITS.grade,
      required: true,
    }),
    phone: checkPhone(input.phone, { required: true }),
    email: checkEmail(input.email, { required: true }),
    message: checkText(input.message, { label: "Message", max: LIMITS.message }),
    branch: checkText(input.branch, {
      label: "Campus",
      max: LIMITS.branchRef,
      required: true,
    }),
  });
  if ("error" in checked) throw new Error(checked.error);
  const { studentName, parentName, grade, phone, email, message, branch } =
    checked.values;

  if (branch === "all" || !(await isValidBranchRef(branch))) {
    throw new Error("Please select a valid campus.");
  }

  try {
    await mutate(
      `INSERT INTO enquiries
         (student_name, parent_name, phone, email, branch_slug, grade, message)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [studentName, parentName, phone, email, branch, grade, message || null]
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
