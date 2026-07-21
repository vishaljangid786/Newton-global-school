import { requireUser } from "@/lib/dal";
import { branchScopeFilter, targetableBranchRefs } from "@/lib/rbac";
import {
  AdminCard,
  EmptyState,
  PageHeader,
  StatusBadge,
} from "@/components/admin/ui";
import { getAllBranches } from "@/lib/branches-store";
import {
  listTestimonialsForAdmin,
  roleTitle,
  type TestimonialRow,
} from "@/lib/testimonials-store";
import TestimonialCreateForm from "./TestimonialCreateForm";
import TestimonialRowActions from "./TestimonialRowActions";

export const metadata = { title: "Testimonials" };

export default async function TestimonialsPage() {
  const user = await requireUser();

  const all = await getAllBranches({ includeUnpublished: true });
  const nameOf = (ref: string) =>
    ref === "all"
      ? "All campuses"
      : (all.find((b) => b.slug === ref)?.name ?? ref);

  const allSlugs = all.map((b) => b.slug);
  const audiences = targetableBranchRefs(user, allSlugs).map((ref) => ({
    value: ref,
    label: ref === "all" ? "All campuses (shown everywhere)" : nameOf(ref),
  }));

  const scope = branchScopeFilter(user, "branch_ref", true);
  let rows: TestimonialRow[] = [];
  try {
    rows = await listTestimonialsForAdmin(scope.clause, scope.params);
  } catch {
    rows = [];
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Content"
        title="Testimonials"
        description="Voices from students, parents and teachers, shown on each campus page. Unpublish to hide a quote without deleting it."
      />

      <AdminCard>
        <h2 className="mb-4 font-heading text-lg text-ink">New testimonial</h2>
        <TestimonialCreateForm audiences={audiences} />
      </AdminCard>

      <section>
        <h2 className="mb-3 font-heading text-lg text-ink">
          All testimonials ({rows.length})
        </h2>
        {rows.length === 0 ? (
          <EmptyState>
            No testimonials yet. Add a quote above and it will appear in the
            campus page&apos;s &ldquo;What our school family says&rdquo;
            section.
          </EmptyState>
        ) : (
          <div className="space-y-3">
            {rows.map((t) => {
              const editable =
                user.role === "super_admin" || t.branch_ref === user.branchSlug;
              const published = t.status === "published";
              return (
                <AdminCard key={t.id} className={published ? "" : "opacity-60"}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 max-w-3xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-heading text-base text-ink">
                          {t.author_name}
                        </h3>
                        <StatusBadge tone={t.author_role}>
                          {roleTitle(t.author_role)}
                        </StatusBadge>
                        <StatusBadge tone={published ? "published" : "draft"}>
                          {published ? "published" : "hidden"}
                        </StatusBadge>
                      </div>
                      {t.role_detail ? (
                        <p className="mt-0.5 text-xs text-faint">
                          {t.role_detail}
                        </p>
                      ) : null}
                      <p className="mt-2 text-sm leading-relaxed text-text-muted">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                      <p className="mt-2 text-xs text-faint">
                        {nameOf(t.branch_ref)} ·{" "}
                        {new Date(t.created_at).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    {editable ? (
                      <TestimonialRowActions id={t.id} published={published} />
                    ) : (
                      <span className="text-xs text-faint">
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
