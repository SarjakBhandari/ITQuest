'use client';

type DashboardIconProps = {
  name: string;
  filled?: boolean;
  className?: string;
};

export function DashboardIcon({ name, filled = false, className = '' }: DashboardIconProps) {
  return (
    <span className={`material-symbols-outlined ${className}`.trim()} style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}>
      {name}
    </span>
  );
}