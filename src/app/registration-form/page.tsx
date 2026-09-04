import type { Metadata } from "next";
import RegistrationForm from "@/components/forms/RegistrationForm";
import Link from "next/link";
import {
  CARD,
  CONTAINER,
  type Img,
  Icon,
  type IconName,
  PageHero,
  rich,
  SECTION,
  SectionTitle,
  STRONG,
  TINTS,
} from "@/components/site/school-kit";
import Reveal from "@/components/ui/Reveal";
import { admissionProcess } from "@/data/pages/admission-process";
import { eligibility } from "@/data/pages/eligibility";
import { feeStructure } from "@/data/pages/fee-structure";
import { hubs } from "@/data/pages/hubs";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Registration Form",
  description: `Register your child for admission at ${site.name}, Sangteda, Kotputli. Fill the form and our admissions team will call you.`,
};

/*
 * This page absorbed the /admissions hub when that page was removed. The
 * masthead and the three cards below are the hub's own content — the Home
 * tab's Admission CTA copy, and one card per admission page carrying that
 * page's H1 and sub-heading — so nothing the document specifies was lost with
 * the route.
 */
const SECTIONS: Array<{
  href: string;
  h1: string;
  sub: string;
  label: string;
  icon: IconName;
}> = [
  {
    href: "/admission-process",
    h1: admissionProcess.hero.h1,
    sub: admissionProcess.hero.sub,
    label: "Admission Process",
    icon: "check",
  },
  {
    href: "/fee-structure",
    h1: feeStructure.hero.h1,
    sub: feeStructure.hero.sub,
    label: "Fee Structure",
    icon: "chart",
  },
  {
    href: "/eligibility-criteria",
    h1: eligibility.hero.h1,
    sub: eligibility.hero.sub,
    label: "Eligibility Criteria",
    icon: "calendar",
  },
];

const IMG = {
  heroBanner: {
    src: "/images/school/parents-with-pupils.webp",
    w: 1448,
    h: 1086,
    alt: "Parents with four Newton Global School pupils in uniform",
  },
} as const satisfies Record<string, Img>;

const STEPS = [
  "Fill in the student and parent details below.",
  "Our admissions team calls you within two working days.",
  "Visit the campus, meet the teachers and complete the formalities.",
] as const;

export default function RegistrationFormPage() {
  return (
    <>
      <PageHero
        image={IMG.heroBanner}
        priority
        crumbs={[{ label: "Registration Form" }]}
        h1={hubs.admissionsH1}
        sub={`Registration Form`}
        body={hubs.admissionsBody}
        cta={hubs.admissionsCta}
        ctaHref="#register"
      />

      {/* ——— The three admission pages, from the old hub ——— */}
      <section className={`border-b border-hairline bg-bg-alt ${SECTION} !py-16 sm:!py-20`}>
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

      <section id="register" className={`scroll-mt-24 bg-bg ${SECTION}`}>
        <div className={CONTAINER}>
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-14">
            <aside className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
              <Reveal>
                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.09em] text-[#87661f]">
                  What happens next
                </p>
                <ol className="mt-5 space-y-5">
                  {STEPS.map((step, index) => (
                    <li key={step} className="flex gap-3.5">
                      <span
                        aria-hidden="true"
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-pill bg-[#001344] font-heading text-[0.8125rem] font-bold text-white"
                      >
                        {index + 1}
                      </span>
                      <span className="text-[0.9375rem] leading-[1.7] text-text-muted">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
                <div className="mt-8 rounded-[1.25rem] border border-[#a8802f]/25 bg-[#faf4e8] p-5">
                  <p className="flex items-start gap-2.5 text-[0.875rem] leading-[1.7] text-text-muted">
                    <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-[#87661f]" />
                    Prefer to talk first? Call{" "}
                    <a href={`tel:${site.headOffice.phone}`} className="font-bold text-[#87661f]">
                      {site.headOffice.phone}
                    </a>
                  </p>
                </div>
              </Reveal>
            </aside>

            <div className="min-w-0">
              <Reveal>
                <SectionTitle eyebrow="Register" title={`Student Registration`} />
                <p className="mt-4 max-w-2xl text-[0.9375rem] leading-[1.8] text-text-muted">
                  Fill in the details below to register your child. There is
                  nothing to pay at this stage — this simply tells our
                  admissions team you are interested.
                </p>
              </Reveal>
              <Reveal delay={110}>
                <div className="mt-8 rounded-[1.5rem] border border-hairline bg-surface p-6 shadow-card sm:p-8">
                  <RegistrationForm />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
