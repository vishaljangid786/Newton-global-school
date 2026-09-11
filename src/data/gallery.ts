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
 *
 * This list is the offline fallback. It used to be `[]`, on the reasoning that
 * an empty grid beats a stale duplicate of the photographs — but nothing
 * downstream checked for empty, so with MySQL unreachable the home page's
 * gallery band rendered its heading, its button, and roughly 500px of blank
 * white nothing between them. A handful of the school's own photographs, which
 * already ship in /public, is a far better floor than a hole in the page.
 *
 * Deliberately short: six is what the home mosaic lays out, so the fallback
 * fills that grid exactly and /gallery still has the full set from the table
 * the moment the database answers.
 */
export const galleryItems: GalleryItem[] = [
  {
    id: "fallback-01",
    caption: "The campus block seen from the main drive",
    category: "Campus",
    branch: "city-center",
    imageUrl: "/images/school/gallery/campus-exterior-01.webp",
    tone: "primary",
  },
  {
    id: "fallback-02",
    caption: "A lesson under way in a junior classroom",
    category: "Classrooms",
    branch: "city-center",
    imageUrl: "/images/school/gallery/classroom-01.webp",
    tone: "accent",
  },
  {
    id: "fallback-03",
    caption: "Pupils reading together in the library",
    category: "Library",
    branch: "city-center",
    imageUrl: "/images/school/gallery/library-students-01.webp",
    tone: "mist",
  },
  {
    id: "fallback-04",
    caption: "Hands-on work at the science lab bench",
    category: "Labs",
    branch: "city-center",
    imageUrl: "/images/school/gallery/science-lab-experiment.webp",
    tone: "forest",
  },
  {
    id: "fallback-05",
    caption: "The playground at break",
    category: "Sports",
    branch: "city-center",
    imageUrl: "/images/school/gallery/playground-01.webp",
    tone: "primary",
  },
  {
    id: "fallback-06",
    caption: "Pupils at work in the computer lab",
    category: "Labs",
    branch: "city-center",
    imageUrl: "/images/school/gallery/computer-lab-students-01.webp",
    tone: "accent",
  },
];

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
