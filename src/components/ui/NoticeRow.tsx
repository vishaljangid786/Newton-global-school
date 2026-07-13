import Badge from "./Badge";
import DateChip from "./DateChip";
import { isNoticeNew } from "@/data/notices";
import { branchLabel } from "@/lib/format";
import type { Notice } from "@/data/types";

interface NoticeRowProps {
  notice: Notice;
  /** Show a branch badge — for group-wide lists mixing branches. */
  showBranch?: boolean;
  className?: string;
}

/**
 * Notice row (F3, design.md §3.3): date chip left, title + excerpt right,
 * "New" badge when the notice is under 7 days old (evaluated at render time —
 * build time on static pages). Renders an h3 — place under an h2 section.
 */
export default function NoticeRow({
  notice,
  showBranch = false,
  className = "",
}: NoticeRowProps) {
  return (
    <article className={`flex gap-4 border-b border-border/70 py-4 ${className}`}>
      <DateChip date={notice.date} />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-heading text-base font-semibold text-text">
            {notice.title}
          </h3>
          {isNoticeNew(notice) ? <Badge>New</Badge> : null}
          {showBranch ? (
            <Badge variant="outline">{branchLabel(notice.branch)}</Badge>
          ) : null}
        </div>
        <p className="mt-1 text-sm text-text-muted">{notice.excerpt}</p>
      </div>
    </article>
  );
}
