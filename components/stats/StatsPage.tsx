'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { logout } from '../../lib/api/auth';
import { getMyStats } from '../../lib/api/stats';
import { DashboardSidebar } from '../dashboard/DashboardSidebar';
import { DashboardTopBar } from '../dashboard/DashboardTopBar';
import { Icon } from '../ui/Icon';

import type { TaskCategory, TaskStatus } from '../../types/task';
import type { UserStats } from '../../types/stats';

const categoryColors: Record<TaskCategory, string> = {
  Class: '#a78bfa',
  Certs: '#23d97e',
  Project: '#facc15',
  Exam: '#f87171',
  Other: '#60a5fa'
};

const statusMeta: { status: TaskStatus; label: string; icon: string; accent: string }[] = [
  { status: 'backlog', label: 'Backlog', icon: 'inventory_2', accent: '#9ca3af' },
  { status: 'in-progress', label: 'In Progress', icon: 'swords', accent: '#a78bfa' },
  { status: 'rest', label: 'Rest', icon: 'bedtime', accent: '#60a5fa' },
  { status: 'done', label: 'Done', icon: 'task_alt', accent: '#45dfa4' }
];

function weekdayLabel(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-US', { weekday: 'short' }).charAt(0);
}

function StatCard({ children, borderColor = '#3f3d46' }: { children: React.ReactNode; borderColor?: string }) {
  return (
    <div className="bg-[#1e1c24] p-5" style={{ border: `2px solid ${borderColor}` }}>
      {children}
    </div>
  );
}

