import type { Metadata } from "next";
import Link from "next/link";
import Accordion from "@/components/ui/Accordion";
import Card from "@/components/ui/Card";
import InquiryForm from "@/components/forms/InquiryForm";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import Stepper, { type Step } from "@/components/ui/Stepper";
import { faqs } from "@/data/faqs";
import { site } from "@/data/site";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Admissions",
  description:
    "Admission process, eligibility, documents, key dates and FAQs for Newton Global School, Jaipur — send an inquiry for the 2026-27 session.",
};

/** §4.5.2 — the five-step admission process. */
const PROCESS_STEPS: Step[] = [
  {
    title: "Inquire",
    description:
      "Share your details through the inquiry form below or at any campus front office.",
  },
  {
    title: "Visit",
    description:
      "Tour the campus with our admissions team and see classrooms in action.",
  },
  {
    title: "Register",
    description:
      "Submit the registration form with documents to book an interaction slot.",
  },
  {
    title: "Assessment",
    description:
      "A play-based interaction up to Grade 1; a short written assessment from Grade 2.",
  },
  {
    title: "Confirm",
    description:
      "Accept the offer and pay the fee within 7 days to secure the seat.",
  },
];

/** §4.5.3 — eligibility criteria (ages as on 31 March 2026, per FAQ norms). */
const ELIGIBILITY = [
  "Nursery: 3 years or older as on 31 March 2026",
  "LKG / UKG: 4 years or older as on 31 March 2026",
  "Grade 1: 5 years or older as on 31 March 2026",
  "Grades 2-12: pass in the previous grade plus a short age-appropriate assessment",
  "Mid-session transfers: welcome subject to seat availability in the grade",
];

/** §4.5.3 — documents checklist. */
const DOCUMENTS = [
  "Birth certificate of the child",
  "Four passport-size photographs",
  "Aadhaar of the child and both parents",
  "Address proof (utility bill, rent agreement or passport)",
  "Previous school report card (Grade 1 and above)",
  "Transfer certificate (Grade 2 and above)",
];

/** §4.5.4 — key dates for the 2026-27 admission cycle. */
const KEY_DATES = [
  {
    milestone: "Inquiries & registrations open",
    date: formatDate("2025-12-01"),
    details: "Online inquiry form and all campus front offices",
  },
  {
    milestone: "Campus visit & interaction",
    date: "Within 10 working days of registration",
    details: "Play-based up to Grade 1; short assessment from Grade 2",
  },
  {
    milestone: "Admission decision",
    date: "Within 10 working days of the interaction",
    details: "Communicated by phone and email",
  },
  {
    milestone: "Seat confirmation & fee payment",
    date: "Within 7 days of the offer",
    details: "Payable online or at the school office",
  },
  {
    milestone: "Session 2026-27 begins",
    date: formatDate("2026-04-06"),
    details: "Orientation week for newly admitted families",
  },
  {
    milestone: "First admission window closes",
    date: formatDate("2026-08-31"),
    details: "Sibling and staff priority applies within this window",
  },
  {
    milestone: "Mid-session admissions close",
    date: formatDate("2026-11-30"),
    details: "Subject to seat availability in the grade",
  },
];

