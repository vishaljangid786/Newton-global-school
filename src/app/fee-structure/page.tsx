import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import Accordion, { type AccordionEntry } from "@/components/ui/Accordion";
import {
  CONTAINER,
  DoodleWash,
  Icon,
  type IconName,
  type Img,
  PageHero,
  Photo,
  rich,
  splitRunIn,
  SECTION,
  DataTable,
  SectionTitle,
} from "@/components/site/school-kit";
import EnquiryBand from "@/components/site/EnquiryBand";
import Reveal from "@/components/ui/Reveal";
import { feeStructure, feeTable } from "@/data/pages/fee-structure";

export const metadata: Metadata = {
  title: "Fee Structure",
  /* Drawn from the document's own sub-heading so the two cannot drift apart. */
  description: feeStructure.hero.sub,
};

/* ———————————————————————————————————————————————————————————————
 * Every string on this page comes from src/data/pages/fee-structure.ts,
 * which is machine-generated verbatim from "Newton Global School.docx"
 * (Fee Structure tab). `**…**` marks the phrases the document bolds and is
 * rendered through rich(); nothing here is reworded, reordered or dropped.
 * The only authored text is the section eyebrows and the image alt copy.
 * ——————————————————————————————————————————————————————————————— */
const { hero, overview, included, byClass, payment, faq, cta, links } =
  feeStructure;


const IMG = {
  heroBanner: {
    src: "/images/school/campus-grounds.webp",

    w: 1600,

    h: 900,

    alt: "The school building across its green grounds",
  },
  approachOffice: {
    src: "/images/school/reception.webp",

    w: 1600,

    h: 1200,

    alt: "The school reception desk and waiting area",
  },
  paymentDesk: {
    src: "/images/school/reception.webp",

    w: 1600,

    h: 1200,

    alt: "The school reception desk and waiting area",
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

/** §6 — the document's five fee questions, wired into the shared Accordion. */
const faqEntries: AccordionEntry[] = faq.items.map((item, index) => ({
  id: `faq-${index + 1}`,
  heading: <span className="font-bold">{item.q}</span>,
  content: <p className="text-[0.9375rem] leading-[1.75]">{rich(item.a)}</p>,
}));

/**
 * §8 — where each suggested link points. The document writes the label as a
 * bold run (sometimes several, pipe-separated); these are the routes it means.
 */
const LINK_ROUTES: Record<string, string> = {
  Home: "/",
  "About Us": "/about",
  Nursery: "/nursery",
  Primary: "/primary",
  Secondary: "/secondary",
  "Senior Secondary": "/senior-secondary",
  "Admission Process": "/admission-process",
  "Fee Structure": "/fee-structure",
  "Eligibility Criteria": "/eligibility-criteria",
};

/** §8 — one icon per suggestion, matching the page each one points at. */
const LINK_ICONS: readonly IconName[] = ["calendar", "shield", "book"];

/**
 * Render one internal-link suggestion. The source wraps each line in double
 * quotes to mark it as a suggestion, so those are stripped; everything else —
 * the pipes, the spacing, the trailing arrow — stays character-for-character.
 * The bold run carries the label(s), which become the clickable part.
 */
function LinkSuggestion({ text }: { text: string }) {
  const bare = text.replace(/^"/, "").replace(/"$/, "");
  return (
    <>
      {bare.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
        if (!part.startsWith("**") || !part.endsWith("**")) {
          return <Fragment key={index}>{part}</Fragment>;
        }
        /* A single bold run may hold several labels split by the doc's "|". */
        return part
          .slice(2, -2)
          .split(/(\s*\|\s*)/g)
          .map((token, tokenIndex) => {
            const href = LINK_ROUTES[token.replace(/[\s→]+$/u, "")];
            return href ? (
              <Link
                key={`${index}-${tokenIndex}`}
                href={href}
                className="font-bold text-[#87661f] underline-offset-4 transition-colors hover:underline"
              >
                {token}
              </Link>
            ) : (
              <Fragment key={`${index}-${tokenIndex}`}>{token}</Fragment>
            );
          });
      })}
    </>
  );
}

