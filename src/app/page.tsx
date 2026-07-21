import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ButtonLink from "@/components/ui/Button";
import BranchCard from "@/components/ui/BranchCard";
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
  (sum, branch) =>
    sum + 1 + (getFacultyForBranch(branch.slug)?.staff.length ?? 0),
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

/** Mosaic placement per teaser slot — two tall corners, one wide base tile. */
const GALLERY_SPANS = [
  "md:col-start-1 md:row-start-1 md:row-span-2",
  "md:col-start-2 md:row-start-1",
  "md:col-start-3 md:row-start-1 md:row-span-2",
  "md:col-start-2 md:row-start-2",
  "md:col-span-2 md:col-start-1 md:row-start-3",
  "md:col-start-3 md:row-start-3",
];

const BRANCH_TONES: PlaceholderTone[] = ["primary", "forest", "dusk"];
const NEWS_TONES: PlaceholderTone[] = ["primary", "forest", "dusk"];

/* ——— §4.1.3 Why choose us — numbered editorial columns ——— */

const whyChooseUs = [
  {
    title: "Experienced Faculty",
    description:
      "Qualified, long-serving teachers who know every child by name, backed by regular training and mentorship programmes.",
  },
  {
    title: "Safe Campus",
    description:
      "CCTV-monitored campuses, GPS-tracked transport and a staffed medical room at every branch, so parents can relax.",
  },
  {
    title: "Modern Labs",
    description:
      "Science, computer and robotics labs plus smart classrooms turn every lesson into something children can touch and build.",
  },
  {
    title: "Sports & Arts",
    description:
      "Fields, tracks, pools, music rooms and art studios give every child a stage — and the timetable makes room for all of it.",
  },
];

