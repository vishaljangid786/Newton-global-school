"use server";

import { revalidatePath } from "next/cache";
import { mutate, query } from "@/lib/db";
import { authorizeAction } from "@/lib/dal";
import { canManageBranch } from "@/lib/rbac";
import { isValidBranchRef } from "@/lib/branches-store";
import { UploadError, fileFromForm, saveUploadedImage } from "@/lib/uploads";
import {
  LIMITS,
  checkEmail,
  checkInt,
  checkPhone,
  checkText,
  collect,
} from "@/lib/validate";

export interface BranchFormState {
  error?: string;
  ok?: boolean;
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

  /*
   * Overrides are all optional — an empty field means "fall back to the
   * branch record" — but anything that IS given still has to fit its column
   * and look like what it claims to be.
   */
  const checked = collect({
    principalName: checkText(formData.get("principal_name"), {
      label: "Principal's name",
      max: LIMITS.personName,
    }),
    principalMessage: checkText(formData.get("principal_message"), {
      label: "Principal's message",
      max: LIMITS.message,
    }),
    campusSize: checkText(formData.get("campus_size"), {
      label: "Campus size",
      max: LIMITS.campusSize,
    }),
    grades: checkText(formData.get("grades"), {
      label: "Grades",
      max: LIMITS.grades,
    }),
    phone: checkPhone(formData.get("phone")),
    email: checkEmail(formData.get("email")),
    address: checkText(formData.get("address"), { label: "Address", max: 255 }),
    students: checkInt(formData.get("students"), {
      label: "Students",
      min: 0,
      max: 100000,
    }),
  });
  if ("error" in checked) return { error: checked.error };

  const blank = (v: string) => (v === "" ? null : v);
  const principalName = blank(checked.values.principalName);
  const principalMessage = blank(checked.values.principalMessage);
  const campusSize = blank(checked.values.campusSize);
  const grades = blank(checked.values.grades);
  const phone = blank(checked.values.phone);
  const email = blank(checked.values.email);
  const address = blank(checked.values.address);
  const students = checked.values.students;

  // Facilities: one per line in the textarea → JSON array (or null).
  const facilitiesRaw = String(formData.get("facilities") ?? "");
  const facilitiesList = facilitiesRaw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const facilitiesJson =
    facilitiesList.length > 0 ? JSON.stringify(facilitiesList) : null;

  // Principal photo: a new upload replaces it, "remove" clears it, otherwise
  // the previously saved override (if any) is kept.
  let photoUrl: string | null = null;
  const photoFile = fileFromForm(formData, "principal_photo");
  if (photoFile) {
    try {
      photoUrl = await saveUploadedImage(photoFile, "principal");
    } catch (error) {
      if (error instanceof UploadError) return { error: error.message };
      throw error;
    }
  } else if (String(formData.get("principal_photo_remove") ?? "") !== "1") {
    const prior = await query<{ principal_photo_url: string | null }>(
      "SELECT principal_photo_url FROM branch_overrides WHERE branch_slug = ? LIMIT 1",
      [slug]
    );
    photoUrl = prior[0]?.principal_photo_url ?? null;
  }

  // Same handling for the campus photo shown on the card and branch hero.
  let heroUrl: string | null = null;
  const heroFile = fileFromForm(formData, "hero_image");
  if (heroFile) {
    try {
      heroUrl = await saveUploadedImage(heroFile, "branch");
    } catch (error) {
      if (error instanceof UploadError) return { error: error.message };
      throw error;
    }
  } else if (String(formData.get("hero_image_remove") ?? "") !== "1") {
    const prior = await query<{ hero_image_url: string | null }>(
      "SELECT hero_image_url FROM branch_overrides WHERE branch_slug = ? LIMIT 1",
      [slug]
    );
    heroUrl = prior[0]?.hero_image_url ?? null;
  }

  await mutate(
    `INSERT INTO branch_overrides
       (branch_slug, principal_name, principal_message, principal_photo_url,
        hero_image_url, students, campus_size, grades, phone, email, address,
        facilities, updated_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       principal_name = VALUES(principal_name),
       principal_message = VALUES(principal_message),
       principal_photo_url = VALUES(principal_photo_url),
       hero_image_url = VALUES(hero_image_url),
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
      photoUrl,
      heroUrl,
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
  revalidatePath(`/admin/branches/${slug}/content`);
  return { ok: true };
}
