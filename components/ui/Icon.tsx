type IconProps = {
  name: string;
  filled?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

type IconRenderer = (filled: boolean) => React.ReactNode;

const strokeProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const
};

const icons: Record<string, IconRenderer> = {
  person: (filled) =>
    filled ? (
      <path
        fill="currentColor"
        d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-4.42 0-8 2.24-8 5v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2c0-2.76-3.58-5-8-5z"
      />
    ) : (
      <>
        <path {...strokeProps} d="M20 21a8 8 0 1 0-16 0" />
        <circle {...strokeProps} cx="12" cy="7" r="4" />
      </>
    ),
  user: () => (
    <>
      <path {...strokeProps} d="M20 21a8 8 0 1 0-16 0" />
      <circle {...strokeProps} cx="12" cy="7" r="4" />
    </>
  ),
  mail: () => (
    <>
      <path {...strokeProps} d="M4 6h16v12H4z" />
      <path {...strokeProps} d="m4 7 8 6 8-6" />
    </>
  ),
  lock: () => (
    <>
      <path {...strokeProps} d="M7 11V8a5 5 0 1 1 10 0v3" />
      <path {...strokeProps} d="M5 11h14v10H5z" />
    </>
  ),
  play: () => <path fill="currentColor" d="M8 5v14l11-7z" />,
  check: () => <path {...strokeProps} strokeWidth={4} d="M5 13l4 4L19 7" />,
  arrow_right: () => (
    <>
      <path {...strokeProps} d="M13 5l7 7-7 7" />
      <path {...strokeProps} d="M20 12H4" />
    </>
  ),
  add: () => (
    <>
      <line {...strokeProps} x1="12" y1="5" x2="12" y2="19" />
      <line {...strokeProps} x1="5" y1="12" x2="19" y2="12" />
    </>
  ),
  delete: () => (
    <>
      <line {...strokeProps} x1="3" y1="6" x2="21" y2="6" />
      <path {...strokeProps} d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path {...strokeProps} d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <line {...strokeProps} x1="10" y1="11" x2="10" y2="17" />
      <line {...strokeProps} x1="14" y1="11" x2="14" y2="17" />
    </>
  ),
  edit: () => <path {...strokeProps} d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />,
  local_fire_department: () => <path fill="currentColor" d="M12 2C9 7 7 9 7 13a5 5 0 0 0 10 0c0-4-2-6-5-11z" />,
  logout: () => (
    <>
      <path {...strokeProps} d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline {...strokeProps} points="16 17 21 12 16 7" />
      <line {...strokeProps} x1="21" y1="12" x2="9" y2="12" />
    </>
  ),
  notifications: () => (
    <>
      <path {...strokeProps} d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path {...strokeProps} d="M13.73 21a2 2 0 0 1-3.46 0" />
    </>
  ),
  schedule: () => (
    <>
      <circle {...strokeProps} cx="12" cy="12" r="9" />
      <polyline {...strokeProps} points="12 7 12 12 15 15" />
    </>
  ),
  settings: () => (
    <>
      <circle {...strokeProps} cx="12" cy="12" r="3" />
      <path
        {...strokeProps}
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
      />
    </>
  ),
  star: (filled) =>
    filled ? (
      <path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
    ) : (
      <path {...strokeProps} d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
    ),
  trending_up: () => (
    <>
      <polyline {...strokeProps} points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline {...strokeProps} points="17 6 23 6 23 12" />
    </>
  ),
  verified: () => (
    <>
      <path {...strokeProps} d="M12 2.94a12 12 0 0 0 8.62 3.04A12 12 0 0 1 12 22 12 12 0 0 1 3.38 5.98 12 12 0 0 0 12 2.94z" />
      <path {...strokeProps} d="M9 12l2 2 4-4" />
    </>
  ),
  warning: () => (
    <>
      <path {...strokeProps} d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line {...strokeProps} x1="12" y1="9" x2="12" y2="13" />
      <line {...strokeProps} x1="12" y1="17" x2="12.01" y2="17" />
    </>
  ),
  ac_unit: () => (
    <>
      <line {...strokeProps} x1="12" y1="2" x2="12" y2="22" />
      <line {...strokeProps} x1="2" y1="12" x2="22" y2="12" />
      <line {...strokeProps} x1="5" y1="5" x2="19" y2="19" />
      <line {...strokeProps} x1="19" y1="5" x2="5" y2="19" />
    </>
  ),
  dashboard: () => (
    <>
      <rect {...strokeProps} x="3" y="3" width="10" height="10" rx="1" />
      <rect {...strokeProps} x="3" y="17" width="10" height="4" rx="1" />
      <rect {...strokeProps} x="17" y="3" width="4" height="10" rx="1" />
      <rect {...strokeProps} x="17" y="17" width="4" height="4" rx="1" />
    </>
  ),
  assignment: () => (
    <>
      <line {...strokeProps} x1="8" y1="6" x2="21" y2="6" />
      <line {...strokeProps} x1="8" y1="12" x2="21" y2="12" />
      <line {...strokeProps} x1="8" y1="18" x2="21" y2="18" />
      <line {...strokeProps} x1="3" y1="6" x2="3.01" y2="6" />
      <line {...strokeProps} x1="3" y1="12" x2="3.01" y2="12" />
      <line {...strokeProps} x1="3" y1="18" x2="3.01" y2="18" />
    </>
  ),
  group: () => (
    <>
      <path {...strokeProps} d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle {...strokeProps} cx="9" cy="7" r="4" />
      <path {...strokeProps} d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path {...strokeProps} d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  bar_chart: () => (
    <>
      <line {...strokeProps} x1="18" y1="20" x2="18" y2="10" />
      <line {...strokeProps} x1="12" y1="20" x2="12" y2="4" />
      <line {...strokeProps} x1="6" y1="20" x2="6" y2="14" />
    </>
  ),
  inventory_2: () => (
    <>
      <path {...strokeProps} d="M20 8H4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z" />
      <path {...strokeProps} d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
      <line {...strokeProps} x1="10" y1="16" x2="14" y2="16" />
    </>
  ),
  swords: () => <path fill="currentColor" d="M13 2 3 14h7l-1 8 11-13h-7l1-7z" />,
  bedtime: () => <path fill="currentColor" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />,
  task_alt: () => (
    <>
      <circle {...strokeProps} cx="12" cy="12" r="9" />
      <polyline {...strokeProps} points="8 12 11 15 16 9" />
    </>
  ),
  priority_high: () => (
    <>
      <line {...strokeProps} x1="12" y1="4" x2="12" y2="14" />
      <line {...strokeProps} x1="12" y1="19" x2="12.01" y2="19" />
    </>
  ),
  shield: () => (
    <>
      <path {...strokeProps} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path {...strokeProps} d="M9 12l2 2 4-4" />
    </>
  ),
  layers: () => (
    <>
      <polygon {...strokeProps} points="12 2 2 8 12 14 22 8 12 2" />
      <polyline {...strokeProps} points="2 14 12 20 22 14" />
    </>
  ),
  trophy: () => (
    <>
      <path {...strokeProps} d="M8 21h8" />
      <path {...strokeProps} d="M12 17v4" />
      <path {...strokeProps} d="M7 4h10v6a5 5 0 0 1-10 0z" />
      <path {...strokeProps} d="M7 5H4a2 2 0 0 0 0 4h3" />
      <path {...strokeProps} d="M17 5h3a2 2 0 0 1 0 4h-3" />
    </>
  ),
  columns: () => (
    <>
      <rect {...strokeProps} x="3" y="4" width="6" height="16" rx="1" />
      <rect {...strokeProps} x="9.5" y="4" width="6" height="10" rx="1" />
      <rect {...strokeProps} x="16" y="4" width="6" height="13" rx="1" />
    </>
  ),
  sparkle: () => (
    <>
      <path fill="currentColor" d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" />
      <path fill="currentColor" opacity=".6" d="M19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75L19 14z" />
      <path fill="currentColor" opacity=".4" d="M5 17l.5 1.5L7 19l-1.5.5L5 21l-.5-1.5L3 19l1.5-.5L5 17z" />
    </>
  ),
  close: () => (
    <>
      <line {...strokeProps} strokeWidth={2.5} x1="18" y1="6" x2="6" y2="18" />
      <line {...strokeProps} strokeWidth={2.5} x1="6" y1="6" x2="18" y2="18" />
    </>
  ),
  content_copy: () => (
    <>
      <rect {...strokeProps} x="9" y="9" width="12" height="12" rx="1" />
      <path {...strokeProps} d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
    </>
  ),
  crown: () => <path fill="currentColor" d="M3 7l4 4 5-6 5 6 4-4-2 11H5L3 7zm2 13h14v2H5v-2z" />
};

const fallbackIcon: IconRenderer = () => <circle {...strokeProps} cx="12" cy="12" r="9" />;

export function Icon({ name, filled = false, className, style }: IconProps) {
  const render = icons[name] ?? fallbackIcon;

  return (
    <svg aria-hidden="true" className={className || 'h-5 w-5'} style={style} viewBox="0 0 24 24">
      {render(filled)}
    </svg>
  );
}
