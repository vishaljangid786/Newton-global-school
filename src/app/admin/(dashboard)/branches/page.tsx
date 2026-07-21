import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/dal";
import { canManageBranch } from "@/lib/rbac";
import { getAllBranches } from "@/lib/branches-store";
import { tryQuery } from "@/lib/db";
import {
  AdminCard,
  EmptyState,
  PageHeader,
  StatusBadge,
  adminButtonPrimary,
} from "@/components/admin/ui";
import BranchRowActions from "./BranchRowActions";

export const metadata = { title: "Branches" };

interface BranchListRow {
  slug: string;
  name: string;
  area: string;
  status: "draft" | "published";
}

/**
 * Unified Branches section: campus records (add/edit/publish/delete — super
 * admin) and public-page content editing live together. Branch admins are
 * taken straight to their own campus's content editor.
 */
export default async function BranchesPage() {
  const user = await requireUser();
  const superAdmin = user.role === "super_admin";

  if (!superAdmin) {
    const all = await getAllBranches({ includeUnpublished: true });
    const editable = all.filter((b) => canManageBranch(user, b.slug));

    if (editable.length === 0) {
      return (
        <div className="space-y-6">
          <PageHeader title="Branches" />
          <EmptyState>You don&apos;t have a branch assigned to edit.</EmptyState>
        </div>
      );
    }

    // One campus → skip the list, land on its content editor.
    if (editable.length === 1) {
      redirect(`/admin/branches/${editable[0].slug}/content`);
    }

    return (
      <div className="space-y-8">
        <PageHeader
          title="Branches"
          description="Pick a campus to edit its public page content."
        />
        <div className="space-y-3">
          {editable.map((b) => (
            <AdminCard key={b.slug}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-heading text-base text-text">{b.name}</h3>
                  <p className="mt-1 text-xs text-text-muted">
                    {b.area} · /branches/{b.slug}
                  </p>
                </div>
                <BranchRowActions slug={b.slug} canManage={false} />
              </div>
            </AdminCard>
          ))}
        </div>
      </div>
    );
  }

  const all = await tryQuery<BranchListRow>(
    `SELECT slug, name, area, status FROM branches ORDER BY established, created_at`
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Branches"
        description="Manage campuses and their public page content. New branches stay drafts until you publish them."
        action={
          <Link href="/admin/branches/new" className={adminButtonPrimary}>
            Add branch
          </Link>
        }
      />

      {all.length === 0 ? (
        <EmptyState>
          No branches yet. Run <code>npm run db:seed</code> to load the founding
          campuses, or click “Add branch”.
        </EmptyState>
      ) : (
        <div className="space-y-3">
          {all.map((b) => (
            <AdminCard key={b.slug}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-heading text-base text-text">
                      {b.name}
                    </h3>
                    <StatusBadge
                      tone={b.status === "published" ? "published" : "draft"}
                    >
                      {b.status}
                    </StatusBadge>
                  </div>
                  <p className="mt-1 text-xs text-text-muted">
                    {b.area} · /branches/{b.slug}
                  </p>
                </div>
                <BranchRowActions slug={b.slug} status={b.status} canManage />
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
}
