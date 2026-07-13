"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Site-wide notification banner. Fetches active notifications from the public
 * API and shows those scoped to "all" plus (on branch pages) the current
 * branch. Dismissals are remembered per-notification in sessionStorage so the
 * banner doesn't nag on every navigation. Kept client-side so the global
 * layout stays statically rendered.
 */

interface PublicNotification {
  id: number;
  title: string;
  body: string;
  branch_ref: string;
  level: "info" | "success" | "warning";
}

const LEVEL_STYLES: Record<PublicNotification["level"], string> = {
  info: "border-primary/30 bg-primary/5 text-primary",
  success: "border-success/30 bg-success/5 text-success",
  warning: "border-accent/40 bg-accent/10 text-accent-ink",
};

function currentBranchSlug(pathname: string | null): string | null {
  const match = pathname?.match(/^\/branches\/([^/]+)/);
  return match ? match[1] : null;
}

export default function NotificationBanner() {
  const pathname = usePathname();
  const [items, setItems] = useState<PublicNotification[]>([]);
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());

  const branch = currentBranchSlug(pathname);

  useEffect(() => {
    const params = new URLSearchParams();
    if (branch) params.set("branch", branch);
    let active = true;
    fetch(`/api/notifications?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : { notifications: [] }))
      .then((data: { notifications: PublicNotification[] }) => {
        if (active) setItems(data.notifications ?? []);
      })
      .catch(() => {
        /* DB offline or route error — show nothing, never break the page. */
      });
    return () => {
      active = false;
    };
  }, [branch]);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("sunrise_dismissed_notices");
      if (raw) setDismissed(new Set(JSON.parse(raw) as number[]));
    } catch {
      /* ignore */
    }
  }, []);

  function dismiss(id: number) {
    setDismissed((prev) => {
      const next = new Set(prev).add(id);
      try {
        sessionStorage.setItem(
          "sunrise_dismissed_notices",
          JSON.stringify([...next])
        );
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  const visible = items.filter((n) => !dismissed.has(n.id));
  if (visible.length === 0) return null;

  return (
    <div className="border-b border-border bg-bg-alt">
      <div className="mx-auto max-w-content px-4 py-2">
        <ul className="space-y-2">
          {visible.map((n) => (
            <li
              key={n.id}
              className={`flex items-start gap-3 rounded-card border px-4 py-2.5 text-sm ${LEVEL_STYLES[n.level]}`}
            >
              <div className="min-w-0 flex-1">
                <span className="font-semibold">{n.title}</span>
                {n.body ? (
                  <span className="text-text-muted"> — {n.body}</span>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => dismiss(n.id)}
                aria-label="Dismiss notification"
                className="shrink-0 rounded-card px-1 text-text-muted hover:text-text"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
