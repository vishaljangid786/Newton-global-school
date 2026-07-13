"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import SocialIcon from "@/components/ui/SocialIcon";
import { getBranchBySlug, isBranchSlug } from "@/data/branches";
import { site } from "@/data/site";
import type { BranchSlug } from "@/data/types";

const LAST_BRANCH_KEY = "sis:lastBranch";

interface NavItem {
  label: string;
  href: string;
}

/**
 * Primary nav (design.md §3.1 order). "Branches" is a single combined tab
 * linking to the /branches page — campuses are no longer listed separately.
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
  "rounded-card px-2.5 py-2 text-sm font-medium transition-colors hover:text-primary";
const desktopLinkActive = "text-primary font-semibold";
const desktopLinkIdle = "text-text";

export default function Header() {
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lastBranch, setLastBranch] = useState<BranchSlug | null>(null);

  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerCloseRef = useRef<HTMLButtonElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

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
          className={`block rounded-card px-3 py-2.5 text-base font-medium ${
            active ? "bg-bg-alt text-primary" : "text-text hover:bg-bg-alt"
          }`}
        >
          {item.label}
        </Link>
      </li>
    );
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-bg transition-shadow ${
        scrolled ? "shadow-card" : "shadow-none"
      }`}
    >
      {/* Top utility bar — desktop only (design.md §3.1) */}
      <div className="hidden bg-primary-dark text-white lg:block">
        <div className="mx-auto flex max-w-content items-center justify-between gap-4 px-4 py-1.5 text-xs">
          <div className="flex items-center gap-5">
            <a
              href={`tel:${site.headOffice.phone}`}
              className="flex items-center gap-1.5 hover:underline"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  fill="currentColor"
                  d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.36 11.36 0 0 0 3.57.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02Z"
                />
              </svg>
              {site.headOffice.phone}
            </a>
            <a
              href={`mailto:${site.headOffice.email}`}
              className="flex items-center gap-1.5 hover:underline"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  fill="currentColor"
                  d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5Z"
                />
              </svg>
              {site.headOffice.email}
            </a>
          </div>
          <div className="flex items-center gap-4">
            {lastBranchData ? (
              <Link
                href={`/branches/${lastBranchData.slug}`}
                className="flex items-center gap-1.5 rounded-pill bg-white/10 px-3 py-0.5 font-medium hover:bg-white/20"
              >
                <span aria-hidden="true">★</span>
                Your campus: {lastBranchData.name}
              </Link>
            ) : null}
            <ul className="flex items-center gap-3">
              {site.socialLinks.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    className="block text-white/80 hover:text-white"
                  >
                    <SocialIcon name={social.name} />
                    <span className="sr-only">
                      {site.name} on {social.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-hairline">
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
              className="h-12 w-auto md:h-14"
            />
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-0.5">
              {NAV_ITEMS.map(renderDesktopLink)}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/admissions"
              className="hidden rounded-card bg-accent px-4 py-2.5 text-sm font-semibold text-primary-dark transition-colors hover:bg-accent/90 md:inline-block"
            >
              Admissions Open — Apply
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

      {/* Mobile overlay */}
      {drawerOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-hidden="true"
          onClick={() => setDrawerOpen(false)}
        />
      ) : null}

      {/* Mobile slide-in drawer (design.md §3.1) */}
      <div
        ref={drawerRef}
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!drawerOpen}
        onKeyDown={onDrawerKeyDown}
        className={`fixed inset-y-0 right-0 z-50 flex h-full w-80 max-w-[85vw] flex-col bg-bg shadow-card-hover transition-transform duration-300 lg:hidden ${
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
              className="mb-3 flex items-center gap-2 rounded-card bg-bg-alt px-3 py-2.5 text-sm font-medium text-primary"
            >
              <span aria-hidden="true">★</span>
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
            className="block rounded-card bg-accent px-4 py-3 text-center text-sm font-semibold text-primary-dark hover:bg-accent/90"
          >
            Admissions Open — Apply
          </Link>
        </div>
      </div>
    </header>
  );
}
