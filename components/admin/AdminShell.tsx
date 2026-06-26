'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

import { getCurrentUser } from '../../lib/api/auth';
import { Icon } from '../ui/Icon';

const ADMIN_NAV_ITEMS: { label: string; href: string; icon: string }[] = [
  { label: 'Overview', href: '/admin', icon: 'bar_chart' },
  { label: 'Users', href: '/admin/users', icon: 'group' },
  { label: 'Guilds', href: '/admin/guilds', icon: 'shield' },
  { label: 'Announcements', href: '/admin/announcements', icon: 'notifications' }
];

type AdminShellProps = {
  title: string;
  children: ReactNode;
};

export function AdminShell({ title, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [accessState, setAccessState] = useState<'checking' | 'allowed' | 'denied'>('checking');

  useEffect(() => {
    let cancelled = false;

    getCurrentUser()
      .then(({ user }) => {
        if (cancelled) return;
        setAccessState(user?.isAdmin ? 'allowed' : 'denied');
      })
      .catch(() => {
        if (!cancelled) setAccessState('denied');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (accessState === 'denied') router.replace('/dashboard');
  }, [accessState, router]);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  if (accessState !== 'allowed') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f0f13] text-[#e5e7eb]">
        <p className="flex items-center gap-2 text-sm text-gray-500">
          <Icon className="h-4 w-4 animate-spin" name="schedule" />
          {accessState === 'checking' ? 'Checking access...' : 'Redirecting...'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0f0f13] text-[#e5e7eb]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {isMobileOpen ? (
        <div aria-hidden="true" className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setIsMobileOpen(false)} />
      ) : null}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-[240px] flex-col overflow-y-auto border-r-4 border-black bg-[#1d1a21]/95 p-4 shadow-[4px_0px_0px_0px_rgba(0,0,0,1)] backdrop-blur-sm transition-transform duration-200 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-5 flex items-center gap-2.5 border-b-2 border-[#2a2733] pb-5">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center border-2 border-black bg-[#f87171] text-[#0f0f13]">
            <Icon className="h-5 w-5" name="shield" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-black leading-tight tracking-tight text-[#f87171]">Admin</h1>
            <p className="truncate text-[10px] uppercase tracking-widest text-[#6b7280]">Control Panel</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1.5" aria-label="Admin navigation">
          {ADMIN_NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                className={`flex items-center gap-3 rounded-md border-2 p-3 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f87171] ${
                  isActive
                    ? 'border-black bg-[#fecaca] text-[#690005] shadow-[3px_3px_0px_0px_#000]'
                    : 'border-transparent text-[#cac4d4] hover:border-[#2a2733] hover:bg-[#2b2930]'
                }`}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon name={item.icon} className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm font-bold uppercase tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 border-t-2 border-[#2a2733] pt-4">
          <Link
            className="flex w-full items-center justify-center gap-2 border-2 border-black bg-[#1d1a21] py-3 text-sm font-bold uppercase tracking-wide text-[#cac4d4] transition-all hover:bg-[#2b2930]"
            href="/dashboard"
          >
            <Icon name="arrow_right" className="h-4 w-4 rotate-180" />
            Back to App
          </Link>
        </div>
      </aside>

      <header className="fixed top-0 right-0 z-30 flex w-full items-center justify-between border-b-4 border-black bg-[#141219]/95 px-4 py-4 shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] backdrop-blur-sm sm:px-6 lg:w-[calc(100%-240px)]">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            aria-label="Toggle menu"
            className="-ml-1 rounded-md border-2 border-black bg-[#1d1a21] p-2 text-[#cac4d4] transition-all hover:bg-[#2b2930] lg:hidden"
            onClick={() => setIsMobileOpen((prev) => !prev)}
            type="button"
          >
            <Icon name="menu" />
          </button>
          <h2 className="truncate text-lg font-bold text-[#fecaca] sm:text-2xl">{title}</h2>
        </div>
      </header>

      <div className="flex flex-1 flex-col overflow-auto pt-20 lg:ml-[240px] lg:pt-24">{children}</div>
    </div>
  );
}
