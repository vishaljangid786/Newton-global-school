import type { Metadata } from "next";
import {
  CONTAINER,
  DoodleWash,
  Icon,
  type Img,
  PageHero,
  Photo,
  rich,
  SECTION,
  SectionTitle,
  STRONG,
} from "@/components/site/school-kit";
import Accordion, { type AccordionEntry } from "@/components/ui/Accordion";
import EnquiryBand from "@/components/site/EnquiryBand";
import Reveal from "@/components/ui/Reveal";
import { eligibility } from "@/data/pages/eligibility";

export const metadata: Metadata = {
  title: "Eligibility Criteria",
  description: eligibility.hero.sub,
};

/* ———————————————————————————————————————————————————————————————
 * Every string on this page comes from src/data/pages/eligibility.ts, which
 * is transcribed verbatim from "Newton Global School.docx" (Age Criteria
 * tab). Nothing here is retyped, reordered or reworded — the eyebrows and
 * the chart's editorial note are the only page furniture.
 * ——————————————————————————————————————————————————————————————— */
const { hero, overview, chart, faq } = eligibility;

/**
 * CC0 sample photography — public domain, no attribution required.
 * Source list in public/images/school/CREDITS.md. None of these show the real
 * school; the alt text describes the photograph itself.
 */
const IMG = {
  heroBanner: {
    src: "/images/school/campus-front.webp",

    w: 1600,

    h: 900,

    alt: "The Newton Global School building seen from the driveway",
  },
  overviewChild: {
    src: "/images/school/pupils-smart-class.webp",

    w: 1448,

    h: 1086,

    alt: "Newton Global School pupils during a smart-class session",
  },
  overviewInset: {
    src: "/images/school/kindergarten-room.webp",

    w: 1600,

    h: 1200,

    alt: "The pre-primary activity room with its play equipment",
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

/* The document's five Q&A pairs, wired into the shared Accordion. */
const faqEntries: AccordionEntry[] = faq.items.map((item, index) => ({
  id: `faq-${index + 1}`,
  heading: <span className="font-bold">{rich(item.q)}</span>,
  content: <p className="text-[0.9375rem] leading-[1.75]">{rich(item.a)}</p>,
}));

/* Header cell rhythm, shared by all four column headings. */
const TH = "px-5 py-4 font-heading text-[0.75rem] font-bold uppercase tracking-[0.09em] text-[#87661f] sm:px-6";
/* Body cell rhythm — generous padding so fourteen rows still breathe. */
const TD = "whitespace-nowrap px-5 py-4 text-[0.9375rem] text-text-muted sm:px-6";
/* Rules for the pinned class column. A sticky cell paints above the table's
   collapsed borders, so both its right divider and the row rule it would
   otherwise hide are drawn as inset shadows on the cell itself. Both live in
   one utility — two `shadow-[…]` classes on one element would fight. */
const STICKY_EDGE = "shadow-[inset_-1px_0_0_0_rgba(168,128,47,0.2)]";
const STICKY_CELL =
  "shadow-[inset_-1px_0_0_0_rgba(168,128,47,0.2),inset_0_1px_0_0_#eaeef3]";

export default function EligibilityCriteriaPage() {
  return (
    <>
      {/* ——— §1 Banner Section — campus exterior under a navy wash ——— */}
      <PageHero
        image={IMG.heroBanner}
        priority
        crumbs={[{ label: "Eligibility Criteria" }]}
        h1={hero.h1}
        sub={hero.sub}
        body={hero.body}
        cta={hero.cta}
        ctaHref="#enquiry"
      />

      {/* ——— §2 Why Age Criteria Matters — the two-paragraph overview ——— */}
      <section className={`relative overflow-hidden bg-bg ${SECTION}`}>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-pill bg-[#faf4e8] opacity-70 blur-2xl"
        />
        <div
          className={`relative ${CONTAINER} grid items-center gap-12 md:grid-cols-2 lg:gap-14 xl:gap-16`}
        >
          <Reveal>
            <SectionTitle eyebrow="Age Criteria" title={overview.h2} />
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
          <Reveal delay={120}>
            <div className="relative">
              <span
                aria-hidden="true"
                className="absolute -bottom-3 -right-3 hidden h-full w-full rounded-[1.75rem] border-2 border-[#a8802f]/45 sm:block"
              />
              <div className="relative overflow-hidden rounded-[1.75rem] shadow-frame">
                <Photo
                  img={IMG.overviewChild}
                  sizes="(max-width: 768px) 92vw, (max-width: 1200px) 46vw, 540px"
                  className="h-auto w-full"
                />
              </div>
              <div className="absolute -bottom-8 -left-2 hidden w-36 overflow-hidden rounded-[1.25rem] border-4 border-bg shadow-frame sm:block lg:w-44">
                <Photo
                  img={IMG.overviewInset}
                  sizes="(max-width: 1024px) 144px, 176px"
                  className="h-auto w-full"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— §3 Class Wise Age Chart — the page's centrepiece ———
          A real <table>: the caption names the session, "Date of Birth in
          Between" is one header spanning the from/to pair (scope="colgroup"),
          and each class is the row header. The frame owns the horizontal
          scroll on narrow screens so the page itself never shifts sideways,
          and the class column stays pinned while the dates scroll past. */}
      <section className={`relative overflow-hidden border-y border-hairline bg-bg-alt ${SECTION}`}>
        <DoodleWash className="text-[#000c2e] opacity-[0.045]" />
        <div className={CONTAINER}>
          <Reveal>
            <SectionTitle
              eyebrow="Age Chart"
              title={chart.h2}
              align="center"
              width="max-w-3xl"
            />
          </Reveal>
          <Reveal delay={90}>
            {/* One element owns both the frame and the scroll. Nesting the
                scroller inside a separate overflow-hidden frame clipped its
                focus ring away, leaving keyboard users no visible target.
                Focusable so the chart can be scrolled by keyboard alone
                (WCAG 2.1.1) — it holds no other focus stop. */}
            <div
              role="region"
              aria-label={chart.caption}
              tabIndex={0}
              className="mt-10 overflow-x-auto rounded-[1.5rem] border border-[#a8802f]/25 bg-surface shadow-frame lg:mt-12"
            >
              <table className="w-full min-w-[46rem] border-collapse text-left">
                <caption className="caption-top border-b border-[#a8802f]/20 bg-[#faf4e8] px-5 py-4 text-left font-heading text-[0.9375rem] font-bold text-[#87661f] sm:px-6">
                  <span className="flex items-center gap-2.5">
                    <Icon name="calendar" className="h-4 w-4 shrink-0" />
                    {rich(chart.caption, STRONG.headingLight)}
                  </span>
                </caption>
                <thead>
                  <tr className="bg-[#faf4e8]">
                    {/* The class column is pinned so the row it labels is
                        still identifiable once the chart is scrolled. Its
                        rules are inset shadows, not borders: a collapsed
                        border belongs to the table, so it would scroll out
                        from under a sticky cell. */}
                    <th
                      scope="col"
                      className={`${TH} sticky left-0 z-10 bg-[#faf4e8] ${STICKY_EDGE}`}
                    >
                      {rich(chart.columns[0], STRONG.headingLight)}
                    </th>
                    {/* One heading, two date columns — hence colgroup. */}
                    <th
                      scope="colgroup"
                      colSpan={2}
                      className={`${TH} text-center`}
                    >
                      {rich(chart.columns[1], STRONG.headingLight)}
                    </th>
                    <th
                      scope="col"
                      className={`${TH} border-l border-[#a8802f]/20`}
                    >
                      {rich(chart.columns[2], STRONG.headingLight)}
                    </th>
                    <th scope="col" className={TH}>
                      {rich(chart.columns[3], STRONG.headingLight)}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {chart.rows.map((row, index) => {
                    /* The pinned cell paints above the row background, so it
                       carries its own opaque fill and hover tint — #fef7e9 is
                       the row's hover wash flattened onto the card. */
                    const tone = index % 2 ? "bg-[#fbf8f1]" : "bg-surface";
                    return (
                      <tr
                        key={row.cls}
                        className={`group border-t border-hairline transition-colors hover:bg-[#faf4e8]/70 ${tone}`}
                      >
                        <th
                          scope="row"
                          className={`sticky left-0 z-10 whitespace-nowrap px-5 py-4 text-left font-heading text-[0.9375rem] font-bold text-ink transition-colors group-hover:bg-[#fef7e9] sm:px-6 ${tone} ${STICKY_CELL}`}
                        >
                          {rich(row.cls)}
                        </th>
                        <td className={`${TD} text-center tabular-nums`}>
                          {rich(row.from)}
                        </td>
                        <td
                          className={`${TD} border-l border-dashed border-[#a8802f]/25 text-center tabular-nums`}
                        >
                          {rich(row.to)}
                        </td>
                        <td className={`${TD} border-l border-[#a8802f]/20`}>
                          {rich(row.age)}
                        </td>
                        <td className={`${TD} tabular-nums`}>{rich(row.asOn)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Reveal>
          {/* Transparency note: the asterisks belong to the source chart, which
              prints no footnote of its own — none is invented here. */}
          <Reveal delay={180}>
            <p className="mt-5 flex max-w-3xl items-start gap-3 text-[0.8125rem] leading-[1.7] text-text-muted">
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-pill bg-[#faf4e8] font-bold text-[#87661f]"
              >
                *
              </span>
              <span>
                Classes marked with an asterisk carry it exactly as printed in
                the school&rsquo;s official age chart.
              </span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ——— §4 FAQ Section — the document's five questions ——— */}
      <section className={`bg-bg ${SECTION}`}>
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
                <Photo
                  img={IMG.faqLibrary}
                  sizes="440px"
                  className="h-auto w-full"
                />
              </div>
            </div>
          </Reveal>
          <Reveal delay={110} className="lg:col-span-7">
            <Accordion items={faqEntries} defaultOpenId="faq-1" />
          </Reveal>
        </div>
      </section>

      {/* ——— §5 Call-To-Action — the document supplies no closing heading,
          so the band reuses its own line rather than inventing copy ——— */}
      <EnquiryBand
        image={IMG.ctaCampus}
        h2={hero.sub}
        formTitle={hero.cta}
      />
    </>
  );
}
