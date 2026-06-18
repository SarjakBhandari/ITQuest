'use client';

import Link from 'next/link';

import { AppLogo } from './AppLogo';
import { siteConfig } from '../../lib/site-config';

type PublicNavbarProps = {
  compact?: boolean;
};

export function PublicNavbar({ compact = false }: PublicNavbarProps) {
  return (
    <header className="w-full border-b-4 border-black bg-[#141219]">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link className="flex items-center gap-3" href="/" aria-label="Go to home">
          <AppLogo className="border-2 border-black bg-white" sizeClassName={compact ? 'h-9 w-9' : 'h-10 w-10'} />
          <span className="text-sm font-black uppercase tracking-[0.35em] text-[#ffc640]">{siteConfig.name}</span>
        </Link>

        <nav className="flex items-center gap-3" aria-label="Public navigation">
          <Link
            className="border-2 border-black px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-[#2b2930]"
            href="/signup"
          >
            Sign Up
          </Link>
          <Link
            className="border-2 border-black bg-[#a78bfa] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#1d1a21] shadow-[3px_3px_0px_0px_#000] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5"
            href="/login"
          >
            Log In
          </Link>
        </nav>
      </div>
    </header>
  );
}
