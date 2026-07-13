import type { Metadata } from "next";
import type { ReactNode } from "react";
import ButtonLink from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ContactForm from "@/components/forms/ContactForm";
import MapEmbed from "@/components/ui/MapEmbed";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { branches } from "@/data/branches";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${site.name}, Jaipur — head office address, phone and hours, campus contact pages and a general inquiry form.`,
};

/** Small icon tile used beside each head-office detail row. */
function DetailIcon({ children }: { children: ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-card bg-primary/10 text-primary"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        focusable="false"
      >
        {children}
      </svg>
    </span>
  );
}

export default function ContactPage() {
  return (
    <>
      {/* §4.9.1 — Page hero */}
      <PageHero
        title="Contact Us"
        subtitle="Questions about admissions, transport or anything in between — call, write or drop by. We answer every message within one working day."
        breadcrumbs={[{ label: "Contact" }]}
      />

      {/* §4.9.2 — Head office card + map embed */}
      <section className="bg-bg py-10 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <SectionHeading
            overline="Reach Us"
            title="Head Office"
            subtitle="Our head office in C-Scheme coordinates admissions, transport and administration for all three campuses."
          />
          <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-2">
            <Reveal className="h-full">
              <Card className="flex h-full flex-col p-6 md:p-8">
                <h3 className="font-heading text-xl font-semibold text-primary">
                  {site.name} — Head Office
                </h3>
                <dl className="mt-6 flex flex-col gap-5">
                  <div className="flex items-start gap-4">
                    <DetailIcon>
                      <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </DetailIcon>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                        Address
                      </dt>
                      <dd className="mt-1 text-sm leading-relaxed text-text">
                        {site.headOffice.address}
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <DetailIcon>
                      <path d="M6.5 3h3l1.5 4.5-2 1.5a12.5 12.5 0 0 0 6 6l1.5-2 4.5 1.5v3a2 2 0 0 1-2 2A16.5 16.5 0 0 1 4.5 5a2 2 0 0 1 2-2Z" />
                    </DetailIcon>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                        Phone
                      </dt>
                      <dd className="mt-1 text-sm text-text">
                        <a
                          href={`tel:${site.headOffice.phone}`}
                          className="font-semibold text-primary hover:underline"
                        >
                          {site.headOffice.phone}
                        </a>
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <DetailIcon>
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="m3 7 9 6 9-6" />
                    </DetailIcon>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                        Email
                      </dt>
                      <dd className="mt-1 text-sm text-text">
                        <a
                          href={`mailto:${site.headOffice.email}`}
                          className="font-semibold text-primary hover:underline"
                        >
                          {site.headOffice.email}
                        </a>
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <DetailIcon>
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 2" />
                    </DetailIcon>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                        Office Hours
                      </dt>
                      <dd className="mt-1 text-sm text-text">
                        {site.headOffice.officeHours}
                      </dd>
                    </div>
                  </div>
                </dl>
                <p className="mt-auto border-t border-border pt-5 text-sm text-text-muted">
                  Visiting a campus instead? Each campus office keeps the same
                  hours — find its details below.
                </p>
              </Card>
            </Reveal>
            <Reveal delay={100} className="h-full">
              <MapEmbed
                name={`${site.name} — Head Office`}
                address={site.headOffice.address}
                className="h-full"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* §4.9.3 — Branch contact quick-cards */}
      <section className="bg-bg-alt py-10 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <SectionHeading
            overline="Campus Contacts"
            title="Contact a Campus Directly"
            subtitle="For admissions visits, fee queries or day-to-day matters, the campus office is your fastest route."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {branches.map((branch, index) => (
              <Reveal key={branch.slug} delay={index * 100} className="h-full">
                <Card hoverLift className="flex h-full flex-col p-6">
                  <h3 className="font-heading text-lg font-semibold text-primary">
                    {branch.name}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-text-muted">
                    {branch.area}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-text">
                    {branch.address}
                  </p>
                  <p className="mt-3 text-sm text-text">
                    <a
                      href={`tel:${branch.phone}`}
                      className="whitespace-nowrap font-semibold text-primary hover:underline"
                    >
                      {branch.phone}
                    </a>
                  </p>
                  <p className="mt-1 break-words text-sm text-text">
                    <a
                      href={`mailto:${branch.email}`}
                      className="font-semibold text-primary hover:underline"
                    >
                      {branch.email}
                    </a>
                  </p>
                  <div className="mt-auto pt-6">
                    <ButtonLink
                      href={`/branches/${branch.slug}/contact`}
                      size="sm"
                    >
                      Campus Contact Page
                      <span className="sr-only">: {branch.name}</span>
                    </ButtonLink>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* §4.9.4 — General inquiry form */}
      <section className="bg-bg py-10 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <SectionHeading
            overline="Write to Us"
            title="Send Us a Message"
            subtitle="Not sure whom to ask? Send your message to the head office or any campus and our team will route it to the right desk."
          />
          <Reveal className="mx-auto mt-10 max-w-3xl">
            <Card className="p-6 md:p-8">
              <ContactForm />
            </Card>
            <p className="mt-6 text-center text-sm text-text-muted">
              Prefer to talk? Call the head office on{" "}
              <a
                href={`tel:${site.headOffice.phone}`}
                className="whitespace-nowrap font-semibold text-primary hover:underline"
              >
                {site.headOffice.phone}
              </a>
              , {site.headOffice.officeHours.toLowerCase()}.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
