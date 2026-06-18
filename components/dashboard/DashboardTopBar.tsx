'use client';

import { siteConfig } from '../../lib/site-config';

import { AppLogo } from '../../components/ui/AppLogo';

import { Icon } from '../../components/ui/Icon';

type DashboardTopBarProps = {
  title?: string;
};

export function DashboardTopBar({ title = 'Dashboard' }: DashboardTopBarProps) {
  return (
    <header className="fixed top-0 right-0 z-40 flex w-[calc(100%-240px)] items-center justify-between border-b-4 border-black bg-[#141219]/95 px-6 py-4 shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <AppLogo alt={`${siteConfig.name} logo`} sizeClassName="w-10 h-10" />
        <h2 className="text-2xl font-bold text-[#cebdff]">{title}</h2>
      </div>
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="flex gap-4">
          <button
            aria-label="Notifications"
            className="rounded-md border-2 border-black bg-[#1d1a21] p-2 text-[#cac4d4] transition-all hover:scale-110 hover:bg-[#2b2930] active:translate-y-1"
            type="button"
          >
            <Icon name="notifications" />
          </button>
          <button
            aria-label="Settings"
            className="rounded-md border-2 border-black bg-[#1d1a21] p-2 text-[#cac4d4] transition-all hover:scale-110 hover:bg-[#2b2930] active:translate-y-1"
            type="button"
          >
            <Icon name="settings" />
          </button>
        </div>
        <div
          aria-label="Profile"
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden border-2 border-black bg-[#45dfa4] text-[#0d2e24]"
        >
          <Icon filled name="person" />
        </div>
      </div>
    </header>
  );
}
