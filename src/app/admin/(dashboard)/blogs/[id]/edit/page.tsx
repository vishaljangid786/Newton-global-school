import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/dal";
import { query } from "@/lib/db";
import { canManageBranch, targetableBranchRefs } from "@/lib/rbac";
import { updateBlog } from "@/lib/actions/blogs";
import { getAllBranches } from "@/lib/branches-store";
import { AdminCard, PageHeader } from "@/components/admin/ui";
import type { BlogPostRow, BranchRef } from "@/lib/admin-types";
import BlogForm from "../../BlogForm";

export const metadata = { title: "Edit Blog Post" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPage({ params }: PageProps) {
  const user = await requireUser();
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) notFound();

  const rows = await query<BlogPostRow>(
    "SELECT * FROM blog_posts WHERE id = ? LIMIT 1",
    [numericId]
  );
  const post = rows[0];
  if (!post) notFound();
  if (!canManageBranch(user, post.branch_ref as BranchRef)) {
    redirect("/admin/blogs?denied=1");
  }

  const all = await getAllBranches({ includeUnpublished: true });
  const audiences = targetableBranchRefs(
    user,
    all.map((b) => b.slug)
  ).map((ref) => ({
    value: ref,
    label:
      ref === "all"
        ? "Group blog (all campuses)"
        : (all.find((b) => b.slug === ref)?.name ?? ref),
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit blog post"
        description={`Status: ${post.status}`}
      />
      <AdminCard>
        <BlogForm
          action={updateBlog}
          audiences={audiences}
          initial={{
            id: post.id,
            title: post.title,
            branch_ref: post.branch_ref,
            excerpt: post.excerpt,
            body: post.body,
            cover_tone: post.cover_tone,
          }}
        />
      </AdminCard>
    </div>
  );
}
