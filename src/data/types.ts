/**
 * Shared domain types for the Newton Global School website.
 * All site content lives in src/data/ modules typed against this file.
 */

/**
 * A campus slug used in /branches/<slug> routes. The three built-ins live in
 * src/data/branches.ts; Super Admins can add more (stored in the DB), so this
 * is a widened string rather than a fixed union.
 */
export type BranchSlug = string;

/** The three built-in campus slugs (custom branches add to these at runtime). */
export type BuiltInBranchSlug = "city-center" | "green-valley" | "riverside";

/** Content scoping: a specific branch, or "all" for group-wide items. */
export type BranchRef = BranchSlug | "all";

export interface SocialLink {
  /** Platform name, also used to pick the icon. */
  name: "Facebook" | "Instagram" | "YouTube";
  href: string;
}

export interface SiteInfo {
  name: string;
  tagline: string;
  established: number;
  headOffice: {
    address: string;
    phone: string;
    email: string;
    officeHours: string;
  };
  socialLinks: SocialLink[];
  /** Academic year admissions are currently open for, e.g. "2026-27". */
  admissionYear: string;
}

export interface Principal {
  name: string;
  /** 3–4 sentence welcome message. */
  message: string;
  /** Admin-uploaded portrait (site-relative /uploads/… path); placeholder when absent. */
  photoUrl?: string | null;
}

export interface Branch {
  slug: BranchSlug;
  name: string;
  /** Short locality line, e.g. "MG Road, Jaipur". */
  area: string;
  address: string;
  phone: string;
  email: string;
  established: number;
  grades: string;
  principal: Principal;
  quickFacts: {
    students: number;
    campusSize: string;
  };
  facilities: string[];
  /** Key naming the hero placeholder image for this branch. */
  heroImage: string;
  /** Key used to select this branch's gallery items. */
  galleryCategoryKey: string;
  /** Hero gradient tone; set for custom branches (built-ins use a static map). */
  heroTone?: PlaceholderTone;
}

export interface Notice {
  id: string;
  title: string;
  excerpt: string;
  /** ISO date, e.g. "2026-07-10". */
  date: string;
  branch: BranchRef;
}

export type EventCategory =
  | "Sports"
  | "Academic"
  | "Cultural"
  | "Workshop"
  | "Community";

export interface SchoolEvent {
  id: string;
  title: string;
  /** ISO date, e.g. "2026-08-14". */
  date: string;
  branch: BranchRef;
  description: string;
  category: EventCategory;
}

export interface NewsPost {
  slug: string;
  title: string;
  /** ISO date, e.g. "2026-06-10". */
  date: string;
  branch: BranchRef;
  excerpt: string;
  /** Body copy as plain-text paragraphs. */
  body: string[];
}

export type GalleryCategory = "Sports" | "Annual Day" | "Classrooms" | "Trips";

/** Visual variant hint for PlaceholderImage gradients. */
export type PlaceholderTone =
  | "primary"
  | "accent"
  | "mist"
  | "forest"
  | "dusk"
  | "stone";

export interface GalleryItem {
  id: string;
  caption: string;
  category: GalleryCategory;
  branch: BranchSlug;
  tone: PlaceholderTone;
  /** Admin-uploaded photo (site-relative /uploads/… path); tone placeholder when absent. */
  imageUrl?: string;
}

export type Department =
  | "Pre-Primary"
  | "Primary"
  | "Mathematics"
  | "Science"
  | "Languages"
  | "Social Science"
  | "Computer Science"
  | "Sports"
  | "Arts"
  | "Administration";

export interface FacultyMember {
  name: string;
  designation: string;
  qualification: string;
  department: Department;
}

export interface BranchFaculty {
  principal: FacultyMember;
  staff: FacultyMember[];
}

export interface Testimonial {
  quote: string;
  name: string;
  /** e.g. "Parent, City Center Campus". */
  role: string;
}

export interface Faq {
  q: string;
  a: string;
}

export type JobType = "Full-time" | "Part-time";

export interface CareerPosition {
  id: string;
  title: string;
  branch: BranchSlug | "any";
  type: JobType;
  description: string;
  requirements: string[];
}
