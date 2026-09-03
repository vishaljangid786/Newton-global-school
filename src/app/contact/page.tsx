import type { Metadata } from "next";
import type { ReactNode } from "react";
import Card from "@/components/ui/Card";
import ContactForm from "@/components/forms/ContactForm";
import MapEmbed from "@/components/ui/MapEmbed";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { getAllBranches } from "@/lib/branches-store";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${site.name}, Jaipur — head office address, phone and hours, campus contact pages and a general inquiry form.`,
};

// Includes published custom branches; falls back to built-ins when DB is offline.
export const dynamic = "force-dynamic";

/** Small icon tile used beside each head-office detail row. */
function DetailIcon({ children }: { children: ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-card bg-primary-soft text-primary"
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

export default async function ContactPage() {
  const branches = await getAllBranches();
  return (
    <>
      {/* §4.9.1 — Page hero */}
      <PageHero
        title="Contact Us"
        subtitle="Questions about admissions, transport or anything in between — call, write or drop by. We answer every message within one working day."
        breadcrumbs={[{ label: "Contact" }]}
      />

      {/* §4.9.2 — Head office card + map embed */}
      <section className="py-12 md:py-14">
        <div className="mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
          <SectionHeading
            overline="Reach Us"
            title="Head Office"
            subtitle="Our head office in C-Scheme coordinates admissions, transport and administration for all our campuses."
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

      {/* §4.9.3 — Campus directory: one hairline panel, numbered rows */}
      <section className="border-t border-hairline py-12 md:py-14">
        <div className="mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
          <SectionHeading
            overline="Campus Contacts"
            title="Contact a Campus Directly"
            subtitle="For admissions visits, fee queries or day-to-day matters, the campus office is your fastest route."
          />
          <Reveal className="mt-10">
            <div className="overflow-hidden rounded-card border border-hairline bg-surface shadow-card">
              {/* Column labels (desktop only) */}
              <div
                aria-hidden="true"
                className="hidden grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)_minmax(0,1fr)_3.75rem] gap-x-6 border-b border-hairline bg-bg-alt px-7 py-3 md:grid"
              >
                <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-faint">
                  Campus
                </span>
                <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-faint">
                  Address
                </span>
                <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-faint">
                  Phone &amp; Email
                </span>
                <span />
              </div>
              <ul className="divide-y divide-hairline">
                {branches.map((branch, index) => (
                  <li
                    key={branch.slug}
                    className="group relative flex flex-col gap-2.5 px-5 py-5 pr-16 transition-colors hover:bg-bg-alt md:grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)_minmax(0,1fr)_3.75rem] md:items-center md:gap-x-6 md:px-7 md:pr-7"
                  >
                    {/* Campus name + area */}
                    <div className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="pt-0.5 font-heading text-[0.8125rem] font-semibold text-accent"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-heading text-base font-semibold text-ink">
                          {branch.name}
                        </h3>
                        <p className="mt-1 flex items-center gap-1.5 text-[0.8125rem] font-medium text-primary">
                          <span
                            aria-hidden="true"
                            className="h-1.5 w-1.5 shrink-0 rounded-pill bg-accent"
                          />
                          {branch.area}
                        </p>
                      </div>
                    </div>

                    {/* Address */}
                    <p className="text-sm leading-relaxed text-text-muted md:pr-2">
                      {branch.address}
                    </p>

                    {/* Phone + email — kept above the stretched row link */}
                    <div className="relative z-10 min-w-0 text-sm">
                      <a
                        href={`tel:${branch.phone}`}
                        className="whitespace-nowrap font-semibold text-primary hover:underline"
                      >
                        {branch.phone}
                      </a>
                      <a
                        href={`mailto:${branch.email}`}
                        className="mt-0.5 block truncate font-medium text-text-muted hover:text-primary hover:underline"
                      >
                        {branch.email}
                      </a>
                    </div>

                    {/* Whole row links to the campus contact page */}
                    <a
                      href={`/branches/${branch.slug}/contact`}
                      className="absolute inset-0 md:static md:justify-self-end"
                      aria-label={`${branch.name} — campus contact page`}
                    >
                      <span
                        aria-hidden="true"
                        className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-pill border border-border bg-surface text-primary transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-white md:static"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          focusable="false"
                        >
                          <path d="M5 12h14m-6-6 6 6-6 6" />
                        </svg>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* §4.9.4 — General inquiry form */}
      <section className="border-t border-hairline py-12 md:py-14">
        <div className="mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
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
