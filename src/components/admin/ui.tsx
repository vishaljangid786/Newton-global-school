import type { ReactNode } from "react";

/** Shared presentational pieces for the admin dashboard (Corporate Light). */

/** Whisper card shadow — structure comes from the hairline border. */
export const adminCardShadow = "shadow-[0_6px_20px_rgba(30,45,80,0.04)]";

export function PageHeader({
  title,
  description,
  eyebrow,
  action,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-hairline pb-5">
      <div>
        {eyebrow ? (
          <p className="eyebrow mb-2 flex items-center gap-2 text-primary">
            <span aria-hidden="true" className="h-px w-5 bg-primary/35" />
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-heading text-[1.625rem] leading-tight text-ink">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-sm text-text-muted">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function AdminCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-card border border-hairline bg-surface p-5 ${adminCardShadow} ${className}`}
    >
      {children}
    </div>
  );
}

/** Card with a titled header + hairline divider — for forms and grouped content. */
export function SectionCard({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-card border border-hairline bg-surface ${adminCardShadow} ${className}`}
    >
      <div className="border-b border-hairline px-5 py-4 sm:px-6">
        <h2 className="font-heading text-base text-ink">{title}</h2>
        {description ? (
          <p className="mt-0.5 text-sm text-text-muted">{description}</p>
        ) : null}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
}) {
  return (
    <AdminCard className="flex items-center gap-4">
      {icon ? (
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.625rem] bg-primary-soft text-primary">
          {icon}
        </span>
      ) : null}
      <div className="min-w-0">
        <p className="eyebrow text-faint">{label}</p>
        <p className="mt-1.5 font-heading text-[1.75rem] leading-none text-ink">
          {value}
        </p>
        {hint ? <p className="mt-1.5 text-xs text-faint">{hint}</p> : null}
      </div>
    </AdminCard>
  );
}

const BADGE_TONES: Record<string, string> = {
  new: "border-blue-200 bg-blue-50 text-blue-700",
  contacted: "border-amber-200 bg-amber-50 text-amber-700",
  closed: "border-slate-200 bg-slate-100 text-slate-600",
  draft: "border-amber-200 bg-amber-50 text-amber-700",
  published: "border-green-200 bg-green-50 text-green-700",
  info: "border-blue-200 bg-blue-50 text-blue-700",
  success: "border-green-200 bg-green-50 text-green-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  neutral: "border-slate-200 bg-slate-100 text-slate-600",
  student: "border-blue-200 bg-blue-50 text-blue-700",
  parent: "border-violet-200 bg-violet-50 text-violet-700",
  teacher: "border-teal-200 bg-teal-50 text-teal-700",
};

export function StatusBadge({ tone, children }: { tone: string; children: ReactNode }) {
  const classes = BADGE_TONES[tone] ?? BADGE_TONES.neutral;
  return (
    <span
      className={`inline-flex items-center rounded-pill border px-2.5 py-0.5 text-xs font-medium capitalize ${classes}`}
    >
      {children}
    </span>
  );
}

export function EmptyState({
  children,
  icon,
}: {
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div
      className={`flex flex-col items-center gap-4 rounded-card border border-hairline bg-surface px-6 py-14 text-center ${adminCardShadow}`}
    >
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-pill bg-primary-soft text-primary">
        {icon ?? (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 13h4l1.5 3h5L16 13h4" />
            <path d="M5 13 7 5h10l2 8v5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z" />
          </svg>
        )}
      </span>
      <p className="max-w-sm text-sm text-text-muted">{children}</p>
    </div>
  );
}

export function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-text">
      {children}
    </label>
  );
}

const adminFieldBase =
  "w-full border border-border bg-surface px-3.5 py-2.5 text-base text-text transition-shadow placeholder:text-faint focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15 sm:text-sm";

/** Single-line fields: the pill radius reads as intended at input height. */
export const adminInputClasses = `rounded-btn ${adminFieldBase}`;

/**
 * Multi-line fields. `--radius-btn` is 999px, which on a tall box becomes an
 * ellipse that eats the first and last characters of every line — so text
 * areas get a corner radius instead of a pill.
 */
export const adminTextareaClasses = `rounded-card ${adminFieldBase} leading-relaxed`;

export const adminButtonPrimary =
  "inline-flex items-center justify-center gap-2 rounded-btn bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60";

export const adminButtonOutline =
  "inline-flex items-center justify-center gap-2 rounded-btn border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-text transition-colors hover:border-primary/40 hover:text-primary";

export const adminButtonDanger =
  "inline-flex items-center justify-center gap-2 rounded-btn border border-error/40 bg-surface px-3 py-2 text-sm font-medium text-error transition-colors hover:bg-error/5";
