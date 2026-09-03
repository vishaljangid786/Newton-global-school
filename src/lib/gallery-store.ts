import "server-only";
import { query, tryQuery } from "@/lib/db";
import { getGalleryItems } from "@/data/gallery";
import type { BranchSlug, GalleryCategory, GalleryItem } from "@/data/types";

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
  image_url: string;
  created_at: string;
}

const COLS = "id, branch_ref, category, caption, image_url, created_at";

function toGalleryItem(row: GalleryImageRow): GalleryItem {
  return {
    id: `db-${row.id}`,
    caption: row.caption,
    category: row.category,
    branch: row.branch_ref,
    tone: "mist", // fallback tone if the file ever goes missing
    imageUrl: row.image_url,
  };
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
  return [...filtered, ...getGalleryItems(filter)];
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
