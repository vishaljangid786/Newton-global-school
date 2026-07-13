"use client";

import {
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";

const TABS = [
  { key: "notices", label: "Notices" },
  { key: "events", label: "Events" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

interface NoticesEventsTabsProps {
  /** Server-rendered content for the Notices tab. */
  noticesPanel: ReactNode;
  /** Server-rendered content for the Events tab. */
  eventsPanel: ReactNode;
  className?: string;
}

/**
 * Notices | Events tab switcher (design.md §5.8). Panels are rendered on the
 * server and passed in as children, so only the tab state lives on the
 * client. Keyboard: ArrowLeft/ArrowRight/Home/End move between tabs and
 * select them; inactive tabs are removed from the tab order (§8).
 */
export default function NoticesEventsTabs({
  noticesPanel,
  eventsPanel,
  className = "",
}: NoticesEventsTabsProps) {
  const baseId = useId();
  const [active, setActive] = useState<TabKey>("notices");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const tabId = (key: TabKey) => `${baseId}-tab-${key}`;
  const panelId = (key: TabKey) => `${baseId}-panel-${key}`;

  const moveTo = (index: number) => {
    const next = (index + TABS.length) % TABS.length;
    setActive(TABS[next].key);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveTo(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveTo(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      moveTo(0);
    } else if (event.key === "End") {
      event.preventDefault();
      moveTo(TABS.length - 1);
    }
  };

  const panels: Record<TabKey, ReactNode> = {
    notices: noticesPanel,
    events: eventsPanel,
  };

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label="Notices and events"
        className="flex gap-1 border-b border-border"
      >
        {TABS.map((tab, index) => {
          const selected = active === tab.key;
          return (
            <button
              key={tab.key}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              id={tabId(tab.key)}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={panelId(tab.key)}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(tab.key)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={`-mb-px border-b-2 px-5 py-3 font-heading text-sm font-semibold transition-colors ${
                selected
                  ? "border-primary text-primary"
                  : "border-transparent text-text-muted hover:text-primary"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {TABS.map((tab) => (
        <div
          key={tab.key}
          id={panelId(tab.key)}
          role="tabpanel"
          aria-labelledby={tabId(tab.key)}
          hidden={active !== tab.key}
          tabIndex={0}
          className="pt-6"
        >
          {panels[tab.key]}
        </div>
      ))}
    </div>
  );
}
