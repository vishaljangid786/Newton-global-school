import Link from "next/link";
import { Fragment } from "react";
import Accordion, { type AccordionEntry } from "@/components/ui/Accordion";
import Reveal from "@/components/ui/Reveal";
import type { StageCopy } from "@/data/pages/types";
import {
  CARD,
  CONTAINER,
  DoodleWash,
  Cover,
  Wave,
  GoldLink,
  Icon,
  PageHero,
  type IconName,
  type Img,
  Photo,
  rich,
  SECTION,
  SectionTitle,
  STAGE_COLOURS,
  DEFAULT_COLOUR,
  STRONG,
} from "./school-kit";

/**
 * The four class-stage tabs of the document (Nursery, Primary, Secondary,
 * Senior Secondary) share one section order, so they share one layout. Each
 * route supplies its verbatim copy plus the photography and icons that suit
 * that age group.
 */
export interface StageChrome {
  /**
   * Breadcrumb label for this stage, e.g. "Nursery". It sits after the
   * "Academics" hub, so every stage reads Home / Academics / <stage>
   * (docs/design.md §3.3: "Home / Section / Page" on all inner pages).
   */
  crumb: string;
  /** Eyebrow shown above each h2. */
  eyebrows: {
    overview: string;
    curriculum: string;
    whyStage: string;
    streams?: string;
    facilities: string;
    teaching: string;
  };
  images: {
    hero: Img;
    overview: Img;
    /** Sits behind the navy "why this stage matters" band. */
    whyStage: Img;
    streams?: Img;
    teaching: Img;
    /** Three or four photos for the facilities band. */
    facilities: Img[];
  };
  curriculumIcons: IconName[];
  facilityIcons: IconName[];
}

/**
 * Resolve the document's internal-link labels to routes. Longest labels are
 * matched first so "Secondary School (Class 6-10)" wins over "Secondary".
 */
const LINK_ROUTES: Array<[RegExp, string]> = [
  [/senior secondary/i, "/academics/senior-secondary"],
  [/secondary school \(class 6-10\)|secondary school/i, "/academics/secondary"],
  [/primary school/i, "/academics/primary"],
  [/nursery/i, "/academics/nursery"],
  [/eligibility criteria/i, "/admissions/eligibility"],
  [/fee structure/i, "/admissions/fees"],
  [/admission process/i, "/admissions/process"],
  [/about us/i, "/about"],
  [/home/i, "/"],
];

function routeFor(label: string): string {
  for (const [pattern, href] of LINK_ROUTES) {
    if (pattern.test(label)) return href;
  }
  return "/";
}

/**
 * Render one "Internal Linking Note" suggestion. The document wraps each in
 * quotation marks to delimit it and bolds the clickable part; the quotes are
 * dropped, everything inside them is kept exactly as written.
 */
function DocLink({ source }: { source: string }) {
  const text = source.replace(/^"|"$/g, "");
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return (
    <p className="text-[0.9375rem] leading-[1.8] text-text-muted">
      {parts.map((part, index) => {
        if (!part.startsWith("**")) return <Fragment key={index}>{part}</Fragment>;
        const label = part.slice(2, -2);
        return (
          <Link
            key={index}
            href={routeFor(label)}
            className="font-bold text-[#87661f] underline decoration-[#a8802f]/40 underline-offset-4 transition-colors hover:text-[#a8802f] hover:decoration-[#a8802f]"
          >
            {label}
          </Link>
        );
      })}
    </p>
  );
}

