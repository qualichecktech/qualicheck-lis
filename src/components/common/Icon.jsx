// src/components/common/Icon.jsx
// Minimal inline SVG icon set. Kept dependency-free on purpose; swap for a
// full icon library later without changing any call sites, since every
// icon is referenced only by name via <Icon name="..." />.

const PATHS = {
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  users:
    'M9 11a4 4 0 100-8 4 4 0 000 8zM3 21v-1a6 6 0 016-6h0a6 6 0 016 6v1M17 11a3.5 3.5 0 100-7M21 21v-1a5.5 5.5 0 00-4-5.3',
  'file-text': 'M6 2h9l5 5v15H6zM14 2v6h6M9 13h6M9 17h6M9 9h2',
  flask: 'M9 2v6l-6 11a2 2 0 002 3h14a2 2 0 002-3L15 8V2M9 2h6',
  'credit-card': 'M2 7h20M2 5h20a1 1 0 011 1v12a1 1 0 01-1 1H2a1 1 0 01-1-1V6a1 1 0 011-1zM6 15h4',
  stethoscope:
    'M5 3v6a5 5 0 0010 0V3M10 20a5 5 0 005-5v-1M18 8a2 2 0 100-4 2 2 0 000 4z',
  'bar-chart': 'M4 20V10M12 20V4M20 20v-7',
  'user-cog': 'M9 11a4 4 0 100-8 4 4 0 000 8zM3 21v-1a6 6 0 016-6h1M18 14v1M18 21v1M15 17.5l.9.5M20.1 20l.9.5M15 20.5l.9-.5M20.1 17.5l.9-.5M18 15.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z',
  settings:
    'M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.7 1.7 0 00.34 1.87l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.7 1.7 0 00-1.87-.34 1.7 1.7 0 00-1 1.55V21a2 2 0 01-4 0v-.09a1.7 1.7 0 00-1-1.55 1.7 1.7 0 00-1.87.34l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.7 1.7 0 00.34-1.87 1.7 1.7 0 00-1.55-1H3a2 2 0 010-4h.09a1.7 1.7 0 001.55-1 1.7 1.7 0 00-.34-1.87l-.06-.06a2 2 0 112.83-2.83l.06.06a1.7 1.7 0 001.87.34H9a1.7 1.7 0 001-1.55V3a2 2 0 014 0v.09a1.7 1.7 0 001 1.55 1.7 1.7 0 001.87-.34l.06-.06a2 2 0 112.83 2.83l-.06.06a1.7 1.7 0 00-.34 1.87V9c.14.41.44.75.84.93.4.18.86.15 1.16-.09H21a2 2 0 010 4h-.09a1.7 1.7 0 00-1.55 1z',
  logout: 'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9',
  chevronDown: 'M6 9l6 6 6-6',
  bell: 'M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0',
  menu: 'M3 12h18M3 6h18M3 18h18',
};

export default function Icon({ name, size = 18, strokeWidth = 1.8, className = '' }) {
  const d = PATHS[name];
  if (!d) return null;
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}
