import type { Metadata } from "next";
import Link from "next/link";
import ButtonLink from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import MapEmbed from "@/components/ui/MapEmbed";
import PageHero from "@/components/ui/PageHero";
import Image from "next/image";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { getAllBranches } from "@/lib/branches-store";
import { site } from "@/data/site";
import { googleMapsUrl } from "@/lib/format";
import type { PlaceholderTone } from "@/data/types";

export const metadata: Metadata = {
  title: "Our Campuses",
  description: `Find your nearest ${site.name} campus in Jaipur: addresses, grades offered, key facilities and directions.`,
};

// Includes published custom branches; falls back to built-ins when DB is offline.
export const dynamic = "force-dynamic";

/** Vary placeholder gradients so the campus cards look distinct. */
const CARD_TONES: PlaceholderTone[] = ["primary", "forest", "dusk", "mist", "stone"];

/** How many facilities to preview in the comparison table. */
const FACILITY_PREVIEW_COUNT = 5;

export default async function BranchesPage() {
  const branches = await getAllBranches();
  return (
    <>
      {/* §4.3.1 — Page hero */}
      <PageHero
        title="Our Campuses"
        subtitle={`${branches.length} campuses across Jaipur, one shared promise: a safe, joyful school where every child is known by name.`}
        breadcrumbs={[{ label: "Branches" }]}
      />

      {/* §4.3.3 — One large card per branch */}
      <section className="bg-bg py-10 md:py-16">
        <div className="mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
          <SectionHeading
            overline="Find Your Campus"
            title="Choose the Newton Campus Nearest You"
            subtitle="Every campus follows the same curriculum, teacher training and safety standards — pick the one closest to home."
          />
          <div className="mt-10 flex flex-col gap-8">
            {branches.map((branch, index) => (
              <Reveal key={branch.slug} delay={index * 100}>
                <Card className="grid md:grid-cols-5">
                  <div className="relative min-h-52 sm:min-h-64 md:col-span-2 md:min-h-0">
                    {branch.heroImageUrl ? (
                      <Image
                        src={branch.heroImageUrl}
                        alt={branch.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 40vw"
                        className="img-skeleton object-cover"
                      />
                    ) : (
                    <PlaceholderImage
                        fill
                        tone={CARD_TONES[index % CARD_TONES.length]}
                        label={branch.name}
                      />
                    )}
                  </div>
                  <div className="flex flex-col p-6 md:col-span-3 md:p-8">
                    <h3 className="font-heading text-2xl font-semibold text-primary">
                      {branch.name}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-text-muted">
                      {branch.area}
                    </p>
                    <p className="mt-3 text-sm text-text">{branch.address}</p>
                    {/* Four columns only from lg. `sm` is 30rem in this theme,
                        so `sm:grid-cols-4` split the card into four ~80px
                        tracks from 480px up — and "Established", one 12px
                        uppercase word with letter-spacing, needs 84px. It had
                        nowhere to wrap and was clipped by its own box. */}
                    <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 lg:grid-cols-4">
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                          Grades Offered
                        </dt>
                        <dd className="mt-1 text-sm font-semibold text-text">
                          {branch.grades}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                          Established
                        </dt>
                        <dd className="mt-1 text-sm font-semibold text-text">
                          {branch.established}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                          Students
                        </dt>
                        <dd className="mt-1 text-sm font-semibold text-text">
                          {branch.quickFacts.students.toLocaleString("en-IN")}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                          Campus Size
                        </dt>
                        <dd className="mt-1 text-sm font-semibold text-text">
                          {branch.quickFacts.campusSize}
                        </dd>
                      </div>
                    </dl>
                    <p className="mt-4 text-sm text-text-muted">
                      Call{" "}
                      <a
                        href={`tel:${branch.phone}`}
                        className="whitespace-nowrap font-semibold text-primary hover:underline"
                      >
                        {branch.phone}
                      </a>{" "}
                      or write to{" "}
                      <a
                        href={`mailto:${branch.email}`}
                        className="font-semibold text-primary hover:underline"
                      >
                        {branch.email}
                      </a>
                    </p>
                    <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-3 pt-6">
                      <ButtonLink href={`/branches/${branch.slug}`}>
                        Visit Branch Page
                        <span className="sr-only">: {branch.name}</span>
                      </ButtonLink>
                      <ButtonLink
                        href={googleMapsUrl(branch.address)}
                        variant="outline"
                        external
                      >
                        Get Directions
                        <span className="sr-only"> to {branch.name}</span>
                      </ButtonLink>
                    </div>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* §4.3.4 — Comparison table */}
      <section className="bg-bg-alt py-10 md:py-16">
        <div className="mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
          <SectionHeading
            overline="At a Glance"
            title="Compare Our Campuses"
            subtitle="Grades offered and key facilities, side by side. Scroll the table sideways on smaller screens."
          />
          <Reveal className="mt-10">
            <div className="relative overflow-x-auto rounded-card border border-hairline bg-surface shadow-card">
              <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                <caption className="sr-only">
                  Comparison of {site.name} campuses by grades offered and key
                  facilities
                </caption>
                <thead>
                  <tr className="border-b border-border bg-bg-alt">
                    <th
                      scope="col"
                      className="px-4 py-3.5 font-heading text-xs font-semibold uppercase tracking-wide text-text"
                    >
                      Campus
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3.5 font-heading text-xs font-semibold uppercase tracking-wide text-text"
                    >
                      Grades Offered
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3.5 font-heading text-xs font-semibold uppercase tracking-wide text-text"
                    >
                      Key Facilities
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {branches.map((branch) => (
                    <tr
                      key={branch.slug}
                      className="border-b border-border align-top last:border-b-0"
                    >
                      <th scope="row" className="px-4 py-4 font-normal">
                        <Link
                          href={`/branches/${branch.slug}`}
                          className="font-heading text-base font-semibold text-primary hover:underline"
                        >
                          {branch.name}
                        </Link>
                        <span className="mt-1 block text-xs text-text-muted">
                          {branch.area} · Est. {branch.established}
                        </span>
                      </th>
                      <td className="px-4 py-4 font-medium text-text">
                        {branch.grades}
                      </td>
                      <td className="px-4 py-4">
                        <ul className="list-disc space-y-1 pl-4 text-text">
                          {branch.facilities
                            .slice(0, FACILITY_PREVIEW_COUNT)
                            .map((facility) => (
                              <li key={facility}>{facility}</li>
                            ))}
                        </ul>
                        {branch.facilities.length > FACILITY_PREVIEW_COUNT ? (
                          <Link
                            href={`/branches/${branch.slug}/facilities`}
                            className="mt-2 inline-block text-sm font-semibold text-primary hover:underline"
                          >
                            +{branch.facilities.length - FACILITY_PREVIEW_COUNT}{" "}
                            more facilities
                            <span className="sr-only"> at {branch.name}</span>
                          </Link>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* §4.3.2 — Campus locations (MapEmbed panels in place of a combined map) */}
      <section className="bg-bg py-10 md:py-16">
        <div className="mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
          <SectionHeading
            overline="Locations"
            title="Find Us Across Jaipur"
            subtitle="Open any campus in Google Maps for turn-by-turn directions from your neighbourhood."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {branches.map((branch, index) => (
              <Reveal key={branch.slug} delay={index * 100}>
                <MapEmbed name={branch.name} address={branch.address} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
