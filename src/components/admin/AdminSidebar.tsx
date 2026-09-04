"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
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

interface NavGroup {
  label?: string;
  items: NavItem[];
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

const NAV_GROUPS: NavGroup[] = [
  {
    items: [
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
    ],
  },
  {
    label: "Inbox",
    items: [
      {
        href: "/admin/submissions",
        label: "Submissions",
        icon: (
          <svg {...ic}>
            <path d="M6 3h9l4 4v14H6z" />
            <path d="M15 3v4h4" />
            <path d="M9 12h7M9 16h4" />
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
    ],
  },
  {
    label: "Content",
    items: [
      {
        // Unified section: campus records + public page content.
        href: "/admin/branches",
        label: "Branches",
        icon: (
          <svg {...ic}>
            <path d="M3 21h18M5 21V7l7-4 7 4v14" />
            <path d="M9 21v-5h6v5M9 10h.01M15 10h.01M9 13h.01M15 13h.01" />
          </svg>
        ),
      },
      {
        href: "/admin/testimonials",
        label: "Testimonials",
        icon: (
          <svg {...ic}>
            <path d="M4 5h16v11H9l-5 4z" />
            <path d="M8.5 9.5h.01M12 9.5h.01M15.5 9.5h.01" />
          </svg>
        ),
      },
      {
        href: "/admin/gallery",
        label: "Gallery",
        icon: (
          <svg {...ic}>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <circle cx="9" cy="10" r="1.6" />
            <path d="m5 19 5.5-5.5 3 3L17 13l4 4" />
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
    ],
  },
  {
    label: "System",
    items: [
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
    ],
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

function Brand() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-[0.625rem] bg-[image:var(--gradient-brand)] font-heading text-lg font-semibold text-white">
        N
      </span>
      <span className="leading-tight">
        <span className="block font-heading text-[0.95rem] font-semibold text-ink">
          Newton Admin
        </span>
        <span className="text-[0.7rem] text-faint">{site.name}</span>
      </span>
    </span>
  );
}

export default function AdminSidebar({ user }: { user: SessionUser }) {
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);

  /* While the drawer is open: lock body scroll and close on Escape.
     (Nav links close it via onClick, so no route-change effect needed.) */
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const groups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter(
      (item) => !item.superAdminOnly || user.role === "super_admin"
    ),
  })).filter((group) => group.items.length > 0);

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-hairline bg-surface px-4 py-3 lg:hidden">
        <Link href="/admin">
          <Brand />
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-btn border border-border px-3 py-1.5 text-sm text-text"
          aria-expanded={open}
          aria-controls="admin-sidebar"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {/* Mobile backdrop */}
      {open ? (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside
        id="admin-sidebar"
        className={`${
          open
            ? "fixed inset-y-0 left-0 z-40 block w-80 max-w-[85vw] overflow-y-auto"
            : "hidden"
        } border-r border-hairline bg-surface lg:sticky lg:top-0 lg:z-auto lg:block lg:h-screen lg:w-[16.5rem] lg:shrink-0 lg:overflow-y-visible`}
      >
        <div className="flex h-full flex-col p-3">
          {/* Brand */}
          <Link
            href="/admin"
            className="mb-3 hidden rounded-lg px-2 py-3 lg:block"
          >
            <Brand />
          </Link>

          <nav className="flex-1 space-y-5" onClick={() => setOpen(false)}>
            {groups.map((group, groupIndex) => (
              <div key={group.label ?? `group-${groupIndex}`}>
                {group.label ? (
                  <p className="eyebrow mb-1.5 px-3 text-faint">
                    {group.label}
                  </p>
                ) : null}
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const active = isActive(pathname, item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-center gap-3 rounded-btn px-3 py-2 text-sm font-medium transition-colors ${
                          active
                            ? "bg-primary-soft text-primary"
                            : "text-text-muted hover:bg-bg-alt hover:text-ink"
                        }`}
                      >
                        <span
                          className={active ? "text-primary" : "text-faint"}
                          aria-hidden="true"
                        >
                          {item.icon}
                        </span>
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* View public site */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-2 flex items-center gap-3 rounded-btn px-3 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-bg-alt hover:text-ink"
          >
            <svg {...ic} className="h-[18px] w-[18px] text-faint">
              <circle cx="12" cy="12" r="9" />
              <path d="M3.5 12h17M12 3a14.5 14.5 0 0 1 0 18M12 3a14.5 14.5 0 0 0 0 18" />
            </svg>
            View public site
            <span className="sr-only"> (opens in a new tab)</span>
          </a>

          {/* User card */}
          <div className="rounded-card border border-hairline bg-bg-alt p-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.625rem] bg-[image:var(--gradient-brand)] text-sm font-semibold text-white">
                {initials(user.name)}
              </span>
              <span className="min-w-0 leading-tight">
                <span className="block truncate text-sm font-medium text-ink">
                  {user.name}
                </span>
                <span className="block truncate text-xs text-faint">
                  {roleLabel(user.role)}
                  {user.branchSlug ? ` · ${user.branchSlug}` : ""}
                </span>
              </span>
            </div>
            <form action={logout} className="mt-3">
              <button
                type="submit"
                className="w-full rounded-btn border border-border bg-surface px-3 py-2 text-sm font-medium text-text transition-colors hover:border-primary/40 hover:text-primary"
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