/** Small decorative check mark for the checklists. */
function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 20 20"
      fill="none"
      className="mt-1 h-4 w-4 shrink-0 text-success"
    >
      <path
        d="M4 10.5l4 4 8-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AdmissionsPage() {
  const telHref = `tel:${site.headOffice.phone.replace(/[^+\d]/g, "")}`;

  return (
    <>
      {/* §4.5.1 — page hero with Admissions Open badge */}
      <PageHero
        title="Admissions"
        badge={`Admissions Open ${site.admissionYear}`}
        subtitle="A simple, transparent five-step process — the same at all three of our Jaipur campuses."
        breadcrumbs={[{ label: "Admissions" }]}
      />

      {/* §4.5.2 — process stepper */}
      <section className="bg-bg py-10 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <Reveal>
            <SectionHeading
              overline="How it works"
              title="The Admission Process"
              subtitle="From your first inquiry to a confirmed seat in five clear steps."
            />
            <Stepper steps={PROCESS_STEPS} className="mt-10" />
          </Reveal>
        </div>
      </section>

      {/* §4.5.3 — eligibility & documents two-column checklist */}
      <section className="bg-bg-alt py-10 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <Reveal>
            <SectionHeading
              overline="Before you apply"
              title="Eligibility & Documents"
              subtitle="Check the age criteria for the grade and keep these documents ready — originals are returned after verification."
            />
          </Reveal>
          <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
            <Reveal>
              <Card className="h-full p-6">
                <h3 className="text-xl text-text">Age & Eligibility</h3>
                <ul className="mt-4 space-y-3">
                  {ELIGIBILITY.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-text">
                      <CheckIcon />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
            <Reveal delay={100}>
              <Card className="h-full p-6">
                <h3 className="text-xl text-text">Required Documents</h3>
                <ul className="mt-4 space-y-3">
                  {DOCUMENTS.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-text">
                      <CheckIcon />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>

      {/* §4.5.4 — key dates table */}
      <section className="bg-bg py-10 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <Reveal>
            <SectionHeading
              overline="Plan ahead"
              title={`Key Dates for ${site.admissionYear}`}
              subtitle="The same schedule applies at every campus; rolling admissions continue while seats remain."
            />
            <div className="mx-auto mt-10 max-w-4xl overflow-x-auto rounded-card border border-border">
              <table className="w-full min-w-[40rem] text-left text-sm">
                <caption className="sr-only">
                  Key admission dates for the {site.admissionYear} session
                </caption>
                <thead>
                  <tr className="border-b border-border bg-bg-alt">
                    <th
                      scope="col"
                      className="px-4 py-3 font-heading font-semibold text-text"
                    >
                      Milestone
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 font-heading font-semibold text-text"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 font-heading font-semibold text-text"
                    >
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {KEY_DATES.map((row) => (
                    <tr
                      key={row.milestone}
                      className="border-b border-border last:border-b-0"
                    >
                      <th
                        scope="row"
                        className="px-4 py-3 font-medium text-text"
                      >
                        {row.milestone}
                      </th>
                      <td className="whitespace-nowrap px-4 py-3 text-text">
                        {row.date}
                      </td>
                      <td className="px-4 py-3 text-text-muted">
                        {row.details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mx-auto mt-4 max-w-4xl text-sm text-text-muted">
              For grade-wise seat availability at a specific campus, visit the{" "}
              <Link
                href="/branches"
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                campus pages
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>

      {/* §4.5.5 — inquiry form (F2) */}
      <section id="inquiry" className="bg-bg-alt py-10 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <Reveal>
            <SectionHeading
              overline="Start here"
              title="Admission Inquiry Form"
              subtitle="Tell us a little about your child and our admissions team will call you within two working days."
            />
            <Card className="mx-auto mt-10 max-w-4xl p-6 md:p-8">
              <InquiryForm />
            </Card>
          </Reveal>
        </div>
      </section>

      {/* §4.5.6 — FAQ accordion */}
      <section className="bg-bg py-10 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <Reveal>
            <SectionHeading
              overline="Good to know"
              title="Frequently Asked Questions"
              subtitle="Answers to the questions parents ask us most during admissions."
            />
            <Accordion
              items={faqs.map((faq) => ({
                id: faq.q,
                heading: faq.q,
                content: <p>{faq.a}</p>,
              }))}
              className="mx-auto mt-8 max-w-3xl"
            />
          </Reveal>
        </div>
      </section>

      {/* §4.5.7 — contact strip */}
      <section className="bg-primary py-10 text-white md:py-14">
        <div className="mx-auto flex max-w-content flex-col items-start gap-6 px-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl md:text-[2rem] md:leading-tight">
              Prefer to talk?
            </h2>
            <p className="mt-2 max-w-xl text-sm text-white/80 md:text-base">
              Our admissions helpdesk is available {site.headOffice.officeHours}
              . We&apos;re happy to answer questions in Hindi or English.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <a
              href={telHref}
              className="inline-flex items-center justify-center gap-2 rounded-card bg-white px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-white/90"
            >
              Call {site.headOffice.phone}
            </a>
            <Link
              href="/contact"
              className="text-sm font-medium text-white underline decoration-white/50 underline-offset-4 transition-colors hover:decoration-white"
            >
              Or write to us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
