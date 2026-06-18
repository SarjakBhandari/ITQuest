'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { getDashboardSummary } from '../../lib/api/dashboard';
import { logout } from '../../lib/api/auth';
import { useToast } from '../ui/ToastProvider';

import { Icon } from '../ui/Icon';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardTopBar } from './DashboardTopBar';

import type { DashboardSummary, WorkloadSegment } from '../../types/dashboard';
import type { TaskCategory } from '../../types/task';

export type QuestMode = 'Normal' | 'Certs' | 'Exam';

const emptySummary: DashboardSummary = {
  level: 1,
  xp: 0,
  xpForNextLevel: 500,
  totalXp: 0,
  streak: 0,
  freezesAvailable: 0,
  overloadPct: 0,
  workload: [],
  priorityQuests: [],
  weeklyXpPotential: 0
};

const categoryColors: Record<TaskCategory, string> = {
  Class: '#a78bfa',
  Certs: '#23d97e',
  Project: '#facc15',
  Exam: '#f87171',
  Other: '#60a5fa'
};

function formatDueIn(dueDate: string | null) {
  if (!dueDate) return null;
  const diffDays = Math.ceil((new Date(dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'Overdue';
  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return '1 day';
  return `${diffDays} days`;
}

function FlameIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C9 7 7 9 7 13a5 5 0 0010 0c0-4-2-6-5-11z" />
    </svg>
  );
}

function SnowflakeIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <line x1="12" x2="12" y1="2" y2="22" /><line x1="2" x2="22" y1="12" y2="12" />
      <line x1="5" x2="19" y1="5" y2="19" /><line x1="19" x2="5" y1="5" y2="19" />
    </svg>
  );
}

function WarnIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" x2="12" y1="9" y2="13" /><line x1="12" x2="12.01" y1="17" y2="17" />
    </svg>
  );
}

function TrendUpIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function WorkloadDonut({ segments }: { segments: WorkloadSegment[] }) {
  const r = 38;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  if (segments.length === 0) {
    return (
      <div className="flex items-center gap-5">
        <svg aria-label="Workload analysis donut chart" className="h-20 w-20 flex-shrink-0" viewBox="0 0 100 100">
          <circle cx="50" cy="50" fill="none" r={r} stroke="#2a2733" strokeWidth="16" />
        </svg>
        <p className="text-xs text-gray-500">No active quests yet — your workload breakdown will show up here.</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-5">
      <svg aria-label="Workload analysis donut chart" className="h-20 w-20 flex-shrink-0" viewBox="0 0 100 100">
        <circle cx="50" cy="50" fill="none" r={r} stroke="#2a2733" strokeWidth="16" />
        {segments.map((segment) => {
          const dashArray = (segment.pct / 100) * circumference;
          const dashOffset = circumference - (offset / 100) * circumference;
          offset += segment.pct;
          return (
            <circle
              key={segment.category}
              cx="50"
              cy="50"
              fill="none"
              r={r}
              stroke={categoryColors[segment.category]}
              strokeDasharray={`${dashArray} ${circumference}`}
              strokeDashoffset={dashOffset}
              strokeWidth="16"
              style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px' }}
            />
          );
        })}
      </svg>
      <ul className="space-y-1.5">
        {segments.map((segment) => (
          <li key={segment.category} className="flex items-center gap-2 text-xs text-gray-300">
            <span className="h-3 w-3 flex-shrink-0 rounded-sm" style={{ backgroundColor: categoryColors[segment.category] }} />
            {segment.category} ({segment.pct}%)
          </li>
        ))}
      </ul>
    </div>
  );
}

function OverloadRing({ pct }: { pct: number }) {
  const r = 52;
  const circumference = 2 * Math.PI * r;
  const filled = (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg aria-label={`System overload at ${pct}%`} className="h-32 w-32" viewBox="0 0 120 120">
        <circle cx="60" cy="60" fill="none" r={r} stroke="#2a2733" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          fill="none"
          r={r}
          stroke="#f87171"
          strokeDasharray={`${filled} ${circumference}`}
          strokeDashoffset={circumference / 4}
          strokeLinecap="round"
          strokeWidth="10"
          style={{ transform: 'rotate(-90deg)', transformOrigin: '60px 60px' }}
        />
        <text dominantBaseline="middle" fill="#e5e7eb" fontSize="18" fontWeight="bold" textAnchor="middle" x="60" y="60">
          {pct}%
        </text>
      </svg>
    </div>
  );
}

function XpBar({ current, max }: { current: number; max: number }) {
  const pct = Math.min((current / max) * 100, 100);
  return (
    <div className="w-full">
      <div
        aria-label={`${current} of ${max} XP`}
        aria-valuemax={max}
        aria-valuemin={0}
        aria-valuenow={current}
        className="h-4 w-full border-2 border-black bg-[#1a1827]"
        role="progressbar"
      >
        <div className="h-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: '#23d97e' }} />
      </div>
      <p className="mt-1.5 text-center text-xs text-[#facc15]">
        {current.toLocaleString()} / {max.toLocaleString()} XP
      </p>
    </div>
  );
}

function RetroCard({ children, borderColor = '#3f3d46', className = '' }: { children: React.ReactNode; borderColor?: string; className?: string }) {
  return (
    <div className={`bg-[#1e1c24] p-5 ${className}`} style={{ border: `2px solid ${borderColor}` }}>
      {children}
    </div>
  );
}

function ModeBtn({ label, active, color, shadowColor, onClick }: { label: QuestMode; active: boolean; color: string; shadowColor: string; onClick: () => void }) {
  return (
    <button
      aria-pressed={active}
      className="min-h-[52px] flex-1 border-4 border-black py-3 text-base font-extrabold transition-all"
      onClick={onClick}
      style={{
        backgroundColor: active ? color : '#1e1c24',
        color: active ? '#0f0f13' : color,
        boxShadow: active ? 'none' : `3px 3px 0px 0px ${shadowColor}`,
        transform: active ? 'translate(3px, 3px)' : undefined,
        outline: active ? `2px solid ${color}` : undefined
      }}
      type="button"
    >
      {label}
    </button>
  );
}

export function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [mode, setMode] = useState<QuestMode>('Normal');
  const [summary, setSummary] = useState<DashboardSummary>(emptySummary);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (searchParams.get('welcome') === '1') {
      showToast('Login successful! Welcome back.', 'success');
      router.replace('/dashboard');
    }
  }, [searchParams, showToast, router]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const { summary: fetched } = await getDashboardSummary();
        if (!cancelled) setSummary(fetched);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Unable to load dashboard data.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
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

  const modeConfig: { label: QuestMode; color: string; shadow: string }[] = [
    { label: 'Normal', color: '#23d97e', shadow: '#065f46' },
    { label: 'Certs', color: '#facc15', shadow: '#78350f' },
    { label: 'Exam', color: '#f87171', shadow: '#7f1d1d' }
  ];

  return (
    <div className="flex min-h-screen bg-[#0f0f13] text-[#e5e7eb]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <DashboardSidebar onLogout={handleLogout} />
      <DashboardTopBar title="Dashboard" />

      <div className="ml-[240px] flex flex-1 flex-col overflow-auto pt-24">
        {error ? (
          <p className="border-b-2 border-[#f87171] bg-[#f87171]/10 px-6 py-2 text-sm text-[#fecaca]">{error}</p>
        ) : null}

        <main aria-label="Dashboard content" className="grid flex-1 grid-cols-1 gap-6 p-6 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-2">
            <RetroCard borderColor="#a78bfa">
              <div className="flex items-center gap-4">
                <span className="whitespace-nowrap text-lg font-extrabold text-white">Level {summary.level}</span>
                <div className="flex-1">
                  <XpBar current={summary.xp} max={summary.xpForNextLevel} />
                </div>
                <span className="whitespace-nowrap text-lg font-extrabold text-white">Level {summary.level + 1}</span>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-6">
                <div
                  aria-label={`${summary.streak} day streak`}
                  className="flex h-20 w-20 flex-shrink-0 flex-col items-center justify-center border-4 border-black"
                  style={{ backgroundColor: '#facc15', boxShadow: '4px 4px 0px 0px #000' }}
                >
                  <span className="text-3xl font-extrabold text-black">{summary.streak}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#f97316]">
                    <FlameIcon /> Streak
                  </span>
                  <span className="mt-3 flex items-center gap-1.5 text-sm font-bold text-[#23d97e]">
                    <SnowflakeIcon /> {summary.freezesAvailable} Freeze Available
                  </span>
                </div>
                <div className="ml-auto">
                  <div
                    className="border-4 border-black px-8 py-3 text-base font-bold"
                    style={{ backgroundColor: '#23d97e', color: '#0d2e24', boxShadow: '3px 3px 0px 0px #065f46' }}
                  >
                    {mode} Mode
                  </div>
                </div>
              </div>
            </RetroCard>

            <div>
              <h2 className="mb-3 text-lg font-extrabold text-white">Priority Quests</h2>
              <RetroCard borderColor="#2a2733">
                {isLoading ? (
                  <p className="py-8 text-center text-sm text-gray-500">Loading...</p>
                ) : summary.priorityQuests.length === 0 ? (
                  <p className="py-8 text-center text-sm text-gray-500">
                    No priority quests yet — start a new quest to begin your adventure.
                  </p>
                ) : (
                  <ul className="divide-y divide-[#2a2733]">
                    {summary.priorityQuests.map((quest) => {
                      const dueLabel = formatDueIn(quest.dueDate);
                      return (
                        <li key={quest.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                          <div className="flex items-center gap-3">
                            <Icon
                              name={quest.priority === 'High' ? 'priority_high' : 'assignment'}
                              className="h-5 w-5 flex-shrink-0 text-[#a78bfa]"
                            />
                            <div>
                              <p className="text-sm font-bold text-white">{quest.title}</p>
                              <p className="text-xs text-gray-400">
                                {quest.category} &middot; {quest.priority} priority
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1 text-xs">
                            <span className="flex items-center gap-1 font-bold text-[#facc15]">
                              <Icon name="star" filled className="h-3.5 w-3.5" />
                              {quest.xp} XP
                            </span>
                            {dueLabel ? <span className="text-gray-400">{dueLabel}</span> : null}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </RetroCard>
            </div>

            <div>
              <h2 className="mb-3 text-lg font-extrabold text-white">Change Modes</h2>
              <RetroCard borderColor="#2a2733">
                <div aria-label="Select quest mode" className="flex gap-4" role="group">
                  {modeConfig.map((item) => (
                    <ModeBtn
                      key={item.label}
                      active={mode === item.label}
                      color={item.color}
                      label={item.label}
                      onClick={() => setMode(item.label)}
                      shadowColor={item.shadow}
                    />
                  ))}
                </div>
              </RetroCard>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <RetroCard borderColor="#f87171">
              <h2 className="mb-4 flex items-center gap-2 text-base font-extrabold text-[#f87171]">
                <WarnIcon /> System Overload
              </h2>
              <div className="mb-3 flex justify-center">
                <OverloadRing pct={summary.overloadPct} />
              </div>
              <p className="text-center text-sm leading-relaxed text-gray-400">
                {summary.overloadPct === 0
                  ? 'You are new here! Go to quest and start your adventure.'
                  : summary.overloadPct < 50
                    ? 'Manageable for now — keep an eye on upcoming due dates.'
                    : 'Heavy workload ahead — consider rescheduling or completing overdue quests.'}
              </p>
            </RetroCard>

            <RetroCard borderColor="#2a2733">
              <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">Workload Analysis</h2>
              <WorkloadDonut segments={summary.workload} />
            </RetroCard>

            <RetroCard borderColor="#a78bfa" className="bg-[#a78bfa]">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-[#3b1f7a]">Weekly XP Potential</span>
                <TrendUpIcon />
              </div>
              <p className="mb-2 text-4xl font-extrabold text-[#0f0f13]">+{summary.weeklyXpPotential} XP</p>
              <p className="text-sm text-[#3b1f7a]">
                {summary.priorityQuests.length === 0
                  ? 'No quests for now! You can earn your XP simply by logging in!'
                  : 'Complete your active quests this week to bank this XP.'}
              </p>
            </RetroCard>
          </div>
        </main>
      </div>
    </div>
  );
}
