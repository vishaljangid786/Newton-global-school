import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import { getPublishedBlogBySlug } from "@/lib/blog";
import { getBranchBySlug } from "@/data/branches";
import { site } from "@/data/site";
import type { PlaceholderTone } from "@/data/types";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function audienceLabel(ref: string): string {
  if (ref === "all") return "All Campuses";
  return getBranchBySlug(ref)?.name ?? ref;
}

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

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPublishedBlogBySlug(slug);
  if (!post) notFound();

  // Legacy plain-text posts (no HTML tags) → wrap their paragraphs; rich-text
  // posts are already sanitised HTML stored by the editor.
  const isHtml = /<[a-z][\s\S]*>/i.test(post.body);
  const bodyHtml = isHtml
    ? post.body
    : post.body
        .split(/\n{2,}/)
        .map((p) => `<p>${p.trim()}</p>`)
        .join("");
  const published = formatPublished(post.published_at);

  return (
    <>
      <PageHero
        title={post.title}
        badge={audienceLabel(post.branch_ref)}
        breadcrumbs={[{ label: "Blog", href: "/blog" }, { label: post.title }]}
      />
      <article className="bg-bg py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-4">
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-text-muted">
            {published ? `${published} · ` : ""}by {post.author_name}
          </p>

          <div className="mt-6 overflow-hidden rounded-card shadow-card">
            <PlaceholderImage
              aspect="16/9"
              tone={post.cover_tone as PlaceholderTone}
              label="Newton Blog"
            />
          </div>

          <div
            className="admin-prose mt-8 text-base leading-relaxed text-text"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />

          <p className="mt-10 border-t border-hairline pt-6 text-sm text-text-muted">
            Published on the {site.name} blog.
          </p>
        </div>
      </article>
    </>
  );
}
