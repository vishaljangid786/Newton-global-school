"use client";

import {
  HoneypotField,
  SelectField,
  SubmitButton,
  SuccessPanel,
  TextAreaField,
  TextField,
  isValidEmail,
  isValidPhone,
  useSimpleForm,
} from "./fields";
import { branches } from "@/data/branches";
import { careers } from "@/data/careers";
import { site } from "@/data/site";
import { branchLabel } from "@/lib/format";

type FieldName = "name" | "email" | "phone" | "position" | "branch" | "message";

function validateField(name: FieldName, value: string): string | undefined {
  const trimmed = value.trim();
  switch (name) {
    case "name":
      return trimmed ? undefined : "Please enter your name.";
    case "email":
      if (!trimmed) return "Please enter an email address.";
      return isValidEmail(trimmed)
        ? undefined
        : "Please enter a valid email address.";
    case "phone":
      if (!trimmed) return "Please enter a phone number.";
      return isValidPhone(trimmed)
        ? undefined
        : "Please enter a valid phone number (10-15 digits).";
    case "position":
      return trimmed ? undefined : "Please select a position.";
    case "branch":
      return trimmed ? undefined : "Please select a campus preference.";
    case "message":
      return undefined; // optional cover note
  }
}

interface CareerFormProps {
  /** Preselect a position by its CareerPosition id (careers accordion). */
  preselectPosition?: string;
  className?: string;
}

/**
 * Job application form (design.md §4.8): position select built from careers
 * data, campus preference, cover note, plus a note that the resume can be
 * emailed. Success state replaces the form with a thank-you panel.
 */
export default function CareerForm({
  preselectPosition,
  className = "",
}: CareerFormProps) {
  const validPreselect = careers.some(
    (position) => position.id === preselectPosition
  )
    ? preselectPosition
    : undefined;

  const form = useSimpleForm<FieldName>({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      position: validPreselect ?? "",
      branch: "",
      message: "",
    },
    validate: (name, value) => validateField(name, value),
  });

  if (form.status === "success") {
    return (
      <SuccessPanel
        title="Application received!"
        message="Thank you for your interest in teaching with us. Our HR team reviews every application and will reach out if you are shortlisted."
        onReset={form.reset}
      />
    );
  }

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit}
      className={`relative grid gap-5 md:grid-cols-2 ${className}`}
    >
      <TextField
        id={form.fieldId("name")}
        label="Full name"
        required
        autoComplete="name"
        value={form.values.name}
        onChange={form.handleChange("name")}
        onBlur={form.handleBlur("name")}
        error={form.errors.name}
      />
      <TextField
        id={form.fieldId("email")}
        label="Email"
        type="email"
        required
        autoComplete="email"
        value={form.values.email}
        onChange={form.handleChange("email")}
        onBlur={form.handleBlur("email")}
        error={form.errors.email}
      />
      <TextField
        id={form.fieldId("phone")}
        label="Phone"
        type="tel"
        required
        autoComplete="tel"
        value={form.values.phone}
        onChange={form.handleChange("phone")}
        onBlur={form.handleBlur("phone")}
        error={form.errors.phone}
      />
      <SelectField
        id={form.fieldId("position")}
        label="Position applying for"
        required
        value={form.values.position}
        onChange={form.handleChange("position")}
        onBlur={form.handleBlur("position")}
        error={form.errors.position}
      >
        <option value="">Select a position</option>
        {careers.map((position) => (
          <option key={position.id} value={position.id}>
            {position.title} — {branchLabel(position.branch)} ({position.type})
          </option>
        ))}
      </SelectField>
      <SelectField
        id={form.fieldId("branch")}
        label="Campus preference"
        required
        value={form.values.branch}
        onChange={form.handleChange("branch")}
        onBlur={form.handleBlur("branch")}
        error={form.errors.branch}
      >
        <option value="">Select a campus</option>
        <option value="any">Any campus</option>
        {branches.map((branch) => (
          <option key={branch.slug} value={branch.slug}>
            {branch.name}
          </option>
        ))}
      </SelectField>
      <TextAreaField
        id={form.fieldId("message")}
        label="Cover note (optional)"
        className="md:col-span-2"
        value={form.values.message}
        onChange={form.handleChange("message")}
        onBlur={form.handleBlur("message")}
        error={form.errors.message}
      />
      <HoneypotField
        id={form.honeypotId}
        value={form.honeypot}
        onChange={form.setHoneypot}
      />
      <p className="text-xs text-text-muted md:col-span-2">
        Have a resume ready? Email it to{" "}
        <a
          href={`mailto:${site.headOffice.email}`}
          className="font-medium text-primary underline underline-offset-2"
        >
          {site.headOffice.email}
        </a>{" "}
        with the position title in the subject line.
      </p>
      <div className="md:col-span-2">
        <SubmitButton submitting={form.status === "submitting"}>
          Submit Application
        </SubmitButton>
      </div>
    </form>
  );
}
