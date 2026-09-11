import type { Metadata } from "next";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import {
  CONTAINER,
  DoodleWash,
  Cover,
  Wave,
  Icon,
  type Img,
  PageHero,
  Photo,
  PhotoBackdrop,
  rich,
  SECTION,
  SectionTitle,
  STRONG,
} from "@/components/site/school-kit";
import Accordion, { type AccordionEntry } from "@/components/ui/Accordion";
import EnquiryBand from "@/components/site/EnquiryBand";
import Reveal from "@/components/ui/Reveal";
import { admissionProcess } from "@/data/pages/admission-process";

export const metadata: Metadata = {
  title: "Admission Process",
  /* The document's own sub-heading, imported rather than retyped. */
  description: admissionProcess.hero.sub,
};

/* ———————————————————————————————————————————————————————————————
 * Every string on this page comes from src/data/pages/admission-process.ts,
 * which is machine-generated from "Newton Global School.docx" (Admission
 * Process tab). Nothing here rewords, reorders or trims it — the copy is
 * imported and rendered through rich() so the document's `**…**` runs survive.
 * ——————————————————————————————————————————————————————————————— */

const { hero, overview, steps, timeline, documents, curriculumNote, faq, links } =
  admissionProcess;

/**
 * CC0 sample photography — public domain, no attribution required. Source
 * list in public/images/school/CREDITS.md. These are placeholders: the alt text
 * describes the stock photo, not the real Sangteda campus.
 */
const IMG = {
  hero: {
    src: "/images/school/campus-front.webp",

    w: 1600,

    h: 900,

    alt: "The Newton Global School building seen from the driveway",
  },
  overviewGate: {
    src: "/images/school/reception.webp",

    w: 1600,

    h: 1200,

    alt: "The school reception desk and waiting area",
  },
  overviewOffice: {
    src: "/images/school/reception.webp",

    w: 1600,

    h: 1200,

    alt: "The school reception desk and waiting area",
  },
  stepsCorridor: {
    src: "/images/school/corridor.webp",

    w: 1200,

    h: 1600,

    alt: "A corridor lined with classrooms inside the school",
  },
  timelineCampus: {
    src: "/images/school/campus-grounds.webp",

    w: 1600,

    h: 900,

    alt: "The school building across its green grounds",
  },
  documentsDesk: {
    src: "/images/school/reception.webp",

    w: 1600,

    h: 1200,

    alt: "The school reception desk and waiting area",
  },
  curriculumBoard: {
    src: "/images/school/teacher-blackboard.webp",

    w: 1200,

    h: 1600,

    alt: "A teacher writing the day's lesson on the blackboard",
  },
  faqLibrary: {
    src: "/images/school/library.webp",

    w: 1600,

    h: 1200,

    alt: "The school library with its reading tables and shelves",
  },
  ctaCampus: {
    src: "/images/school/parents-with-pupils.webp",

    w: 1448,

    h: 1086,

    alt: "Parents with four Newton Global School pupils in uniform",
  },
} as const satisfies Record<string, Img>;

/* ——— The document's "Internal Linking Note" suggestions ————————————
 * Each suggestion is wrapped in quotation marks that delimit it in the source
 * (dropped here) and bolds the clickable part. One run names several pages —
 * "Nursery | Primary | Secondary | Senior Secondary →" — so the run is split
 * on its own separators and each named page linked in place, leaving the
 * separators and the arrow exactly as written. "Best School in Kotputli" is
 * the document's About Us link.
 * ——————————————————————————————————————————————————————————————— */
const LINK_ROUTES: Record<string, string> = {
  Home: "/",
  "About Us": "/about",
  "Best School in Kotputli": "/about",
  Nursery: "/nursery",
  Primary: "/primary",
  Secondary: "/secondary",
  "Senior Secondary": "/senior-secondary",
  "Admission Process": "/admission-process",
  "Fee Structure": "/fee-structure",
  "Eligibility Criteria": "/eligibility-criteria",
};

const DOC_LINK_CLASS =
  "font-bold text-[#87661f] underline decoration-[#a8802f]/40 underline-offset-4 transition-colors hover:text-[#a8802f] hover:decoration-[#a8802f]";

