import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ButtonLink from "@/components/ui/Button";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Card from "@/components/ui/Card";
import CTABand from "@/components/ui/CTABand";
import FactTile from "@/components/ui/FactTile";
import MapEmbed from "@/components/ui/MapEmbed";
import NoticeRow from "@/components/ui/NoticeRow";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { getBranchBySlugAsync } from "@/lib/branches-store";
import { getBranchContent } from "@/lib/branch-content";
import { getGalleryItems } from "@/data/gallery";
import { getNoticesForBranch } from "@/data/notices";
import { site } from "@/data/site";
import { initials } from "@/lib/format";
import type {
  Branch,
  BranchSlug,
  GalleryCategory,
  PlaceholderTone,
} from "@/data/types";

// Branch home renders admin-editable content merged over the static defaults,
// so it's dynamic (falls back to static data when MySQL is offline).
export const dynamic = "force-dynamic";

interface BranchPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BranchPageProps): Promise<Metadata> {
  const { slug } = await params;
  const branch = await getBranchBySlugAsync(slug);
  if (!branch) return { title: "Campus Not Found" };
  return {
    // §9 branch pattern via root template → "City Center Campus | Newton Global School"
    title: branch.name,
    description: `${branch.name} of ${site.name} in ${branch.area} — ${branch.grades}, facilities, notices, gallery and contact details.`,
  };
}

/* ------------------------------------------------------------- visuals */

/** Hero gradient tone per campus so the three branch heroes look distinct. */
const HERO_TONES: Record<BranchSlug, PlaceholderTone> = {
  "city-center": "primary",
  "green-valley": "forest",
  riverside: "dusk",
};

const iconProps = {
  className: "h-6 w-6",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
  focusable: false,
} as const;

const gradesIcon = (
  <svg {...iconProps}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5v13z" />
    <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />
  </svg>
);

const studentsIcon = (
  <svg {...iconProps}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
    <path d="M16 5.5a3.5 3.5 0 0 1 0 7M17.5 14.5a6.5 6.5 0 0 1 4 5.5" />
  </svg>
);

const establishedIcon = (
  <svg {...iconProps}>
    <path d="M5 21V4" />
    <path d="M5 4h12l-2.5 4L17 12H5" />
    <path d="M3 21h6" />
  </svg>
);

const campusIcon = (
  <svg {...iconProps}>
    <path d="M3 21h18M5 21V8l7-5 7 5v13" />
    <path d="M9 21v-6h6v6M10 10h4" />
  </svg>
);

/* ---------------------------------------------------- highlight content */

interface Highlight {
  title: string;
  description: string;
  items: string[];
  icon: ReactNode;
}

/** §5.1.4 — three highlight cards, bullet points pulled from branch data. */
function buildHighlights(branch: Branch): Highlight[] {
  return [
    {
      title: "Learning & Labs",
      description:
        "Bright, well-equipped spaces where lessons turn hands-on every single day.",
      items: branch.facilities.slice(0, 3),
      icon: (
        <svg {...iconProps}>
          <path d="M9 3v6.5L4 18a2.4 2.4 0 0 0 2.2 3.5h11.6A2.4 2.4 0 0 0 20 18l-5-8.5V3" />
          <path d="M7.5 3h9M7 15h10" />
        </svg>
      ),
    },
    {
      title: "Sports, Arts & Play",
      description:
        "Fields, stages and studios that give every child a place to shine beyond the classroom.",
      items: branch.facilities.slice(3, 6),
      icon: (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18M3.5 9h17M3.5 15h17" />
        </svg>
      ),
    },
    {
      title: "Safety & Care",
      description:
        "Every campus decision starts with one question — is it safe and kind for children?",
      items: branch.facilities.filter((facility) =>
        /cctv|transport|medical/i.test(facility)
      ),
      icon: (
        <svg {...iconProps}>
          <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" />
          <path d="M9 12l2 2 4-4.5" />
        </svg>
      ),
    },
  ];
}

/* ------------------------------------------------------------------ page */

