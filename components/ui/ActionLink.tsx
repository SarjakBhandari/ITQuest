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
  purple: 'bg-[#a78bfa] text-[#1d1a21]',
  green: 'bg-[#23d97e] text-[#0d2e24]',
  gray: 'bg-[#1e1c24] text-white',
  dark: 'bg-[#0f0f13] text-white'
};

export function ActionLink({ href, tone, children, icon, className }: ActionLinkProps) {
  return (
    <Link
      className={`retro-button min-h-14 border-4 border-black px-6 py-4 text-base shadow-[4px_4px_0px_0px_#000] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 sm:text-lg ${toneClasses[tone]} ${className ?? ''}`.trim()}
      href={href}
    >
      {icon ? <span className="flex shrink-0 items-center">{icon}</span> : null}
      <span className="flex items-center gap-2 whitespace-nowrap leading-none">{children}</span>
    </Link>
  );
}
