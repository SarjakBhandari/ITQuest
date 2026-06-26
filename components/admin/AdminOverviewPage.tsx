'use client';

import { useEffect, useState } from 'react';

import { getAdminOverview } from '../../lib/api/admin';
import { Icon } from '../ui/Icon';

import { AdminShell } from './AdminShell';

import type { AdminOverview } from '../../types/admin';

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: string | number; color: string }) {
  return (
    <div className="flex items-center gap-4 border-2 border-black bg-[#1e1c24] p-5 shadow-[4px_4px_0px_0px_#000]">
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center border-2 border-black" style={{ backgroundColor: color }}>
        <Icon className="h-6 w-6" name={icon} style={{ color: '#0f0f13' }} />
      </div>
      <div>
        <p className="text-2xl font-extrabold text-white">{value}</p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#9ca3af]">{label}</p>
      </div>
    </div>
  );
}

function weekdayLabel(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-US', { weekday: 'short' }).charAt(0);
}

export function AdminOverviewPage() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    getAdminOverview()
      .then(({ overview: fetched }) => {
        if (!cancelled) setOverview(fetched);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Unable to load overview.');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const maxSignups = overview ? Math.max(1, ...overview.signupsByDay.map((day) => day.count)) : 1;

  return (
    <AdminShell title="Overview">
      <main className="flex flex-col gap-6 p-6">
        {error ? <p className="border-2 border-[#f87171] bg-[#f87171]/10 p-4 text-sm text-[#fecaca]">{error}</p> : null}

        {!overview ? (
          <p className="flex items-center gap-2 text-sm text-gray-500">
            <Icon className="h-4 w-4 animate-spin" name="schedule" />
            Loading overview...
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard color="#a78bfa" icon="group" label="Total Heroes" value={overview.totalUsers} />
              <StatCard color="#facc15" icon="shield" label="Active Guilds" value={overview.totalGuilds} />
              <StatCard color="#45dfa4" icon="task_alt" label="Quests Completed" value={overview.totalQuestsCompleted} />
              <StatCard color="#60a5fa" icon="trending_up" label="Active Last 7 Days" value={overview.activeUsersLast7Days} />
              <StatCard color="#f87171" icon="warning" label="Suspended Accounts" value={overview.suspendedUsers} />
              <StatCard color="#23d97e" icon="star" label="Total XP Awarded" value={overview.totalXpAwarded.toLocaleString()} />
            </div>

            <section className="border-2 border-black bg-[#1e1c24] p-6 shadow-[6px_6px_0px_0px_#000]">
              <h3 className="mb-4 text-sm font-extrabold uppercase tracking-widest text-white">Signups - Last 7 Days</h3>
              <div className="flex h-32 items-end justify-between gap-3">
                {overview.signupsByDay.map((day) => {
                  const heightPct = Math.max(6, Math.round((day.count / maxSignups) * 100));
                  return (
                    <div key={day.date} className="flex flex-1 flex-col items-center gap-2">
                      <span className="text-xs font-bold text-[#a78bfa]">{day.count}</span>
                      <div className="flex h-20 w-full items-end border-2 border-black bg-[#141219]">
                        <div className="w-full transition-all duration-500" style={{ height: `${heightPct}%`, backgroundColor: '#a78bfa' }} />
                      </div>
                      <span className="text-[10px] font-bold uppercase text-[#6b7280]">{weekdayLabel(day.date)}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </main>
    </AdminShell>
  );
}
