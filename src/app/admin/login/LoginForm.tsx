"use client";

import { useActionState, useState } from "react";
import { login, type LoginState } from "@/lib/actions/auth";

interface DemoAccount {
  label: string;
  scope: string;
  email: string;
  password: string;
}

// Demo accounts seeded by `npm run db:seed`. Shown for easy access during
// setup — remove this block before going live.
const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    label: "Super Admin",
    scope: "All campuses",
    email: "admin@newton-school.example",
    password: "Admin@12345",
  },
  {
    label: "Branch Admin",
    scope: "City Center",
    email: "citycenter.admin@newton-school.example",
    password: "Branch@12345",
  },
];

const inputBase =
  "w-full rounded-card border border-border bg-bg py-3 pl-11 pr-3.5 text-base text-text transition-colors focus:border-primary sm:text-sm";

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export default function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    login,
    {}
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  function useDemo(account: DemoAccount) {
    setEmail(account.email);
    setPassword(account.password);
  }

  return (
    <div className="space-y-6">
      <form action={action} className="grid gap-5" noValidate>
        {state?.error ? (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-card border border-error/30 bg-error/5 px-3.5 py-2.5 text-sm text-error"
          >
            <span aria-hidden="true">⚠</span>
            {state.error}
          </p>
        ) : null}

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-text">
            Email
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-text-muted">
              <MailIcon />
            </span>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@newton-school.example"
              className={inputBase}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-text">
            Password
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-text-muted">
              <LockIcon />
            </span>
            <input
              id="password"
              name="password"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`${inputBase} pr-16`}
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="absolute inset-y-0 right-2 my-1.5 rounded-card px-2 text-xs font-semibold uppercase tracking-wide text-text-muted hover:text-primary"
              aria-pressed={show}
            >
              {show ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="mt-1 inline-flex items-center justify-center gap-2 rounded-card bg-primary px-6 py-3 text-sm font-semibold text-white shadow-card transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? (
            <>
              <svg viewBox="0 0 24 24" className="h-4 w-4 animate-spin" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              Signing in…
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      {/* ——— Demo credentials ——— */}
      <div className="rounded-lg border border-dashed border-accent/40 bg-accent/5 p-4">
        <div className="flex items-center justify-between">
          <p className="eyebrow text-accent-ink">Demo accounts</p>
          <span className="font-mono text-[0.625rem] uppercase tracking-wider text-text-muted">
            click to fill
          </span>
        </div>
        <div className="mt-3 grid gap-2">
          {DEMO_ACCOUNTS.map((acc) => (
            <button
              key={acc.email}
              type="button"
              onClick={() => useDemo(acc)}
              className="group flex items-center justify-between gap-3 rounded-card border border-border bg-bg px-3.5 py-2.5 text-left transition-colors hover:border-primary hover:bg-primary/5"
            >
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-text">
                  {acc.label}
                  <span className="ml-2 font-normal text-text-muted">
                    · {acc.scope}
                  </span>
                </span>
                <span className="block truncate font-mono text-xs text-text-muted">
                  {acc.email}
                </span>
              </span>
              <span className="shrink-0 rounded-pill border border-border px-2.5 py-1 text-xs font-medium text-primary group-hover:border-primary">
                Use
              </span>
            </button>
          ))}
        </div>
        <p className="mt-3 font-mono text-[0.6875rem] text-text-muted">
          Password for both:{" "}
          <span className="font-semibold text-text">ChangeMe123!</span>
        </p>
      </div>
    </div>
  );
}