function CategoryDonut({ categories }: { categories: UserStats['categoryBreakdown'] }) {
  const r = 42;
  const circumference = 2 * Math.PI * r;
  const totalXp = categories.reduce((sum, entry) => sum + entry.xp, 0);
  let offset = 0;

  if (categories.length === 0 || totalXp === 0) {
    return (
      <div className="flex items-center gap-5">
        <svg aria-label="Category XP breakdown" className="h-24 w-24 flex-shrink-0" viewBox="0 0 100 100">
          <circle cx="50" cy="50" fill="none" r={r} stroke="#2a2733" strokeWidth="16" />
        </svg>
        <p className="text-xs text-gray-500">Complete quests to see where your XP comes from.</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-6">
      <svg aria-label="Category XP breakdown" className="h-24 w-24 flex-shrink-0" viewBox="0 0 100 100">
        <circle cx="50" cy="50" fill="none" r={r} stroke="#2a2733" strokeWidth="16" />
        {categories.map((entry) => {
          const pct = (entry.xp / totalXp) * 100;
          const dashArray = (pct / 100) * circumference;
          const dashOffset = circumference - (offset / 100) * circumference;
          offset += pct;
          return (
            <circle
              key={entry.category}
              cx="50"
              cy="50"
              fill="none"
              r={r}
              stroke={categoryColors[entry.category]}
              strokeDasharray={`${dashArray} ${circumference - dashArray}`}
              strokeDashoffset={dashOffset}
              strokeWidth="16"
              style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px' }}
            />
          );
        })}
      </svg>
      <ul className="space-y-1.5">
        {categories.map((entry) => (
          <li key={entry.category} className="flex items-center gap-2 text-xs text-gray-300">
            <span className="h-3 w-3 flex-shrink-0" style={{ backgroundColor: categoryColors[entry.category] }} />
            {entry.category} - {entry.xp.toLocaleString()} XP ({entry.count})
          </li>
        ))}
      </ul>
    </div>
  );
}

function WeeklyActivityChart({ weeklyCompletions }: { weeklyCompletions: UserStats['weeklyCompletions'] }) {
  const max = Math.max(1, ...weeklyCompletions.map((day) => day.count));

  return (
    <div className="flex h-32 items-end justify-between gap-3">
      {weeklyCompletions.map((day) => {
        const heightPct = Math.max(6, Math.round((day.count / max) * 100));
        return (
          <div key={day.date} className="flex flex-1 flex-col items-center gap-2">
            <span className="text-xs font-bold text-[#45dfa4]">{day.count}</span>
            <div className="flex h-20 w-full items-end border-2 border-black bg-[#141219]">
              <div className="w-full transition-all duration-500" style={{ height: `${heightPct}%`, backgroundColor: '#a78bfa' }} />
            </div>
            <span className="text-[10px] font-bold uppercase text-[#6b7280]">{weekdayLabel(day.date)}</span>
          </div>
        );
      })}
    </div>
  );
}

function AchievementCard({ achievement }: { achievement: UserStats['achievements'][number] }) {
  const pct = Math.round((achievement.progress / achievement.target) * 100);

  return (
    <div
      className={`flex flex-col gap-3 border-2 p-4 transition-all ${achievement.earned ? 'border-[#facc15] bg-[#facc15]/10' : 'border-[#2a2733] bg-[#1a1827]'}`}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center border-2 border-black"
          style={{ backgroundColor: achievement.earned ? '#facc15' : '#2a2733', color: achievement.earned ? '#0f0f13' : '#6b7280' }}
        >
          <Icon className="h-5 w-5" name={achievement.earned ? achievement.icon : 'lock'} />
        </div>
        <div className="min-w-0">
          <p className={`text-sm font-bold ${achievement.earned ? 'text-[#facc15]' : 'text-gray-200'}`}>{achievement.label}</p>
          <p className="text-xs text-gray-500">{achievement.description}</p>
        </div>
      </div>
      <div>
        <div className="h-2 w-full overflow-hidden border border-black bg-[#0f0f13]">
          <div
            className="h-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: achievement.earned ? '#facc15' : '#45dfa4' }}
          />
        </div>
        <p className="mt-1 text-[10px] uppercase tracking-widest text-[#6b7280]">
          {achievement.progress} / {achievement.target}
          {achievement.rewardXp ? ` - +${achievement.rewardXp} XP reward` : ''}
        </p>
      </div>
    </div>
  );
}

function PersonalBestCard({ personalBest }: { personalBest: UserStats['personalBest'] }) {
  const max = Math.max(1, personalBest.currentWeekXp, personalBest.bestWeekXp);
  const currentPct = Math.round((personalBest.currentWeekXp / max) * 100);
  const bestPct = Math.round((personalBest.bestWeekXp / max) * 100);

  return (
    <StatCard borderColor={personalBest.isNewBest ? '#facc15' : '#2a2733'}>
      <h2 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
        <Icon className="h-4 w-4" name="trending_up" style={{ color: '#facc15' }} />
        Personal Best
      </h2>

      <div className="mb-3">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="font-bold text-white">This Week</span>
          <span className="font-bold text-[#23d97e]">{personalBest.currentWeekXp.toLocaleString()} XP</span>
        </div>
        <div className="h-3 w-full overflow-hidden border border-black bg-[#0f0f13]">
          <div className="h-full bg-[#23d97e] transition-all duration-500" style={{ width: `${currentPct}%` }} />
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-gray-400">{personalBest.bestWeekLabel}</span>
          <span className="font-bold text-[#facc15]">{personalBest.bestWeekXp.toLocaleString()} XP</span>
        </div>
        <div className="h-3 w-full overflow-hidden border border-black bg-[#0f0f13]">
          <div className="h-full bg-[#facc15] transition-all duration-500" style={{ width: `${bestPct}%` }} />
        </div>
      </div>

      {personalBest.isNewBest ? (
        <p className="text-xs font-bold text-[#facc15]">New personal best! +{personalBest.delta.toLocaleString()} XP ahead.</p>
      ) : personalBest.bestWeekXp > 0 ? (
        <p className="text-xs text-gray-400">{Math.abs(personalBest.delta).toLocaleString()} XP behind your best week.</p>
      ) : (
        <p className="text-xs text-gray-400">Complete quests this week to set your first record.</p>
      )}
    </StatCard>
  );
}

export function StatsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    getMyStats()
      .then(({ stats: fetched }) => {
        if (!cancelled) setStats(fetched);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Unable to load your stats.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      router.push('/login');
    }
  };

  const xpPct = stats ? Math.min((stats.xp / stats.xpForNextLevel) * 100, 100) : 0;
  const earnedCount = stats?.achievements.filter((achievement) => achievement.earned).length ?? 0;

  return (
    <div className="flex min-h-screen bg-[#0f0f13] text-[#e5e7eb]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <DashboardSidebar onLogout={handleLogout} />
      <DashboardTopBar title="Stats" />

      <div className="flex flex-1 flex-col overflow-auto pt-20 lg:ml-[240px] lg:pt-24">
        {error ? (
          <p className="border-b-2 border-[#f87171] bg-[#f87171]/10 px-6 py-2 text-sm text-[#fecaca]">{error}</p>
        ) : null}

        {isLoading || !stats ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="flex items-center gap-2 text-sm text-gray-500">
              <Icon className="h-4 w-4 animate-spin" name="schedule" />
              Loading your stats...
            </p>
          </div>
        ) : (
          <main className="grid flex-1 grid-cols-1 gap-6 p-6 lg:grid-cols-3">
            <div className="flex flex-col gap-6 lg:col-span-2">
              <StatCard borderColor="#a78bfa">
                <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[#a78bfa]">{stats.heroName}</p>
                <div className="flex items-center gap-4">
                  <span className="whitespace-nowrap text-lg font-extrabold text-white">Level {stats.level}</span>
                  <div className="flex-1">
                    <div
                      aria-label={`${stats.xp} of ${stats.xpForNextLevel} XP`}
                      aria-valuemax={stats.xpForNextLevel}
                      aria-valuemin={0}
                      aria-valuenow={stats.xp}
                      className="h-4 w-full border-2 border-black bg-[#1a1827]"
                      role="progressbar"
                    >
                      <div className="h-full transition-all duration-500" style={{ width: `${xpPct}%`, backgroundColor: '#23d97e' }} />
                    </div>
                    <p className="mt-1.5 text-center text-xs text-[#facc15]">
                      {stats.xp.toLocaleString()} / {stats.xpForNextLevel.toLocaleString()} XP
                    </p>
                  </div>
                  <span className="whitespace-nowrap text-lg font-extrabold text-white">Level {stats.level + 1}</span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="flex flex-col items-center border-2 border-black bg-[#141219] p-3">
                    <Icon className="h-6 w-6" name="local_fire_department" style={{ color: '#f97316' }} />
                    <span className="mt-1 text-xl font-extrabold text-white">{stats.streak}</span>
                    <span className="text-[10px] uppercase tracking-widest text-[#6b7280]">Streak</span>
                  </div>
                  <div className="flex flex-col items-center border-2 border-black bg-[#141219] p-3">
                    <Icon className="h-6 w-6" name="ac_unit" style={{ color: '#60a5fa' }} />
                    <span className="mt-1 text-xl font-extrabold text-white">{stats.freezesAvailable}</span>
                    <span className="text-[10px] uppercase tracking-widest text-[#6b7280]">Freezes</span>
                  </div>
                  <div className="flex flex-col items-center border-2 border-black bg-[#141219] p-3">
                    <Icon className="h-6 w-6" name="task_alt" style={{ color: '#45dfa4' }} />
                    <span className="mt-1 text-xl font-extrabold text-white">{stats.completedQuestsCount}</span>
                    <span className="text-[10px] uppercase tracking-widest text-[#6b7280]">Completed</span>
                  </div>
                  <div className="flex flex-col items-center border-2 border-black bg-[#141219] p-3">
                    <Icon className="h-6 w-6" name="trophy" style={{ color: '#facc15' }} />
                    <span className="mt-1 text-xl font-extrabold text-white">
                      {earnedCount}/{stats.achievements.length}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-[#6b7280]">Badges</span>
                  </div>
                </div>
              </StatCard>

              <div>
                <h2 className="mb-3 text-lg font-extrabold text-white">Weekly Activity</h2>
                <StatCard>
                  <WeeklyActivityChart weeklyCompletions={stats.weeklyCompletions} />
                </StatCard>
              </div>

              <div>
                <h2 className="mb-3 text-lg font-extrabold text-white">Achievements</h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {stats.achievements.map((achievement) => (
                    <AchievementCard key={achievement.id} achievement={achievement} />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <StatCard borderColor="#2a2733">
                <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">XP by Category</h2>
                <CategoryDonut categories={stats.categoryBreakdown} />
                {stats.bestCategory ? (
                  <p className="mt-4 text-xs text-[#9ca3af]">
                    Your strongest category is{' '}
                    <span className="font-bold" style={{ color: categoryColors[stats.bestCategory.category] }}>
                      {stats.bestCategory.category}
                    </span>{' '}
                    with {stats.bestCategory.xp.toLocaleString()} XP earned.
                  </p>
                ) : null}
              </StatCard>

              <StatCard borderColor="#2a2733">
                <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">Quest Board Snapshot</h2>
                <div className="grid grid-cols-2 gap-3">
                  {statusMeta.map((meta) => (
                    <div key={meta.status} className="flex items-center gap-2 border-2 border-black bg-[#141219] p-3">
                      <Icon className="h-4 w-4 flex-shrink-0" name={meta.icon} style={{ color: meta.accent }} />
                      <div>
                        <p className="text-base font-extrabold text-white">{stats.statusBreakdown[meta.status]}</p>
                        <p className="text-[10px] uppercase tracking-widest text-[#6b7280]">{meta.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </StatCard>
            </div>
          </main>
        )}
      </div>
    </div>
  );
}
