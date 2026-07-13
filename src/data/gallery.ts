import type { BranchSlug, GalleryCategory, GalleryItem } from "./types";

/** Gallery items (F5). `tone` varies the PlaceholderImage gradient. */
export const galleryItems: GalleryItem[] = [
  // ——— City Center Campus ———
  {
    id: "cc-sports-01",
    caption: "Senior football final on the main field",
    category: "Sports",
    branch: "city-center",
    tone: "forest",
  },
  {
    id: "cc-sports-02",
    caption: "Annual athletics meet — 100m sprint finish",
    category: "Sports",
    branch: "city-center",
    tone: "primary",
  },
  {
    id: "cc-annualday-01",
    caption: "Colours of India grand finale on stage",
    category: "Annual Day",
    branch: "city-center",
    tone: "dusk",
  },
  {
    id: "cc-annualday-02",
    caption: "Prize distribution with the chief guest",
    category: "Annual Day",
    branch: "city-center",
    tone: "accent",
  },
  {
    id: "cc-class-01",
    caption: "Robotics lab build challenge in progress",
    category: "Classrooms",
    branch: "city-center",
    tone: "mist",
  },
  {
    id: "cc-class-02",
    caption: "Chemistry practicals, Grade 11",
    category: "Classrooms",
    branch: "city-center",
    tone: "stone",
  },
  {
    id: "cc-trip-01",
    caption: "Heritage walk through Amber Fort",
    category: "Trips",
    branch: "city-center",
    tone: "accent",
  },
  {
    id: "cc-trip-02",
    caption: "Grade 12 astronomy night camp",
    category: "Trips",
    branch: "city-center",
    tone: "dusk",
  },

  // ——— Green Valley Campus ———
  {
    id: "gv-sports-01",
    caption: "Morning warm-up on the 400m track",
    category: "Sports",
    branch: "green-valley",
    tone: "primary",
  },
  {
    id: "gv-sports-02",
    caption: "Junior cricket coaching camp",
    category: "Sports",
    branch: "green-valley",
    tone: "forest",
  },
  {
    id: "gv-annualday-01",
    caption: "Folk dance ensemble at Annual Day",
    category: "Annual Day",
    branch: "green-valley",
    tone: "accent",
  },
  {
    id: "gv-annualday-02",
    caption: "The junior choir takes a bow",
    category: "Annual Day",
    branch: "green-valley",
    tone: "dusk",
  },
  {
    id: "gv-class-01",
    caption: "Harvest morning in the kitchen garden",
    category: "Classrooms",
    branch: "green-valley",
    tone: "forest",
  },
  {
    id: "gv-class-02",
    caption: "Science Discovery Lab — circuits week",
    category: "Classrooms",
    branch: "green-valley",
    tone: "mist",
  },
  {
    id: "gv-trip-01",
    caption: "Birdwatching trip to Keoladeo National Park",
    category: "Trips",
    branch: "green-valley",
    tone: "stone",
  },
  {
    id: "gv-trip-02",
    caption: "Village farm visit, Grade 3",
    category: "Trips",
    branch: "green-valley",
    tone: "accent",
  },

  // ——— Riverside Campus ———
  {
    id: "rs-sports-01",
    caption: "Learn-to-swim session at the junior pool",
    category: "Sports",
    branch: "riverside",
    tone: "primary",
  },
  {
    id: "rs-sports-02",
    caption: "Sports day sack race, Grade 2",
    category: "Sports",
    branch: "riverside",
    tone: "accent",
  },
  {
    id: "rs-annualday-01",
    caption: "Kindergarten rhythm and rhyme performance",
    category: "Annual Day",
    branch: "riverside",
    tone: "dusk",
  },
  {
    id: "rs-annualday-02",
    caption: "Backstage smiles before the curtain call",
    category: "Annual Day",
    branch: "riverside",
    tone: "stone",
  },
  {
    id: "rs-class-01",
    caption: "Story circle in the reading nook",
    category: "Classrooms",
    branch: "riverside",
    tone: "mist",
  },
  {
    id: "rs-class-02",
    caption: "Pottery studio — first wheels",
    category: "Classrooms",
    branch: "riverside",
    tone: "accent",
  },
  {
    id: "rs-trip-01",
    caption: "Sensory garden nature trail",
    category: "Trips",
    branch: "riverside",
    tone: "forest",
  },
  {
    id: "rs-trip-02",
    caption: "Fire station visit, Grade 1",
    category: "Trips",
    branch: "riverside",
    tone: "primary",
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
