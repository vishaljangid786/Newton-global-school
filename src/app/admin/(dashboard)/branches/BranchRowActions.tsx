"use client";

import Link from "next/link";
import { useTransition } from "react";
import { deleteBranch, setBranchStatus } from "@/lib/actions/branches";
import { adminButtonDanger } from "@/components/admin/ui";

const rowButton =
  "rounded-card border border-border px-3 py-2 text-sm text-text hover:border-primary hover:bg-primary/5";

export default function BranchRowActions({
  slug,
  status = "published",
  /** Super admin: record actions (edit details, publish, delete). */
  canManage,
}: {
  slug: string;
  status?: "draft" | "published";
  canManage: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href={`/admin/branches/${slug}/content`}
        className="rounded-card border border-primary/30 bg-primary/5 px-3 py-2 text-sm font-medium text-primary hover:border-primary"
      >
        Page content
      </Link>
      {canManage ? (
        <Link href={`/admin/branches/${slug}/edit`} className={rowButton}>
          Edit details
        </Link>
      ) : null}
      {canManage ? (
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(() =>
              setBranchStatus(slug, status === "published" ? "draft" : "published")
            )
          }
          className={rowButton}
        >
          {status === "published" ? "Unpublish" : "Publish"}
        </button>
      ) : null}
      <a
        href={`/branches/${slug}`}
        target="_blank"
        rel="noreferrer"
        className="rounded-card border border-border px-3 py-2 text-sm text-primary hover:border-primary hover:bg-primary/5"
      >
        Preview
      </a>
      {canManage ? (
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            if (confirm("Delete this branch? This cannot be undone.")) {
              startTransition(() => deleteBranch(slug));
            }
          }}
          className={adminButtonDanger}
        >
          Delete
        </button>
      ) : null}
    </div>
  );
}
