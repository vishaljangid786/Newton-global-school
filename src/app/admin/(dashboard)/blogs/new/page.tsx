import { requireUser } from "@/lib/dal";
import { targetableBranchRefs } from "@/lib/rbac";
import { createBlog } from "@/lib/actions/blogs";
import { getAllBranches } from "@/lib/branches-store";
import { AdminCard, PageHeader } from "@/components/admin/ui";
import BlogForm from "../BlogForm";

export const metadata = { title: "New Blog Post" };

export default async function NewBlogPage() {
  const user = await requireUser();
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
      <PageHeader title="New blog post" description="Draft or publish a post." />
      <AdminCard>
        <BlogForm
          action={createBlog}
          audiences={audiences}
          initial={{
            title: "",
            branch_ref: audiences[0]?.value ?? "",
            excerpt: "",
            body: "",
            cover_tone: "primary",
          }}
        />
      </AdminCard>
    </div>
  );
}
