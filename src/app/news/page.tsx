import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import { events } from "@/data/events";
import { getAllNews } from "@/data/news";
import { getAllNotices } from "@/data/notices";
import type { PlaceholderTone } from "@/data/types";
import NewsFeed, { type FeedItem } from "./_components/NewsFeed";

export const metadata: Metadata = {
  title: "News & Events",
  description:
    "News, upcoming events and notices from Newton Global School's three Jaipur campuses — filter by type or campus to stay up to date.",
};

/** Placeholder tones cycled across news cards so grids look varied. */
const NEWS_TONES: PlaceholderTone[] = [
  "primary",
  "forest",
  "dusk",
  "accent",
  "stone",
  "mist",
];

/**
 * Aggregate news posts, events and notices into one typed feed, newest first
 * (design.md §4.6.3). Ties keep news → events → notices order (stable sort).
 */
function buildFeed(): FeedItem[] {
  const newsItems: FeedItem[] = getAllNews().map((post, index) => ({
    kind: "news",
    id: post.slug,
    date: post.date,
    branch: post.branch,
    post,
    tone: NEWS_TONES[index % NEWS_TONES.length],
  }));
  const eventItems: FeedItem[] = events.map((event) => ({
    kind: "event",
    id: event.id,
    date: event.date,
    branch: event.branch,
    event,
  }));
  const noticeItems: FeedItem[] = getAllNotices().map((notice) => ({
    kind: "notice",
    id: notice.id,
    date: notice.date,
    branch: notice.branch,
    notice,
  }));
  return [...newsItems, ...eventItems, ...noticeItems].sort((a, b) =>
    b.date.localeCompare(a.date)
  );
}

export default function NewsPage() {
  const feed = buildFeed();

  return (
    <>
      {/* §4.6.1 Page hero */}
      <PageHero
        title="News & Events"
        subtitle="Stories, achievements, notices and upcoming events from all three Newton campuses, in one place."
        breadcrumbs={[{ label: "News & Events" }]}
      />

      {/* §4.6.2–.4 Filter row + combined feed + load more */}
      <section className="bg-bg-alt py-10 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <SectionHeading
            overline="Stay Updated"
            title="The latest from our campuses"
            subtitle="Browse everything in one feed, or narrow it down by type and campus."
            align="left"
          />
          <div className="mt-8">
            <NewsFeed items={feed} />
          </div>
        </div>
      </section>
    </>
  );
}
