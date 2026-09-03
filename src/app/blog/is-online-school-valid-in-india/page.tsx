import type { Metadata } from "next";
import {
  CONTAINER,
  Cover,
  GoldLink,
  type Img,
  rich,
  SECTION,
  STRONG,
  Wave,
} from "@/components/site/school-kit";
import Reveal from "@/components/ui/Reveal";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { onlineSchoolArticle } from "@/data/pages/online-school";

/* The document writes headings as bold runs; strip the markers for metadata. */
const plain = (s: string) => s.replace(/\*\*/g, "");
const h1 = onlineSchoolArticle.find((b) => b.kind === "h1");
const intro = onlineSchoolArticle.find((b) => b.kind === "p");

export const metadata: Metadata = {
  title: h1 && "text" in h1 ? plain(h1.text) : "Is Online School Valid in India?",
  description:
    intro && "text" in intro ? plain(intro.text).slice(0, 155) : undefined,
};

const IMG = {
  banner: {
    src: "/images/school/computer-lab-students.webp",
    w: 1600,
    h: 1200,
    alt: "Pupils working at computers in the school lab",
  },
} as const satisfies Record<string, Img>;

/* ———————————————————————————————————————————————————————————————
 * Every block on this page comes from src/data/pages/online-school.ts, which
 * is machine-generated verbatim from "Newton Global School.docx" and kept in
 * the document's own order — headings, paragraphs, list items and both
 * tables. Nothing here is reworded, reordered or dropped.
 * ——————————————————————————————————————————————————————————————— */
export default function OnlineSchoolValidityPage() {
  /* Consecutive list items are gathered so they render as one real <ul>. */
  const blocks = onlineSchoolArticle;

  return (
    <>
      {/* ——— Banner ——— */}
      <section className="relative flex flex-col justify-center overflow-hidden bg-[#001344] pb-16 pt-24 text-white sm:pb-20 sm:pt-28 lg:pb-24 lg:pt-32">
        <Wave className="z-20 text-bg" />
        <Cover img={IMG.banner} sizes="100vw" decorative className="opacity-[0.2]" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(0,19,68,0.96),rgba(0,12,46,0.85))]"
        />
        <div className={`relative ${CONTAINER} max-w-4xl`}>
          <Breadcrumbs
            items={[{ label: "Blog", href: "/blog" }, { label: "Online School Validity" }]}
            className="mb-5"
            tone="dark"
          />
          <span
            aria-hidden="true"
            className="block h-[3px] w-16 rounded-pill bg-[#d6a53f]"
          />
          {h1 && "text" in h1 ? (
            <h1 className="mt-6 text-[clamp(1.5rem,1.1rem+1.6vw,2.4rem)] leading-[1.22] text-white">
              {rich(h1.text, STRONG.headingDark)}
            </h1>
          ) : null}
        </div>
      </section>

      {/* ——— The article, in the document's own order ——— */}
      <section className={`bg-bg ${SECTION}`}>
        <article className={`${CONTAINER} max-w-3xl`}>
          {blocks.map((block, index) => {
            if (block.kind === "h1") return null;

            if (block.kind === "table") {
              return (
                <Reveal key={`t-${index}`}>
                  {/* Wide tables scroll inside their own box, never the page. */}
                  <div className="my-8 overflow-x-auto rounded-[1.125rem] border border-hairline shadow-card">
                    <table className="w-full min-w-[34rem] border-collapse text-left text-[0.875rem]">
                      <thead>
                        <tr className="bg-[#001344] text-white">
                          {block.rows[0]?.map((cell) => (
                            <th
                              key={cell}
                              scope="col"
                              className="px-4 py-3 font-bold leading-snug"
                            >
                              {rich(cell, STRONG.headingDark)}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {block.rows.slice(1).map((row, r) => (
                          <tr
                            key={row.join("|").slice(0, 48)}
                            className={r % 2 ? "bg-bg-alt" : "bg-surface"}
                          >
                            {row.map((cell, c) => (
                              <td
                                key={`${c}-${cell.slice(0, 24)}`}
                                className="border-t border-hairline px-4 py-3 align-top leading-[1.7] text-text-muted"
                              >
                                {rich(cell)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Reveal>
              );
            }

            if (block.kind === "h2") {
              return (
                <Reveal key={`h2-${index}`}>
                  <h2 className="mt-12 text-[clamp(1.15rem,1rem+0.6vw,1.6rem)] leading-[1.3] text-ink">
                    {rich(block.text, "font-bold text-[#154a8a]")}
                  </h2>
                  <span
                    aria-hidden="true"
                    className="mt-3 block h-[2px] w-12 rounded-pill bg-[#a8802f]"
                  />
                </Reveal>
              );
            }

            if (block.kind === "h3") {
              return (
                <Reveal key={`h3-${index}`}>
                  <h3 className="mt-9 text-[1.05rem] font-bold leading-snug text-ink">
                    {rich(block.text, "font-bold text-[#87661f]")}
                  </h3>
                </Reveal>
              );
            }

            if (block.kind === "li") {
              return (
                <Reveal key={`li-${index}`}>
                  <div className="mt-3 flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-pill bg-[#a8802f]"
                    />
                    <p className="text-[0.9375rem] leading-[1.9] text-text-muted">
                      {rich(block.text, STRONG.runIn)}
                    </p>
                  </div>
                </Reveal>
              );
            }

            return (
              <Reveal key={`p-${index}`}>
                <p className="mt-5 text-[0.9375rem] leading-[1.95] text-text-muted md:text-base">
                  {rich(block.text)}
                </p>
              </Reveal>
            );
          })}

          <Reveal>
            <div className="mt-12 rounded-[1.25rem] border border-[#a8802f]/25 bg-[#faf4e8] p-6 text-center sm:p-8">
              <GoldLink href="/admissions" className="w-full sm:w-auto">
                Enquire Now / Book a Visit
              </GoldLink>
            </div>
          </Reveal>
        </article>
      </section>
    </>
  );
}
