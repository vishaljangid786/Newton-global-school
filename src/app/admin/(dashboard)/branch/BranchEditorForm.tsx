"use client";

import { useActionState } from "react";
import {
  saveBranchOverride,
  type BranchFormState,
} from "@/lib/actions/branch";
import {
  FieldLabel,
  adminButtonPrimary,
  adminInputClasses,
} from "@/components/admin/ui";

export interface BranchEditorValues {
  slug: string;
  principalName: string;
  principalMessage: string;
  students: string;
  campusSize: string;
  grades: string;
  phone: string;
  email: string;
  address: string;
  facilities: string;
}

export default function BranchEditorForm({
  values,
}: {
  values: BranchEditorValues;
}) {
  const [state, action, pending] = useActionState<BranchFormState, FormData>(
    saveBranchOverride,
    {}
  );

  return (
    // key forces the uncontrolled fields to reset when switching branch tabs.
    <form key={values.slug} action={action} className="grid gap-5">
      <input type="hidden" name="slug" value={values.slug} />

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
          Saved. The public branch page has been updated.
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="principal_name">Principal name</FieldLabel>
          <input
            id="principal_name"
            name="principal_name"
            defaultValue={values.principalName}
            className={adminInputClasses}
          />
        </div>
        <div>
          <FieldLabel htmlFor="grades">Grades offered</FieldLabel>
          <input
            id="grades"
            name="grades"
            defaultValue={values.grades}
            className={adminInputClasses}
          />
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="principal_message">Principal&apos;s message</FieldLabel>
        <textarea
          id="principal_message"
          name="principal_message"
          rows={5}
          defaultValue={values.principalMessage}
          className={adminInputClasses}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="students">Students</FieldLabel>
          <input
            id="students"
            name="students"
            type="number"
            min="0"
            defaultValue={values.students}
            className={adminInputClasses}
          />
        </div>
        <div>
          <FieldLabel htmlFor="campus_size">Campus size</FieldLabel>
          <input
            id="campus_size"
            name="campus_size"
            defaultValue={values.campusSize}
            className={adminInputClasses}
          />
        </div>
        <div>
          <FieldLabel htmlFor="phone">Phone</FieldLabel>
          <input
            id="phone"
            name="phone"
            defaultValue={values.phone}
            className={adminInputClasses}
          />
        </div>
        <div>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <input
            id="email"
            name="email"
            defaultValue={values.email}
            className={adminInputClasses}
          />
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="address">Address</FieldLabel>
        <input
          id="address"
          name="address"
          defaultValue={values.address}
          className={adminInputClasses}
        />
      </div>

      <div>
        <FieldLabel htmlFor="facilities">Facilities (one per line)</FieldLabel>
        <textarea
          id="facilities"
          name="facilities"
          rows={8}
          defaultValue={values.facilities}
          className={`${adminInputClasses} font-mono text-xs`}
        />
        <p className="mt-1 text-xs text-text-muted">
          Leave a field empty to revert it to the site default.
        </p>
      </div>

      <div>
        <button type="submit" disabled={pending} className={adminButtonPrimary}>
          {pending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
