import ButtonLink from "./Button";
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
 * (design.md §4.1.2, §4.3): photo top, name, area, address, meta line,
 * "Visit Branch Page" button + "Get Directions" external link.
 */
export default function BranchCard({
  branch,
  tone = "primary",
  className = "",
}: BranchCardProps) {
  return (
    <Card hoverLift className={`flex h-full flex-col ${className}`}>
      <PlaceholderImage aspect="16/9" tone={tone} label={branch.name} />
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-heading text-xl font-semibold text-primary">
          {branch.name}
        </h3>
        <p className="mt-1 text-sm font-medium text-text-muted">{branch.area}</p>
        <p className="mt-3 text-sm text-text">{branch.address}</p>
        <p className="mt-2 text-sm text-text-muted">
          {branch.grades} · Est. {branch.established} ·{" "}
          <a href={`tel:${branch.phone}`} className="whitespace-nowrap hover:underline">
            {branch.phone}
          </a>
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-3 pt-5">
          <ButtonLink href={`/branches/${branch.slug}`} size="sm">
            Visit Branch Page
            <span className="sr-only">: {branch.name}</span>
          </ButtonLink>
          <a
            href={googleMapsUrl(branch.address)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-primary hover:underline"
          >
            Get Directions
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
