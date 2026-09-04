"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { adminButtonPrimary } from "@/components/admin/ui";

/**
 * Modal wrapper for the short "create" forms that used to sit open on the
 * page. Built on the native <dialog>: `showModal()` gives a focus trap, Esc to
 * close and an inert background for free, which is a lot of accessibility to
 * reimplement by hand.
 *
 * A form inside calls `useDialogClose()` and fires it when its action
 * succeeds. Outside a dialog that hook is a no-op, so the same form component
 * still works rendered inline (blogs and branches keep their full pages).
 */

const CloseContext = createContext<(() => void) | null>(null);

const noop = () => {};

/** Closes the surrounding dialog, or does nothing when there isn't one. */
export function useDialogClose(): () => void {
  return useContext(CloseContext) ?? noop;
}

export default function AdminDialog({
  label,
  title,
  description,
  children,
  className = "",
}: {
  /** Button text, e.g. "New testimonial". A plus icon is added. */
  label: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  const close = useCallback(() => {
    ref.current?.close();
  }, []);

  const openDialog = () => {
    ref.current?.showModal();
    setOpen(true);
  };

  /* showModal() makes the background inert but does not stop it scrolling,
     so a long list behind the dialog would still move under the wheel. */
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      <button type="button" onClick={openDialog} className={adminButtonPrimary}>
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        {label}
      </button>

      <dialog
        ref={ref}
        onClose={() => setOpen(false)}
        /* The backdrop is the dialog's own padding box, so a click that lands
           on the element itself — never on the panel inside it — is a click
           outside the content. */
        onClick={(event) => {
          if (event.target === ref.current) close();
        }}
        className={`m-auto w-[min(42rem,calc(100vw-2rem))] rounded-card border border-hairline bg-surface p-0 text-text shadow-[0_24px_60px_rgba(30,45,80,0.22)] backdrop:bg-ink/45 ${className}`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-hairline px-5 py-4 sm:px-6">
          <div>
            <h2 className="font-heading text-base text-ink">{title}</h2>
            {description ? (
              <p className="mt-0.5 text-sm text-text-muted">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="-mr-1 -mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-btn text-faint transition-colors hover:bg-primary-soft hover:text-primary"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* Only mounted while open, so every form starts empty each time and
            a stale success message never greets the next opening. */}
        <div className="max-h-[min(70vh,40rem)] overflow-y-auto p-5 sm:p-6">
          {open ? (
            <CloseContext.Provider value={close}>{children}</CloseContext.Provider>
          ) : null}
        </div>
      </dialog>
    </>
  );
}
