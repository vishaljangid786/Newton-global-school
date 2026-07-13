import Badge from "./Badge";
import Card from "./Card";
import DateChip from "./DateChip";
import { branchLabel } from "@/lib/format";
import type { SchoolEvent } from "@/data/types";

interface EventCardProps {
  event: SchoolEvent;
  className?: string;
}

/**
 * Event card (F4, design.md §5.8): date chip left; branch + category badges,
 * title and description right. Renders an h3 — place under an h2 section.
 */
export default function EventCard({ event, className = "" }: EventCardProps) {
  return (
    <Card className={`flex gap-4 p-6 ${className}`}>
      <DateChip date={event.date} showYear />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{branchLabel(event.branch)}</Badge>
          <Badge variant="outline">{event.category}</Badge>
        </div>
        <h3 className="mt-2 font-heading text-base font-semibold text-text">
          {event.title}
        </h3>
        <p className="mt-1 text-sm text-text-muted">{event.description}</p>
      </div>
    </Card>
  );
}
