import { siteConfig } from '../../lib/site-config';
import { dashboardNavItems } from '../../lib/site-content';

import { AppLogo } from '../../components/ui/AppLogo';
import { RetroButton } from '../../components/ui/RetroButton';

import { DashboardIcon } from '../../components/dashboard/DashboardIcon';

export function DashboardSidebar() {
  return (
    <aside className="fixed left-0 top-0 z-50 flex h-full w-[240px] flex-col border-r-4 border-black bg-[#1d1a21]/95 p-4 shadow-[4px_0px_0px_0px_rgba(0,0,0,1)] backdrop-blur-sm">
      <div className="mb-8">
        <AppLogo alt={`${siteConfig.name} logo`} className="logo-frame mb-4 bg-white p-1 rounded-sm" sizeClassName="w-20 h-20" />
        <h1 className="text-3xl font-black tracking-tighter text-[#ffc640]">{siteConfig.name}</h1>
        <div className="mt-2 flex items-center gap-3">
          <div className="w-10 h-10 overflow-hidden border-2 border-black bg-[#a78bfa]">
            <img alt="Hero Avatar" className="w-full h-full object-cover" src={siteConfig.dashboardHeroAvatarUrl} />
          </div>
          <div>
            <p className="text-sm font-bold text-[#e6e0ea]">Level 12</p>
            <p className="text-[10px] text-[#cac4d4] uppercase">Coding Squire</p>
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {dashboardNavItems.map((item) => (
          <a
            key={item.label}
            className={`flex items-center gap-3 rounded-md p-3 transition-all ${item.active ? 'active-nav group' : 'text-[#cac4d4] hover:bg-[#2b2930]'}`}
            href={item.href}
          >
            <DashboardIcon name={item.icon} />
            <span className="text-sm font-bold uppercase tracking-wide">{item.label}</span>
          </a>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-4">
        <RetroButton className="w-full justify-center bg-[#ffc640] font-bold uppercase tracking-wider text-[#261a00]">
          <DashboardIcon name="add" />
          New Quest
        </RetroButton>
        <RetroButton className="w-full justify-center bg-[#ffb4ab] font-bold uppercase tracking-wider text-[#690005]">
          <DashboardIcon name="logout" />
          Log Out
        </RetroButton>
      </div>
    </aside>
  );
}