import type { Metadata } from "next";
import {
  CARD,
  CONTAINER,
  Cover,
  Icon,
  type Img,
  PageHero,
  rich,
  SECTION,
  SectionTitle,
  TINTS,
} from "@/components/site/school-kit";
import EnquiryBand from "@/components/site/EnquiryBand";
import Reveal from "@/components/ui/Reveal";
import {
  achievementAreas,
  achievements,
  boardResults,
  resultImages,
  resultStats,
} from "@/data/pages/results";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Results & Achievements",
  description:
    "RBSE board results and student achievements at Newton Global School, Sangteda, Kotputli — Class 10 and Class 12 performance, toppers and co-curricular success.",
};

const IMG = {
  heroBanner: {
    src: "/images/school/gallery/assembly-hall-04.webp",
    w: 1400,
    h: 1050,
    alt: "Students gathered in the assembly hall at Newton Global School",
  },
  ctaCampus: {
    src: "/images/school/campus-front.webp",
    w: 1600,
    h: 900,
    alt: "The Newton Global School building seen from the driveway",
  },
} as const satisfies Record<string, Img>;

export default function ResultsPage() {
  return (
    <>
      <PageHero
        image={IMG.heroBanner}
        priority
        crumbs={[{ label: "Academics", href: "/academics" }, { label: "Results" }]}
        h1={`Results & Achievements`}
        sub={`RBSE Board Performance at Sangteda, Kotputli`}
        body={achievements.body.replace(/\*\*/g, "")}
      />

      {/* ——— The document's three stat highlights ——— */}
      <section className={`bg-bg ${SECTION} !py-16 sm:!py-20`}>
        <div className={CONTAINER}>
          <Reveal>
            <SectionTitle
              eyebrow="Stat Highlights"
              title={achievements.h2}
              align="center"
            />
          </Reveal>
          <ul className="mt-12 grid gap-5 sm:grid-cols-3 lg:gap-6">
            {resultStats.map((stat, index) => (
              <li key={stat.label}>
                <Reveal delay={index * 90}>
                  <div className="h-full rounded-[1.25rem] border border-[#a8802f]/25 bg-[#faf4e8] p-7 text-center">
                    <p className="font-heading text-[clamp(2.25rem,1.6rem+2vw,3.25rem)] font-bold leading-none text-[#87661f]">
                      {stat.value}
                    </p>
                    <p className="mt-3 text-[0.9375rem] leading-[1.7] text-text-muted">
                      {rich(stat.label, "font-bold text-ink")}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ——— Board results, one block per examination ——— */}
      <section className={`border-y border-hairline bg-bg-alt ${SECTION}`}>
        <div className={CONTAINER}>
          <Reveal>
            <SectionTitle
              eyebrow="Board Results"
              title={`**RBSE** Results at a Glance`}
              align="center"
            />
          </Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {boardResults.map((board, index) => (
              <Reveal key={board.exam} delay={index * 110}>
                <div className={`${CARD} h-full p-7 sm:p-8`}>
                  {/* A card title under the section's own h2 — h3, not a
                      second h2 set smaller than the one above it. */}
                  <h3 className="text-[1.125rem] leading-[1.3] text-ink">
                    {board.exam}
                  </h3>
                  <p className="mt-2 text-[0.875rem] leading-[1.75] text-text-muted">
                    {rich(board.detail, "font-bold text-ink")}
                  </p>
                  <dl className="mt-6 divide-y divide-hairline border-t border-hairline">
                    {board.rows.map((row) => (
                      <div
                        key={row.label}
                        className="flex items-baseline justify-between gap-4 py-3"
                      >
                        <dt className="text-[0.875rem] text-text-muted">
                          {row.label}
                        </dt>
                        <dd className="font-heading text-[1.125rem] font-bold text-[#154a8a]">
                          {row.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Where our students win ——— */}
      <section className={SECTION}>
        <div
          className={`${CONTAINER} grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16`}
        >
          <Reveal>
            <SectionTitle
              eyebrow="Beyond the Marksheet"
              title={`Talent in **Every Field**`}
            />
            <ul className="mt-8 grid gap-5">
              {achievementAreas.map((area, index) => {
                const tint = TINTS[index % TINTS.length];
                return (
                  <li key={area.title} className="flex gap-4">
                    <span
                      className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.625rem] ${tint.well}`}
                    >
                      <Icon name={area.icon} className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-[1rem] leading-[1.35] text-ink">
                        {area.title}
                      </h3>
                      <p className="mt-1.5 text-[0.875rem] leading-[1.75] text-text-muted">
                        {rich(area.body, "font-bold text-ink")}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Reveal>

          <Reveal delay={120}>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {resultImages.map((img, index) => (
                <div
                  key={img.src}
                  className={`relative aspect-[4/3] overflow-hidden rounded-[1.25rem] shadow-card ${
                    index % 2 ? "translate-y-6" : ""
                  }`}
                >
                  <Cover img={img} sizes="(max-width: 1024px) 46vw, 300px" />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— Admissions CTA — with the form, not a link to it ——— */}
      <EnquiryBand
        image={IMG.ctaCampus}
        h2={`Give your child the same start at **${site.name}**`}
        formTitle="Apply for Admission 2026-27"
      />
    </>
  );
}
