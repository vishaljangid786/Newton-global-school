import Link from "next/link";
import Card from "./Card";
import PlaceholderImage from "./PlaceholderImage";
import { googleMapsUrl } from "@/lib/format";
import type { Branch, PlaceholderTone } from "@/data/types";

interface BranchCardProps {
  branch: Branch;
  /** Vary across grid items so placeholders look distinct. */
  tone?: PlaceholderTone;
  className?: string;
}

/**
 * Branch card for the home selector strip and /branches listing
 * (design.md §4.1.2, §4.3): photo top, Est. micro-label, name, blue-dot
 * area line, address, meta line, then a hairline-topped footer row with
 * "Visit Branch Page →" and a quiet "Directions" link.
 */
export default function BranchCard({
  branch,
  tone = "primary",
  className = "",
}: BranchCardProps) {
  return (
    <Card hoverLift className={`group flex h-full flex-col ${className}`}>
      <div className="h-[10.625rem] overflow-hidden">
        <PlaceholderImage
          fill={false}
          aspect="16/9"
          tone={tone}
          label={branch.name}
          className="h-full transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-faint">
          Est. {branch.established}
        </p>
        <h3 className="mt-1.5 font-heading text-xl font-semibold text-ink">
          {branch.name}
        </h3>
        <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-primary">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-pill bg-accent"
          />
          {branch.area}
        </p>
        <p className="mt-2.5 text-sm leading-normal text-text-muted">
          {branch.address}
        </p>
        <p className="mt-1.5 text-[0.8125rem] text-faint">
          {branch.grades} ·{" "}
          <a href={`tel:${branch.phone}`} className="whitespace-nowrap hover:underline">
            {branch.phone}
          </a>
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#f0f3f7] pt-4">
          <Link
            href={`/branches/${branch.slug}`}
            className="text-[0.84375rem] font-semibold text-primary hover:text-primary-dark"
          >
            Visit Branch Page
            <span className="sr-only">: {branch.name}</span>
            <span aria-hidden="true"> →</span>
          </Link>
          <a
            href={googleMapsUrl(branch.address)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[0.84375rem] font-medium text-faint transition-colors hover:text-text"
          >
            Directions
            <span className="sr-only">
              {" "}
              to {branch.name} (opens in a new tab)
            </span>
          </a>
        </div>
      </div>
    </Card>
  );
}
