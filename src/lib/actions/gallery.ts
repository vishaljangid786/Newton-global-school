"use server";

import { revalidatePath } from "next/cache";
import { mutate, query } from "@/lib/db";
import { authorizeAction } from "@/lib/dal";
import { canManageBranch } from "@/lib/rbac";
import { isValidBranchRef } from "@/lib/branches-store";
import { isGalleryCategory } from "@/lib/gallery-store";
import {
  UploadError,
  fileFromForm,
  saveUploadedImage,
  saveUploadedVideo,
} from "@/lib/uploads";
import { parseYouTubeId } from "@/lib/youtube";
import { LIMITS, checkText, collect } from "@/lib/validate";

export interface GalleryFormState {
  error?: string;
  ok?: boolean;
}

function revalidateGalleryPages(branchRef: string) {
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  /* The home page carries a gallery strip, so it has to refresh too. */
  revalidatePath("/");
  revalidatePath(`/branches/${branchRef}`);
  revalidatePath(`/branches/${branchRef}/gallery`);
}

/**
 * Add one item to the gallery — a photograph, an uploaded video clip, or a
 * YouTube link.
 *
 * One action rather than three because the caption/category/campus half is
 * identical for all of them and the branch permission check must not be
 * duplicated three ways. `media` selects the arm:
 *
 *   "image"   → `image` file field
 *   "video"   → `video` file field, optional `poster` image
 *   "youtube" → `youtube_url` text field; the poster is derived from the id
 */
export async function uploadGalleryImage(
  _prev: GalleryFormState | undefined,
  formData: FormData
): Promise<GalleryFormState> {
  const user = await authorizeAction();

  const caption = String(formData.get("caption") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const ref = String(formData.get("branch_ref") ?? "");
  const media = String(formData.get("media") ?? "image");

  const checked = collect({
    caption: checkText(caption, {
      label: "Caption",
      max: LIMITS.caption,
      required: true,
    }),
  });
  if ("error" in checked) return { error: checked.error };
  if (!isGalleryCategory(category)) {
    return { error: "Choose a valid category." };
  }
  if (ref === "all" || !(await isValidBranchRef(ref, { includeUnpublished: true }))) {
    return { error: "Please choose a valid campus." };
  }
  if (!canManageBranch(user, ref)) {
    return { error: "You can only upload to your own branch." };
  }
  if (media !== "image" && media !== "video" && media !== "youtube") {
    return { error: "Choose whether this is a photo, a video or a YouTube link." };
  }

  /* What goes in the four media columns, filled in by whichever arm runs. */
  let mediaType: "image" | "video" = "image";
  let imageUrl: string | null = null;
  let videoUrl: string | null = null;
  let videoSource: "file" | "youtube" | null = null;

  try {
    if (media === "image") {
      const file = fileFromForm(formData, "image");
      if (!file) return { error: "Choose an image to upload." };
      imageUrl = await saveUploadedImage(file, "gallery");
    } else if (media === "video") {
      const file = fileFromForm(formData, "video");
      if (!file) return { error: "Choose a video to upload." };
      mediaType = "video";
      videoSource = "file";
      videoUrl = await saveUploadedVideo(file, "gallery-video");
      /* Optional: without one the tile plays the clip's own first frame. */
      const poster = fileFromForm(formData, "poster");
      if (poster) imageUrl = await saveUploadedImage(poster, "gallery-poster");
    } else {
      const raw = String(formData.get("youtube_url") ?? "").trim();
      if (!raw) return { error: "Paste the YouTube link." };
      const id = parseYouTubeId(raw);
      if (!id) {
        return {
          error:
            "That does not look like a YouTube link. Paste the address from the browser bar or the Share button.",
        };
      }
      mediaType = "video";
      videoSource = "youtube";
      videoUrl = id;
      /* imageUrl stays null: the poster is derived from the id on read, so a
         thumbnail the school never has to supply. */
    }
  } catch (error) {
    if (error instanceof UploadError) return { error: error.message };
    throw error;
  }

  await mutate(
    `INSERT INTO gallery_images
       (branch_ref, category, caption, media_type, image_url, video_url, video_source, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [ref, category, caption, mediaType, imageUrl, videoUrl, videoSource, user.id]
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
