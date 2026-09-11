import type { Metadata } from "next";
import type { ReactNode } from "react";
import Accordion from "@/components/ui/Accordion";
import Badge from "@/components/ui/Badge";
import ButtonLink from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import CareerForm from "@/components/forms/CareerForm";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { branches } from "@/data/branches";
import { careers } from "@/data/careers";
import { site } from "@/data/site";
import { branchLabel } from "@/lib/format";

export const metadata: Metadata = {
  title: "Careers",
  /* Was "Newton Global School, Jaipur — … across our three campuses": the
     template's city and the template's campus count, printed as this page's
     search-result snippet. */
  description:
    "Teaching and staff careers at Newton Global School, Sangteda, Kotputli — browse open positions and apply online.",
};

/** §4.8.2 — why work here: three benefit cards. */
const BENEFITS: Array<{
  title: string;
  body: string;
  icon: "growth" | "community" | "care";
}> = [
  {
    title: "Grow as an Educator",
    body:
      "Funded workshops every term, board-curriculum trainings and classroom mentoring — with a clear path from teacher to coordinator and academic leadership across our campuses.",
    icon: "growth",
  },
  {
    title: "A Staffroom That Has Your Back",
    body:
      "Shared planning periods, co-teaching in the early grades and leaders who observe to coach, not to catch out. New joiners get a buddy teacher for their whole first year.",
    icon: "community",
  },
  {
    title: "Benefits Beyond the Payslip",
    body:
      "Fee concession for staff children, seats on school transport routes, medical cover for you and your family, and a genuine summer break after result week.",
    icon: "care",
  },
];

/** Decorative icons for the benefit cards (aria-hidden). */
function BenefitIcon({ icon }: { icon: "growth" | "community" | "care" }) {
  const paths: Record<typeof icon, ReactNode> = {
    growth: (
      <>
        <path d="M4 20h16" strokeLinecap="round" />
        <path d="M6 16l4-5 3 3 5-7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 7h4v4" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    community: (
      <>
        <circle cx="8.5" cy="9" r="2.5" />
        <circle cx="15.5" cy="9" r="2.5" />
        <path d="M3.5 18c.6-2.6 2.6-4 5-4s4.4 1.4 5 4" strokeLinecap="round" />
        <path d="M14.5 14.3c2 .3 3.5 1.6 4 3.7" strokeLinecap="round" />
      </>
    ),
    care: (
      <>
        <path
          d="M12 20s-7-4.4-7-9.5A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.5C19 15.6 12 20 12 20z"
          strokeLinejoin="round"
        />
      </>
    ),
  };
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-12 w-12 items-center justify-center rounded-pill bg-primary/10 text-primary"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
        focusable="false"
      >
        {paths[icon]}
      </svg>
    </span>
  );
}

export default function CareersPage() {
  return (
    <>
      {/* §4.8.1 — page hero */}
      <PageHero
        title="Teach With Us"
        badge="Now Hiring"
        subtitle={`Join the team behind ${branches.length} campuses and more than 3,000 students across Jaipur — passionate educators and warm, organised support staff.`}
        breadcrumbs={[{ label: "Careers" }]}
      />

      {/* §4.8.2 — why work here: 3 benefit cards */}
      <section className="bg-bg py-10 md:py-16">
        <div className="mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
          <Reveal>
            <SectionHeading
              overline="Why work here"
              title="Why Teach at Newton?"
              subtitle={`Since ${site.established} we have grown by looking after the people who look after our students. Here is what our teachers say keeps them with us.`}
            />
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((benefit, index) => (
              <Reveal key={benefit.title} delay={index * 100}>
                <Card className="h-full p-6">
                  <BenefitIcon icon={benefit.icon} />
                  <h3 className="mt-4 text-xl text-text">{benefit.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-muted">
                    {benefit.body}
                  </p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* §4.8.3 — open positions accordion */}
      <section className="bg-bg-alt py-10 md:py-16">
        <div className="mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
          <Reveal>
            <SectionHeading
              overline="Open positions"
              title="Current Openings"
              subtitle={`${careers.length} roles are open for the ${site.admissionYear} session. Select a role to see the details, then apply using the form below.`}
            />
            <Accordion
              className="mx-auto mt-8 max-w-3xl"
              items={careers.map((position) => ({
                id: position.id,
                heading: (
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pr-2">
                    <span>{position.title}</span>
                    <span className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">
                        {branchLabel(position.branch)}
                      </Badge>
                      <Badge variant="outline">{position.type}</Badge>
                    </span>
                  </span>
                ),
                content: (
                  <div className="space-y-4">
                    <p>{position.description}</p>
                    <div>
                      <h4 className="font-heading text-sm font-semibold text-text">
                        What we&apos;re looking for
                      </h4>
                      <ul className="mt-2 list-disc space-y-1.5 pl-5">
                        {position.requirements.map((requirement) => (
                          <li key={requirement}>{requirement}</li>
                        ))}
                      </ul>
                    </div>
                    <p className="text-xs">
                      Note: shortlisted candidates are invited for a demo class
                      (teaching roles) or a working interview at the campus.
                      Select this position in the application form below to
                      apply.
                    </p>
                    <ButtonLink href="#apply" size="sm">
                      Apply for this role
                    </ButtonLink>
                  </div>
                ),
              }))}
            />
            <p className="mx-auto mt-6 max-w-3xl text-sm text-text-muted">
              Don&apos;t see the right role? We&apos;re always glad to meet
              good educators — email your resume to{" "}
              <a
                href={`mailto:${site.headOffice.email}`}
                className="font-medium text-primary underline underline-offset-2"
              >
                {site.headOffice.email}
              </a>{" "}
              and we&apos;ll keep it on file for the next opening.
            </p>
          </Reveal>
        </div>
      </section>

      {/* §4.8.4 — application form */}
      <section id="apply" className="scroll-mt-24 bg-bg py-10 md:py-16">
        <div className="mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
          <Reveal>
            <SectionHeading
              overline="Apply now"
              title="Application Form"
              subtitle="Tell us about yourself and your preferred campus — our HR team reviews every application and replies within five working days."
            />
            <Card className="mx-auto mt-10 max-w-4xl p-6 md:p-8">
              <CareerForm />
            </Card>
          </Reveal>
        </div>
      </section>
    </>
  );
}
