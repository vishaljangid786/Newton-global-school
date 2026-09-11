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
import { youTubeThumbnail } from "@/lib/youtube";
import AdminDialog from "@/components/admin/AdminDialog";
import GalleryUploadForm from "./GalleryUploadForm";
import GalleryRowActions from "./GalleryRowActions";

export const metadata = { title: "Gallery" };

/**
 * The still to show for a row, or null when there is none to show.
 * A YouTube row stores no poster — it is derived from the video id, the same
 * way the public gallery derives it.
 */
function posterFor(row: GalleryImageRow): string | null {
  if (row.image_url) return row.image_url;
  if (row.media_type === "video" && row.video_source === "youtube" && row.video_url) {
    return youTubeThumbnail(row.video_url);
  }
  return null;
}

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
        description="Upload campus photos and videos — a video file, or just a YouTube link. They appear immediately in the public gallery, spread through the photographs, and under the Videos tab."
        action={
          <AdminDialog
            label="Add photo or video"
            title="Add to the gallery"
            description="Shown in the public gallery as soon as it finishes uploading."
          >
            <GalleryUploadForm campuses={campuses} />
          </AdminDialog>
        }
      />

      <section>
        <h2 className="mb-3 font-heading text-lg text-ink">
          Uploaded media ({rows.length})
        </h2>
        {rows.length === 0 ? (
          <EmptyState>
            Nothing uploaded yet. Until then, the public gallery shows the
            built-in photographs that ship with the site.
          </EmptyState>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((img) => {
              /* Hoisted: TypeScript cannot carry a narrowing across two calls
                 to the same function inside JSX. */
              const poster = posterFor(img);
              return (
              <AdminCard key={img.id} className="flex flex-col p-0">
                <span className="relative block h-44 overflow-hidden rounded-t-card bg-bg-alt">
                  {/*
                    Three cases. A photograph and a YouTube video both have a
                    still to show (YouTube's is derived on read). An uploaded
                    clip may have no poster at all, so the <video> element is
                    the preview — metadata only, so the browser fetches a frame
                    and not the whole file.
                  */}
                  {poster ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={poster}
                      alt={img.caption}
                      className="h-full w-full object-cover"
                    />
                  ) : img.video_url ? (
                    <video
                      src={img.video_url}
                      muted
                      playsInline
                      preload="metadata"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-xs text-faint">
                      No preview
                    </span>
                  )}
                  {img.media_type === "video" ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 flex items-center justify-center bg-[#001344]/25"
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-pill bg-white/90 text-[#001344] shadow">
                        <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5" fill="currentColor">
                          <path d="M8 5.5v13l11-6.5z" />
                        </svg>
                      </span>
                    </span>
                  ) : null}
                </span>
                <span className="flex flex-1 flex-col p-4">
                  <span className="flex flex-wrap items-center gap-2">
                    <StatusBadge tone="neutral">{img.category}</StatusBadge>
                    {img.media_type === "video" ? (
                      <StatusBadge tone="neutral">
                        {img.video_source === "youtube" ? "YouTube" : "Video"}
                      </StatusBadge>
                    ) : null}
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
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
