import Link from "next/link";
import { requireUser } from "@/lib/dal";
import { tryQuery } from "@/lib/db";
import { branchScopeFilter } from "@/lib/rbac";
import {
  AdminCard,
  EmptyState,
  PageHeader,
  StatusBadge,
  adminButtonPrimary,
} from "@/components/admin/ui";
import { getBranchBySlug } from "@/data/branches";
import type { BlogPostRow } from "@/lib/admin-types";
import BlogRowActions from "./BlogRowActions";

export const metadata = { title: "Blogs" };

function audienceLabel(ref: string): string {
  if (ref === "all") return "Group";
  return getBranchBySlug(ref)?.name ?? ref;
}

export default async function BlogsPage() {
  const user = await requireUser();
  const scope = branchScopeFilter(user, "branch_ref", true);

  const rows = await tryQuery<BlogPostRow>(
    `SELECT id, slug, title, branch_ref, status, author_name, published_at, updated_at
     FROM blog_posts WHERE ${scope.clause}
     ORDER BY updated_at DESC LIMIT 200`,
    scope.params
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blogs"
        description="Branch and group-wide posts. Drafts are hidden from the public site."
        action={
          <Link href="/admin/blogs/new" className={adminButtonPrimary}>
            New post
          </Link>
        }
      />

      {rows.length === 0 ? (
        <EmptyState>No posts yet. Create your first one.</EmptyState>
      ) : (
        <div className="space-y-3">
          {rows.map((p) => {
            const canEdit =
              user.role === "super_admin" || p.branch_ref === user.branchSlug;
            return (
              <AdminCard key={p.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-heading text-base text-text">
                        {p.title}
                      </h3>
                      <StatusBadge tone={p.status}>{p.status}</StatusBadge>
                      <StatusBadge tone="neutral">
                        {audienceLabel(p.branch_ref)}
                      </StatusBadge>
                    </div>
                    <p className="mt-1 text-xs text-text-muted">
                      by {p.author_name} ·{" "}
                      {p.status === "published" && p.published_at
                        ? `published ${new Date(p.published_at).toLocaleDateString("en-IN")}`
                        : `updated ${new Date(p.updated_at).toLocaleDateString("en-IN")}`}
                      {p.status === "published" ? (
                        <>
                          {" · "}
                          <Link
                            href={`/blog/${p.slug}`}
                            target="_blank"
                            className="text-primary hover:underline"
                          >
                            view
                          </Link>
                        </>
                      ) : null}
                    </p>
                  </div>
                  {canEdit ? (
                    <BlogRowActions id={p.id} status={p.status} />
                  ) : (
                    <span className="text-xs text-text-muted">Read-only</span>
                  )}
                </div>
              </AdminCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
