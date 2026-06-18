'use client';

import Link from 'next/link';

import { AppLogo } from './AppLogo';

type PublicNavbarProps = {
  compact?: boolean;
};

export function PublicNavbar({ compact = false }: PublicNavbarProps) {
  return (
    <header className="w-full border-b border-white/10 bg-[#0f0f13]/90 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link className="flex items-center gap-3" href="/" aria-label="Go to home">
          <AppLogo sizeClassName={compact ? 'h-10 w-10' : 'h-12 w-12'} />
          <span className="text-sm font-black uppercase tracking-[0.35em] text-white">IT Quest</span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3" aria-label="Public navigation">
          <Link className="rounded-full border border-white/10 px-3 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white" href="/">
            Home
          </Link>
          <Link className="rounded-full border border-[#9d7aff]/30 bg-[#9d7aff]/10 px-3 py-2 text-sm font-semibold text-[#e7dcff] transition hover:bg-[#9d7aff]/20" href="/signup">
            Sign up
          </Link>
          <Link className="rounded-full border border-[#00c88c]/30 bg-[#00c88c]/10 px-3 py-2 text-sm font-semibold text-[#bff7e1] transition hover:bg-[#00c88c]/20" href="/login">
            Log in
          </Link>
        </nav>
      </div>
    </header>
  );
}