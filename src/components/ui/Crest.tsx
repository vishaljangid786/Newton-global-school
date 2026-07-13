/**
 * Small inline-SVG school crest: a shield with a rising sun.
 * Decorative — always rendered with aria-hidden.
 */
export default function Crest({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false">
      {/* Shield */}
      <path
        d="M20 1.5 36 7.5v11.7c0 9.6-6.6 16.4-16 19.3-9.4-2.9-16-9.7-16-19.3V7.5Z"
        className="fill-primary"
      />
      <path
        d="M20 4.7 33 9.6v9.6c0 7.9-5.4 13.6-13 16.2-7.6-2.6-13-8.3-13-16.2V9.6Z"
        className="fill-primary-dark"
      />
      {/* Sun rays */}
      <g className="fill-accent">
        <rect x="19.1" y="8" width="1.8" height="4.4" rx="0.9" />
        <rect x="19.1" y="8" width="1.8" height="4.4" rx="0.9" transform="rotate(35 20 22)" />
        <rect x="19.1" y="8" width="1.8" height="4.4" rx="0.9" transform="rotate(-35 20 22)" />
        <rect x="19.1" y="8" width="1.8" height="4.4" rx="0.9" transform="rotate(70 20 22)" />
        <rect x="19.1" y="8" width="1.8" height="4.4" rx="0.9" transform="rotate(-70 20 22)" />
      </g>
      {/* Rising sun over horizon */}
      <path d="M13.4 24.2a6.6 6.6 0 0 1 13.2 0Z" className="fill-accent" />
      <rect x="10" y="25.6" width="20" height="1.7" rx="0.85" className="fill-bg" />
      <rect x="12.5" y="29" width="15" height="1.5" rx="0.75" className="fill-bg/60" />
    </svg>
  );
}
