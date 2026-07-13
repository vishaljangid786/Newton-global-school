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
import { branches, getBranchBySlug } from "@/data/branches";
import type { BranchSlug } from "@/data/types";

type FieldName =
  | "recipient"
  | "name"
  | "email"
  | "phone"
  | "subject"
  | "message";

interface ContactFormProps {
  /**
   * Branch contact pages (§5.9): show "Sending to: <campus>" as static text
   * instead of the recipient select.
   */
  fixedBranch?: BranchSlug;
  className?: string;
}

/**
 * General contact form (F8, design.md §4.9/§5.9): name, email, phone,
 * subject, message; recipient select (Head Office / campus) unless fixed.
 */
export default function ContactForm({
  fixedBranch,
  className = "",
}: ContactFormProps) {
  const fixed = fixedBranch ? getBranchBySlug(fixedBranch) : undefined;

  const form = useSimpleForm<FieldName>({
    initialValues: {
      recipient: fixedBranch ?? "",
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
    validate: (name, value) => {
      const trimmed = value.trim();
      switch (name) {
        case "recipient":
          if (fixedBranch) return undefined;
          return trimmed ? undefined : "Please choose a recipient.";
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
        case "subject":
          return trimmed ? undefined : "Please enter a subject.";
        case "message":
          return trimmed ? undefined : "Please enter a message.";
      }
    },
  });

  if (form.status === "success") {
    return (
      <SuccessPanel
        title="Message sent!"
        message="Thank you for writing to us. Our team will get back to you within one working day."
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
      {fixed ? (
        <p className="text-sm text-text md:col-span-2">
          Sending to:{" "}
          <span className="font-semibold text-primary">{fixed.name}</span>
        </p>
      ) : (
        <SelectField
          id={form.fieldId("recipient")}
          label="Send to"
          required
          className="md:col-span-2"
          value={form.values.recipient}
          onChange={form.handleChange("recipient")}
          onBlur={form.handleBlur("recipient")}
          error={form.errors.recipient}
        >
          <option value="">Select a recipient</option>
          <option value="head-office">Head Office</option>
          {branches.map((branch) => (
            <option key={branch.slug} value={branch.slug}>
              {branch.name}
            </option>
          ))}
        </SelectField>
      )}
      <TextField
        id={form.fieldId("name")}
        label="Your name"
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
      <TextField
        id={form.fieldId("subject")}
        label="Subject"
        required
        value={form.values.subject}
        onChange={form.handleChange("subject")}
        onBlur={form.handleBlur("subject")}
        error={form.errors.subject}
      />
      <TextAreaField
        id={form.fieldId("message")}
        label="Message"
        required
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
        <SubmitButton submitting={form.status === "submitting"}>
          Send Message
        </SubmitButton>
      </div>
    </form>
  );
}
