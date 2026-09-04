import type { BranchSlug, GalleryCategory, GalleryItem } from "./types";

/** Gallery items (F5). `tone` varies the PlaceholderImage gradient. */
/**
 * Every photograph the school has supplied, grouped by what it shows.
 * All of them are Newton Global School's own — see
 * public/images/school/CREDITS.md for how the set was filtered.
 */
/**
 * Every photograph the school has supplied, grouped by what it shows.
 * The school was formerly Tagore International School, so frames carrying
 * that name on a uniform crest are the same pupils on the same campus.
 */
/**
 * The gallery lives in the `gallery_images` table — see db/seed-gallery.mjs.
 * This list is the offline fallback only: when MySQL is unreachable the page
 * renders empty rather than showing a second, stale copy of the photographs.
 */
export const galleryItems: GalleryItem[] = [];

/**
 * Gallery items, optionally filtered by branch and/or category.
 * With no filter, returns every item.
 */
export function getGalleryItems(filter?: {
  branch?: BranchSlug;
  category?: GalleryCategory;
}): GalleryItem[] {
  return galleryItems.filter(
    (item) =>
      (!filter?.branch || item.branch === filter.branch) &&
      (!filter?.category || item.category === filter.category)
  );
}
