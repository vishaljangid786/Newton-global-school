import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import BranchCard from "@/components/ui/BranchCard";
import ButtonLink from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import CTABand from "@/components/ui/CTABand";
import NewsCard from "@/components/ui/NewsCard";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import StatsBand, { type Stat } from "@/components/ui/StatsBand";
import TestimonialCarousel from "@/components/ui/TestimonialCarousel";
import { branches } from "@/data/branches";
import { getFacultyForBranch } from "@/data/faculty";
import { getGalleryItems } from "@/data/gallery";
import { getAllNews } from "@/data/news";
import { site } from "@/data/site";
import { testimonials } from "@/data/testimonials";
import type { PlaceholderTone } from "@/data/types";

export const metadata: Metadata = {
  description: `One school family, three campuses across Jaipur. Explore our campuses, news and galleries, and start an admission inquiry for ${site.admissionYear}.`,
};

/* ——— Data derived once at build time ——— */

const yearsOfExcellence = new Date().getFullYear() - site.established;

const totalStudents = branches.reduce(
  (sum, branch) => sum + branch.quickFacts.students,
  0
);

const totalFaculty = branches.reduce(
  (sum, branch) => sum + 1 + getFacultyForBranch(branch.slug).staff.length,
  0
);

const stats: Stat[] = [
  { value: `${yearsOfExcellence}+`, label: "Years of Excellence" },
  { value: `${branches.length}`, label: "Campuses in Jaipur" },
  { value: `${totalStudents.toLocaleString("en-IN")}+`, label: "Students" },
  { value: `${totalFaculty}+`, label: "Faculty Members" },
];

const latestNews = getAllNews().slice(0, 3);

const homeTestimonials = testimonials.slice(0, 3);

/** 2 gallery items per branch, offset so tones and categories stay varied. */
const galleryTeaser = branches.flatMap((branch, index) =>
  getGalleryItems({ branch: branch.slug }).slice(index * 2, index * 2 + 2)
);

const BRANCH_TONES: PlaceholderTone[] = ["primary", "forest", "dusk"];
const NEWS_TONES: PlaceholderTone[] = ["primary", "forest", "dusk"];

/* ——— §4.1.3 Why choose us — icon cards with inline SVG icons ——— */

interface WhyCard {
  title: string;
  description: string;
  icon: ReactNode;
}

const ICON_PROPS = {
  viewBox: "0 0 24 24",
  className: "h-6 w-6",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
} as const;

const whyChooseUs: WhyCard[] = [
  {
    title: "Experienced Faculty",
    description:
      "Qualified, long-serving teachers who know every child by name, backed by regular training and mentorship programmes.",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M12 4.5 2.5 9l9.5 4.5L21.5 9 12 4.5Z" />
        <path d="M6.5 11.4v3.9c0 1.3 2.5 2.7 5.5 2.7s5.5-1.4 5.5-2.7v-3.9" />
        <path d="M21.5 9v5" />
      </svg>
    ),
  },
  {
    title: "Safe Campus",
    description:
      "CCTV-monitored campuses, GPS-tracked transport and a staffed medical room at every branch, so parents can relax.",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M12 3.5 5 6.1v5c0 4.2 2.9 7.4 7 8.9 4.1-1.5 7-4.7 7-8.9v-5L12 3.5Z" />
        <path d="m9 11.6 2.2 2.2 3.8-4" />
      </svg>
    ),
  },
  {
    title: "Modern Labs",
    description:
      "Science, computer and robotics labs plus smart classrooms turn every lesson into something children can touch and build.",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M9.5 3.5h5" />
        <path d="M10.5 3.5v5.1L5.9 16.5a2.6 2.6 0 0 0 2.3 3.9h7.6a2.6 2.6 0 0 0 2.3-3.9L13.5 8.6V3.5" />
        <path d="M7.5 14.5h9" />
      </svg>
    ),
  },
  {
    title: "Sports & Arts",
    description:
      "Fields, tracks, pools, music rooms and art studios give every child a stage — and the timetable makes room for all of it.",
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M8 4.5h8v4.8a4 4 0 0 1-8 0V4.5Z" />
        <path d="M8 6H4.5v1.2A3.3 3.3 0 0 0 8 10.4" />
        <path d="M16 6h3.5v1.2a3.3 3.3 0 0 1-3.5 3.2" />
        <path d="M12 13.3v3.2" />
        <path d="M9 20.5h6" />
        <path d="m9.8 20.5.7-4h3l.7 4" />
      </svg>
    ),
  },
];