export default function FeeStructurePage() {
  return (
    <>
      {/* ——— §1 Banner Section — campus exterior under a navy wash ——— */}
      <PageHero
        image={IMG.heroBanner}
        priority
        crumbs={[{ label: "Fee Structure" }]}
        h1={hero.h1}
        sub={hero.sub}
        body={hero.body}
        cta={hero.cta}
        ctaHref="#enquiry"
      />

      {/* ——— §2 Our Approach to Fees — copy beside the admission office ——— */}
      <section className={`relative overflow-hidden bg-bg ${SECTION}`}>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-pill bg-[#faf4e8] opacity-70 blur-2xl"
        />
        <div
          className={`relative ${CONTAINER} grid items-center gap-12 md:grid-cols-2 lg:gap-14 xl:gap-16`}
        >
          <Reveal>
            <SectionTitle eyebrow="Our Approach" title={overview.h2} />
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
                  img={IMG.approachOffice}
                  sizes="(max-width: 768px) 92vw, (max-width: 1200px) 46vw, 540px"
                  className="h-auto w-full"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— §3 What Our Fees Generally Cover — pastel tiles, run-in titles ——— */}
      <section className={`relative overflow-hidden border-y border-hairline bg-bg-alt ${SECTION}`}>
        <DoodleWash className="text-[#000c2e] opacity-[0.045]" />
        <div className={CONTAINER}>
          <Reveal>
            <SectionTitle
              eyebrow="What's Covered"
              title={included.h2}
              align="center"
            />
            <p className="mx-auto mt-4 max-w-3xl text-center text-[0.9375rem] leading-[1.85] text-text-muted md:text-base">
              {rich(included.lede)}
            </p>
          </Reveal>
          {/* A table rather than twelve cards: the school asked for the fee
              page to read as tables throughout, and this is a two-column list
              of item and description, which is what a table is for. */}
          <Reveal delay={110}>
            <DataTable
              className="mx-auto mt-10 max-w-4xl lg:mt-12"
              head={["Included in the fee", "What it covers"]}
              rows={included.items.map((item) => {
                const { title, body } = splitRunIn(item);
                return [title || item, body];
              })}
            />
          </Reveal>
          <Reveal delay={180}>
            <p className="mx-auto mt-10 max-w-3xl text-center text-[0.9375rem] leading-[1.85] text-text-muted md:text-base">
              {rich(included.closing)}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ——— §4 Fees by Class — a gold-soft callout, because the point is
              that the numbers come from a person, not from this page ——— */}
      <section className={`bg-bg ${SECTION}`}>
        <div className={CONTAINER}>
          <Reveal>
            <SectionTitle
              eyebrow="Class-wise Fees"
              title={byClass.h2}
              align="center"
            />
          </Reveal>
          <Reveal delay={110}>
            <DataTable
              className="mx-auto mt-10 max-w-4xl lg:mt-12"
              head={feeTable.head}
              rows={feeTable.rows.map((row) => [
                row.cls,
                row.covers,
                row.amount || "Shared on enquiry",
              ])}
            />
          </Reveal>

          <Reveal delay={150}>
            <DataTable
              className="mx-auto mt-6 max-w-4xl"
              head={feeTable.separate.head}
              rows={feeTable.separate.rows.map((row) => [row.item, row.note])}
            />
          </Reveal>

          <Reveal delay={190}>
            <div className="mx-auto mt-8 max-w-4xl space-y-3">
              {byClass.body.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 32)}
                  className="text-[0.9375rem] leading-[1.85] text-text-muted"
                >
                  {rich(paragraph)}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— §5 How Fee Payment Works — notes list beside a desk photo ——— */}
      <section className={`border-y border-hairline bg-bg-alt ${SECTION}`}>
        <div
          className={`${CONTAINER} grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-14`}
        >
          <Reveal className="lg:col-span-5">
            <SectionTitle eyebrow="Payments" title={payment.h2} />
            <p className="mt-5 text-[0.9375rem] leading-[1.85] text-text-muted md:text-base">
              {rich(payment.lede)}
            </p>
            <div className="relative mt-8 hidden lg:block">
              <span
                aria-hidden="true"
                className="absolute -bottom-3 -left-3 h-full w-full rounded-[1.5rem] border-2 border-[#a8802f]/45"
              />
              <div className="relative overflow-hidden rounded-[1.5rem] shadow-frame">
                <Photo
                  img={IMG.paymentDesk}
                  sizes="440px"
                  className="h-auto w-full"
                />
              </div>
            </div>
          </Reveal>
          {/* min-w-0: this is a grid item, and a grid item will not shrink
              below its content unless told to — the fee table inside is 36rem
              wide by design and would otherwise drag the whole page sideways
              on a phone instead of scrolling inside its own box. */}
          <div className="min-w-0 lg:col-span-7">
            <Reveal delay={110}>
              <DataTable
                className="mt-8"
                head={["How payment works", "Detail"]}
                rows={payment.items.map((item) => {
                  const { title, body } = splitRunIn(item);
                  return [title || item, body];
                })}
              />
            </Reveal>
            <Reveal delay={270}>
              <p className="mt-6 text-[0.9375rem] leading-[1.85] text-text-muted md:text-base">
                {rich(payment.closing)}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ——— §6 Frequently Asked Questions About Fees ——— */}
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

      {/* ——— §7 Call-To-Action — the document names two contact actions; the
          first is now the form itself, and the second stays a link ——— */}
      <EnquiryBand
        image={IMG.ctaCampus}
        h2={cta.h2}
        body={cta.body}
        formTitle={cta.buttons[0]}
        formNote={cta.buttons[1]}
      />

      {/* ——— §8 Internal links — the document's own onward suggestions ——— */}
      <section className="border-t border-hairline bg-bg-alt py-10 sm:py-12 lg:py-14">
        <div className={CONTAINER}>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {links.map((suggestion, index) => (
              <li key={suggestion.slice(0, 24)}>
                <Reveal delay={index * 90} className="h-full">
                  <div className="flex h-full items-start gap-3 rounded-[1.25rem] border border-hairline bg-surface p-5 shadow-card">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-pill bg-[#faf4e8] text-[#87661f]"
                    >
                      <Icon
                        name={LINK_ICONS[index % LINK_ICONS.length]}
                        className="h-4 w-4"
                      />
                    </span>
                    <p className="break-words text-[0.9375rem] leading-[1.8] text-text-muted">
                      <LinkSuggestion text={suggestion} />
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