export default async function BranchHomePage({ params }: BranchPageProps) {
  const { slug } = await params;
  const branch = await getBranchContent(slug);
  if (!branch) notFound();

  const heroTone = branch.heroTone ?? HERO_TONES[branch.slug] ?? "primary";
  const latestNotices = getNoticesForBranch(branch.slug).slice(0, 3);
  const highlights = buildHighlights(branch);

  // §5.1.6 — one image per gallery category for a varied 4-up strip.
  const galleryCategories: GalleryCategory[] = [
    "Sports",
    "Annual Day",
    "Classrooms",
    "Trips",
  ];
  const galleryPicks = galleryCategories
    .map(
      (category) => getGalleryItems({ branch: branch.slug, category })[0]
    )
    .filter((item) => item !== undefined);

  // §9 — schema.org/School JSON-LD (no geo coordinates in the data model).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "School",
    name: `${site.name}, ${branch.name}`,
    url: `https://sunrise-school.example/branches/${branch.slug}`,
    telephone: branch.phone,
    email: branch.email,
    foundingDate: String(branch.established),
    address: {
      "@type": "PostalAddress",
      streetAddress: branch.address,
      addressCountry: "IN",
    },
    parentOrganization: {
      "@type": "Organization",
      name: site.name,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* 1. Hero — §5.1.1 */}
      <section className="relative overflow-hidden text-white">
        <PlaceholderImage fill tone={heroTone} />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 via-primary-dark/70 to-primary/40"
        />
        <div className="relative mx-auto max-w-content px-4 py-16 md:py-24">
          <Breadcrumbs
            tone="light"
            items={[
              { label: "Branches", href: "/branches" },
              { label: branch.name },
            ]}
          />
          <h1 className="mt-5 max-w-3xl text-[1.75rem] leading-tight md:text-[2.5rem]">
            {site.name}, {branch.name}
          </h1>
          <p className="mt-3 max-w-2xl text-base text-white/85 md:text-lg">
            {branch.area} · {branch.grades}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <ButtonLink
              href={`/branches/${branch.slug}/admissions`}
              variant="accent"
            >
              Admissions
            </ButtonLink>
            <Link
              href={`/branches/${branch.slug}/contact`}
              className="inline-flex items-center justify-center gap-2 rounded-card border border-white/70 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Quick facts — §5.1.2 */}
      <section className="bg-bg py-10 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <h2 className="sr-only">Quick facts about {branch.name}</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <FactTile
              icon={gradesIcon}
              value={branch.grades}
              label="Grades offered"
            />
            <FactTile
              icon={studentsIcon}
              value={branch.quickFacts.students.toLocaleString("en-IN")}
              label="Students"
            />
            <FactTile
              icon={establishedIcon}
              value={branch.established}
              label="Established"
            />
            <FactTile
              icon={campusIcon}
              value={branch.quickFacts.campusSize}
              label="Campus size"
            />
          </div>
        </div>
      </section>

      {/* 3. Principal's message — §5.1.3 */}
      <section className="bg-bg-alt py-10 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <div className="grid items-start gap-8 md:grid-cols-[2fr_5fr] md:gap-12">
            <div className="mx-auto w-full max-w-64 md:max-w-none">
              <PlaceholderImage
                aspect="1/1"
                tone="mist"
                label={initials(branch.principal.name)}
                className="rounded-card shadow-card"
              />
            </div>
            <div>
              <SectionHeading
                align="left"
                overline={"Principal's Message"}
                title={"From the Principal's Desk"}
              />
              <blockquote className="mt-5 border-l-4 border-accent pl-4 text-base leading-relaxed text-text md:pl-5">
                {branch.principal.message}
              </blockquote>
              <p className="mt-5 font-heading text-base font-semibold text-text">
                {branch.principal.name}
              </p>
              <p className="text-sm text-text-muted">
                Principal, {branch.name}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Highlights — §5.1.4 */}
      <section className="bg-bg py-10 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <SectionHeading
            overline="Campus Highlights"
            title={`Why Families Choose ${branch.name}`}
            subtitle="A quick look at what everyday school life offers here."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {highlights.map((highlight, index) => (
              <Reveal key={highlight.title} delay={index * 100}>
                <Card hoverLift className="flex h-full flex-col p-6">
                  <span
                    aria-hidden="true"
                    className="inline-flex h-12 w-12 items-center justify-center rounded-card bg-primary/10 text-primary"
                  >
                    {highlight.icon}
                  </span>
                  <h3 className="mt-4 text-lg text-text">{highlight.title}</h3>
                  <p className="mt-2 text-sm text-text-muted">
                    {highlight.description}
                  </p>
                  <ul className="mt-4 space-y-2 border-t border-border/60 pt-4 text-sm text-text">
                    {highlight.items.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-pill bg-accent"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Latest branch notices — §5.1.5 */}
      <section className="bg-bg-alt py-10 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              align="left"
              overline="Notice Board"
              title="Latest Notices"
            />
            <ButtonLink
              href={`/branches/${branch.slug}/notices`}
              variant="outline"
              size="sm"
            >
              All Notices <span aria-hidden="true">→</span>
            </ButtonLink>
          </div>
          <Card className="mt-8 px-6">
            {latestNotices.length > 0 ? (
              latestNotices.map((notice) => (
                <NoticeRow
                  key={notice.id}
                  notice={notice}
                  showBranch
                  className="last:border-b-0"
                />
              ))
            ) : (
              <p className="py-6 text-sm text-text-muted">
                No notices yet — please check back soon.
              </p>
            )}
          </Card>
        </div>
      </section>

      {/* 6. Mini gallery — §5.1.6 */}
      <section className="bg-bg py-10 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <SectionHeading
            overline="Campus Life"
            title="A Glimpse of Our Days"
            subtitle="Four moments from around the campus — there are many more in the gallery."
          />
          <Reveal>
            <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {galleryPicks.map((item) => (
                <figure key={item.id}>
                  <PlaceholderImage
                    aspect="4/3"
                    tone={item.tone}
                    label={item.category}
                    className="rounded-card shadow-card"
                  />
                  <figcaption className="mt-2 text-sm text-text-muted">
                    {item.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </Reveal>
          <div className="mt-8 text-center">
            <ButtonLink
              href={`/branches/${branch.slug}/gallery`}
              variant="outline"
            >
              View Branch Gallery
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* 7. Map + address strip — §5.1.7 */}
      <section className="bg-bg-alt py-10 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <SectionHeading
            align="left"
            overline="Find Us"
            title="Visit Our Campus"
          />
          <div className="mt-8 grid items-start gap-6 lg:grid-cols-[7fr_5fr]">
            <MapEmbed address={branch.address} name={branch.name} />
            <Card className="p-6">
              <h3 className="text-lg text-text">Address &amp; Contact</h3>
              <dl className="mt-4 space-y-4 text-sm">
                <div>
                  <dt className="font-medium text-text">Address</dt>
                  <dd className="mt-1 text-text-muted">{branch.address}</dd>
                </div>
                <div>
                  <dt className="font-medium text-text">Phone</dt>
                  <dd className="mt-1">
                    <a
                      href={`tel:${branch.phone}`}
                      className="text-primary underline-offset-2 hover:underline"
                    >
                      {branch.phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-text">Email</dt>
                  <dd className="mt-1">
                    <a
                      href={`mailto:${branch.email}`}
                      className="text-primary underline-offset-2 hover:underline"
                    >
                      {branch.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-text">Office hours</dt>
                  <dd className="mt-1 text-text-muted">
                    {site.headOffice.officeHours}
                  </dd>
                </div>
              </dl>
              <ButtonLink
                href={`/branches/${branch.slug}/contact`}
                variant="primary"
                size="sm"
                className="mt-6"
              >
                Contact This Campus
              </ButtonLink>
            </Card>
          </div>
        </div>
      </section>

      {/* 7b. CTA band — §5.1.7 */}
      <CTABand
        title={`Admissions Open for ${site.admissionYear}`}
        subtitle={`Seats at ${branch.name} fill quickly — begin your child's Newton journey today.`}
        ctaHref={`/branches/${branch.slug}/admissions`}
      />
    </>
  );
}
