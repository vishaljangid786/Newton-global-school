import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import BlogCard from "@/components/ui/BlogCard";
import { getBranchBySlugAsync } from "@/lib/branches-store";
import { getBranchBlogs } from "@/lib/blog";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const branch = await getBranchBySlugAsync(slug);
  if (!branch) return { title: "Campus Not Found" };
  return {
    title: `${branch.name} — Blog`,
    description: `Stories and updates from ${branch.name}.`,
  };
}

export default async function BranchBlogPage({ params }: PageProps) {
  const { slug } = await params;
  const branch = await getBranchBySlugAsync(slug);
  if (!branch) notFound();

  const posts = await getBranchBlogs(slug);

  return (
    <>
      <PageHero
        title={`${branch.name} Blog`}
        subtitle="Campus stories and updates, plus group-wide news from across Newton."
        breadcrumbs={[
          { label: "Branches", href: "/branches" },
          { label: branch.name, href: `/branches/${branch.slug}` },
          { label: "Blog" },
        ]}
      />
      <section className="bg-bg py-12 md:py-16">
        <div className="mx-auto max-w-content px-4">
          {posts.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border bg-bg-alt px-6 py-12 text-center text-sm text-text-muted">
              No posts for this campus yet. Please check back soon.
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
