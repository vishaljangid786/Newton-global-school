"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  createTestimonial,
  type TestimonialFormState,
} from "@/lib/actions/testimonials";
import {
  FieldLabel,
  adminButtonPrimary,
  adminInputClasses,
} from "@/components/admin/ui";

interface AudienceOption {
  value: string;
  label: string;
}

export default function TestimonialCreateForm({
  audiences,
}: {
  audiences: AudienceOption[];
}) {
  const [state, action, pending] = useActionState<
    TestimonialFormState,
    FormData
  >(createTestimonial, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state?.ok]);

  return (
    <form ref={formRef} action={action} className="grid gap-4">
      {state?.error ? (
        <p
          role="alert"
          className="rounded-card border border-error/30 bg-error/5 px-3.5 py-2.5 text-sm text-error"
        >
          {state.error}
        </p>
      ) : null}
      {state?.ok ? (
        <p className="rounded-card border border-success/30 bg-success/5 px-3.5 py-2.5 text-sm text-success">
          Testimonial published.
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="author_name">Name</FieldLabel>
          <input
            id="author_name"
            name="author_name"
            required
            className={adminInputClasses}
            placeholder="e.g. Ritu Khandelwal"
          />
        </div>
        <div>
          <FieldLabel htmlFor="role_detail">Detail line (optional)</FieldLabel>
          <input
            id="role_detail"
            name="role_detail"
            className={adminInputClasses}
            placeholder='e.g. "Parent, Grade 4" or "Grade 9 student"'
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="author_role">Who is speaking?</FieldLabel>
          <select
            id="author_role"
            name="author_role"
            className={adminInputClasses}
            defaultValue="parent"
          >
            <option value="student">Student</option>
            <option value="parent">Parent</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>
        <div>
          <FieldLabel htmlFor="branch_ref">Campus</FieldLabel>
          <select
            id="branch_ref"
            name="branch_ref"
            className={adminInputClasses}
            defaultValue={audiences[0]?.value}
          >
            {audiences.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="quote">Quote</FieldLabel>
        <textarea
          id="quote"
          name="quote"
          rows={3}
          required
          minLength={20}
          className={adminInputClasses}
          placeholder="The quote as it should appear on the campus page"
        />
      </div>

      <div>
        <button type="submit" disabled={pending} className={adminButtonPrimary}>
          {pending ? "Publishing…" : "Publish testimonial"}
        </button>
      </div>
    </form>
  );
}
