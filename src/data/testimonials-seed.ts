import type { TestimonialRole } from "@/lib/testimonials-store";

/**
 * Fallback voices, used only while the `testimonials` table has nothing
 * published for a surface — or when MySQL is unreachable. These two are the
 * document's own quotes from the Home Page tab, so an empty database still
 * leaves the section reading exactly as the school wrote it.
 *
 * Anything added through Admin → Testimonials is shown ahead of these, and
 * once real testimonials exist the seed drops out entirely. Mirrors the same
 * arrangement as src/data/gallery-seed.ts.
 */
export interface SeedTestimonial {
  id: string;
  quote: string;
  authorName: string;
  role: TestimonialRole;
  roleDetail: string;
}

export const testimonialSeed: readonly SeedTestimonial[] = [
  {
    id: "seed-kotputli-parent",
    quote:
      "Newton Global School has been a wonderful choice for my daughter. As a leading English medium school in Kotputli, the teachers are supportive and the environment feels like a second home.",
    authorName: "A Parent",
    role: "parent",
    roleDetail: "Kotputli",
  },
  {
    id: "seed-sangteda-parent",
    quote:
      "We chose this RBSE School in Kotputli because of its discipline and caring teachers. Our son has grown so much in confidence.",
    authorName: "A Parent",
    role: "parent",
    roleDetail: "Sangteda",
  },
];
