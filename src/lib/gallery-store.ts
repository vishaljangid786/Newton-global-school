import "server-only";
import { query, tryQuery } from "@/lib/db";
import { getGalleryItems } from "@/data/gallery";
import type {
  BranchSlug,
  GalleryCategory,
  GalleryItem,
  VideoSource,
} from "@/data/types";
import { youTubeThumbnail } from "@/lib/youtube";

/**
 * Gallery images — admin-uploaded photos per campus (gallery_images table),
 * merged ahead of the static placeholder gallery so pages fill up with real
 * photography as it is uploaded. Public reads never throw.
 */

export const GALLERY_CATEGORIES: GalleryCategory[] = [
  "Campus",
  "Classrooms",
  "Library",
  "Labs",
  "Sports",
  "Pre-Primary",
  "Transport",
  "Assembly",
  "Our Team",
  "Annual Day",
  "Trips",
];

export interface GalleryImageRow {
  id: number;
  branch_ref: string;
  category: GalleryCategory;
  caption: string;
  media_type: "image" | "video";
  /** Photograph, or a video's poster frame. NULL for a poster-less clip. */
  image_url: string | null;
  /** Videos only: an /uploads/… path, or a YouTube video id. */
  video_url: string | null;
  video_source: VideoSource | null;
  created_at: string;
}

const COLS =
  "id, branch_ref, category, caption, media_type, image_url, video_url, video_source, created_at";

function toGalleryItem(row: GalleryImageRow): GalleryItem {
  const isVideo = row.media_type === "video";
  return {
    id: `db-${row.id}`,
    caption: row.caption,
    category: row.category,
    branch: row.branch_ref,
    tone: "mist", // fallback tone if the file ever goes missing
    /*
     * A YouTube item stores only the video id, and its poster is derived
     * rather than uploaded — so the tile gets a picture without the school
     * having to find and crop one.
     */
    imageUrl:
      row.image_url ??
      (isVideo && row.video_source === "youtube" && row.video_url
        ? youTubeThumbnail(row.video_url)
        : undefined),
    ...(isVideo
      ? {
          mediaType: "video" as const,
          videoUrl: row.video_url ?? undefined,
          videoSource: row.video_source ?? undefined,
        }
      : {}),
  };
}

/**
 * Lay videos through the photographs instead of letting them clump.
 *
 * Rows come back newest-first, so uploading six clips in one sitting puts all
 * six at the top of the grid and the gallery reads as "videos, then photos"
 * rather than one gallery. This spreads them at an even stride through the
 * photographs so a video turns up every few tiles, which is what "mixed in"
 * actually looks like.
 *
 * Deliberately NOT a random shuffle. This runs on the server for a page that
 * also renders on the client, and an order that changes per request makes the
 * grid jump around between loads and breaks the lightbox's next/previous
 * index. The stride is derived from the two counts, so it is stable for a
 * given set and still re-spreads itself as more of either is uploaded.
 */
export function interleaveMedia(items: GalleryItem[]): GalleryItem[] {
  const videos = items.filter((i) => i.mediaType === "video");
  const photos = items.filter((i) => i.mediaType !== "video");
  if (videos.length === 0 || photos.length === 0) return items;

  /* One video every `stride` photographs, spread across the whole run. */
  const stride = Math.max(1, Math.round(photos.length / (videos.length + 1)));
  const out: GalleryItem[] = [];
  let v = 0;
  photos.forEach((photo, index) => {
    out.push(photo);
    if (v < videos.length && (index + 1) % stride === 0) out.push(videos[v++]);
  });
  /* Anything left over (more videos than gaps) goes on the end. */
  while (v < videos.length) out.push(videos[v++]);
  return out;
}

/** Uploaded photos (newest first), optionally scoped to one campus. */
export async function getUploadedGalleryItems(
  branch?: BranchSlug
): Promise<GalleryItem[]> {
  const rows = await tryQuery<GalleryImageRow>(
    branch
      ? `SELECT ${COLS} FROM gallery_images WHERE branch_ref = ? ORDER BY created_at DESC`
      : `SELECT ${COLS} FROM gallery_images ORDER BY created_at DESC`,
    branch ? [branch] : []
  );
  return rows.map(toGalleryItem);
}

/**
 * Uploaded photos first, then the static placeholder items — the shape every
 * public gallery surface (grid, teaser, lightbox) consumes.
 */
export async function getMergedGalleryItems(filter?: {
  branch?: BranchSlug;
  category?: GalleryCategory;
}): Promise<GalleryItem[]> {
  const uploaded = await getUploadedGalleryItems(filter?.branch);
  const filtered = filter?.category
    ? uploaded.filter((item) => item.category === filter.category)
    : uploaded;
  /* Videos are spread through the photographs rather than stacked in front of
     them — see interleaveMedia. */
  return interleaveMedia([...filtered, ...getGalleryItems(filter)]);
}

/** Admin list, scoped by a WHERE fragment from rbac.branchScopeFilter. */
export async function listGalleryImagesForAdmin(
  clause: string,
  params: string[]
): Promise<GalleryImageRow[]> {
  return query<GalleryImageRow>(
    `SELECT ${COLS} FROM gallery_images WHERE ${clause} ORDER BY created_at DESC`,
    params
  );
}

export function isGalleryCategory(value: string): value is GalleryCategory {
  return (GALLERY_CATEGORIES as string[]).includes(value);
}
