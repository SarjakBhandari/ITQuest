'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { getDashboardSummary } from '../../lib/api/dashboard';
import { resolveAvatarColor } from '../../lib/avatar';
import { siteConfig } from '../../lib/site-config';
import { dashboardNavItems } from '../../lib/site-content';

import { AppLogo } from '../../components/ui/AppLogo';
import { RetroButton } from '../../components/ui/RetroButton';

import { Icon } from '../../components/ui/Icon';

type DashboardSidebarProps = {
  onLogout?: () => void;
};

export function DashboardSidebar({ onLogout }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [heroName, setHeroName] = useState('');
  const [avatarColor, setAvatarColor] = useState<string | null>(null);
  const [level, setLevel] = useState<number | null>(null);
  const [xp, setXp] = useState(0);
  const [xpForNextLevel, setXpForNextLevel] = useState(500);

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    function refresh() {
      getDashboardSummary()
        .then(({ summary }) => {
          if (cancelled) return;
          setHeroName(summary.heroName);
          setAvatarColor(summary.avatarColor);
          setLevel(summary.level);
          setXp(summary.xp);
          setXpForNextLevel(summary.xpForNextLevel);
        })
        .catch(() => {
          /* sidebar still renders without level info */
        });
    }

    refresh();
    window.addEventListener('itquest:xp-updated', refresh);
    return () => {
      cancelled = true;
      window.removeEventListener('itquest:xp-updated', refresh);
    };
  }, []);

  useEffect(() => {
    function toggle() {
      setIsMobileOpen((prev) => !prev);
    }
    window.addEventListener('itquest:toggle-sidebar', toggle);
    return () => window.removeEventListener('itquest:toggle-sidebar', toggle);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      return;
    }
    router.push('/login');
  };

  const handleNewQuest = () => {
    router.push('/quests?new=1');
  };

  const xpPct = Math.min((xp / xpForNextLevel) * 100, 100);

  return (
    <>
      {isMobileOpen ? (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      ) : null}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-[240px] flex-col overflow-y-auto border-r-4 border-black bg-[#1d1a21]/95 p-4 shadow-[4px_0px_0px_0px_rgba(0,0,0,1)] backdrop-blur-sm transition-transform duration-200 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
      <div className="mb-5 flex items-center gap-2.5 border-b-2 border-[#2a2733] pb-5">
        <AppLogo alt={`${siteConfig.name} logo`} className="border-2 border-black bg-white" sizeClassName="h-9 w-9" />
        <div className="min-w-0">
          <h1 className="truncate text-lg font-black leading-tight tracking-tight text-[#ffc640]">{siteConfig.name}</h1>
          <p className="truncate text-[10px] uppercase tracking-widest text-[#6b7280]">{siteConfig.tagline}</p>
        </div>
      </div>

      <Link className="mb-5 block border-2 border-black bg-[#141219] p-3 shadow-[3px_3px_0px_0px_#000] transition-colors hover:bg-[#1a1721]" href="/settings">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden border-2 border-black text-[#1d1a21]"
            style={{ backgroundColor: heroName ? resolveAvatarColor(heroName, avatarColor) : '#a78bfa' }}
          >
            {heroName ? <span className="text-sm font-extrabold">{heroName.charAt(0).toUpperCase()}</span> : <Icon filled name="person" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-[#e6e0ea]">
              {heroName || 'Loading...'}
              {level !== null ? ` - Level ${level}` : ''}
            </p>
            <p className="text-[10px] uppercase tracking-wide text-[#cac4d4]">
              {xp} / {xpForNextLevel} XP
            </p>
          </div>
        </div>
        <div
          className="mt-3 h-1.5 w-full overflow-hidden border border-black bg-[#0f0f13]"
          role="progressbar"
          aria-label="XP progress to next level"
          aria-valuenow={xp}
          aria-valuemin={0}
          aria-valuemax={xpForNextLevel}
        >
          <div className="h-full bg-[#23d97e] transition-all duration-500" style={{ width: `${xpPct}%` }} />
        </div>
      </Link>

      <RetroButton
        className="mb-5 w-full justify-center bg-[#ffc640] font-bold uppercase tracking-wider text-[#261a00]"
        onClick={handleNewQuest}
        type="button"
      >
        <Icon name="add" />
        New Quest
      </RetroButton>

      <nav className="flex flex-1 flex-col gap-1.5" aria-label="Main navigation">
        {dashboardNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              className={`flex items-center gap-3 rounded-md border-2 p-3 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#a78bfa] ${
                isActive
                  ? 'border-black bg-[#cebdff] text-[#381385] shadow-[3px_3px_0px_0px_#000]'
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
        <RetroButton
          className="w-full justify-center bg-[#ffb4ab] font-bold uppercase tracking-wider text-[#690005]"
          onClick={handleLogout}
          type="button"
        >
          <Icon name="logout" />
          Log Out
        </RetroButton>
      </div>
    </aside>
    </>
  );
}
