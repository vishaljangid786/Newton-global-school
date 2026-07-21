"use server";

import { revalidatePath } from "next/cache";
import { mutate, query } from "@/lib/db";
import { authorizeAction } from "@/lib/dal";
import { canManageBranch } from "@/lib/rbac";
import { isValidBranchRef } from "@/lib/branches-store";
import { isGalleryCategory } from "@/lib/gallery-store";
import { UploadError, fileFromForm, saveUploadedImage } from "@/lib/uploads";

export interface GalleryFormState {
  error?: string;
  ok?: boolean;
}

function revalidateGalleryPages(branchRef: string) {
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  revalidatePath(`/branches/${branchRef}`);
  revalidatePath(`/branches/${branchRef}/gallery`);
}

export async function uploadGalleryImage(
  _prev: GalleryFormState | undefined,
  formData: FormData
): Promise<GalleryFormState> {
  const user = await authorizeAction();

  const caption = String(formData.get("caption") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const ref = String(formData.get("branch_ref") ?? "");
  const file = fileFromForm(formData, "image");

  if (!caption) return { error: "A caption is required." };
  if (!isGalleryCategory(category)) {
    return { error: "Choose a valid category." };
  }
  if (ref === "all" || !(await isValidBranchRef(ref, { includeUnpublished: true }))) {
    return { error: "Please choose a valid campus." };
  }
  if (!canManageBranch(user, ref)) {
    return { error: "You can only upload photos for your own branch." };
  }
  if (!file) return { error: "Choose an image to upload." };

  let imageUrl: string;
  try {
    imageUrl = await saveUploadedImage(file, "gallery");
  } catch (error) {
    if (error instanceof UploadError) return { error: error.message };
    throw error;
  }

  await mutate(
    `INSERT INTO gallery_images (branch_ref, category, caption, image_url, created_by)
     VALUES (?, ?, ?, ?, ?)`,
    [ref, category, caption, imageUrl, user.id]
  );

  revalidateGalleryPages(ref);
  return { ok: true };
}

export async function deleteGalleryImage(id: number): Promise<void> {
  const user = await authorizeAction();
  const rows = await query<{ branch_ref: string }>(
    "SELECT branch_ref FROM gallery_images WHERE id = ? LIMIT 1",
    [id]
  );
  const row = rows[0];
  if (!row || !canManageBranch(user, row.branch_ref)) return;
  await mutate("DELETE FROM gallery_images WHERE id = ?", [id]);
  revalidateGalleryPages(row.branch_ref);
}
