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
  listGalleryImagesForAdmin,
  type GalleryImageRow,
} from "@/lib/gallery-store";
import GalleryUploadForm from "./GalleryUploadForm";
import GalleryRowActions from "./GalleryRowActions";

export const metadata = { title: "Gallery" };

export default async function AdminGalleryPage() {
  const user = await requireUser();

  const all = await getAllBranches({ includeUnpublished: true });
  const nameOf = (ref: string) =>
    all.find((b) => b.slug === ref)?.name ?? ref;

  // Gallery photos always belong to one campus — no group-wide option.
  const campuses = targetableBranchRefs(user, all.map((b) => b.slug))
    .filter((ref) => ref !== "all")
    .map((ref) => ({ value: ref, label: nameOf(ref) }));

  const scope = branchScopeFilter(user, "branch_ref");
  let rows: GalleryImageRow[] = [];
  try {
    rows = await listGalleryImagesForAdmin(scope.clause, scope.params);
  } catch {
    rows = [];
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Content"
        title="Gallery"
        description="Upload campus photos. They appear immediately in the public gallery, the campus page strip and the photo viewer, ahead of the placeholder artwork."
      />

      <AdminCard>
        <h2 className="mb-4 font-heading text-lg text-ink">Upload a photo</h2>
        <GalleryUploadForm campuses={campuses} />
      </AdminCard>

      <section>
        <h2 className="mb-3 font-heading text-lg text-ink">
          Uploaded photos ({rows.length})
        </h2>
        {rows.length === 0 ? (
          <EmptyState>
            No photos uploaded yet. Until then, the public gallery shows the
            built-in placeholder artwork.
          </EmptyState>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((img) => (
              <AdminCard key={img.id} className="flex flex-col p-0">
                <span className="block h-44 overflow-hidden rounded-t-card bg-bg-alt">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.image_url}
                    alt={img.caption}
                    className="h-full w-full object-cover"
                  />
                </span>
                <span className="flex flex-1 flex-col p-4">
                  <span className="flex flex-wrap items-center gap-2">
                    <StatusBadge tone="neutral">{img.category}</StatusBadge>
                    <span className="text-xs text-faint">
                      {nameOf(img.branch_ref)}
                    </span>
                  </span>
                  <span className="mt-2 text-sm font-medium text-ink">
                    {img.caption}
                  </span>
                  <span className="mt-1 text-xs text-faint">
                    {new Date(img.created_at).toLocaleDateString("en-IN")}
                  </span>
                  <span className="mt-3">
                    <GalleryRowActions id={img.id} />
                  </span>
                </span>
              </AdminCard>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