export default function StagePage({
  copy,
  chrome,
}: {
  copy: StageCopy;
  chrome: StageChrome;
}) {
  const { images, eyebrows } = chrome;
  /* Each class stage carries its own colour through its tiles and accents. */
  const colour = STAGE_COLOURS[copy.slug] ?? DEFAULT_COLOUR;
  const faqEntries: AccordionEntry[] = copy.faq.items.map((item, index) => ({
    id: `faq-${index + 1}`,
    heading: <span className="font-bold">{item.q}</span>,
    content: <p className="text-[0.9375rem] leading-[1.75]">{rich(item.a)}</p>,
  }));

  return (
    <>
      {/* ——— §1 Banner Section ——— */}
      <PageHero
        image={images.hero}
        priority
        crumbs={[
          { label: "Academics", href: "/academics" },
          { label: chrome.crumb },
        ]}
        h1={copy.hero.h1}
        sub={copy.hero.sub}
        body={copy.hero.body}
        cta={copy.hero.cta}
      />

      {/* ——— §2 Overview Section ——— */}
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
                  img={images.overview}
                  sizes="(max-width: 768px) 92vw, (max-width: 1200px) 46vw, 540px"
                  className="h-auto w-full"
                />
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <SectionTitle eyebrow={eyebrows.overview} title={copy.overview.h2} />
            {copy.overview.body.map((paragraph, index) => (
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

      {/* ——— §3 Curriculum Highlights — colour-coded focus tiles ——— */}
      <section className={`relative overflow-hidden border-y border-hairline bg-bg-alt ${SECTION}`}>
        <DoodleWash className="text-[#000c2e] opacity-[0.045]" />
        <div className={CONTAINER}>
          <Reveal>
            <SectionTitle
              eyebrow={eyebrows.curriculum}
              title={copy.curriculum.h2}
              align="center"
            />
            {copy.curriculum.lede ? (
              <p className="mx-auto mt-4 max-w-3xl text-center text-[0.9375rem] leading-[1.8] text-text-muted">
                {rich(copy.curriculum.lede)}
              </p>
            ) : null}
          </Reveal>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-6">
            {copy.curriculum.items.map((item, index) => {
              return (
                <li key={item.slice(0, 28)}>
                  <Reveal delay={(index % 3) * 90} className="h-full">
                    <article
                      className={`flex h-full flex-col p-5 sm:p-6 lg:p-7 ${CARD} ${colour.edge} ${colour.bar}`}
                    >
                      <span
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.125rem] ${colour.well}`}
                      >
                        <Icon
                          name={
                            chrome.curriculumIcons[
                              index % chrome.curriculumIcons.length
                            ]
                          }
                          className="h-6 w-6"
                        />
                      </span>
                      <p className="mt-5 break-words text-[0.9375rem] leading-[1.8] text-text-muted">
                        {rich(item, STRONG.runIn)}
                      </p>
                    </article>
                  </Reveal>
                </li>
              );
            })}
          </ul>
          <Reveal delay={120}>
            <p className="mx-auto mt-9 max-w-3xl rounded-[1.25rem] border border-[#a8802f]/25 bg-[#faf4e8] py-5 text-center text-[0.9375rem] leading-[1.8] text-text-muted sm:py-6 px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
              {rich(copy.curriculum.closing)}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ——— §4 Why This Stage Matters — navy band ——— */}
      <section className="relative flex min-h-[calc(100svh-var(--header-h))] flex-col justify-center overflow-hidden bg-[#001344] pb-16 pt-20 sm:pb-20 sm:pt-24 lg:pb-24 lg:pt-28">
        <Wave className="z-20 text-bg-alt" />
        <Cover img={images.whyStage} sizes="100vw" decorative className="opacity-[0.18]" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,rgba(0,19,68,0.96),rgba(0,19,68,0.8))]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-pill bg-[radial-gradient(circle,rgba(214,165,63,0.18),transparent_70%)]"
        />
        <div className={`relative ${CONTAINER}`}>
          <Reveal>
            <SectionTitle
              eyebrow={eyebrows.whyStage}
              title={copy.whyStage.h2}
              align="center"
              tone="dark"
            />
          </Reveal>
          <div className="mx-auto mt-9 grid max-w-4xl gap-5 md:grid-cols-2 lg:mt-11">
            {copy.whyStage.body.map((paragraph, index) => (
              <Reveal
                key={paragraph.slice(0, 32)}
                delay={index * 110}
                className="h-full"
              >
                <p className="h-full rounded-[1.25rem] border border-white/12 bg-white/[0.06] p-5 text-[0.9375rem] leading-[1.85] text-[#c2cfe4] backdrop-blur-sm sm:p-7 lg:p-8">
                  {rich(paragraph, STRONG.dark)}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Stream selection — Senior Secondary only ——— */}
      {copy.streams && images.streams ? (
        <section className={SECTION}>
          <div
            className={`${CONTAINER} grid items-center gap-12 md:grid-cols-2 lg:gap-14 xl:gap-16`}
          >
            <Reveal>
              <SectionTitle
                eyebrow={eyebrows.streams ?? "Streams"}
                title={copy.streams.h2}
              />
              {copy.streams.body.map((paragraph, index) => (
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
            <Reveal delay={120}>
              <div className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -bottom-3 -right-3 hidden h-full w-full rounded-[1.75rem] border-2 border-[#a8802f]/45 sm:block"
                />
                <div className="relative overflow-hidden rounded-[1.75rem] shadow-frame">
                  <Photo
                    img={images.streams}
                    sizes="(max-width: 768px) 92vw, (max-width: 1200px) 46vw, 540px"
                    className="h-auto w-full"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* ——— §5 Facilities — photo band above the icon tiles ——— */}
      <section className={`border-y border-hairline bg-bg-alt ${SECTION}`}>
        <div className={CONTAINER}>
          <Reveal>
            <SectionTitle
              eyebrow={eyebrows.facilities}
              title={copy.facilities.h2}
              align="center"
            />
          </Reveal>
          <Reveal delay={90}>
            <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {images.facilities.map((img, index) => (
                <div
                  key={img.src}
                  className={`relative aspect-[4/3] overflow-hidden rounded-[1.25rem] shadow-card sm:aspect-[16/11] ${
                    index % 2 ? "lg:translate-y-4" : ""
                  }`}
                >
                  <Cover
                    img={img}
                    sizes="(max-width: 1024px) 46vw, 275px"
                    className="transition-transform duration-500 hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100"
                  />
                </div>
              ))}
            </div>
          </Reveal>
          <ul className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
            {copy.facilities.items.map((item, index) => {
              return (
                <li key={item.slice(0, 28)}>
                  <Reveal delay={(index % 3) * 70} className="h-full">
                    {/* Same lightening as the home page: a long list of
                        facilities reads better without twelve boxes. */}
                    <div className="flex h-full gap-3.5">
                      <span
                        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.625rem] ${colour.well}`}
                      >
                        <Icon
                          name={
                            chrome.facilityIcons[index % chrome.facilityIcons.length]
                          }
                          className="h-[1.2rem] w-[1.2rem]"
                        />
                      </span>
                      <p className="break-words text-[0.875rem] leading-[1.75] text-text-muted md:text-[0.9375rem]">
                        {rich(item, STRONG.runIn)}
                      </p>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ——— §6 Teacher-Student Approach ——— */}
      <section className={SECTION}>
        <div
          className={`${CONTAINER} grid items-center gap-12 md:grid-cols-2 lg:gap-14 xl:gap-16`}
        >
          <Reveal>
            <SectionTitle eyebrow={eyebrows.teaching} title={copy.teaching.h2} />
            {copy.teaching.body.map((paragraph, index) => (
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
          <Reveal delay={120}>
            <div className="overflow-hidden rounded-[1.75rem] shadow-frame">
              <Photo
                img={images.teaching}
                sizes="(max-width: 768px) 92vw, (max-width: 1200px) 46vw, 540px"
                className="h-auto w-full"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— §7 FAQ Section ——— */}
      <section className={`border-y border-hairline bg-bg-alt ${SECTION}`}>
        <div className={CONTAINER}>
          <Reveal>
            <SectionTitle eyebrow="FAQ" title={copy.faq.h2} align="center" />
          </Reveal>
          <Reveal delay={110}>
            <Accordion
              items={faqEntries}
              defaultOpenId="faq-1"
              className="mx-auto mt-10 max-w-3xl lg:mt-12"
            />
          </Reveal>
        </div>
      </section>

      {/* ——— §8 Admission CTA Section ——— */}
      <section className="relative flex min-h-[calc(100svh-var(--header-h))] flex-col justify-center overflow-hidden bg-[#001344] pb-16 pt-20 text-center text-white sm:pb-20 sm:pt-24 lg:pb-24 lg:pt-28">
        <Wave className="z-20 text-bg-alt" />
        <Cover img={images.hero} sizes="100vw" decorative className="opacity-[0.26]" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(0,19,68,0.95),rgba(0,12,46,0.86))]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-pill bg-[radial-gradient(circle,rgba(214,165,63,0.24),transparent_70%)]"
        />
        <Reveal className={`relative ${CONTAINER}`}>
          <span
            aria-hidden="true"
            className="mx-auto block h-[3px] w-16 rounded-pill bg-[#d6a53f]"
          />
          <h2 className="mx-auto mt-6 max-w-3xl text-[1.5rem] leading-[1.2] text-white sm:text-[1.75rem] md:text-[2rem] lg:text-[2.25rem] xl:text-[2.4rem]">
            {rich(copy.admissionCta.h2, STRONG.headingDark)}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[0.9375rem] leading-[1.85] text-[#c2cfe4] md:text-base">
            {rich(copy.admissionCta.body, STRONG.dark)}
          </p>
          <GoldLink href="/admissions" className="mt-8 w-full sm:w-auto">
            {copy.admissionCta.button}
          </GoldLink>
        </Reveal>
      </section>

      {/* ——— The document's "Internal Linking Note" suggestions ——— */}
      <section className={SECTION}>
        <div className={CONTAINER}>
          <Reveal>
            <ul className="mx-auto grid max-w-4xl gap-3 rounded-[1.25rem] border border-[#a8802f]/25 bg-[#faf4e8] py-6 px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
              {copy.links.map((link) => (
                <li key={link}>
                  <DocLink source={link} />
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </>
  );
}
