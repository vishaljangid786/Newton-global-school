import {
  PageHero as SchoolHero,
  type Img,
} from "@/components/site/school-kit";
import type { Crumb } from "./Breadcrumbs";

interface PageHeroProps {
  /** Page h1 — exactly one PageHero per inner page. */
  title: string;
  subtitle?: string;
  /** Optional eyebrow above the title, e.g. "Admissions Open 2026-27". */
  badge?: string;
  /** Breadcrumb trail after Home; omit to hide breadcrumbs. */
  breadcrumbs?: Crumb[];
  /** Override the masthead photo; defaults to a classroom shot. */
  image?: Img;
}

/**
 * Inner-page masthead. This used to render its own gradient panel, which left
 * the older routes (news, gallery, contact, branches, careers, blog and the
 * per-branch pages) looking nothing like the pages rebuilt from the school's
 * document. It now delegates to the shared school hero, so all of them pick up
 * the same navy-over-photo treatment, gold rule and type scale.
 */
const DEFAULT_HERO: Img = {
  src: "/images/school/campus-front.webp",

  w: 1600,

  h: 900,

  alt: "The Newton Global School building seen from the driveway",
};

export default function PageHero({
  title,
  subtitle,
  badge,
  breadcrumbs,
  image = DEFAULT_HERO,
}: PageHeroProps) {
  return (
    <SchoolHero
      image={image}
      priority
      crumbs={breadcrumbs}
      h1={title}
      sub={badge}
      body={subtitle}
    />
  );
}
