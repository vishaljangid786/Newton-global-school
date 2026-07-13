import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import BlogCard from "@/components/ui/BlogCard";
import { getPublishedBlogs } from "@/lib/blog";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Blog",
  description: `News, stories and updates from across ${site.name}.`,
};

// Reads published posts from the DB; falls back to an empty list when offline.
export const dynamic = "force-dynamic";

export default async function BlogIndexPage() {
  const posts = await getPublishedBlogs();

  return (
    <>
      <PageHero
        title="From the Newton Blog"
        subtitle="Stories, updates and reflections from our campuses and the wider school community."
        badge="Blog"
        breadcrumbs={[{ label: "Blog" }]}
      />
      <section className="bg-bg py-12 md:py-16">
        <div className="mx-auto max-w-content px-4">
          {posts.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border bg-bg-alt px-6 py-12 text-center text-sm text-text-muted">
              No blog posts have been published yet. Please check back soon.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
