import Link from "next/link";
import { requireSuperAdmin } from "@/lib/dal";
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

export default async function BranchesManagerPage() {
  await requireSuperAdmin();

  const all = await tryQuery<BranchListRow>(
    `SELECT slug, name, area, status FROM branches ORDER BY established, created_at`
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Branches"
        description="Add, edit, publish or delete any campus. New branches stay drafts until you publish them."
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
                <BranchRowActions slug={b.slug} status={b.status} />
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
}
