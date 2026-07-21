"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { getBranchBySlug, isBranchSlug } from "@/data/branches";
import { useBranches } from "@/components/hooks/useBranches";
import { site } from "@/data/site";
import type { BranchSlug } from "@/data/types";

const LAST_BRANCH_KEY = "sis:lastBranch";

interface NavItem {
  label: string;
  href: string;
}

/**
 * Full nav (design.md §3.1 order) — used by the mobile drawer, where space
 * is vertical. "Branches" is a single combined tab linking to the /branches
 * page — campuses are no longer listed separately.
 */
const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Branches", href: "/branches" },
  { label: "Academics", href: "/academics" },
  { label: "Admissions", href: "/admissions" },
  { label: "News & Events", href: "/news" },
  { label: "Blog", href: "/blog" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

/**
 * Trimmed desktop nav: "Home" lives on the logo, "Admissions" on the CTA
 * button, and "News & Events" shortens to "News" — keeps the glass bar airy.
 */
const DESKTOP_NAV_ITEMS: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Branches", href: "/branches" },
  { label: "Academics", href: "/academics" },
  { label: "News", href: "/news" },
  { label: "Blog", href: "/blog" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Extract the branch slug from a /branches/<slug>... pathname. */
function branchSlugFromPath(pathname: string): BranchSlug | null {
  const match = pathname.match(/^\/branches\/([^/]+)/);
  if (match && isBranchSlug(match[1])) return match[1];
  return null;
}

const desktopLinkBase =
  "rounded-btn px-2.5 py-2 text-[0.90625rem] font-medium transition-colors";
const desktopLinkActive = "text-primary font-semibold";
const desktopLinkIdle = "text-text-muted hover:text-ink";

export default function Header() {
  const pathname = usePathname();
  const campuses = useBranches();

  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [branchesOpen, setBranchesOpen] = useState(false);
  const [lastBranch, setLastBranch] = useState<BranchSlug | null>(null);

  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerCloseRef = useRef<HTMLButtonElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const branchesMenuRef = useRef<HTMLLIElement>(null);

  /* ——— Branches dropdown: close on outside click / Esc / route change ——— */
  useEffect(() => {
    setBranchesOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!branchesOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!branchesMenuRef.current?.contains(event.target as Node)) {
        setBranchesOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setBranchesOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [branchesOpen]);

  /* ——— Sticky shadow after 8px of scroll (design.md §3.1, §7) ——— */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ——— F1: remember the last-visited branch in localStorage ——— */
  useEffect(() => {
    const slug = branchSlugFromPath(pathname);
    try {
      if (slug) {
        window.localStorage.setItem(LAST_BRANCH_KEY, slug);
        setLastBranch(slug);
      } else {
        const stored = window.localStorage.getItem(LAST_BRANCH_KEY);
        setLastBranch(stored && isBranchSlug(stored) ? stored : null);
      }
    } catch {
      // localStorage unavailable (private mode etc.) — quick link simply hides.
    }
  }, [pathname]);

  /* ——— Close the drawer whenever the route changes ——— */
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  /* ——— Drawer: lock body scroll + move focus in, restore focus out ——— */
  useEffect(() => {
    if (drawerOpen) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      drawerCloseRef.current?.focus();
      return () => {
        document.body.style.overflow = previousOverflow;
        hamburgerRef.current?.focus();
      };
    }
  }, [drawerOpen]);

  /* ——— Drawer focus trap + Esc (design.md §8) ——— */
  const onDrawerKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setDrawerOpen(false);
      return;
    }
    if (event.key !== "Tab") return;
    const drawer = drawerRef.current;
    if (!drawer) return;
    const focusable = Array.from(
      drawer.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const lastBranchData = lastBranch ? getBranchBySlug(lastBranch) : undefined;

  const renderDesktopLink = (item: NavItem) => {
    const active = isActive(pathname, item.href);

    /* "Branches" gets a dynamic submenu listing every published campus. */
    if (item.href === "/branches") {
      return (
        <li key={item.href} ref={branchesMenuRef} className="relative">
          <button
            type="button"
            aria-expanded={branchesOpen}
            aria-haspopup="menu"
            onClick={() => setBranchesOpen((open) => !open)}
            className={`${desktopLinkBase} inline-flex items-center gap-1 ${
              active ? desktopLinkActive : desktopLinkIdle
            }`}
          >
            {item.label}
            <span
              className={`ml-0.5 rounded-pill px-1.5 py-0.5 text-[0.65625rem] font-semibold leading-none ${
                active
                  ? "bg-primary-soft text-primary"
                  : "bg-bg-alt text-faint"
              }`}
            >
              {campuses.length}
            </span>
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
              className={`h-3.5 w-3.5 transition-transform ${branchesOpen ? "rotate-180" : ""}`}
            >
              <path
                d="m6 9 6 6 6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {branchesOpen ? (
            <div className="absolute left-1/2 top-full z-50 mt-2 w-72 -translate-x-1/2 overflow-hidden rounded-card border border-hairline bg-surface shadow-card-hover">
              <ul className="max-h-[19.5rem] overflow-y-auto overscroll-contain p-1.5">
                {campuses.map((campus) => (
                  <li key={campus.slug}>
                    <Link
                      href={`/branches/${campus.slug}`}
                      className="flex items-start gap-2.5 rounded-btn px-3 py-2.5 transition-colors hover:bg-bg-alt"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-pill bg-accent"
                      />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-ink">
                          {campus.name}
                        </span>
                        <span className="block truncate text-xs text-faint">
                          {campus.area}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/branches"
                className="block border-t border-hairline px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary-soft"
              >
                View all branches
                <span aria-hidden="true"> →</span>
              </Link>
            </div>
          ) : null}
        </li>
      );
    }

    return (
      <li key={item.href}>
        <Link
          href={item.href}
          aria-current={active ? "page" : undefined}
          className={`${desktopLinkBase} ${active ? desktopLinkActive : desktopLinkIdle}`}
        >
          {item.label}
        </Link>
      </li>
    );
  };

  const renderDrawerLink = (item: NavItem) => {
    const active = isActive(pathname, item.href);
    return (
      <li key={item.href}>
        <Link
          href={item.href}
          aria-current={active ? "page" : undefined}
          className={`block rounded-btn px-3 py-2.5 text-base font-medium ${
            active
              ? "bg-primary-soft text-primary"
              : "text-text hover:bg-bg-alt"
          }`}
        >
          {item.label}
          {item.href === "/branches" ? (
            <span className="ml-2 rounded-pill bg-bg-alt px-2 py-0.5 text-xs font-semibold text-faint">
              {campuses.length}
            </span>
          ) : null}
        </Link>
        {/* Nested campus list under "Branches" */}
        {item.href === "/branches" ? (
          <ul className="mb-1 ml-3 mt-0.5 space-y-0.5 border-l border-hairline pl-3">
            {campuses.map((campus) => {
              const campusActive = isActive(
                pathname,
                `/branches/${campus.slug}`
              );
              return (
                <li key={campus.slug}>
                  <Link
                    href={`/branches/${campus.slug}`}
                    aria-current={campusActive ? "page" : undefined}
                    className={`block rounded-btn px-3 py-2 text-sm ${
                      campusActive
                        ? "bg-primary-soft font-medium text-primary"
                        : "text-text-muted hover:bg-bg-alt hover:text-text"
                    }`}
                  >
                    {campus.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : null}
      </li>
    );
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b bg-bg/90 backdrop-blur-lg transition-[border-color,box-shadow] ${
          scrolled
            ? "border-hairline shadow-[0_8px_30px_-16px_rgba(27,37,54,0.16)]"
            : "border-hairline shadow-none"
        }`}
      >
      {/* Main bar — single glass sticky bar (utility bar removed; phone/email
          and socials live in the footer, F1 quick link moved inline). */}
      <div>
        <div className="mx-auto flex max-w-content items-center justify-between gap-4 px-4 py-3">
          {/* Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center"
            aria-label={`${site.name} — home`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/newton-logo.png"
              alt={`${site.name} logo`}
              className="h-10 w-auto md:h-12"
            />
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {DESKTOP_NAV_ITEMS.map(renderDesktopLink)}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/admissions"
              className="hidden rounded-btn bg-[image:var(--gradient-brand)] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-[1.06] md:inline-block"
            >
              Apply Now
            </Link>

            {/* Mobile hamburger */}
            <button
              ref={hamburgerRef}
              type="button"
              aria-expanded={drawerOpen}
              aria-controls="mobile-drawer"
              aria-label={drawerOpen ? "Close menu" : "Open menu"}
              onClick={() => setDrawerOpen((open) => !open)}
              className="rounded-card p-2 text-primary hover:bg-bg-alt lg:hidden"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      </header>

      {/* Mobile drawer layer — a sibling of the header (backdrop-blur on the
          header would make it the containing block for fixed descendants) and
          an overflow-hidden viewport wrapper, so the off-canvas drawer never
          widens the page and makes mobile browsers zoom out. */}
      <div
        className={`fixed inset-0 z-50 overflow-hidden lg:hidden ${
          drawerOpen ? "" : "pointer-events-none"
        }`}
      >
        {/* Overlay */}
        {drawerOpen ? (
          <div
            className="absolute inset-0 bg-black/40"
            aria-hidden="true"
            onClick={() => setDrawerOpen(false)}
          />
        ) : null}

        {/* Slide-in drawer (design.md §3.1) */}
        <div
          ref={drawerRef}
          id="mobile-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          inert={!drawerOpen}
          onKeyDown={onDrawerKeyDown}
          className={`absolute inset-y-0 right-0 flex w-80 max-w-[85vw] flex-col rounded-l-2xl bg-surface shadow-card-hover transition-transform duration-300 ${
            drawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
        <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
          <span className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/newton-logo.png"
              alt={`${site.name} logo`}
              className="h-10 w-auto"
            />
          </span>
          <button
            ref={drawerCloseRef}
            type="button"
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
            className="rounded-card p-2 text-text hover:bg-bg-alt"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              aria-hidden="true"
              focusable="false"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                d="m6 6 12 12M18 6 6 18"
              />
            </svg>
          </button>
        </div>

        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-3 py-4">
          {lastBranchData ? (
            <Link
              href={`/branches/${lastBranchData.slug}`}
              className="mb-3 flex items-center gap-2 rounded-btn bg-bg-alt px-3 py-2.5 text-sm font-medium text-primary"
            >
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-pill bg-accent"
              />
              Your campus: {lastBranchData.name}
            </Link>
          ) : null}
          <ul className="flex flex-col gap-0.5">
            {NAV_ITEMS.map(renderDrawerLink)}
          </ul>
        </nav>

        <div className="border-t border-hairline p-4">
          <Link
            href="/admissions"
            className="block rounded-btn bg-[image:var(--gradient-brand)] px-4 py-3 text-center text-sm font-semibold text-white transition hover:brightness-[1.06]"
          >
            Admissions Open — Apply
          </Link>
        </div>
        </div>
      </div>
    </>
  );
}
