import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import EventCard from "@/components/ui/EventCard";
import NoticeRow from "@/components/ui/NoticeRow";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import NoticesEventsTabs from "./_components/NoticesEventsTabs";
import { getBranchBySlugAsync } from "@/lib/branches-store";
import { getPastEvents, getUpcomingEvents } from "@/data/events";
import { getNoticesForBranch } from "@/data/notices";
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
    title: `Notices & Events | ${branch.name}`,
    description: `Latest notices, circulars and upcoming events at ${branch.name}, ${site.name}, ${branch.area}.`,
  };
}

/**
 * Branch notices & events — design.md §5.8: tabbed Notices (rows, newest
 * first) | Events (upcoming then past, event cards with date chips).
 */
export default async function BranchNoticesPage({ params }: BranchPageProps) {
  const { slug } = await params;
  const branch = await getBranchBySlugAsync(slug);
  if (!branch) notFound();

  const branchNotices = getNoticesForBranch(branch.slug);
  const upcoming = getUpcomingEvents(branch.slug);
  const past = getPastEvents(branch.slug);

  const noticesPanel =
    branchNotices.length > 0 ? (
      <div>
        {branchNotices.map((notice) => (
          <NoticeRow key={notice.id} notice={notice} />
        ))}
      </div>
    ) : (
      <p className="rounded-card bg-bg-alt px-6 py-10 text-center text-sm text-text-muted">
        No notices yet — please check back soon.
      </p>
    );

  const eventsPanel = (
    <div className="space-y-10">
      <div>
        <h3 className="text-lg text-text md:text-xl">Upcoming Events</h3>
        {upcoming.length > 0 ? (
          <div className="mt-4 grid gap-4">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-card bg-bg-alt px-6 py-10 text-center text-sm text-text-muted">
            No upcoming events right now — please check back soon.
          </p>
        )}
      </div>
      <div>
        <h3 className="text-lg text-text md:text-xl">Past Events</h3>
        {past.length > 0 ? (
          <div className="mt-4 grid gap-4">
            {past.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-card bg-bg-alt px-6 py-10 text-center text-sm text-text-muted">
            No past events to show yet.
          </p>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* §5.8 — page hero */}
      <PageHero
        title={`Notices & Events — ${branch.name}`}
        subtitle={`Campus circulars and the event calendar for ${branch.name}, including group-wide announcements from ${site.name}.`}
        breadcrumbs={[
          { label: "Branches", href: "/branches" },
          { label: branch.name, href: `/branches/${branch.slug}` },
          { label: "Notices & Events" },
        ]}
      />

      {/* §5.8 — tabbed Notices | Events */}
      <section className="bg-bg py-10 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <Reveal>
            <SectionHeading
              overline="Stay updated"
              title="Campus Noticeboard"
              subtitle="Switch between written notices and the events calendar — new items appear here first."
            />
            <NoticesEventsTabs
              noticesPanel={noticesPanel}
              eventsPanel={eventsPanel}
              className="mx-auto mt-10 max-w-4xl"
            />
          </Reveal>
        </div>
      </section>

      {/* Cross-link to group-wide news */}
      <section className="bg-bg-alt py-10 md:py-14">
        <div className="mx-auto max-w-content px-4 text-center">
          <h2 className="text-2xl text-text md:text-[2rem] md:leading-tight">
            Looking for stories and photos?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-text-muted md:text-base">
            Longer reads — results, awards and campus milestones from across the
            group — live on our news page.
          </p>
          <p className="mt-5">
            <Link
              href="/news"
              className="text-sm font-semibold text-primary underline-offset-2 hover:underline"
            >
              Read school news &rarr;
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
