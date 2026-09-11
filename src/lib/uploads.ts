import "server-only";
import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Media uploads for the admin (principal photos, gallery photographs and
 * videos). Files land in public/uploads/ and are served as /uploads/<name> by
 * the Next server, so no external storage is needed for this self-hosted site.
 */

const UPLOADS_DIR = join(process.cwd(), "public", "uploads");
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Videos get their own, much larger ceiling — 5 MB is a few seconds of 720p.
 *
 * Kept below next.config.ts's `serverActions.bodySizeLimit`, which has to be
 * the larger of the two: a Server Action buffers the whole request body before
 * this function ever sees the file, so a request over that limit is rejected by
 * the framework with a far less helpful message than the one below. Raise both
 * together or neither.
 */
export const MAX_VIDEO_BYTES = 48 * 1024 * 1024; // 48 MB

/* YouTube link parsing and URL building live in lib/youtube.ts — this module
   is server-only and the gallery lightbox needs them on the client. */

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

/**
 * Only formats a browser can play from a plain <video> tag with no transcoding
 * step behind it. MP4 (H.264) is the one every phone records and every browser
 * plays; the other two are here because a school may already have them.
 */
const VIDEO_EXT_BY_MIME: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/ogg": "ogv",
  /* iPhones hand .mov files this type; the container is MP4-compatible. */
  "video/quicktime": "mp4",
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

/**
 * Validate and persist an uploaded video. Returns the public URL path
 * (e.g. "/uploads/gallery-video-1a2b3c.mp4"). Throws UploadError with a
 * user-presentable message on invalid input.
 */
export async function saveUploadedVideo(
  file: File,
  prefix: string
): Promise<string> {
  const ext = VIDEO_EXT_BY_MIME[file.type];
  if (!ext) {
    throw new UploadError(
      "Unsupported video type — use MP4, WebM or MOV."
    );
  }
  if (file.size === 0) throw new UploadError("The uploaded file is empty.");
  if (file.size > MAX_VIDEO_BYTES) {
    throw new UploadError(
      `Video is too large — keep it under ${Math.floor(MAX_VIDEO_BYTES / (1024 * 1024))} MB, ` +
        "or put it on YouTube and paste the link instead."
    );
  }

  const name = `${prefix}-${Date.now().toString(36)}-${randomBytes(4).toString("hex")}.${ext}`;
  await mkdir(UPLOADS_DIR, { recursive: true });
  await writeFile(
    join(UPLOADS_DIR, name),
    Buffer.from(await file.arrayBuffer())
  );
  return `/uploads/${name}`;
}
