'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

type Tone = 'purple' | 'green' | 'gray' | 'dark';

type ActionLinkProps = {
  href: string;
  tone: Tone;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
};

const toneClasses: Record<Tone, string> = {
  purple: 'shadow-purple-retro bg-[#9d7aff] text-[#1a1a2e]',
  green: 'shadow-green-retro bg-[#00c88c] text-[#0d2e24]',
  gray: 'shadow-gray-retro bg-[#333338] text-white',
  dark: 'shadow-gray-retro bg-[#1e1c24] text-white'
};

export function ActionLink({ href, tone, children, icon, className }: ActionLinkProps) {
  return (
    <Link className={`retro-button min-h-14 px-6 py-4 text-base sm:text-lg ${toneClasses[tone]} ${className ?? ''}`.trim()} href={href}>
      {icon ? <span className="shrink-0">{icon}</span> : null}
      <span className="leading-none">{children}</span>
    </Link>
  );
}