import Link from "next/link";

export interface Crumb {
  label: string;
  /** Omit on the last crumb (current page) — rendered as plain text. */
  href?: string;
}

interface BreadcrumbsProps {
  /**
   * Trail AFTER the "Home" crumb, which is prepended automatically.
   * The last item is the current page (aria-current="page").
   */
  items: Crumb[];
  /** "light" for primary/dark backgrounds (PageHero), "dark" for light ones. */
  tone?: "light" | "dark";
  className?: string;
}

const TONE_CLASSES = {
  light: {
    link: "text-white/75 transition-colors hover:text-white hover:underline",
    current: "font-medium text-white",
    separator: "text-white/40",
  },
  dark: {
    link: "text-text-muted transition-colors hover:text-primary hover:underline",
    current: "font-medium text-text",
    separator: "text-text-muted/60",
  },
} as const;

/** Breadcrumb trail — design.md §3.3: Home / Section / Page on inner pages. */
export default function Breadcrumbs({
  items,
  tone = "light",
  className = "",
}: BreadcrumbsProps) {
  const classes = TONE_CLASSES[tone];
  const crumbs: Crumb[] = [{ label: "Home", href: "/" }, ...items];

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={`${crumb.label}-${index}`} className="flex items-center gap-2">
              {index > 0 ? (
                <span aria-hidden="true" className={classes.separator}>
                  /
                </span>
              ) : null}
              {isLast || !crumb.href ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={classes.current}
                >
                  {crumb.label}
                </span>
              ) : (
                <Link href={crumb.href} className={classes.link}>
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
