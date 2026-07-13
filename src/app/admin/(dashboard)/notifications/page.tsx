import { requireUser } from "@/lib/dal";
import { tryQuery } from "@/lib/db";
import { branchScopeFilter, targetableBranchRefs } from "@/lib/rbac";
import {
  AdminCard,
  EmptyState,
  PageHeader,
  StatusBadge,
} from "@/components/admin/ui";
import { getAllBranches } from "@/lib/branches-store";
import type { NotificationRow } from "@/lib/admin-types";
import NotificationCreateForm from "./NotificationCreateForm";
import NotificationRowActions from "./NotificationRowActions";

export const metadata = { title: "Notifications" };

export default async function NotificationsPage() {
  const user = await requireUser();

  const all = await getAllBranches({ includeUnpublished: true });
  const nameOf = (ref: string) =>
    ref === "all"
      ? "All campuses"
      : (all.find((b) => b.slug === ref)?.name ?? ref);

  const allSlugs = all.map((b) => b.slug);
  const audiences = targetableBranchRefs(user, allSlugs).map((ref) => ({
    value: ref,
    label: ref === "all" ? "All campuses (group-wide)" : nameOf(ref),
  }));

  const scope = branchScopeFilter(user, "branch_ref", true);
  const rows = await tryQuery<NotificationRow>(
    `SELECT id, title, body, branch_ref, level, active, created_at
     FROM notifications WHERE ${scope.clause}
     ORDER BY created_at DESC LIMIT 100`,
    scope.params
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Notifications"
        description="Publish alerts that appear as a banner on the public site. Deactivate to hide without deleting."
      />

      <AdminCard>
        <h2 className="mb-4 font-heading text-lg text-text">New notification</h2>
        <NotificationCreateForm audiences={audiences} />
      </AdminCard>

      <section>
        <h2 className="mb-3 font-heading text-lg text-text">Published</h2>
        {rows.length === 0 ? (
          <EmptyState>No notifications yet.</EmptyState>
        ) : (
          <div className="space-y-3">
            {rows.map((n) => {
              const editable =
                user.role === "super_admin" || n.branch_ref === user.branchSlug;
              return (
                <AdminCard key={n.id} className={n.active ? "" : "opacity-60"}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-heading text-base text-text">
                          {n.title}
                        </h3>
                        <StatusBadge tone={n.level}>{n.level}</StatusBadge>
                        <StatusBadge tone={n.active ? "published" : "neutral"}>
                          {n.active ? "active" : "inactive"}
                        </StatusBadge>
                      </div>
                      {n.body ? (
                        <p className="mt-1 text-sm text-text-muted">{n.body}</p>
                      ) : null}
                      <p className="mt-2 text-xs text-text-muted">
                        {nameOf(n.branch_ref)} ·{" "}
                        {new Date(n.created_at).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    {editable ? (
                      <NotificationRowActions
                        id={n.id}
                        active={n.active === 1}
                      />
                    ) : (
                      <span className="text-xs text-text-muted">
                        Group-wide · read-only
                      </span>
                    )}
                  </div>
                </AdminCard>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
