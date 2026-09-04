import { nursery } from "./nursery";
import { primary } from "./primary";
import { secondary } from "./secondary";
import { seniorSecondary } from "./senior-secondary";

/**
 * The document has no Faculty tab. It does, however, describe how the school's
 * teachers work — once per class stage, in the "Teacher-Student Approach"
 * sections, plus a line in the home page's "Why Choose Us" list. This module
 * composes the faculty page from those existing verbatim blocks rather than
 * writing anything new about the staff, so every sentence on /faculty is still
 * the school's own wording.
 */

/** Home page §3, "Why Choose Us" — the document's own line about its teachers. */
export const facultyPromise =
  `**Experienced & Caring Faculty** - Teachers who know every child by name, not just roll number`;

/** About Us §7 — the document's list of what sets the school apart. */
export const facultyValue = `Dedicated and caring teaching staff`;

export interface FacultyStage {
  stage: string;
  href: string;
  h2: string;
  body: readonly string[];
}

/** One block per stage, straight from that stage's own tab. */
export const facultyStages: readonly FacultyStage[] = [
  {
    stage: "Nursery",
    href: "/nursery",
    h2: nursery.teaching.h2,
    body: nursery.teaching.body,
  },
  {
    stage: "Primary",
    href: "/primary",
    h2: primary.teaching.h2,
    body: primary.teaching.body,
  },
  {
    stage: "Secondary",
    href: "/secondary",
    h2: secondary.teaching.h2,
    body: secondary.teaching.body,
  },
  {
    stage: "Senior Secondary",
    href: "/senior-secondary",
    h2: seniorSecondary.teaching.h2,
    body: seniorSecondary.teaching.body,
  },
];

/**
 * The staff portraits the school supplied. They are shown without names or
 * designations on purpose: the school sent photographs only, and captioning a
 * real person with an invented name or subject would be worse than showing
 * none. Add names here when the school provides them.
 */
export const facultyPortraits = Array.from({ length: 13 }, (_, i) => ({
  src: `/images/school/gallery/staff-${String(i + 1).padStart(2, "0")}.webp`,
  alt: "A member of the Newton Global School team",
}));
