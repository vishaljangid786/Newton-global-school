"use client";

import { useId, useState } from "react";
import { initials } from "@/lib/format";

/**
 * Branch testimonials (client): role tabs — Students / Parents / Teachers —
 * over a grid of quote cards. Data comes from the server page (DB-backed);
 * roles with no quotes are hidden, and the section is skipped entirely by the
 * server when there is nothing to show.
 */

export interface BranchTestimonial {
  id: number;
  author_name: string;
  role_detail: string;
  quote: string;
}

export type RoleKey = "student" | "parent" | "teacher";

const ROLE_TABS: Array<{ key: RoleKey; label: string }> = [
  { key: "student", label: "Students" },
  { key: "parent", label: "Parents" },
  { key: "teacher", label: "Teachers" },
];

export default function BranchTestimonials({
  groups,
}: {
  groups: Record<RoleKey, BranchTestimonial[]>;
}) {
  const baseId = useId();
  const tabs = ROLE_TABS.filter((tab) => groups[tab.key].length > 0);
  const [active, setActive] = useState<RoleKey>(tabs[0]?.key ?? "parent");

  if (tabs.length === 0) return null;

  const current = groups[active] ?? [];

  return (
    <div>
      {/* Role tabs */}
      <div
        role="tablist"
        aria-label="Testimonials by role"
        className="flex flex-wrap gap-2"
      >
        {tabs.map((tab) => {
          const selected = tab.key === active;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tab.key}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${tab.key}`}
              onClick={() => setActive(tab.key)}
              className={`rounded-pill px-4 py-2 text-sm transition-colors ${
                selected
                  ? "bg-primary font-semibold text-white"
                  : "border border-border bg-surface font-medium text-text-muted hover:border-primary/40 hover:text-primary"
              }`}
            >
              {tab.label}
              <span
                className={`ml-1.5 text-xs ${selected ? "text-white/70" : "text-faint"}`}
              >
                {groups[tab.key].length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Quote cards */}
      <div
        role="tabpanel"
        id={`${baseId}-panel-${active}`}
        aria-labelledby={`${baseId}-tab-${active}`}
        className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
      >
        {current.map((t) => (
          <figure
            key={t.id}
            className="flex h-full flex-col rounded-card border border-hairline bg-surface p-6 shadow-card"
          >
            <div
              aria-hidden="true"
              className="font-heading text-4xl leading-[0.6] text-[#c6d2f0]"
            >
              &ldquo;
            </div>
            <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-text">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3 border-t border-[#f0f3f7] pt-4">
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.625rem] bg-[image:var(--gradient-brand)] font-heading text-sm font-semibold text-white"
              >
                {initials(t.author_name)}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-ink">
                  {t.author_name}
                </span>
                {t.role_detail ? (
                  <span className="block truncate text-xs text-faint">
                    {t.role_detail}
                  </span>
                ) : null}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
