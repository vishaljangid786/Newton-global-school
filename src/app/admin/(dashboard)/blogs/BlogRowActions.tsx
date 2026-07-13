"use client";

import Link from "next/link";
import { useTransition } from "react";
import { deleteBlog, setBlogStatus } from "@/lib/actions/blogs";
import { adminButtonDanger } from "@/components/admin/ui";

export default function BlogRowActions({
  id,
  status,
}: {
  id: number;
  status: "draft" | "published";
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href={`/admin/blogs/${id}/edit`}
        className="rounded-card border border-border px-3 py-2 text-sm text-text hover:border-primary hover:bg-primary/5"
      >
        Edit
      </Link>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(() =>
            setBlogStatus(id, status === "published" ? "draft" : "published")
          )
        }
        className="rounded-card border border-border px-3 py-2 text-sm text-text hover:border-primary hover:bg-primary/5"
      >
        {status === "published" ? "Unpublish" : "Publish"}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (confirm("Delete this post? This cannot be undone.")) {
            startTransition(() => deleteBlog(id));
          }
        }}
        className={adminButtonDanger}
      >
        Delete
      </button>
    </div>
  );
}
