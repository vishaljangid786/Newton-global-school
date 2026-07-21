import "server-only";
import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Image uploads for the admin (principal photos, gallery). Files land in
 * public/uploads/ and are served as /uploads/<name> by the Next server, so
 * no external storage is needed for this self-hosted site.
 */

const UPLOADS_DIR = join(process.cwd(), "public", "uploads");
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

export class UploadError extends Error {}

/**
 * Validate and persist an uploaded image. Returns the public URL path
 * (e.g. "/uploads/gallery-1a2b3c.webp"). Throws UploadError with a
 * user-presentable message on invalid input.
 */
export async function saveUploadedImage(
  file: File,
  prefix: string
): Promise<string> {
  const ext = EXT_BY_MIME[file.type];
  if (!ext) {
    throw new UploadError(
      "Unsupported image type — use JPG, PNG, WebP, AVIF or GIF."
    );
  }
  if (file.size === 0) throw new UploadError("The uploaded file is empty.");
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new UploadError("Image is too large — keep it under 5 MB.");
  }

  const name = `${prefix}-${Date.now().toString(36)}-${randomBytes(4).toString("hex")}.${ext}`;
  await mkdir(UPLOADS_DIR, { recursive: true });
  await writeFile(
    join(UPLOADS_DIR, name),
    Buffer.from(await file.arrayBuffer())
  );
  return `/uploads/${name}`;
}

/** The file from a form field, or null when the input was left empty. */
export function fileFromForm(
  formData: FormData,
  field: string
): File | null {
  const value = formData.get(field);
  if (value instanceof File && value.size > 0 && value.name) return value;
  return null;
}