export default function HomePage() {
  return (
    <>
      {/* ——— §4.1.1 Hero ——— */}
      <section className="relative isolate overflow-hidden bg-primary-dark text-white">
        <PlaceholderImage fill tone="dusk" />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(100deg, var(--color-primary-dark) 8%, color-mix(in srgb, var(--color-primary-dark) 80%, transparent) 52%, color-mix(in srgb, var(--color-primary) 30%, transparent) 100%)",
          }}
        />
        <div className="relative mx-auto flex w-full max-w-content flex-col items-start px-4 py-20 md:py-28 lg:py-32">
          <p className="eyebrow flex items-center gap-2.5 text-accent">
            <span aria-hidden="true" className="h-px w-8 bg-accent" />
            Welcome to {site.name}
          </p>
          <h1 className="mt-6 max-w-4xl text-[2.5rem] leading-[1.03] md:text-[4rem]">
            {site.tagline}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85">
            Three campuses across Jaipur, one promise — a safe, joyful school
            where every child is known, challenged and celebrated.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <ButtonLink href="/branches">Explore Branches</ButtonLink>
            <ButtonLink href="/admissions" variant="accent">
              Apply for Admission
            </ButtonLink>
          </div>
          {/* Editorial mono meta row */}
          <dl className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/15 pt-6 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-white/70">
            <div>
              <dt className="sr-only">Established</dt>
              <dd>
                <span className="text-accent">Est.</span> {site.established}
              </dd>
            </div>
            <div>
              <dt className="sr-only">Campuses</dt>
              <dd>{branches.length} Campuses</dd>
            </div>
            <div>
              <dt className="sr-only">Location</dt>
              <dd>Jaipur, Rajasthan</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ——— §4.1.2 Branch selector strip (F1 entry point) ——— */}
      <section className="bg-bg py-10 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <Reveal>
            <SectionHeading
              overline="Our Campuses"
              title="Find your nearest campus"
              subtitle="Every campus shares the Newton curriculum and values — pick the one closest to home."
            />
          </Reveal>
          <Reveal delay={100}>
            <ul className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">
              {branches.map((branch, index) => (
                <li
                  key={branch.slug}
                  className="w-[85%] flex-none snap-start sm:w-[60%] md:w-[45%] lg:w-auto"
                >
                  <BranchCard
                    branch={branch}
                    tone={BRANCH_TONES[index % BRANCH_TONES.length]}
                  />
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ——— §4.1.3 Why choose us ——— */}
      <section className="bg-bg-alt py-10 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <Reveal>
            <SectionHeading
              overline="Why Newton"
              title="Why families choose us"
              subtitle="Four things you will notice on your very first campus visit."
            />
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map((item, index) => (
              <Reveal key={item.title} delay={index * 100} className="h-full">
                <Card className="h-full p-6">
                  <span
                    aria-hidden="true"
                    className="flex h-12 w-12 items-center justify-center rounded-pill bg-primary/10 text-primary"
                  >
                    {item.icon}
                  </span>
                  <h3 className="mt-4 font-heading text-lg font-semibold text-text">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-text-muted">
                    {item.description}
                  </p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ——— §4.1.4 About preview ——— */}
      <section className="bg-bg py-10 md:py-16">
        <div className="mx-auto grid max-w-content items-center gap-10 px-4 md:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="overflow-hidden rounded-card shadow-card">
              <PlaceholderImage
                aspect="4/3"
                tone="mist"
                label={`Campus life since ${site.established}`}
              />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <SectionHeading
              align="left"
              overline="About Us"
              title={`One school family since ${site.established}`}
            />
            <p className="mt-5 text-base text-text">
              Newton Global School opened its gates in{" "}
              {site.established} with a handful of classrooms and a simple
              belief — that a great school should feel like a family. That
              belief now guides {branches.length} campuses across Jaipur, each
              rooted in its own neighbourhood yet part of one close-knit group.
            </p>
            <p className="mt-4 text-base text-text">
              Every campus follows the same curriculum, the same values and the
              same goal: confident, kind learners. Small classes, well-equipped
              labs and a full calendar of sport, art and community work keep
              childhood here busy in the best possible way.
            </p>
            <Link
              href="/about"
              className="mt-6 inline-block text-sm font-semibold text-primary hover:underline"
            >
              Read more about our story
              <span aria-hidden="true"> →</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ——— §4.1.5 Stats band ——— */}
      <section aria-label="Newton Global School at a glance">
        <StatsBand stats={stats} />
      </section>

      {/* ——— §4.1.6 Latest news & events ——— */}
      <section className="bg-bg-alt py-10 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <Reveal>
            <SectionHeading
              overline="Latest Updates"
              title="News from our campuses"
              subtitle="A snapshot of what our students and teachers have been up to."
            />
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestNews.map((post, index) => (
              <Reveal key={post.slug} delay={index * 100} className="h-full">
                <NewsCard
                  post={post}
                  tone={NEWS_TONES[index % NEWS_TONES.length]}
                  className="h-full"
                />
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <ButtonLink href="/news" variant="outline">
              View all news &amp; events
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ——— §4.1.7 Testimonials ——— */}
      <section className="bg-bg py-10 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <Reveal>
            <SectionHeading
              overline="Testimonials"
              title="What parents say about Newton"
            />
            <TestimonialCarousel items={homeTestimonials} className="mt-10" />
          </Reveal>
        </div>
      </section>

      {/* ——— §4.1.8 Gallery teaser ——— */}
      <section className="bg-bg-alt py-10 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <Reveal>
            <SectionHeading
              overline="Gallery"
              title="Moments from around our campuses"
              subtitle="Sports days, stage lights, lab benches and everything in between."
            />
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {galleryTeaser.map((item, index) => (
              <Reveal key={item.id} delay={index * 80}>
                <div className="overflow-hidden rounded-card shadow-card">
                  <PlaceholderImage
                    aspect="4/3"
                    tone={item.tone}
                    label={item.caption}
                  />
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <ButtonLink href="/gallery">View Full Gallery</ButtonLink>
          </div>
        </div>
      </section>

      {/* ——— §4.1.9 CTA band ——— */}
      <section aria-label="Admissions call to action">
        <CTABand
          title={`Admissions open for ${site.admissionYear}`}
          subtitle="Seats in Nursery, KG and Grade 1 fill quickly. Begin with a simple online inquiry and our admissions team will guide you the rest of the way."
        />
      </section>
    </>
  );
}
