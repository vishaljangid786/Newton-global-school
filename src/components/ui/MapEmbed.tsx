import { useId } from "react";
import { googleMapsUrl } from "@/lib/format";

interface MapEmbedProps {
  address: string;
  /** Optional heading line above the address, e.g. the campus name. */
  name?: string;
  className?: string;
}

/**
 * Map placeholder panel (F9 stand-in — deliberately NOT an iframe): 16:9
 * bg-alt panel with a map-pin motif, the address, and an external
 * "Open in Google Maps" link.
 */
export default function MapEmbed({
  address,
  name,
  className = "",
}: MapEmbedProps) {
  const patternId = useId();

  return (
    <div
      className={`relative flex aspect-video min-h-56 w-full flex-col items-center justify-center overflow-hidden rounded-card border border-border bg-bg-alt px-6 py-6 text-center ${className}`}
    >
      {/* Decorative street-grid pattern */}
      <svg
        className="absolute inset-0 h-full w-full text-primary/10"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <pattern
            id={patternId}
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 24h48M24 0v48"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
            <circle cx="24" cy="24" r="2" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>

      <span
        aria-hidden="true"
        className="relative flex h-12 w-12 items-center justify-center rounded-pill bg-primary text-white shadow-card"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" focusable="false">
          <path
            fill="currentColor"
            d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"
          />
        </svg>
      </span>
      {name ? (
        <p className="relative mt-3 font-heading text-base font-semibold text-text">
          {name}
        </p>
      ) : null}
      <p className="relative mt-1 max-w-md text-sm text-text-muted">{address}</p>
      <a
        href={googleMapsUrl(address)}
        target="_blank"
        rel="noopener noreferrer"
        className="relative mt-4 inline-flex items-center gap-1.5 rounded-card bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
      >
        Open in Google Maps
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5"
          aria-hidden="true"
          focusable="false"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 17 17 7m0 0H9m8 0v8"
          />
        </svg>
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </div>
  );
}
