"use client";

import { useTransition } from "react";
import { updateRegistrationStatus } from "@/lib/actions/registrations";

const STATUSES = ["new", "contacted", "closed"] as const;

export default function SubmissionActions({
  id,
  status,
}: {
  id: number;
  status: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className={`flex items-center justify-end ${pending ? "opacity-60" : ""}`}>
      <label className="sr-only" htmlFor={`reg-status-${id}`}>
        Update status
      </label>
      <select
        id={`reg-status-${id}`}
        defaultValue={status}
        disabled={pending}
        onChange={(event) => {
          const next = event.target.value;
          startTransition(() => updateRegistrationStatus(id, next));
        }}
        className="cursor-pointer rounded-md border border-border bg-white px-2.5 py-1.5 text-base font-medium capitalize text-text transition-colors hover:border-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15 sm:text-xs"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
