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
import { BTN_BASE, BTN_SIZE, BTN_TONE } from "@/components/site/school-kit";
import { site } from "@/data/site";
import type { BranchSlug } from "@/data/types";

const LAST_BRANCH_KEY = "sis:lastBranch";

interface NavItem {
  label: string;
  href: string;
  /**
   * True when the href is only a grouping key, not a page. Admission has no
   * hub page of its own — its content moved to /registration-form — so the
   * drawer renders this one as a heading instead of a dead link. The desktop
   * bar already renders every group as a button.
   */
  groupOnly?: boolean;
}

/**
 * The school's running order for the menu, which supersedes the document's
 * "Header Menu" line. The document listed Facilities at the top level; it now
 * sits inside About Us, and News & Events takes its place in the bar. This
 * array is the single source of truth for both the desktop bar and the mobile
 * drawer. Branches is not in the document either, but the campuses it lists
 * are managed in the database, so it stays.
 */
const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Branches", href: "/branches" },
  { label: "Academics", href: "/academics" },
  { label: "Admission", href: "/admissions", groupOnly: true },
  { label: "News & Events", href: "/news" },
  { label: "Blogs", href: "/blog" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact Us", href: "/contact" },
];

/**
 * Dropdowns, in the order the school set them out.
 *
 * About and Academics lead with their own hub page: on desktop a nav item
 * that has a dropdown renders as a button rather than a link, so without that
 * first entry /about and /academics would have no way in at all. Admission has
 * no hub page — it was removed and its content now opens the Registration Form
 * page — so that group is marked groupOnly and carries no such row.
 *
 * Faculty moved out of About Us and into Academics, and Results out of
 * Academics and into Admission. School Calendar and Mandatory Disclosure are
 * the two pages the document has no copy for, so they carry only what is
 * actually known. Gallery is deliberately not in About Us — it is a top-level
 * item of its own.
 */
const SUBNAV: Record<string, NavItem[]> = {
  "/about": [
    { label: "About", href: "/about" },
    { label: "Facility", href: "/facilities" },
    { label: "Our Mission and Vision", href: "/vision-mission" },
    { label: "School Calendar", href: "/school-calendar" },
    { label: "Location", href: "/#location" },
    { label: "Mandatory Disclosure", href: "/mandatory-disclosure" },
  ],
  "/academics": [
    { label: "Academics", href: "/academics" },
    { label: "Nursery", href: "/nursery" },
    { label: "Primary", href: "/primary" },
    { label: "Secondary", href: "/secondary" },
    { label: "Senior Secondary", href: "/senior-secondary" },
    { label: "Advance Program", href: "/advance-program" },
    { label: "Faculty", href: "/faculty" },
  ],
  "/admissions": [
    { label: "Admission Process", href: "/admission-process" },
    { label: "Registration Form", href: "/registration-form" },
    { label: "Fee Structure", href: "/fee-structure" },
    { label: "Eligibility Criteria", href: "/eligibility-criteria" },
    { label: "Results", href: "/results" },
  ],
};

/** Desktop shows the document's menu in full; the drawer repeats it. */
const DESKTOP_NAV_ITEMS: NavItem[] = NAV_ITEMS;

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

/*
 * Nav items carry a gold rule that draws in from the left on hover and stays
 * put on the current page. The rule animates `scale` (not width) so it is
 * composited rather than re-laid-out on every frame — and the transition
 * names transform, which in Tailwind v4 covers scale.
 */
const desktopLinkBase =
  "group relative inline-flex items-center gap-1 px-1 py-2 text-[clamp(0.78rem,0.73rem+0.12vw,0.875rem)] font-semibold transition-colors duration-200";
const desktopLinkActive = "text-[#154a8a]";
const desktopLinkIdle = "text-text-muted hover:text-[#154a8a]";

