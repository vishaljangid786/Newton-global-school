"use client";

import { useId, useMemo, useState } from "react";
import { buttonClasses } from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import EventCard from "@/components/ui/EventCard";
import NewsCard from "@/components/ui/NewsCard";
import NoticeRow from "@/components/ui/NoticeRow";
import { branches } from "@/data/branches";
import type {
  BranchRef,
  BranchSlug,
  NewsPost,
  Notice,
  PlaceholderTone,
  SchoolEvent,
} from "@/data/types";

/**
 * One entry in the combined news / events / notices feed (design.md §4.6).
 * The server page aggregates the three data modules into this shape, sorted
 * newest first; this component only filters and renders.
 */
export type FeedItem =
  | {
      kind: "news";
      id: string;
      date: string;
      branch: BranchRef;
      post: NewsPost;
      tone: PlaceholderTone;
    }
  | {
      kind: "event";
      id: string;
      date: string;
      branch: BranchRef;
      event: SchoolEvent;
    }
  | {
      kind: "notice";
      id: string;
      date: string;
      branch: BranchRef;
      notice: Notice;
    };

const TYPE_FILTERS = [
  { value: "all", label: "All" },
  { value: "news", label: "News" },
  { value: "event", label: "Events" },
  { value: "notice", label: "Notices" },
] as const;

type TypeFilter = (typeof TYPE_FILTERS)[number]["value"];

/** Items shown initially and added per "Load more" click (design.md §4.6.4). */
const PAGE_SIZE = 9;

interface NewsFeedProps {
  /** Pre-aggregated feed, sorted newest first by the server page. */
  items: FeedItem[];
}

function renderItem(item: FeedItem) {
  switch (item.kind) {
    case "news":
      return <NewsCard post={item.post} tone={item.tone} className="flex-1" />;
    case "event":
      return <EventCard event={item.event} className="flex-1" />;
    case "notice":
      return (
        <Card className="flex-1 px-6 py-2">
          <NoticeRow
            notice={item.notice}
            showBranch
            className="border-b-transparent"
          />
        </Card>
      );
  }
}

/**
 * Filter row + combined feed for /news (design.md §4.6.2–.4): type chips
 * (All | News | Events | Notices), campus dropdown, card grid newest first,
 * and a "Load more" button. Filtering happens entirely client-side.
 */
export default function NewsFeed({ items }: NewsFeedProps) {
  const branchSelectId = useId();
  const [type, setType] = useState<TypeFilter>("all");
  const [branchFilter, setBranchFilter] = useState<BranchSlug | "all">("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(
    () =>
      items.filter(
        (item) =>
          (type === "all" || item.kind === type) &&
          (branchFilter === "all" ||
            item.branch === branchFilter ||
            item.branch === "all")
      ),
    [items, type, branchFilter]
  );

  const visible = filtered.slice(0, visibleCount);

  const applyType = (value: TypeFilter) => {
    setType(value);
    setVisibleCount(PAGE_SIZE);
  };

  const applyBranch = (value: BranchSlug | "all") => {
    setBranchFilter(value);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <div>
      {/* Filter row — design.md §4.6.2 */}
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <div
          role="group"
          aria-label="Filter updates by type"
          className="flex flex-wrap gap-2"
        >
          {TYPE_FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              aria-pressed={type === filter.value}
              onClick={() => applyType(filter.value)}
              className={`rounded-pill px-4 py-1.5 text-sm transition-colors ${
                type === filter.value
                  ? "bg-accent font-semibold text-primary-dark"
                  : "border border-border bg-bg font-medium text-text hover:bg-border/40"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor={branchSelectId}
            className="text-sm font-medium text-text"
          >
            Campus
          </label>
          <select
            id={branchSelectId}
            value={branchFilter}
            onChange={(event) =>
              applyBranch(event.target.value as BranchSlug | "all")
            }
            className="rounded-card border border-border bg-bg px-3 py-2 text-sm text-text"
          >
            <option value="all">All campuses</option>
            {branches.map((branch) => (
              <option key={branch.slug} value={branch.slug}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p role="status" className="mt-4 text-sm text-text-muted">
        Showing {visible.length} of {filtered.length}{" "}
        {filtered.length === 1 ? "update" : "updates"}
      </p>

      {/* Feed grid — design.md §4.6.3, cards 3-up → 2-up → 1-up (§3) */}
      {filtered.length === 0 ? (
        <p className="mt-4 rounded-card bg-bg px-6 py-10 text-center text-sm text-text-muted shadow-card">
          No updates match these filters yet. Try a different type or campus.
        </p>
      ) : (
        <ul className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <li key={`${item.kind}-${item.id}`} className="flex flex-col">
              {renderItem(item)}
            </li>
          ))}
        </ul>
      )}

      {/* Load more — design.md §4.6.4 */}
      {filtered.length > visibleCount ? (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            className={buttonClasses("outline")}
          >
            Load more updates
          </button>
        </div>
      ) : null}
    </div>
  );
}
