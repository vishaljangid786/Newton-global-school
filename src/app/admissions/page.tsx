import type { Metadata } from "next";
import Link from "next/link";
import {
  CARD,
  CONTAINER,
  DoodleWash,
  Cover,
  Wave,
  GoldLink,
  Icon,
  type IconName,
  type Img,
  PageHero,
  rich,
  SECTION,
  SectionTitle,
  STRONG,
  TINTS,
} from "@/components/site/school-kit";
import InquiryForm from "@/components/forms/InquiryForm";
import Reveal from "@/components/ui/Reveal";
import { admissionProcess } from "@/data/pages/admission-process";
import { eligibility } from "@/data/pages/eligibility";
import { feeStructure } from "@/data/pages/fee-structure";
import { hubs } from "@/data/pages/hubs";

export const metadata: Metadata = {
  title: "Admissions",
  description: hubs.admissionsBody.replace(/\*\*/g, ""),
};

/*
 * Hub for the three admission pages, plus the inquiry form. Every string is
 * document copy: the masthead is the Home tab's Admission CTA section and each
 * card carries that page's own H1 and sub-heading. The form's own labels come
 * from the InquiryForm component, which is unchanged.
 */

const IMG = {
  hero: {
    src: "/images/home/about-main-gate.webp",
    w: 853,
    h: 640,
    alt: "Young pupils in school uniform outside the school",
  },
  cta: {
    src: "/images/home/hero-campus.webp",
    w: 960,
    h: 540,
    alt: "Classroom of school children with their hands raised",
  },
} as const satisfies Record<string, Img>;

const SECTIONS: Array<{
  href: string;
  h1: string;
  sub: string;
  label: string;
  icon: IconName;
}> = [
  {
    href: "/admissions/process",
    h1: admissionProcess.hero.h1,
    sub: admissionProcess.hero.sub,
    label: "Admission Process",
    icon: "check",
  },
  {
    href: "/admissions/fees",
    h1: feeStructure.hero.h1,
    sub: feeStructure.hero.sub,
    label: "Fee Structure",
    icon: "chart",
  },
  {
    href: "/admissions/eligibility",
    h1: eligibility.hero.h1,
    sub: eligibility.hero.sub,
    label: "Eligibility Criteria",
    icon: "calendar",
  },
];

export default function AdmissionsPage() {
  return (
    <>
      <PageHero
        image={IMG.hero}
        priority
        crumbs={[{ label: "Admissions" }]}
        h1={hubs.admissionsH1}
        body={hubs.admissionsBody}
        cta={hubs.admissionsCta}
        ctaHref="#inquiry"
      />

      {/* ——— The three admission pages ——— */}
      <section className={SECTION}>
        <div className={CONTAINER}>
          <Reveal>
            <SectionTitle
              eyebrow="Admissions"
              title={hubs.admissionsH1}
              align="center"
            />
          </Reveal>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-6">
            {SECTIONS.map((item, index) => {
              const tint = TINTS[index % TINTS.length];
              return (
                <li key={item.href}>
                  <Reveal delay={index * 90} className="h-full">
                    <Link
                      href={item.href}
                      className={`group flex h-full flex-col p-6 sm:p-7 ${CARD} hover:border-[#a8802f]/45`}
                    >
                      <span
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.125rem] ${tint.well}`}
                      >
                        <Icon name={item.icon} className="h-6 w-6" />
                      </span>
                      <h2 className="mt-5 font-heading text-[1.0625rem] font-semibold leading-snug text-ink transition-colors group-hover:text-[#87661f]">
                        {rich(item.h1, STRONG.body)}
                      </h2>
                      <p className="mt-2.5 flex-1 text-[0.875rem] leading-[1.75] text-text-muted">
                        {rich(item.sub)}
                      </p>
                      <span
                        aria-hidden="true"
                        className="mt-4 text-sm font-bold text-[#87661f]"
                      >
                        {item.label} →
                      </span>
                    </Link>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ——— Inquiry form (unchanged feature, restyled shell) ——— */}
      <section id="inquiry"
        className={`relative overflow-hidden scroll-mt-24 border-y border-hairline bg-bg-alt ${SECTION}`}>
        <DoodleWash className="text-[#000c2e] opacity-[0.045]" />
        <div className={CONTAINER}>
          <Reveal>
            <SectionTitle
              eyebrow="Enquiry"
              title={hubs.admissionsCta}
              align="center"
            />
          </Reveal>
          <Reveal delay={110}>
            <div className="mx-auto mt-10 max-w-4xl rounded-[1.25rem] border border-hairline bg-surface p-5 shadow-card sm:p-7 lg:mt-12 lg:p-8">
              <InquiryForm />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— Closing band ——— */}
      <section className="relative flex min-h-[calc(100svh-4rem)] flex-col justify-center overflow-hidden bg-[#001344] pb-16 pt-20 text-center text-white sm:pb-20 sm:pt-24 lg:pb-24 lg:pt-28">
        <Wave className="z-20 text-bg-alt" />
        <Cover img={IMG.cta} sizes="100vw" decorative className="opacity-[0.28]" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(0,19,68,0.95),rgba(0,12,46,0.86))]"
        />
        <Reveal className={`relative ${CONTAINER}`}>
          <span
            aria-hidden="true"
            className="mx-auto block h-[3px] w-14 rounded-pill bg-[#d6a53f]"
          />
          <h2 className="mx-auto mt-6 max-w-3xl text-[1.5rem] leading-[1.2] text-white sm:text-[1.8rem] md:text-[2.1rem]">
            {rich(hubs.admissionsH1, STRONG.headingDark)}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[0.9375rem] leading-[1.8] text-[#c2cfe4] md:text-base">
            {rich(hubs.admissionsBody, STRONG.dark)}
          </p>
          <GoldLink href="/contact" className="mt-8 w-full sm:w-auto">
            {hubs.admissionsCta}
          </GoldLink>
        </Reveal>
      </section>
    </>
  );
}
