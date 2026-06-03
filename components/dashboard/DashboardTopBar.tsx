import { siteConfig } from '../../lib/site-config';

import { AppLogo } from '../../components/ui/AppLogo';

import { DashboardIcon } from '../../components/dashboard/DashboardIcon';

export function DashboardTopBar() {
  return (
    <header className="fixed top-0 right-0 z-40 flex w-[calc(100%-240px)] items-center justify-between border-b-4 border-black bg-[#141219]/95 px-6 py-4 shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <AppLogo alt={`${siteConfig.name} logo`} sizeClassName="w-10 h-10" />
        <h2 className="text-2xl font-bold text-[#cebdff]">Dashboard</h2>
      </div>
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="flex gap-4">
          <button className="rounded-md border-2 border-black bg-[#1d1a21] p-2 text-[#cac4d4] transition-all hover:scale-110 hover:bg-[#2b2930] active:translate-y-1">
            <DashboardIcon name="notifications" />
          </button>
          <button className="rounded-md border-2 border-black bg-[#1d1a21] p-2 text-[#cac4d4] transition-all hover:scale-110 hover:bg-[#2b2930] active:translate-y-1">
            <DashboardIcon name="settings" />
          </button>
        </div>
        <div className="h-10 w-10 overflow-hidden border-2 border-black bg-[#45dfa4]">
          <img alt="Adventurer Profile" className="w-full h-full object-cover" src={siteConfig.dashboardProfileUrl} />
        </div>
      </div>
    </header>
  );
}