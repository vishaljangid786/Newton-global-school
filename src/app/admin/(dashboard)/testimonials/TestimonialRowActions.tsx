"use client";

import { useTransition } from "react";
import {
  deleteTestimonial,
  toggleTestimonial,
} from "@/lib/actions/testimonials";
import { adminButtonDanger } from "@/components/admin/ui";

export default function TestimonialRowActions({
  id,
  published,
}: {
  id: number;
  published: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => toggleTestimonial(id, !published))}
        className="rounded-btn border border-border px-3 py-2 text-sm text-text hover:border-primary/40 hover:text-primary"
      >
        {published ? "Unpublish" : "Publish"}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (confirm("Delete this testimonial?")) {
            startTransition(() => deleteTestimonial(id));
          }
        }}
        className={adminButtonDanger}
      >
        Delete
      </button>
    </div>
  );
}
