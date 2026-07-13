import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Card from "@/components/ui/Card";
import ContactForm from "@/components/forms/ContactForm";
import MapEmbed from "@/components/ui/MapEmbed";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { getBranchBySlugAsync } from "@/lib/branches-store";
import { site } from "@/data/site";

interface BranchPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BranchPageProps): Promise<Metadata> {
  const { slug } = await params;
  const branch = await getBranchBySlugAsync(slug);
  if (!branch) return { title: "Campus Not Found" };
  return {
    title: `Contact | ${branch.name}`,
    description: `Address, phone, email and office hours for ${branch.name}, ${branch.area} — write to the campus office or plan your visit.`,
  };
}

interface DetailRow {
  label: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export default async function BranchContactPage({ params }: BranchPageProps) {
  const { slug } = await params;
  const branch = await getBranchBySlugAsync(slug);
  if (!branch) notFound();

  const detailRows: DetailRow[] = [
    {
      label: "Address",
      icon: (
        <>
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </>
      ),
      content: <p>{branch.address}</p>,
    },
    {
      label: "Phone",
      icon: (
        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.5 2.9.7a2 2 0 0 1 1.6 2Z" />
      ),
      content: (
        <a
          href={`tel:${branch.phone}`}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          {branch.phone}
        </a>
      ),
    },
    {
      label: "Email",
      icon: (
        <>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-10 6L2 7" />
        </>
      ),
      content: (
        <a
          href={`mailto:${branch.email}`}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          {branch.email}
        </a>
      ),
    },
    {
      label: "Office hours",
      icon: (
        <>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </>
      ),
      content: <p>{site.headOffice.officeHours}</p>,
    },
    {
      label: "Transport",
      icon: (
        <>
          <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
          <path d="M4 11h16" />
          <circle cx="8" cy="18" r="1.6" />
          <circle cx="16" cy="18" r="1.6" />
        </>
      ),
      content: (
        <p>
          GPS-tracked buses with trained attendants serve most of Jaipur. Route
          charts and stop timings for the {branch.area} area are available from
          the campus front office.
        </p>
      ),
    },
  ];

  return (
    <>
      {/* §5.9 — page hero */}
      <PageHero
        title={`Contact ${branch.name}`}
        subtitle={`We are happy to help with admissions, transport and everything in between — call, write or visit us at ${branch.area}.`}
        breadcrumbs={[
          { label: "Branches", href: "/branches" },
          { label: branch.name, href: `/branches/${branch.slug}` },
          { label: "Contact" },
        ]}
      />

      {/* §5.9 — two-column: contact details card + contact form */}
      <section className="bg-bg py-10 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <Reveal>
            <SectionHeading
              overline="Get in touch"
              title="Reach the Campus Office"
              subtitle={`The ${branch.name} office responds to messages within one working day.`}
            />
            <div className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-2">
              <Card className="p-6 md:p-8">
                <h3 className="text-xl text-text">Campus office details</h3>
                <dl className="mt-6 space-y-5">
                  {detailRows.map((row) => (
                    <div key={row.label} className="flex gap-4">
                      <dt className="shrink-0">
                        <span
                          aria-hidden="true"
                          className="flex h-10 w-10 items-center justify-center rounded-card bg-primary/10 text-primary"
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
                            {row.icon}
                          </svg>
                        </span>
                        <span className="sr-only">{row.label}</span>
                      </dt>
                      <dd className="text-sm leading-relaxed text-text-muted">
                        <span className="mb-0.5 block font-heading text-sm font-semibold text-text">
                          {row.label}
                        </span>
                        {row.content}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Card>
              <Card className="p-6 md:p-8">
                <h3 className="text-xl text-text">Send us a message</h3>
                <ContactForm fixedBranch={branch.slug} className="mt-6" />
              </Card>
            </div>
          </Reveal>
        </div>
      </section>

      {/* §5.9 — full-width map embed */}
      <section className="bg-bg-alt py-10 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <Reveal>
            <SectionHeading
              overline="Plan your visit"
              title="Find Us"
              subtitle={`${branch.name} is located at ${branch.area}, with visitor parking beside the main gate.`}
            />
            <MapEmbed
              name={branch.name}
              address={branch.address}
              className="mx-auto mt-10 max-w-5xl"
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
