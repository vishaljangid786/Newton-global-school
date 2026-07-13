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
import { useBranches } from "@/components/hooks/useBranches";
import { site } from "@/data/site";
import { submitEnquiry } from "@/lib/actions/enquiries";
import type { BranchSlug } from "@/data/types";

const GRADES = [
  "Nursery",
  "LKG",
  "UKG",
  ...Array.from({ length: 12 }, (_, index) => `Grade ${index + 1}`),
];

type FieldName =
  | "studentName"
  | "parentName"
  | "phone"
  | "email"
  | "branch"
  | "grade"
  | "message";

function validateField(name: FieldName, value: string): string | undefined {
  const trimmed = value.trim();
  switch (name) {
    case "studentName":
      return trimmed ? undefined : "Please enter the student name.";
    case "parentName":
      return trimmed ? undefined : "Please enter the parent or guardian name.";
    case "phone":
      if (!trimmed) return "Please enter a phone number.";
      return isValidPhone(trimmed)
        ? undefined
        : "Please enter a valid phone number (10-15 digits).";
    case "email":
      if (!trimmed) return "Please enter an email address.";
      return isValidEmail(trimmed)
        ? undefined
        : "Please enter a valid email address.";
    case "branch":
      return trimmed ? undefined : "Please select a campus.";
    case "grade":
      return trimmed ? undefined : "Please select a grade.";
    case "message":
      return undefined; // optional
  }
}

interface InquiryFormProps {
  /** Preselect a campus in the dropdown (branch admissions pages, §5.5). */
  preselectBranch?: BranchSlug;
  className?: string;
}

/**
 * Admission inquiry form (F2, design.md §4.5): 2-column on desktop, stacked
 * on mobile; success state replaces the form with a thank-you panel.
 */
export default function InquiryForm({
  preselectBranch,
  className = "",
}: InquiryFormProps) {
  const campuses = useBranches();
  const form = useSimpleForm<FieldName>({
    initialValues: {
      studentName: "",
      parentName: "",
      phone: "",
      email: "",
      branch: preselectBranch ?? "",
      grade: "",
      message: "",
    },
    validate: (name, value) => validateField(name, value),
    onSubmit: async (values) => {
      await submitEnquiry({
        studentName: values.studentName,
        parentName: values.parentName,
        phone: values.phone,
        email: values.email,
        branch: values.branch,
        grade: values.grade,
        message: values.message,
      });
    },
  });

  if (form.status === "success") {
    return (
      <SuccessPanel
        title="Thank you for your inquiry!"
        message={`Our admissions team will call you within two working days about admission for ${site.admissionYear}.`}
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
        id={form.fieldId("studentName")}
        label="Student name"
        required
        value={form.values.studentName}
        onChange={form.handleChange("studentName")}
        onBlur={form.handleBlur("studentName")}
        error={form.errors.studentName}
      />
      <TextField
        id={form.fieldId("parentName")}
        label="Parent / guardian name"
        required
        autoComplete="name"
        value={form.values.parentName}
        onChange={form.handleChange("parentName")}
        onBlur={form.handleBlur("parentName")}
        error={form.errors.parentName}
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
      <SelectField
        id={form.fieldId("branch")}
        label="Campus applying to"
        required
        value={form.values.branch}
        onChange={form.handleChange("branch")}
        onBlur={form.handleBlur("branch")}
        error={form.errors.branch}
      >
        <option value="">Select a campus</option>
        {campuses.map((branch) => (
          <option key={branch.slug} value={branch.slug}>
            {branch.name}
          </option>
        ))}
      </SelectField>
      <SelectField
        id={form.fieldId("grade")}
        label="Grade applying for"
        required
        value={form.values.grade}
        onChange={form.handleChange("grade")}
        onBlur={form.handleBlur("grade")}
        error={form.errors.grade}
      >
        <option value="">Select a grade</option>
        {GRADES.map((grade) => (
          <option key={grade} value={grade}>
            {grade}
          </option>
        ))}
      </SelectField>
      <TextAreaField
        id={form.fieldId("message")}
        label="Message (optional)"
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
      <div className="md:col-span-2">
        {form.submitError ? (
          <p
            role="alert"
            className="mb-3 rounded-card border border-error/30 bg-error/5 px-3.5 py-2.5 text-sm text-error"
          >
            {form.submitError}
          </p>
        ) : null}
        <SubmitButton submitting={form.status === "submitting"}>
          Submit Inquiry
        </SubmitButton>
      </div>
    </form>
  );
}
