/**
 * Shared field validation for the server actions.
 *
 * The length caps below are the actual VARCHAR widths in db/schema.sql. This
 * matters more than it looks: MySQL runs in STRICT_TRANS_TABLES here, so an
 * over-long string is rejected by the database rather than truncated, and the
 * visitor sees "we couldn't submit right now" with no way to work out why.
 * Checking here turns that into a sentence telling them which field is too
 * long. Keep these in step with the schema.
 */
export const LIMITS = {
  branchRef: 40,
  slug: 190,

  personName: 120,
  email: 190,
  phone: 40,
  address: 300,
  grade: 60,
  school: 160,

  title: 200,
  caption: 200,
  excerpt: 400,
  campusSize: 60,
  grades: 80,
  roleDetail: 120,
  tone: 20,

  /* TEXT columns — no hard DB limit, but unbounded input is still input. */
  message: 4000,
  body: 200_000,
} as const;

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Digits with optional +, spaces, brackets and dashes; 10-15 digits. */
export const PHONE_RE = /^\+?[0-9]{10,15}$/;

export interface FieldSpec {
  label: string;
  max: number;
  /** Reject an empty value (after trimming). */
  required?: boolean;
  min?: number;
}

/**
 * Trim and check one string field. Returns the cleaned value, or a message
 * written for the person filling the form rather than for a log.
 */
export function checkText(
  raw: unknown,
  { label, max, required = false, min }: FieldSpec
): { value: string } | { error: string } {
  const value = typeof raw === "string" ? raw.trim() : "";
  if (!value) {
    return required ? { error: `${label} is required.` } : { value: "" };
  }
  if (min && value.length < min) {
    return { error: `${label} must be at least ${min} characters.` };
  }
  if (value.length > max) {
    return {
      error: `${label} is too long — please keep it under ${max} characters.`,
    };
  }
  return { value };
}

/** Optional unless `required`; must look like an address when present. */
export function checkEmail(
  raw: unknown,
  { label = "Email", required = false } = {}
): { value: string } | { error: string } {
  const checked = checkText(raw, { label, max: LIMITS.email, required });
  if ("error" in checked) return checked;
  const value = checked.value.toLowerCase();
  if (!value) return { value };
  return EMAIL_RE.test(value)
    ? { value }
    : { error: `Please enter a valid ${label.toLowerCase()}.` };
}

/** Optional unless `required`; 10-15 digits once punctuation is stripped. */
export function checkPhone(
  raw: unknown,
  { label = "Phone", required = false } = {}
): { value: string } | { error: string } {
  const checked = checkText(raw, { label, max: LIMITS.phone, required });
  if ("error" in checked) return checked;
  const value = checked.value;
  if (!value) return { value };
  return PHONE_RE.test(value.replace(/[\s()-]/g, ""))
    ? { value }
    : { error: `Please enter a valid ${label.toLowerCase()} (10-15 digits).` };
}

/** Whole number within a range; empty is allowed unless `required`. */
export function checkInt(
  raw: unknown,
  { label, min, max, required = false }: { label: string; min: number; max: number; required?: boolean }
): { value: number | null } | { error: string } {
  const text = typeof raw === "string" ? raw.trim() : "";
  if (!text) {
    return required ? { error: `${label} is required.` } : { value: null };
  }
  const n = Number(text);
  if (!Number.isInteger(n) || n < min || n > max) {
    return { error: `${label} must be a whole number between ${min} and ${max}.` };
  }
  return { value: n };
}

type Checked<T> = { value: T } | { error: string };

/**
 * Run a whole form's checks at once. Returns the first failure, or every
 * cleaned value unwrapped and correctly typed — so an action reads as a list
 * of fields rather than a ladder of ifs and casts.
 */
export function collect<T extends Record<string, Checked<unknown>>>(
  checks: T
): { error: string } | { values: { [K in keyof T]: Extract<T[K], { value: unknown }>["value"] } } {
  const values: Record<string, unknown> = {};
  for (const [key, result] of Object.entries(checks)) {
    if ("error" in result) return { error: result.error };
    values[key] = result.value;
  }
  return {
    values: values as { [K in keyof T]: Extract<T[K], { value: unknown }>["value"] },
  };
}
