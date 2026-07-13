"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { logout } from "@/lib/actions/auth";
import { roleLabel } from "@/lib/rbac";
import { site } from "@/data/site";
import type { SessionUser } from "@/lib/admin-types";

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
  superAdminOnly?: boolean;
}

const ic = {
  className: "h-[18px] w-[18px]",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
};

const NAV: NavItem[] = [
  {
    href: "/admin",
    label: "Overview",
    icon: (
      <svg {...ic}>
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
      </svg>
    ),
  },
  {
    href: "/admin/enquiries",
    label: "Enquiries",
    icon: (
      <svg {...ic}>
        <path d="M4 5h16v12H7l-3 3z" />
        <path d="M8 9h8M8 13h5" />
      </svg>
    ),
  },
  {
    href: "/admin/notifications",
    label: "Notifications",
    icon: (
      <svg {...ic}>
        <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
        <path d="M10 20a2 2 0 0 0 4 0" />
      </svg>
    ),
  },
  {
    href: "/admin/branches",
    label: "Branches",
    superAdminOnly: true,
    icon: (
      <svg {...ic}>
        <path d="M3 21h18M5 21V7l7-4 7 4v14" />
        <path d="M9 21v-5h6v5M9 10h.01M15 10h.01M9 13h.01M15 13h.01" />
      </svg>
    ),
  },
  {
    href: "/admin/branch",
    label: "Branch Content",
    icon: (
      <svg {...ic}>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
      </svg>
    ),
  },
  {
    href: "/admin/blogs",
    label: "Blogs",
    icon: (
      <svg {...ic}>
        <path d="M4 4h11l5 5v11H4z" />
        <path d="M14 4v5h5M8 13h8M8 17h6" />
      </svg>
    ),
  },
  {
    href: "/admin/users",
    label: "Users",
    superAdminOnly: true,
    icon: (
      <svg {...ic}>
        <circle cx="9" cy="8" r="3.2" />
        <path d="M3 20a6 6 0 0 1 12 0" />
        <path d="M16 5.5a3.2 3.2 0 0 1 0 6.4M18 20a6 6 0 0 0-3-5.2" />
      </svg>
    ),
  },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  // Avoid /admin/branches matching /admin/branch.
  return pathname === href || pathname.startsWith(`${href}/`);
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const a = parts[0]?.[0] ?? "";
  const b = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (a + b).toUpperCase() || "?";
}

export default function AdminSidebar({ user }: { user: SessionUser }) {
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);

  const items = NAV.filter(
    (item) => !item.superAdminOnly || user.role === "super_admin"
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-3 lg:hidden">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="inline-flex rounded-md bg-white p-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/newton-logo.png" alt="" className="h-7 w-auto" />
          </span>
          <span className="text-base font-semibold text-white">Admin</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-md border border-slate-700 px-3 py-1.5 text-sm text-slate-200"
          aria-expanded={open}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <aside
        className={`${open ? "block" : "hidden"} bg-slate-900 text-slate-300 lg:sticky lg:top-0 lg:block lg:h-screen lg:w-64 lg:shrink-0`}
      >
        <div className="flex h-full flex-col p-3">
          {/* Brand */}
          <Link
            href="/admin"
            className="mb-2 hidden items-center gap-2.5 rounded-lg px-2 py-3 lg:flex"
          >
            <span className="inline-flex rounded-md bg-white p-1.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/newton-logo.png" alt={`${site.name} logo`} className="h-8 w-auto" />
            </span>
            <span className="leading-tight">
              <span className="block text-[0.95rem] font-semibold text-white">
                Newton Admin
              </span>
              <span className="text-[0.7rem] text-slate-400">Dashboard</span>
            </span>
          </Link>

          <nav className="flex-1 space-y-0.5" onClick={() => setOpen(false)}>
            {items.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-slate-800 text-white"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
                  }`}
                >
                  <span
                    className={active ? "text-blue-400" : "text-slate-500"}
                    aria-hidden="true"
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User card */}
          <div className="mt-3 rounded-lg border border-slate-800 bg-slate-800/50 p-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                {initials(user.name)}
              </span>
              <span className="min-w-0 leading-tight">
                <span className="block truncate text-sm font-medium text-white">
                  {user.name}
                </span>
                <span className="block truncate text-xs text-slate-400">
                  {roleLabel(user.role)}
                  {user.branchSlug ? ` · ${user.branchSlug}` : ""}
                </span>
              </span>
            </div>
            <form action={logout} className="mt-3">
              <button
                type="submit"
                className="w-full rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-200 transition-colors hover:bg-slate-800"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
