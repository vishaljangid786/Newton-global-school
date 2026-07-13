"use client";

import Link from "next/link";
import { useTransition } from "react";
import { deleteBranch, setBranchStatus } from "@/lib/actions/branches";
import { adminButtonDanger } from "@/components/admin/ui";

export default function BranchRowActions({
  slug,
  status,
}: {
  slug: string;
  status: "draft" | "published";
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href={`/admin/branches/${slug}/edit`}
        className="rounded-card border border-border px-3 py-2 text-sm text-text hover:border-primary hover:bg-primary/5"
      >
        Edit
      </Link>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(() =>
            setBranchStatus(slug, status === "published" ? "draft" : "published")
          )
        }
        className="rounded-card border border-border px-3 py-2 text-sm text-text hover:border-primary hover:bg-primary/5"
      >
        {status === "published" ? "Unpublish" : "Publish"}
      </button>
      <a
        href={`/branches/${slug}`}
        target="_blank"
        rel="noreferrer"
        className="rounded-card border border-border px-3 py-2 text-sm text-primary hover:border-primary hover:bg-primary/5"
      >
        Preview
      </a>
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
    </div>
  );
}
