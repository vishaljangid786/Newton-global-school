import Link from "next/link";
import Badge from "./Badge";
import Card from "./Card";
import PlaceholderImage from "./PlaceholderImage";
import { branchLabel, formatDate } from "@/lib/format";
import type { NewsPost, PlaceholderTone } from "@/data/types";

interface NewsCardProps {
  post: NewsPost;
  /** Vary across grid items so placeholders look distinct. */
  tone?: PlaceholderTone;
  className?: string;
}

/**
 * News card (design.md §4.1.6, §4.6): image, date, branch badge, linked
 * title, excerpt, read-more link. Renders an h3 — place under an h2 section.
 */
export default function NewsCard({
  post,
  tone = "primary",
  className = "",
}: NewsCardProps) {
  const href = `/news/${post.slug}`;
  return (
    <Card hoverLift className={`flex h-full flex-col ${className}`}>
      <PlaceholderImage aspect="16/9" tone={tone} label="School News" />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-3">
          <time
            dateTime={post.date}
            className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-text-muted"
          >
            {formatDate(post.date)}
          </time>
          <Badge>{branchLabel(post.branch)}</Badge>
        </div>
        <h3 className="mt-3 font-heading text-lg font-semibold leading-snug">
          <Link href={href} className="text-text transition-colors hover:text-primary">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm text-text-muted">{post.excerpt}</p>
        <div className="mt-auto pt-4">
          <Link href={href} className="text-sm font-semibold text-primary hover:underline">
            Read more
            <span className="sr-only">: {post.title}</span>
            <span aria-hidden="true"> →</span>
          </Link>
        </div>
      </div>
    </Card>
  );
}
