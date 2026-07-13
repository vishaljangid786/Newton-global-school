import Link from "next/link";
import Badge from "./Badge";
import Card from "./Card";
import PlaceholderImage from "./PlaceholderImage";
import { getBranchBySlug } from "@/data/branches";
import type { PlaceholderTone } from "@/data/types";
import type { PublicBlogCard } from "@/lib/blog";

function audienceLabel(ref: string): string {
  if (ref === "all") return "All Campuses";
  return getBranchBySlug(ref)?.name ?? ref;
}

/** "2026-07-13 10:30:00" (MySQL DATETIME) → "13 July 2026". */
function formatPublished(value: string | null): string {
  if (!value) return "";
  const iso = value.includes("T") ? value : value.replace(" ", "T");
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
}

export default function BlogCard({ post }: { post: PublicBlogCard }) {
  const href = `/blog/${post.slug}`;
  const published = formatPublished(post.published_at);
  return (
    <Card hoverLift className="flex h-full flex-col">
      <PlaceholderImage
        aspect="16/9"
        tone={post.cover_tone as PlaceholderTone}
        label="Blog"
      />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-3">
          {published ? (
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-text-muted">
              {published}
            </span>
          ) : null}
          <Badge>{audienceLabel(post.branch_ref)}</Badge>
        </div>
        <h3 className="mt-3 font-heading text-lg font-semibold leading-snug">
          <Link href={href} className="text-text transition-colors hover:text-primary">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm text-text-muted">
          {post.excerpt}
        </p>
        <div className="mt-auto pt-4">
          <Link
            href={href}
            className="text-sm font-semibold text-primary hover:underline"
          >
            Read more
            <span className="sr-only">: {post.title}</span>
            <span aria-hidden="true"> →</span>
          </Link>
        </div>
      </div>
    </Card>
  );
}
