import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Badge from "@/components/ui/Badge";
import PageHero from "@/components/ui/PageHero";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { getAllNews, getNewsBySlug } from "@/data/news";
import type { BranchRef, PlaceholderTone } from "@/data/types";
import { branchLabel, formatDate } from "@/lib/format";

interface NewsDetailProps {
  params: Promise<{ slug: string }>;
}

/** Pre-render every news post at build time. Only news posts get detail pages. */
export function generateStaticParams() {
  return getAllNews().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: NewsDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getNewsBySlug(slug);
  if (!post) {
    return { title: "Story Not Found" };
  }
  return {
    title: post.title,
    description: post.excerpt,
  };
}

/** Hero placeholder tone per branch so posts look distinct but deterministic. */
const HERO_TONES: Record<BranchRef, PlaceholderTone> = {
  all: "primary",
  "city-center": "dusk",
  "green-valley": "forest",
  riverside: "stone",
};

export default async function NewsDetailPage({ params }: NewsDetailProps) {
  const { slug } = await params;
  const post = getNewsBySlug(slug);
  if (!post) notFound();

  return (
    <>
      {/* §4.6 detail: title (h1) + breadcrumbs */}
      <PageHero
        title={post.title}
        breadcrumbs={[
          { label: "News & Events", href: "/news" },
          { label: post.title },
        ]}
      />

      {/* §4.6 detail: date, branch badge, hero image, rich text, back link */}
      <section className="bg-bg py-10 md:py-16">
        <div className="mx-auto max-w-content px-4">
          <article className="mx-auto max-w-3xl">
            <div className="flex flex-wrap items-center gap-3 text-sm text-text-muted">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <Badge>{branchLabel(post.branch)}</Badge>
            </div>

            <div className="mt-6 overflow-hidden rounded-card shadow-card">
              <PlaceholderImage
                aspect="16/9"
                tone={HERO_TONES[post.branch]}
                label="School News"
              />
            </div>

            <div className="mt-8 space-y-5 text-base leading-relaxed text-text">
              {post.body.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-10 border-t border-border pt-6">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                <span aria-hidden="true">&larr;</span>
                Back to News &amp; Events
              </Link>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
