import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { site } from "@/data/site";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin Sign In",
  robots: { index: false, follow: false },
};

const HIGHLIGHTS = [
  "Review and manage admission enquiries",
  "Send branch-wise notifications to the website",
  "Edit branch pages — facts, facilities, contact",
  "Publish branch & group-wide blog posts",
];

export default async function AdminLoginPage() {
  // Already signed in? Skip the form.
  const user = await getSessionUser();
  if (user) redirect("/admin");

  return (
    <div className="admin-scope grid min-h-[100dvh] lg:grid-cols-[1.05fr_1fr]">
      {/* ——— Left: branded panel (desktop) ——— */}
      <aside className="relative hidden overflow-hidden bg-slate-900 text-white lg:flex lg:flex-col">
        {/* faint architectural pinstripes */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0 58px, rgba(255,255,255,0.04) 58px 59px)",
          }}
        />
        {/* warm glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--color-accent) 30%, transparent), transparent 70%)",
          }}
        />

        <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
          <div className="flex items-center gap-3">
            <span className="inline-flex rounded-card bg-white p-2 shadow-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/newton-logo.png"
                alt={`${site.name} logo`}
                className="h-12 w-auto"
              />
            </span>
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-white/70">
              Admin Console
            </span>
          </div>

          <div className="max-w-md">
            <p className="eyebrow text-accent">Newton Global School</p>
            <h1 className="mt-4 font-heading text-4xl leading-[1.1] text-white xl:text-5xl">
              Run every campus from one calm dashboard.
            </h1>
            <ul className="mt-8 space-y-3.5">
              {HIGHLIGHTS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white/85">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-pill bg-accent/20 text-accent"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m5 13 4 4L19 7" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p className="font-mono text-xs text-white/50">
            © {new Date().getFullYear()} {site.name} · Jaipur
          </p>
        </div>
      </aside>

      {/* ——— Right: sign-in form ——— */}
      <main className="flex min-w-0 items-center justify-center bg-bg px-5 py-12 sm:px-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/newton-logo.png"
              alt={`${site.name} logo`}
              className="h-12 w-auto"
            />
          </div>

          <p className="eyebrow text-accent-ink">Welcome back</p>
          <h2 className="mt-3 font-heading text-3xl text-text">Sign in</h2>
          <p className="mt-2 text-sm text-text-muted">
            Enter your credentials to access the admin dashboard.
          </p>

          <div className="mt-8">
            <LoginForm />
          </div>

          <p className="mt-8 border-t border-hairline pt-6 text-center text-xs text-text-muted">
            Access is restricted to authorised {site.name} staff.
          </p>
        </div>
      </main>
    </div>
  );
}
