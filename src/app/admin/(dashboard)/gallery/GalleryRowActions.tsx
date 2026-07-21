"use client";

import { useTransition } from "react";
import { deleteGalleryImage } from "@/lib/actions/gallery";
import { adminButtonDanger } from "@/components/admin/ui";

export default function GalleryRowActions({ id }: { id: number }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm("Delete this photo? It will disappear from the public gallery.")) {
          startTransition(() => deleteGalleryImage(id));
        }
      }}
      className={adminButtonDanger}
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
