"use client";

import {
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";

export interface AccordionEntry {
  /** Stable unique id within this accordion (used for ARIA wiring). */
  id: string;
  heading: ReactNode;
  content: ReactNode;
}

interface AccordionProps {
  items: AccordionEntry[];
  /** id of the entry open on first render; omit for all closed. */
  defaultOpenId?: string;
  /** Heading level for the row headings (default 3). */
  headingLevel?: 2 | 3 | 4;
  className?: string;
}

/**
 * Accordion — design.md §3.3: border-bottom rows, +/− indicator, one open at
 * a time. Keyboard: Enter/Space toggle, ArrowUp/ArrowDown/Home/End move
 * between headers (§8). Used for FAQs and career positions.
 */
export default function Accordion({
  items,
  defaultOpenId,
  headingLevel = 3,
  className = "",
}: AccordionProps) {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const HeadingTag = `h${headingLevel}` as "h2" | "h3" | "h4";

  const onButtonKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    const buttons = buttonRefs.current.filter(
      (button): button is HTMLButtonElement => button !== null
    );
    const currentIndex = buttons.findIndex(
      (button) => button === document.activeElement
    );
    if (currentIndex === -1) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      buttons[(currentIndex + 1) % buttons.length]?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      buttons[(currentIndex - 1 + buttons.length) % buttons.length]?.focus();
    } else if (event.key === "Home") {
      event.preventDefault();
      buttons[0]?.focus();
    } else if (event.key === "End") {
      event.preventDefault();
      buttons[buttons.length - 1]?.focus();
    }
  };

  return (
    <div
      className={`overflow-hidden rounded-card border border-hairline bg-surface shadow-card ${className}`}
    >
      {items.map((item, index) => {
        const open = openId === item.id;
        const buttonId = `${baseId}-${item.id}-button`;
        const panelId = `${baseId}-${item.id}-panel`;
        return (
          <div
            key={item.id}
            className="border-b border-hairline px-5 last:border-b-0"
          >
            <HeadingTag className="m-0">
              <button
                ref={(node) => {
                  buttonRefs.current[index] = node;
                }}
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() =>
                  setOpenId((previous) => (previous === item.id ? null : item.id))
                }
                onKeyDown={onButtonKeyDown}
                className="flex w-full items-center justify-between gap-4 py-4 text-left font-heading text-base font-semibold text-text transition-colors hover:text-primary"
              >
                <span>{item.heading}</span>
                <span
                  aria-hidden="true"
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-pill text-lg leading-none transition-colors ${
                    open ? "bg-primary text-white" : "bg-primary-soft text-primary"
                  }`}
                >
                  {open ? "−" : "+"}
                </span>
              </button>
            </HeadingTag>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!open}
              className="pb-5 text-sm leading-relaxed text-text-muted"
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