/** Split section header: dash-eyebrow heading left, lede right (mockup). */
function SplitHeader({
  overline,
  title,
  lede,
}: {
  overline: string;
  title: string;
  lede: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
      <SectionHeading overline={overline} title={title} />
      <p className="max-w-xs text-[0.96875rem] leading-relaxed text-text-muted">
        {lede}
      </p>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* ——— §4.1.1 Hero — framed full-bleed image with overlay + fact strip ——— */}
      <section className="border-b border-[#e6ebf2] bg-bg-alt">
        <div className="mx-auto max-w-content px-4 pb-11 pt-8 md:pt-10">
          <div className="relative overflow-hidden rounded-lg border border-[#e1e7f0] shadow-frame">
            <div className="relative">
              <PlaceholderImage fill tone="dusk" />
              {/* Left-to-right dark wash so the copy stays readable */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(16,24,44,0.84),rgba(16,24,44,0.5)_56%,rgba(16,24,44,0.12))]"
              />
              {/* Student cutout anchored to the right edge of the hero frame */}
              <Image
                src="/images/hero-student.webp"
                alt="Smiling Newton Global School student holding her books"
                width={1110}
                height={1124}
                priority
                className="pointer-events-none absolute bottom-0 right-6 hidden h-[94%] w-auto object-contain object-bottom drop-shadow-[0_18px_36px_rgba(10,16,32,0.45)] lg:block xl:right-14"
              />
              <div className="relative flex min-h-[26rem] max-w-2xl flex-col justify-center px-6 py-10 md:min-h-[29.25rem] md:px-14">
                <p className="eyebrow flex items-center gap-2.5 text-[#a9c0f5]">
                  <span
                    aria-hidden="true"
                    className="h-3.5 w-3.5 rounded-[4px] bg-[#6e8ef2]"
                  />
                  {site.name} · Est. {site.established}
                </p>
                <h1 className="mt-4 text-[2.375rem] leading-[1.07] text-white md:text-[3.25rem]">
                  {site.tagline}
                </h1>
                <p className="mt-4 max-w-md text-base leading-relaxed text-[#d5dcea] md:text-[1.0625rem]">
                  Three campuses across Jaipur, one promise — a safe, joyful
                  school where every child is known, challenged and celebrated.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <ButtonLink href="/branches">Explore Branches</ButtonLink>
                  <Link
                    href="/admissions"
                    className="inline-flex items-center justify-center gap-2 rounded-btn border border-white/40 bg-white/10 px-6 py-3 text-[0.9375rem] font-semibold text-white transition duration-200 hover:bg-white/20"
                  >
                    Apply for Admission
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ——— §4.1.2 Branch selector strip (F1 entry point) ——— */}
      <section className="py-12 md:py-14">
        <div className="mx-auto max-w-content px-4">
          <Reveal>
            <SplitHeader
              overline="Our Campuses"
              title="Find your nearest campus"
              lede="Every campus shares the Newton curriculum and values — pick the one closest to home."
            />
          </Reveal>
          <Reveal delay={100}>
            <ul className="relative mt-9 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">
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

      {/* ——— §4.1.3 Why choose us — numbered editorial columns ——— */}
      <section className="border-t border-hairline py-12 md:py-14">
        <div className="mx-auto max-w-content px-4">
          <Reveal>
            <SectionHeading
              align="center"
              overline="Why Newton"
              title="Why families choose us"
              subtitle="Four things you will notice on your very first campus visit."
            />
          </Reveal>
          <div className="mt-11 grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map((item, index) => (
              <Reveal key={item.title} delay={index * 100} className="h-full">
                <div className="h-full border-t-2 border-[#e1e7f2] pt-4">
                  <p
                    aria-hidden="true"
                    className="font-heading text-[0.9375rem] font-semibold text-accent"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 font-heading text-lg font-semibold text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-text-muted">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ——— §4.1.4 About preview ——— */}
      <section className="border-t border-hairline py-12 md:py-14">
        <div className="mx-auto grid max-w-content items-center gap-10 px-4 md:grid-cols-2 lg:gap-14">
          <Reveal>
            <div className="relative">
              <div className="overflow-hidden rounded-lg shadow-frame">
                <PlaceholderImage aspect="4/3" tone="mist" />
              </div>
              <span className="absolute bottom-4 left-4 rounded-btn border border-hairline bg-surface px-3.5 py-2 text-xs font-medium text-text">
                Campus life since {site.established}
              </span>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <SectionHeading
              align="left"
              overline="Our Story"
              title={`One school family since ${site.established}`}
            />
            <p className="mt-5 text-base leading-[1.7] text-[#4a5563]">
              Newton Global School opened its gates in {site.established} with
              a handful of classrooms and a simple belief — that a great school
              should feel like a family. That belief now guides{" "}
              {branches.length} campuses across Jaipur, each rooted in its own
              neighbourhood yet part of one close-knit group.
            </p>
            <p className="mt-3.5 text-base leading-[1.7] text-[#4a5563]">
              Every campus follows the same curriculum, the same values and the
              same goal: confident, kind learners. Small classes, well-equipped
              labs and a full calendar of sport, art and community work keep
              childhood here busy in the best possible way.
            </p>
            <Link
              href="/about"
              className="mt-6 inline-block text-[0.9375rem] font-semibold text-primary hover:text-primary-dark"
            >
              Read more about our story
              <span aria-hidden="true"> →</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ——— §4.1.5 Stats band ——— */}
      <section
        aria-label="Newton Global School at a glance"
        className="border-t border-hairline"
      >
        <StatsBand stats={stats} />
      </section>

      {/* ——— §4.1.6 Latest news & events ——— */}
      <section className="border-t border-hairline py-12 md:py-14">
        <div className="mx-auto max-w-content px-4">
          <Reveal>
            <SplitHeader
              overline="Newsroom"
              title="News from our campuses"
              lede="A snapshot of what our students and teachers have been up to."
            />
          </Reveal>
          <div className="mt-9 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
          <div className="mt-9 text-center">
            <ButtonLink href="/news" variant="outline">
              View all news &amp; events
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ——— §4.1.7 Testimonials — large centered quote ——— */}
      <section className="border-t border-hairline py-14 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <h2 className="sr-only">What parents say about Newton</h2>
          <Reveal>
            <TestimonialCarousel items={homeTestimonials} />
          </Reveal>
        </div>
      </section>

      {/* ——— §4.1.8 Gallery teaser — mosaic with overlay captions ——— */}
      <section className="border-t border-hairline py-12 md:py-14">
        <div className="mx-auto max-w-content px-4">
          <Reveal>
            <SectionHeading
              overline="Gallery"
              title="Moments from around our campuses"
              subtitle="Sports days, stage lights, lab benches and everything in between."
            />
          </Reveal>
          <div className="mt-9 grid grid-cols-2 gap-3.5 md:grid-cols-3 md:grid-rows-[repeat(3,11.625rem)]">
            {galleryTeaser.map((item, index) => (
              <Reveal
                key={item.id}
                delay={index * 80}
                className={GALLERY_SPANS[index % GALLERY_SPANS.length]}
              >
                <div className="group relative h-full min-h-[10rem] overflow-hidden rounded-lg transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-card-hover motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                  <PlaceholderImage fill tone={item.tone} />
                  <span className="absolute left-3 top-3 rounded-pill bg-white/90 px-2.5 py-1.5 text-[0.65625rem] font-semibold uppercase tracking-[0.05em] text-primary backdrop-blur-sm">
                    {item.category}
                  </span>
                  <p className="absolute inset-x-0 bottom-0 bg-[linear-gradient(transparent,rgba(20,28,44,0.8))] px-4 pb-3.5 pt-9 text-[0.8125rem] font-medium text-white">
                    {item.caption}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-9 text-center">
            <ButtonLink href="/gallery" variant="accent">
              View Full Gallery
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ——— §4.1.9 CTA band ——— */}
      <section
        aria-label="Admissions call to action"
        className="border-t border-hairline"
      >
        <CTABand
          eyebrow="Enrollment Open"
          title={`Admissions open for ${site.admissionYear}`}
          subtitle="Seats in Nursery, KG and Grade 1 fill quickly. Begin with a simple online inquiry and our admissions team will guide you the rest of the way."
        />
      </section>
    </>
  );
}
