import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  CARD,
  CONTAINER,
  CONTAINER_FLUID,
  Icon,
  type Img,
  PageHero,
  rich,
  SECTION,
  splitRunIn,
  SectionTitle,
  TINTS,
} from "@/components/site/school-kit";
import EnquiryBand from "@/components/site/EnquiryBand";
import Reveal from "@/components/ui/Reveal";
import {
  facultyPortraits,
  facultyPromise,
  facultyStages,
  facultyValue,
} from "@/data/pages/faculty";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Faculty",
  description:
    "The teachers of Newton Global School, Sangteda, Kotputli — how they teach at every stage, from Nursery to Class 12.",
};

const IMG = {
  heroBanner: {
    src: "/images/school/classroom-teaching.webp",
    w: 1600,
    h: 1200,
    alt: "A teacher leading a lesson in a full classroom",
  },
  ctaCampus: {
    src: "/images/school/campus-front.webp",
    w: 1600,
    h: 900,
    alt: "The Newton Global School building seen from the driveway",
  },
} as const satisfies Record<string, Img>;

/* ———————————————————————————————————————————————————————————————
 * The document has no Faculty tab, so every sentence about the teachers here
 * is lifted from where it does describe them — the four "Teacher-Student
 * Approach" sections and the "Why Choose Us" list. See
 * src/data/pages/faculty.ts. Only the section eyebrows are authored.
 * ——————————————————————————————————————————————————————————————— */
export default function FacultyPage() {
  return (
    <>
      <PageHero
        image={IMG.heroBanner}
        priority
        crumbs={[{ label: "About Us", href: "/about" }, { label: "Faculty" }]}
        h1={`Our Faculty`}
        sub={`The Teachers Behind Every Classroom at Sangteda, Kotputli`}
        body={`How our teachers work changes with the age they teach — patient and personal in Nursery, mentor-like by Class 12. This page sets out that approach stage by stage.`}
      />

      {/* ——— The document's own line about its teachers ——— */}
      <section className={`bg-bg ${SECTION} !py-16 sm:!py-20`}>
        <div className={`${CONTAINER_FLUID} max-w-4xl text-center`}>
          <Reveal>
            <span
              aria-hidden="true"
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-[1.125rem] bg-[#faf4e8] text-[#87661f]"
            >
              <Icon name="faculty" className="h-6 w-6" />
            </span>
            {/* This block opened the page with no heading of its own, and the
                document's line is a run-in — title then description — so it
                splits the same way the home page splits it. */}
            <h2 className="mt-6 text-[clamp(1.3rem,1rem+0.9vw,2.05rem)] leading-[1.24] text-[#154a8a]">
              {splitRunIn(facultyPromise).title}
            </h2>
            <p className="mt-3 text-[clamp(0.95rem,0.9rem+0.3vw,1.125rem)] leading-[1.7] text-ink">
              {splitRunIn(facultyPromise).body}
            </p>
            <p className="mt-4 text-[0.9375rem] leading-[1.85] text-text-muted">
              {facultyValue}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ——— How we teach, stage by stage ——— */}
      <section className={`border-y border-hairline bg-bg-alt ${SECTION}`}>
        <div className={CONTAINER}>
          <Reveal>
            <SectionTitle
              eyebrow="Teaching Approach"
              title={`How We Teach, Stage by Stage`}
              align="center"
            />
          </Reveal>
          <ul className="mt-10 grid gap-5 lg:mt-12 lg:grid-cols-2 lg:gap-6">
            {facultyStages.map((entry, index) => {
              const tint = TINTS[index % TINTS.length];
              return (
                <li key={entry.stage}>
                  <Reveal delay={(index % 2) * 110} className="h-full">
                    <article className={`flex h-full flex-col p-6 sm:p-7 ${CARD} ${tint.edge} ${tint.bar}`}>
                      <span className="text-[0.6875rem] font-bold uppercase tracking-[0.09em] text-[#87661f]">
                        {entry.stage}
                      </span>
                      <h3 className="mt-2 font-heading text-[1.0625rem] font-bold leading-snug text-ink">
                        {entry.h2}
                      </h3>
                      {entry.body.map((paragraph) => (
                        <p
                          key={paragraph.slice(0, 32)}
                          className="mt-4 text-[0.9375rem] leading-[1.85] text-text-muted"
                        >
                          {rich(paragraph)}
                        </p>
                      ))}
                      <Link
                        href={entry.href}
                        className="mt-5 inline-flex items-center gap-2 text-[0.875rem] font-bold text-[#87661f]"
                      >
                        More about {entry.stage}
                        <span aria-hidden="true">→</span>
                      </Link>
                    </article>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ——— The team, photographs only ——— */}
      <section className={SECTION}>
        <div className={CONTAINER}>
          <Reveal>
            <SectionTitle
              eyebrow="Our Team"
              title={`The People Who Teach Here`}
              align="center"
            />
            <p className="mx-auto mt-4 max-w-2xl text-center text-[0.9375rem] leading-[1.85] text-text-muted">
              Teachers, coordinators and support staff at our Sangteda campus.
            </p>
          </Reveal>
          <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:mt-12 lg:grid-cols-5 lg:gap-5">
            {facultyPortraits.map((person, index) => (
              <li key={person.src}>
                <Reveal delay={(index % 5) * 70}>
                  <div className="group relative aspect-[3/4] overflow-hidden rounded-[1.25rem] bg-bg-alt shadow-card">
                    <Image
                      src={person.src}
                      alt={person.alt}
                      fill
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 18vw"
                      className="img-skeleton object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ——— Come and meet them — with the form, not a link to it ——— */}
      <EnquiryBand
        image={IMG.ctaCampus}
        h2={`Come and meet our teachers at **${site.name}**`}
        formTitle="Book a Campus Visit"
      />
    </>
  );
}
