'use client';

import { useRouter } from 'next/navigation';

import { siteConfig } from '../../lib/site-config';

import { AppLogo } from '../../components/ui/AppLogo';

import { Icon } from '../../components/ui/Icon';
import { NotificationBell } from '../../components/ui/NotificationBell';

type DashboardTopBarProps = {
  title?: string;
};

export function DashboardTopBar({ title = 'Dashboard' }: DashboardTopBarProps) {
  const router = useRouter();

  return (
    <header className="fixed top-0 right-0 z-30 flex w-full items-center justify-between border-b-4 border-black bg-[#141219]/95 px-4 py-4 shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] backdrop-blur-sm sm:px-6 lg:w-[calc(100%-240px)]">
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          aria-label="Toggle menu"
          className="-ml-1 rounded-md border-2 border-black bg-[#1d1a21] p-2 text-[#cac4d4] transition-all hover:bg-[#2b2930] lg:hidden"
          onClick={() => window.dispatchEvent(new Event('itquest:toggle-sidebar'))}
          type="button"
        >
          <Icon name="menu" />
        </button>
        <AppLogo alt={`${siteConfig.name} logo`} className="hidden sm:block" sizeClassName="w-10 h-10" />
        <h2 className="truncate text-lg font-bold text-[#cebdff] sm:text-2xl">{title}</h2>
      </div>
      <div className="flex items-center gap-3 sm:gap-6">
        <NotificationBell />
        <button
          aria-label="Profile and settings"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden border-2 border-black bg-[#45dfa4] text-[#0d2e24] transition-transform hover:scale-110"
          onClick={() => router.push('/settings')}
          type="button"
        >
          <Icon filled name="person" />
        </button>
      </div>
    </header>
  );
}
