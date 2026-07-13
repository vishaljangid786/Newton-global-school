"use server";

import { revalidatePath } from "next/cache";
import { mutate } from "@/lib/db";
import { authorizeAction } from "@/lib/dal";
import { canManageBranch } from "@/lib/rbac";
import { isValidBranchRef } from "@/lib/branches-store";

export interface BranchFormState {
  error?: string;
  ok?: boolean;
}

/** Trim to a value or null (null reverts the field to the static default). */
function orNull(v: FormDataEntryValue | null): string | null {
  const s = String(v ?? "").trim();
  return s.length > 0 ? s : null;
}

export async function saveBranchOverride(
  _prev: BranchFormState | undefined,
  formData: FormData
): Promise<BranchFormState> {
  const user = await authorizeAction();
  const slug = String(formData.get("slug") ?? "");

  if (slug === "all" || !(await isValidBranchRef(slug, { includeUnpublished: true }))) {
    return { error: "Unknown branch." };
  }
  if (!canManageBranch(user, slug)) {
    return { error: "You can only edit your own branch." };
  }

  const principalName = orNull(formData.get("principal_name"));
  const principalMessage = orNull(formData.get("principal_message"));
  const campusSize = orNull(formData.get("campus_size"));
  const grades = orNull(formData.get("grades"));
  const phone = orNull(formData.get("phone"));
  const email = orNull(formData.get("email"));
  const address = orNull(formData.get("address"));

  const studentsRaw = orNull(formData.get("students"));
  let students: number | null = null;
  if (studentsRaw !== null) {
    const n = Number(studentsRaw);
    if (!Number.isFinite(n) || n < 0) {
      return { error: "Students must be a positive number." };
    }
    students = Math.round(n);
  }

  // Facilities: one per line in the textarea → JSON array (or null).
  const facilitiesRaw = String(formData.get("facilities") ?? "");
  const facilitiesList = facilitiesRaw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const facilitiesJson =
    facilitiesList.length > 0 ? JSON.stringify(facilitiesList) : null;

  await mutate(
    `INSERT INTO branch_overrides
       (branch_slug, principal_name, principal_message, students, campus_size,
        grades, phone, email, address, facilities, updated_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       principal_name = VALUES(principal_name),
       principal_message = VALUES(principal_message),
       students = VALUES(students),
       campus_size = VALUES(campus_size),
       grades = VALUES(grades),
       phone = VALUES(phone),
       email = VALUES(email),
       address = VALUES(address),
       facilities = VALUES(facilities),
       updated_by = VALUES(updated_by)`,
    [
      slug,
      principalName,
      principalMessage,
      students,
      campusSize,
      grades,
      phone,
      email,
      address,
      facilitiesJson,
      user.id,
    ]
  );

  // Refresh the public branch pages that read this content.
  revalidatePath(`/branches/${slug}`);
  revalidatePath(`/branches/${slug}/contact`);
  revalidatePath("/admin/branch");
  return { ok: true };
}
