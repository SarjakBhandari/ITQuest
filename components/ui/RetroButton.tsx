'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

type RetroButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode;
  className?: string;
};

export function RetroButton({ icon, className = '', children, ...props }: RetroButtonProps) {
  return (
    <button className={`retro-button min-h-14 px-6 py-4 ${className}`.trim()} {...props}>
      {icon ? <span className="flex shrink-0 items-center">{icon}</span> : null}
      <span className="flex items-center gap-2 whitespace-nowrap leading-none">{children}</span>
    </button>
  );
}