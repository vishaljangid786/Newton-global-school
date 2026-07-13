import Badge from "./Badge";
import Card from "./Card";
import PlaceholderImage from "./PlaceholderImage";
import { initials } from "@/lib/format";
import type { FacultyMember, PlaceholderTone } from "@/data/types";

interface FacultyCardProps {
  member: FacultyMember;
  /** Vary across grid items so placeholders look distinct. */
  tone?: PlaceholderTone;
  /**
   * Larger horizontal layout for the principal feature card (design.md §5.4);
   * also shows the department badge.
   */
  featured?: boolean;
  className?: string;
}

/**
 * Faculty card (F6, design.md §5.4): 1:1 portrait placeholder, name,
 * designation, qualification. Renders an h3 — place under an h2 section.
 */
export default function FacultyCard({
  member,
  tone = "mist",
  featured = false,
  className = "",
}: FacultyCardProps) {
  const portraitLabel = initials(member.name);

  if (featured) {
    return (
      <Card
        className={`flex flex-col items-center gap-6 p-6 text-center md:flex-row md:p-8 md:text-left ${className}`}
      >
        <div className="w-32 shrink-0 overflow-hidden rounded-pill md:w-40">
          <PlaceholderImage aspect="1/1" tone={tone} label={portraitLabel} />
        </div>
        <div>
          <Badge variant="outline">{member.department}</Badge>
          <h3 className="mt-2 font-heading text-xl font-semibold text-text">
            {member.name}
          </h3>
          <p className="mt-1 text-sm font-medium text-primary">
            {member.designation}
          </p>
          <p className="mt-1 text-sm text-text-muted">{member.qualification}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`h-full p-6 text-center ${className}`}>
      <div className="mx-auto w-24 overflow-hidden rounded-pill">
        <PlaceholderImage aspect="1/1" tone={tone} label={portraitLabel} />
      </div>
      <h3 className="mt-4 font-heading text-base font-semibold text-text">
        {member.name}
      </h3>
      <p className="mt-0.5 text-sm font-medium text-primary">
        {member.designation}
      </p>
      <p className="mt-1 text-xs text-text-muted">{member.qualification}</p>
    </Card>
  );
}
