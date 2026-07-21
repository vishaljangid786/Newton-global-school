"use client";

import {
  useCallback,
  useId,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { buttonClasses } from "@/components/ui/Button";

/**
 * Shared form internals (design.md §3.3, §7): visible labels above inputs,
 * validate on blur + submit, inline error messages, honeypot spam trap,
 * simulated ~800ms submit, success panel. Used by InquiryForm, ContactForm
 * and CareerForm — pages normally import those, not this module.
 */

export type FormStatus = "idle" | "submitting" | "success";

/* ————————————————— Validators ————————————————— */

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/** Accepts +, spaces, dashes, parens; requires 10-15 digits. */
export function isValidPhone(value: string): boolean {
  return /^\+?[0-9]{10,15}$/.test(value.replace(/[\s()-]/g, ""));
}

/* ————————————————— Form state hook ————————————————— */

interface UseSimpleFormConfig<N extends string> {
  initialValues: Record<N, string>;
  /** Return an error message, or undefined when the field is valid. */
  validate: (name: N, value: string, values: Record<N, string>) => string | undefined;
  /**
   * Optional real async submit. When provided it replaces the simulated send:
   * resolve → success panel; throw → the message is shown and the form stays
   * editable. When omitted, the form simulates an ~800ms send (F8 demo forms).
   */
  onSubmit?: (values: Record<N, string>) => Promise<void>;
}

/**
 * Controlled-form state: values/errors/status, blur + submit validation,
 * focus moves to the first invalid field on submit, ~800ms simulated send.
 * Field order for "first invalid" follows the key order of initialValues.
 * User input is never cleared on validation failure.
 */
export function useSimpleForm<N extends string>({
  initialValues,
  validate,
  onSubmit,
}: UseSimpleFormConfig<N>) {
  const idBase = useId();
  const [values, setValues] = useState<Record<N, string>>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<N, string>>>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [submitError, setSubmitError] = useState<string | undefined>();
  const [honeypot, setHoneypot] = useState("");

  const fieldId = useCallback((name: N) => `${idBase}-${name}`, [idBase]);
  const honeypotId = `${idBase}-hp`;

  const handleChange = (name: N) => (value: string) => {
    const next = { ...values, [name]: value };
    setValues(next);
    // Re-validate live only once a field already shows an error.
    if (errors[name] !== undefined) {
      setErrors({ ...errors, [name]: validate(name, value, next) });
    }
  };

  const handleBlur = (name: N) => () => {
    setErrors((previous) => ({
      ...previous,
      [name]: validate(name, values[name], values),
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;

    const nextErrors: Partial<Record<N, string>> = {};
    let firstInvalid: N | null = null;
    for (const name of Object.keys(values) as N[]) {
      const message = validate(name, values[name], values);
      if (message) {
        nextErrors[name] = message;
        firstInvalid ??= name;
      }
    }
    setErrors(nextErrors);
    if (firstInvalid) {
      document.getElementById(fieldId(firstInvalid))?.focus();
      return;
    }

    // Honeypot submissions are silently dropped: bots see the same success
    // state and nothing is ever sent.
    if (honeypot.trim()) {
      setStatus("success");
      return;
    }

    setSubmitError(undefined);
    setStatus("submitting");

    if (onSubmit) {
      onSubmit(values)
        .then(() => setStatus("success"))
        .catch((error: unknown) => {
          setSubmitError(
            error instanceof Error
              ? error.message
              : "Sorry, something went wrong. Please try again."
          );
          setStatus("idle");
        });
      return;
    }

    // No real handler → simulated ~800ms send (demo forms).
    window.setTimeout(() => setStatus("success"), 800);
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setHoneypot("");
    setSubmitError(undefined);
    setStatus("idle");
  };

  return {
    values,
    errors,
    status,
    submitError,
    honeypot,
    setHoneypot,
    fieldId,
    honeypotId,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
  };
}

/* ————————————————— Field components ————————————————— */

const LABEL_CLASSES = "mb-1.5 block text-sm font-medium text-text";

function inputClasses(hasError: boolean): string {
  return `w-full rounded-btn border bg-surface px-3.5 py-3 text-base text-text transition-colors focus:border-primary/40 sm:text-sm ${
    hasError ? "border-error" : "border-border"
  }`;
}

interface CommonFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  className?: string;
}

function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={`${id}-error`} className="mt-1.5 text-sm text-error">
      {error}
    </p>
  );
}

export function TextField({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  className = "",
  type = "text",
  autoComplete,
}: CommonFieldProps & {
  type?: "text" | "email" | "tel";
  autoComplete?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className={LABEL_CLASSES}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={inputClasses(Boolean(error))}
      />
      <FieldError id={id} error={error} />
    </div>
  );
}

export function TextAreaField({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  className = "",
  rows = 4,
}: CommonFieldProps & { rows?: number }) {
  return (
    <div className={className}>
      <label htmlFor={id} className={LABEL_CLASSES}>
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={inputClasses(Boolean(error))}
      />
      <FieldError id={id} error={error} />
    </div>
  );
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  className = "",
  children,
}: CommonFieldProps & { children: ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id} className={LABEL_CLASSES}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={inputClasses(Boolean(error))}
      >
        {children}
      </select>
      <FieldError id={id} error={error} />
    </div>
  );
}

/** Visually hidden spam trap (F8) — humans never see or fill it. */
export function HoneypotField({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label htmlFor={id}>Leave this field empty</label>
      <input
        id={id}
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

export function SubmitButton({
  children,
  submitting,
  className = "",
}: {
  children: ReactNode;
  submitting: boolean;
  className?: string;
}) {
  return (
    <button
      type="submit"
      disabled={submitting}
      className={`${buttonClasses("primary")} disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {submitting ? "Sending…" : children}
    </button>
  );
}

/** Replaces the form after a successful (simulated) submit. */
export function SuccessPanel({
  title,
  message,
  onReset,
}: {
  title: string;
  message: string;
  onReset?: () => void;
}) {
  return (
    <div
      role="status"
      className="rounded-card border border-success/30 bg-success/5 px-6 py-10 text-center"
    >
      <span
        aria-hidden="true"
        className="mx-auto flex h-12 w-12 items-center justify-center rounded-pill bg-success text-white"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          focusable="false"
        >
          <path d="m5 13 4 4L19 7" />
        </svg>
      </span>
      <h3 className="mt-4 font-heading text-xl font-semibold text-text">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-text-muted">{message}</p>
      {onReset ? (
        <button
          type="button"
          onClick={onReset}
          className="mt-5 text-sm font-semibold text-primary underline underline-offset-4 hover:text-primary-dark"
        >
          Submit another response
        </button>
      ) : null}
    </div>
  );
}
