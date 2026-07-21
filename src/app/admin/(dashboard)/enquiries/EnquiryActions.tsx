"use client";

import { useTransition } from "react";
import { deleteEnquiry, updateEnquiryStatus } from "@/lib/actions/enquiries";

const STATUSES = ["new", "contacted", "closed"] as const;

export default function EnquiryActions({
  id,
  status,
}: {
  id: number;
  status: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div
      className={`flex items-center justify-end gap-2 ${pending ? "opacity-60" : ""}`}
    >
      <label className="sr-only" htmlFor={`status-${id}`}>
        Update status
      </label>
      <select
        id={`status-${id}`}
        defaultValue={status}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value;
          startTransition(() => updateEnquiryStatus(id, next));
        }}
        className="cursor-pointer rounded-md border border-border bg-white px-2.5 py-1.5 text-base font-medium capitalize text-text transition-colors hover:border-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15 sm:text-xs"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>
      <button
        type="button"
        disabled={pending}
        title="Delete enquiry"
        aria-label="Delete enquiry"
        onClick={() => {
          if (confirm("Delete this enquiry? This cannot be undone.")) {
            startTransition(() => deleteEnquiry(id));
          }
        }}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-muted transition-colors hover:border-error/40 hover:bg-error/5 hover:text-error"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0-1 13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1L6 7" />
          <path d="M10 11v6M14 11v6" />
        </svg>
      </button>
    </div>
  );
}