/** Link every page named inside one bold run, keeping the run's own text. */
function linkRun(run: string): ReactNode[] {
  return run.split(/(\s\|\s)/g).map((piece, index) => {
    const href = LINK_ROUTES[piece.replace(/→/g, "").trim()];
    return href ? (
      <Link key={index} href={href} className={DOC_LINK_CLASS}>
        {piece}
      </Link>
    ) : (
      <Fragment key={index}>{piece}</Fragment>
    );
  });
}

/** One suggestion: plain lead-in copy, then the bold run as the link. */
function DocLink({ source }: { source: string }) {
  const text = source.replace(/^"|"$/g, "");
  return (
    <p className="text-[0.9375rem] leading-[1.8] text-text-muted">
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
        part.startsWith("**") && part.endsWith("**") ? (
          /* The whole run is bold in the document — the separators between
             the linked page names included — so the <strong> wraps the run
             and the links sit inside it. */
          <strong key={index} className={STRONG.body}>
            {linkRun(part.slice(2, -2))}
          </strong>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        )
      )}
    </p>
  );
}

const faqEntries: AccordionEntry[] = faq.items.map((item, index) => ({
  id: `faq-${index + 1}`,
  heading: <span className="font-bold">{item.q}</span>,
  content: <p className="text-[0.9375rem] leading-[1.75]">{rich(item.a)}</p>,
}));

