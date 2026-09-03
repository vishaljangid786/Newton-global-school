import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import BlogCard from "@/components/ui/BlogCard";
import SectionHeading from "@/components/ui/SectionHeading";
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
        breadcrumbs={[{ label: "Blog" }]}
      />
      <section className="py-12 md:py-14">
        <div className="mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
          <div>
            <SectionHeading
              overline="Latest Posts"
              title="Stories from around Newton"
            />
            <p className="mt-5 max-w-3xl text-[0.9375rem] leading-[1.8] text-text-muted">
              Written by our teachers and campus teams — classroom ideas,
              event recaps and school news.
            </p>
          </div>
          {posts.length === 0 ? (
            <div className="mt-9 flex flex-col items-center gap-4 rounded-card border border-hairline bg-surface px-6 py-14 text-center shadow-card">
              <span className="flex h-12 w-12 items-center justify-center rounded-pill bg-primary-soft text-primary">
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
                </svg>
              </span>
              <p className="max-w-sm text-sm text-text-muted">
                No blog posts have been published yet. Our teachers are
                writing — please check back soon.
              </p>
            </div>
          ) : (
            <div className="mt-9 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