/** The sliding rule. `active` pins it open; otherwise it follows hover/focus. */
function NavRule({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 bottom-0.5 h-[2px] origin-left rounded-pill bg-[#a8802f] transition-transform duration-300 ease-out motion-reduce:transition-none ${
        active
          ? "scale-x-100"
          : "scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100"
      }`}
    />
  );
}

export default function Header() {
  const pathname = usePathname();
  const campuses = useBranches();

  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [lastBranch, setLastBranch] = useState<BranchSlug | null>(null);
  /** Bar slides away going down the page and returns on any upward scroll. */
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerCloseRef = useRef<HTMLButtonElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const menuBarRef = useRef<HTMLUListElement>(null);

  /* ——— Desktop dropdowns: close on outside click / Esc / route change ——— */
  useEffect(() => {
    setOpenMenu(null);
  }, [pathname]);

  useEffect(() => {
    if (!openMenu) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!menuBarRef.current?.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openMenu]);

  /* ——— Sticky shadow, and hide-on-scroll-down / show-on-scroll-up ———
     The bar leaves once the reader is well past it and returns on a
     deliberate upward scroll. The delta threshold is what stops trackpad
     jitter and momentum from flicking it in and out — too small a value and
     the movement reads as a snap rather than a slide. ——— */
  useEffect(() => {
    lastScrollY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      const delta = y - lastScrollY.current;
      if (Math.abs(delta) < 12) return;
      setHidden(delta > 0 && y > 140);
      lastScrollY.current = y;
    };
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

  /* ——— Drawer: lock body scroll + move focus in, restore focus out ———
   *
   * Hiding the body's overflow removes the scrollbar, and the page then widens
   * by its width — which reads as a jolt the moment the menu opens and again
   * when it closes. Padding the body by exactly that width holds the layout
   * still. `preventScroll` matters too: focusing a control inside a panel that
   * is still sliding in makes the browser scroll it into view mid-animation.
   */
  useEffect(() => {
    if (!drawerOpen) return;
    const { body, documentElement } = document;
    const scrollbar = window.innerWidth - documentElement.clientWidth;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;

    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    drawerCloseRef.current?.focus({ preventScroll: true });

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
      hamburgerRef.current?.focus({ preventScroll: true });
    };
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

  /* Keep the bar in place while the drawer or a dropdown is open — derived
     rather than pushed through an effect, which would cost a second render. */
  const barHidden = hidden && !drawerOpen && !openMenu;

  const renderDesktopLink = (item: NavItem) => {
    const active = isActive(pathname, item.href);

    /*
     * Any item with a SUBNAV group becomes a dropdown. It opens on hover (and
     * on focus, so the keyboard behaves the same), and the click handler stays
     * for touch, where there is no hover to speak of. The panel is glued to
     * the trigger with no gap so the pointer cannot fall through the crack on
     * its way down.
     */
    /* Campuses come from the database via useBranches, so this group is built
       per render rather than read from the static SUBNAV map. */
    const isBranches = item.href === "/branches";
    const group = isBranches
      ? campuses.map((campus) => ({ label: campus.name, href: `/branches/${campus.slug}` }))
      : SUBNAV[item.href];
    if (group) {
      const open = openMenu === item.href;
      return (
        <li
          key={item.href}
          className="relative"
          onMouseEnter={() => setOpenMenu(item.href)}
          onMouseLeave={() => setOpenMenu(null)}
        >
          <button
            type="button"
            aria-expanded={open}
            aria-haspopup="menu"
            onClick={() =>
              setOpenMenu((current) => (current === item.href ? null : item.href))
            }
            onFocus={() => setOpenMenu(item.href)}
            className={`${desktopLinkBase} ${
              active ? desktopLinkActive : desktopLinkIdle
            }`}
          >
            {item.label}
            <NavRule active={active} />
            {isBranches ? (
              <span
                className={`ml-0.5 rounded-pill px-1.5 py-0.5 text-[0.65625rem] font-semibold leading-none ${
                  active ? "bg-primary-soft text-primary" : "bg-bg-alt text-faint"
                }`}
              >
                {campuses.length}
              </span>
            ) : null}
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
              className={`h-3.5 w-3.5 transition-transform duration-300 ease-out ${open ? "rotate-180" : ""}`}
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

          {open ? (
            <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2">
              <div className="menu-in w-64 overflow-hidden rounded-card border border-hairline bg-surface shadow-card-hover">
                <ul className="p-1.5">
                  {group.map((sub) => (
                    <li key={sub.href}>
                      <Link
                        href={sub.href}
                        onClick={() => setOpenMenu(null)}
                        className="flex items-center gap-2.5 rounded-btn px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-bg-alt"
                      >
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 shrink-0 rounded-pill bg-[#a8802f]"
                        />
                        {sub.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                {isBranches ? (
                  <Link
                    href="/branches"
                    onClick={() => setOpenMenu(null)}
                    className="block border-t border-hairline px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary-soft"
                  >
                    View all branches
                    <span aria-hidden="true"> →</span>
                  </Link>
                ) : null}
              </div>
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
          <NavRule active={active} />
        </Link>
      </li>
    );
  };

  const renderDrawerLink = (item: NavItem) => {
    const active = isActive(pathname, item.href);
    const badge =
      item.href === "/branches" ? (
        <span className="ml-2 rounded-pill bg-bg-alt px-2 py-0.5 text-xs font-semibold text-faint">
          {campuses.length}
        </span>
      ) : null;
    return (
      <li key={item.href}>
        {item.groupOnly ? (
          <p
            className={`px-3 py-2.5 text-base font-medium ${
              active ? "text-primary" : "text-text"
            }`}
          >
            {item.label}
            {badge}
          </p>
        ) : (
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
            {badge}
          </Link>
        )}
        {/* Nested sub-pages under "Academics" and "Admissions" */}
        {SUBNAV[item.href] ? (
          <ul className="mb-1 ml-3 mt-0.5 space-y-0.5 border-l border-hairline pl-3">
            {SUBNAV[item.href].map((sub) => {
              const subActive = isActive(pathname, sub.href);
              return (
                <li key={sub.href}>
                  <Link
                    href={sub.href}
                    aria-current={subActive ? "page" : undefined}
                    className={`block rounded-btn px-3 py-2 text-sm ${
                      subActive
                        ? "bg-primary-soft font-medium text-primary"
                        : "text-text-muted hover:bg-bg-alt hover:text-text"
                    }`}
                  >
                    {sub.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : null}
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
        className={`sticky top-0 z-50 bg-surface [will-change:transform] transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
          barHidden ? "-translate-y-full" : "translate-y-0"
        } ${
          scrolled ? "shadow-[0_8px_28px_-18px_rgba(20,30,50,0.25)]" : "shadow-none"
        }`}
      >
      {/* Main bar — single glass sticky bar (utility bar removed; phone/email
          and socials live in the footer, F1 quick link moved inline). */}
      <div>
        <div className="mx-auto max-w-content flex items-center justify-between gap-4 py-3 px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20">
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
              className="h-11 w-auto sm:h-12 md:h-14"
            />
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Main" className="hidden lg:block">
            <ul ref={menuBarRef} className="flex items-center gap-5 xl:gap-7">
              {DESKTOP_NAV_ITEMS.map(renderDesktopLink)}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/registration-form"
              /* max-md:hidden, not `hidden md:inline-flex` — the shared base
                 already sets inline-flex, and a bare `hidden` loses to it in
                 the cascade, which would leak this button onto mobile where
                 the drawer carries its own. */
              className={`max-md:hidden ${BTN_BASE} ${BTN_SIZE.sm} ${BTN_TONE.teal}`}
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
        {/* Overlay. Always mounted, opacity animated: unmounting it on close
            made the backdrop disappear instantly while the panel still had
            300ms of travel left, which is what read as a flicker. */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ease-out motion-reduce:transition-none ${
            drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-hidden="true"
          onClick={() => setDrawerOpen(false)}
        />

        {/* Slide-in drawer (design.md §3.1) */}
        <div
          ref={drawerRef}
          id="mobile-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          inert={!drawerOpen}
          onKeyDown={onDrawerKeyDown}
          /* will-change promotes the panel to its own layer so the slide is
             composited instead of repainting the page behind it each frame;
             the easing curve is the same one the sticky bar uses. */
          className={`absolute inset-y-0 right-0 flex w-80 max-w-[85vw] flex-col rounded-l-2xl bg-surface shadow-card-hover [will-change:transform] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
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
            href="/registration-form"
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