export default function AdmissionProcessPage() {
  return (
    <>
      {/* ——— Banner Section — campus exterior under a navy wash ——— */}
      <PageHero
        image={IMG.hero}
        priority
        /* Flat URL now, and Registration Form is a sibling page rather than
           a parent, so the trail is just Home / this page. */
        crumbs={[{ label: "Admission Process" }]}
        h1={hero.h1}
        sub={hero.sub}
        body={hero.body}
        cta={hero.cta}
        ctaHref="#enquiry"
      />

      {/* ——— Overview — the gateway photo with the admission office inset ——— */}
      <section className={`relative overflow-hidden bg-bg ${SECTION}`}>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-pill bg-[#faf4e8] opacity-70 blur-2xl"
        />
        <div
          className={`relative ${CONTAINER} grid items-center gap-12 md:grid-cols-2 lg:gap-14 xl:gap-16`}
        >
          <Reveal>
            <div className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-3 -top-3 hidden h-full w-full rounded-[1.75rem] border-2 border-[#a8802f]/45 sm:block"
              />
              <div className="relative overflow-hidden rounded-[1.75rem] shadow-frame">
                <Photo
                  img={IMG.overviewGate}
                  sizes="(max-width: 767px) 92vw, (max-width: 1200px) 46vw, 540px"
                  className="h-auto w-full"
                />
              </div>
              <div className="absolute -bottom-8 -right-2 hidden w-36 overflow-hidden rounded-[1.25rem] border-4 border-bg shadow-frame sm:block lg:w-44">
                <Photo
                  img={IMG.overviewOffice}
                  sizes="(max-width: 1024px) 144px, 176px"
                  className="h-auto w-full"
                />
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <SectionTitle eyebrow="Overview" title={overview.h2} />
            {overview.body.map((paragraph, index) => (
              <p
                key={paragraph.slice(0, 32)}
                className={`text-[0.9375rem] leading-[1.85] text-text-muted md:text-base ${
                  index === 0 ? "mt-5" : "mt-4"
                }`}
              >
                {rich(paragraph)}
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ——— The four steps — the page's centrepiece.
          A rail carries the eye from one gold numeral to the next: it runs
          down the left of the stack on small screens and straight across the
          four columns from lg, so the four steps read as one journey rather
          than four cards. ——— */}
      <section className={`relative overflow-hidden relative overflow-hidden border-y border-hairline bg-bg-alt ${SECTION}`}>
        <DoodleWash className="text-[#000c2e] opacity-[0.045]" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-pill bg-[radial-gradient(circle,rgba(168,128,47,0.16),transparent_70%)]"
        />
        <div className={`relative ${CONTAINER}`}>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
            <Reveal className="lg:col-span-7">
              <SectionTitle
                eyebrow="Step by Step"
                title={steps.h2}
                width="max-w-2xl"
              />
              <p className="mt-5 max-w-2xl text-[0.9375rem] leading-[1.85] text-text-muted md:text-base">
                {rich(steps.lede)}
              </p>
            </Reveal>
            <Reveal delay={120} className="lg:col-span-5">
              <div className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -bottom-3 -right-3 hidden h-full w-full rounded-[1.5rem] border-2 border-[#a8802f]/45 sm:block"
                />
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.5rem] shadow-frame">
                  <Cover img={IMG.stepsCorridor} sizes="(max-width: 1024px) 92vw, 440px" />
                </div>
              </div>
            </Reveal>
          </div>

          <ol className="mt-12 grid gap-8 md:grid-cols-2 md:gap-x-10 lg:mt-16 lg:grid-cols-4 lg:gap-7">
            {steps.items.map((step, index) => {
              const last = index === steps.items.length - 1;
              return (
                <li key={step.title} className="h-full">
                  <Reveal delay={index * 90} className="h-full">
                    <div className="flex h-full gap-5 sm:gap-6 lg:flex-col lg:gap-0">
                      {/* Gold numeral, then the rail on to the next step */}
                      <div className="flex flex-col items-center lg:w-full lg:flex-row">
                        <span
                          aria-hidden="true"
                          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.25rem] bg-[#d99a34] bg-[image:linear-gradient(135deg,#d6a53f,#a8802f)] font-heading text-[1.25rem] font-bold tracking-tight text-[#001344] shadow-[0_12px_26px_-12px_rgba(168,128,47,0.9)] sm:h-16 sm:w-16 sm:text-[1.5rem]"
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span
                          aria-hidden="true"
                          className={`mt-2 w-px flex-1 bg-[linear-gradient(180deg,#a8802f,rgba(168,128,47,0.12))] md:hidden lg:mt-0 lg:ml-4 lg:block lg:h-px lg:w-auto lg:bg-[linear-gradient(90deg,#a8802f,rgba(168,128,47,0.12))] ${
                            last ? "hidden lg:block" : ""
                          }`}
                        />
                      </div>
                      <div className="min-w-0 flex-1 pb-2 lg:pb-0 lg:pt-7">
                        <h3 className="font-heading text-[1.0625rem] font-bold leading-snug text-ink break-words sm:text-[1.125rem]">
                          {rich(step.title, STRONG.headingLight)}
                        </h3>
                        <p className="mt-3 break-words text-[0.9375rem] leading-[1.8] text-text-muted">
                          {rich(step.body)}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>

        </div>
      </section>

      {/* ——— When to Apply — navy band, one panel per paragraph ——— */}
      <section className="relative flex min-h-[calc(100svh-var(--header-h))] flex-col justify-center overflow-hidden bg-[#001344] pb-16 pt-20 sm:pb-20 sm:pt-24 lg:pb-24 lg:pt-28">
        <Wave className="z-20 text-bg-alt" />
        <PhotoBackdrop img={IMG.timelineCampus} fixed />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-pill bg-[radial-gradient(circle,rgba(214,165,63,0.18),transparent_70%)]"
        />
        <div className={`relative ${CONTAINER}`}>
          <Reveal>
            <SectionTitle
              eyebrow="Timeline"
              title={timeline.h2}
              align="center"
              tone="dark"
            />
          </Reveal>
          <div className="mx-auto mt-9 grid max-w-4xl gap-5 md:grid-cols-2 lg:mt-11">
            {timeline.body.map((paragraph, index) => (
              <Reveal
                key={paragraph.slice(0, 32)}
                delay={index * 110}
                className="h-full"
              >
                <div className="h-full rounded-[1.25rem] border border-white/12 bg-white/[0.06] p-5 backdrop-blur-sm sm:p-6 lg:p-7">
                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 items-center justify-center rounded-[0.875rem] bg-[#d6a53f]/15 text-[#d6a53f]"
                  >
                    <Icon name={index === 0 ? "calendar" : "check"} className="h-5 w-5" />
                  </span>
                  <p className="mt-5 text-[0.9375rem] leading-[1.85] text-[#c2cfe4]">
                    {rich(paragraph, STRONG.dark)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ——— What You'll Need — the document's list as a ticked checklist ——— */}
      <section className={`relative overflow-hidden bg-bg ${SECTION}`}>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 bottom-10 h-64 w-64 rounded-pill bg-[#faf4e8] opacity-70 blur-2xl"
        />
        <div
          className={`relative ${CONTAINER} grid gap-10 lg:grid-cols-12 lg:gap-14`}
        >
          <div className="lg:col-span-5">
            <Reveal>
              <SectionTitle eyebrow="Documents" title={documents.h2} />
              <p className="mt-5 text-[0.9375rem] leading-[1.85] text-text-muted md:text-base">
                {rich(documents.lede)}
              </p>
            </Reveal>
            <Reveal delay={110}>
              <div className="mt-8 hidden overflow-hidden rounded-[1.5rem] shadow-frame sm:block">
                <Photo
                  img={IMG.documentsDesk}
                  sizes="(max-width: 1024px) 92vw, 440px"
                  className="h-auto w-full"
                />
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <ul className="divide-y divide-hairline overflow-hidden rounded-[1.5rem] border border-hairline bg-surface shadow-card">
              {documents.items.map((item, index) => (
                <li key={item}>
                  <Reveal delay={index * 70}>
                    <div className="flex items-start gap-4 px-5 py-4 sm:px-6 sm:py-5">
                      <span
                        aria-hidden="true"
                        className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.75rem] bg-[#faf4e8] text-[#87661f]"
                      >
                        <Icon name="check" className="h-4 w-4" />
                      </span>
                      <p className="text-[0.9375rem] leading-[1.8] text-text-muted">
                        {rich(item)}
                      </p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
            <Reveal delay={120}>
              <p className="mt-6 rounded-[1.25rem] border border-[#a8802f]/25 bg-[#faf4e8] px-5 py-5 text-[0.9375rem] leading-[1.8] text-text-muted sm:px-6 sm:py-6">
                {rich(documents.closing)}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ——— A Note on Our Curriculum — the frank RBSE status, gold-soft band ——— */}
      <section className={`border-y border-[#a8802f]/20 bg-[#faf4e8] ${SECTION}`}>
        <div
          className={`${CONTAINER} grid items-center gap-10 lg:grid-cols-12 lg:gap-14`}
        >
          <Reveal className="lg:col-span-5">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.5rem] shadow-frame">
              <Cover img={IMG.curriculumBoard} sizes="(max-width: 1024px) 92vw, 440px" />
            </div>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-7">
            <SectionTitle eyebrow="Curriculum" title={curriculumNote.h2} />
            <div className="mt-7 rounded-[1.25rem] border border-[#a8802f]/25 bg-surface p-5 shadow-card sm:p-6 lg:p-8">
              <span
                aria-hidden="true"
                className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-[#faf4e8] text-[#87661f]"
              >
                <Icon name="book" className="h-5 w-5" />
              </span>
              <p className="mt-5 text-[0.9375rem] leading-[1.9] text-text md:text-base">
                {rich(curriculumNote.body)}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— FAQ Section ——— */}
      <section className={SECTION}>
        <div
          className={`${CONTAINER} grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-14`}
        >
          <Reveal className="lg:col-span-5">
            <SectionTitle eyebrow="FAQ" title={faq.h2} />
            <div className="relative mt-8 hidden lg:block">
              <span
                aria-hidden="true"
                className="absolute -bottom-3 -right-3 h-full w-full rounded-[1.5rem] border-2 border-[#a8802f]/45"
              />
              <div className="relative overflow-hidden rounded-[1.5rem] shadow-frame">
                <Photo img={IMG.faqLibrary} sizes="440px" className="h-auto w-full" />
              </div>
            </div>
          </Reveal>
          <Reveal delay={110} className="lg:col-span-7">
            <Accordion items={faqEntries} defaultOpenId="faq-1" />
          </Reveal>
        </div>
      </section>

      {/* ——— The document's "Internal Linking Note" suggestions ——— */}
      <section className={`border-y border-hairline bg-bg-alt ${SECTION}`}>
        <div className={CONTAINER}>
          <Reveal>
            <ul className="mx-auto grid max-w-4xl gap-3 rounded-[1.25rem] border border-[#a8802f]/25 bg-[#faf4e8] py-5 sm:py-6 px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
              {links.map((link) => (
                <li key={link} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-pill bg-white text-[#87661f]"
                  >
                    <Icon name="pin" className="h-3.5 w-3.5" />
                  </span>
                  <DocLink source={link} />
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ——— Closing CTA band — the hero's promise, with the form under it
          so the next step is not another page load ——— */}
      <EnquiryBand
        image={IMG.ctaCampus}
        h2={hero.sub}
        waveClass="text-bg-alt"
        formTitle={hero.cta}
      />
    </>
  );
}
