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
import { submitRegistration } from "@/lib/actions/registrations";

const CLASSES = [
  "Nursery",
  "LKG",
  "UKG",
  ...Array.from({ length: 12 }, (_, index) => `Class ${index + 1}`),
];

type FieldName =
  | "studentName"
  | "dateOfBirth"
  | "gender"
  | "classApplied"
  | "fatherName"
  | "motherName"
  | "phone"
  | "email"
  | "address"
  | "previousSchool"
  | "branch"
  | "message";

function validateField(name: FieldName, value: string): string | undefined {
  const trimmed = value.trim();
  switch (name) {
    case "studentName":
      return trimmed ? undefined : "Please enter the student's full name.";
    case "classApplied":
      return trimmed ? undefined : "Please choose the class being applied for.";
    case "fatherName":
      return trimmed ? undefined : "Please enter the father's name.";
    case "phone":
      if (!trimmed) return "Please enter a phone number.";
      return isValidPhone(trimmed)
        ? undefined
        : "Please enter a valid phone number (10-15 digits).";
    case "email":
      /* Optional — but if given it must look like an address. */
      if (!trimmed) return undefined;
      return isValidEmail(trimmed)
        ? undefined
        : "Please enter a valid email address.";
    case "dateOfBirth":
      if (!trimmed) return undefined;
      return Number.isNaN(Date.parse(trimmed))
        ? "Please enter a valid date."
        : undefined;
    default:
      return undefined;
  }
}

/**
 * Registration form behind "Apply Now". Submissions land in the
 * `registrations` table and appear under Inbox → Submissions in the admin.
 */
export default function RegistrationForm({ className = "" }: { className?: string }) {
  const campuses = useBranches();
  const form = useSimpleForm<FieldName>({
    initialValues: {
      studentName: "",
      dateOfBirth: "",
      gender: "",
      classApplied: "",
      fatherName: "",
      motherName: "",
      phone: "",
      email: "",
      address: "",
      previousSchool: "",
      branch: "",
      message: "",
    },
    validate: (name, value) => validateField(name, value),
    onSubmit: async (values) => {
      await submitRegistration({
        studentName: values.studentName,
        dateOfBirth: values.dateOfBirth,
        gender: values.gender,
        classApplied: values.classApplied,
        fatherName: values.fatherName,
        motherName: values.motherName,
        phone: values.phone,
        email: values.email,
        address: values.address,
        previousSchool: values.previousSchool,
        branch: values.branch || "all",
        message: values.message,
      });
    },
  });

  if (form.status === "success") {
    return (
      <SuccessPanel
        title="Registration received"
        message={`Thank you. Our admissions team will call you within two working days about admission for ${site.admissionYear}.`}
        onReset={form.reset}
      />
    );
  }

  const legend =
    "text-[0.6875rem] font-bold uppercase tracking-[0.09em] text-[#87661f]";

  return (
    <form noValidate onSubmit={form.handleSubmit} className={`relative ${className}`}>
      <fieldset className="border-0 p-0">
        <legend className={legend}>Student details</legend>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <TextField
            id={form.fieldId("studentName")}
            label="Student's full name"
            required
            value={form.values.studentName}
            onChange={form.handleChange("studentName")}
            onBlur={form.handleBlur("studentName")}
            error={form.errors.studentName}
          />
          <TextField
            id={form.fieldId("dateOfBirth")}
            label="Date of birth"
            type="date"
            value={form.values.dateOfBirth}
            onChange={form.handleChange("dateOfBirth")}
            onBlur={form.handleBlur("dateOfBirth")}
            error={form.errors.dateOfBirth}
          />
          <SelectField
            id={form.fieldId("gender")}
            label="Gender"
            value={form.values.gender}
            onChange={form.handleChange("gender")}
            onBlur={form.handleBlur("gender")}
            error={form.errors.gender}
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </SelectField>
          <SelectField
            id={form.fieldId("classApplied")}
            label="Class applying for"
            required
            value={form.values.classApplied}
            onChange={form.handleChange("classApplied")}
            onBlur={form.handleBlur("classApplied")}
            error={form.errors.classApplied}
          >
            <option value="">Select a class</option>
            {CLASSES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </SelectField>
          <TextField
            id={form.fieldId("previousSchool")}
            label="Previous school (if any)"
            className="md:col-span-2"
            value={form.values.previousSchool}
            onChange={form.handleChange("previousSchool")}
            onBlur={form.handleBlur("previousSchool")}
            error={form.errors.previousSchool}
          />
        </div>
      </fieldset>

      <fieldset className="mt-9 border-0 p-0">
        <legend className={legend}>Parent / guardian</legend>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <TextField
            id={form.fieldId("fatherName")}
            label="Father's name"
            required
            value={form.values.fatherName}
            onChange={form.handleChange("fatherName")}
            onBlur={form.handleBlur("fatherName")}
            error={form.errors.fatherName}
          />
          <TextField
            id={form.fieldId("motherName")}
            label="Mother's name"
            value={form.values.motherName}
            onChange={form.handleChange("motherName")}
            onBlur={form.handleBlur("motherName")}
            error={form.errors.motherName}
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
            autoComplete="email"
            value={form.values.email}
            onChange={form.handleChange("email")}
            onBlur={form.handleBlur("email")}
            error={form.errors.email}
          />
          <TextField
            id={form.fieldId("address")}
            label="Home address"
            className="md:col-span-2"
            value={form.values.address}
            onChange={form.handleChange("address")}
            onBlur={form.handleBlur("address")}
            error={form.errors.address}
          />
          {campuses.length > 1 ? (
            <SelectField
              id={form.fieldId("branch")}
              label="Campus"
              className="md:col-span-2"
              value={form.values.branch}
              onChange={form.handleChange("branch")}
              onBlur={form.handleBlur("branch")}
              error={form.errors.branch}
            >
              <option value="">No preference</option>
              {campuses.map((campus) => (
                <option key={campus.slug} value={campus.slug}>
                  {campus.name}
                </option>
              ))}
            </SelectField>
          ) : null}
          <TextAreaField
            id={form.fieldId("message")}
            label="Anything else we should know?"
            className="md:col-span-2"
            rows={4}
            value={form.values.message}
            onChange={form.handleChange("message")}
            onBlur={form.handleBlur("message")}
            error={form.errors.message}
          />
        </div>
      </fieldset>

      <HoneypotField
        id={form.honeypotId}
        value={form.honeypot}
        onChange={form.setHoneypot}
      />

      <div className="mt-8">
        {form.submitError ? (
          <p
            role="alert"
            className="mb-3 rounded-card border border-error/30 bg-error/5 px-3.5 py-2.5 text-sm text-error"
          >
            {form.submitError}
          </p>
        ) : null}
        <SubmitButton submitting={form.status === "submitting"}>
          Submit registration
        </SubmitButton>
      </div>
    </form>
  );
}
