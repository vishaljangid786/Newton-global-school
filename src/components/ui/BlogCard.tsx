import Link from "next/link";
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
    <Card hoverLift className="group flex h-full flex-col">
      <div className="overflow-hidden">
        <PlaceholderImage
          aspect="16/9"
          tone={post.cover_tone as PlaceholderTone}
          label="Blog"
          className="transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-faint">
          {published ? (
            <>
              <span className="font-medium">{published}</span>
              <span aria-hidden="true" className="text-[#c3cbd8]">
                ·
              </span>
            </>
          ) : null}
          <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.04em] text-primary">
            {audienceLabel(post.branch_ref)}
          </span>
        </div>
        <h3 className="mt-2.5 font-heading text-lg font-semibold leading-snug">
          <Link href={href} className="text-ink transition-colors hover:text-primary">
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
