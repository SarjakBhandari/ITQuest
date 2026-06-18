'use client';

import type { QuestMode } from '../../components/dashboard/DashboardPage';
import { DashboardIcon } from '../../components/dashboard/DashboardIcon';
import { BrutalistCard } from '../../components/ui/BrutalistCard';
import { RetroButton } from '../../components/ui/RetroButton';

type DashboardProgressCardProps = {
  currentXp: number;
  maxXp: number;
  streak: number;
  freezesAvailable: number;
  mode: QuestMode;
};

const modeStyles: Record<QuestMode, { bg: string; text: string }> = {
  Normal: { bg: 'bg-[#45dfa4]', text: 'text-[#003825]' },
  Certs: { bg: 'bg-[#ffc640]', text: 'text-[#261a00]' },
  Exam: { bg: 'bg-[#ffb4ab]', text: 'text-[#690005]' }
};

function xpProgressPct(current: number, max: number) {
  return Math.min((current / max) * 100, 100);
}

function levelFromXp(current: number, max: number) {
  return Math.floor((current / max) * 10) + 1;
}

export function DashboardProgressCard({ currentXp, maxXp, streak, freezesAvailable, mode }: DashboardProgressCardProps) {
  const pct = xpProgressPct(currentXp, maxXp);
  const level = levelFromXp(currentXp, maxXp);
  const modeStyle = modeStyles[mode];

  return (
    <section className="brutalist-card flex flex-col gap-6 bg-[#211e25] p-6 sm:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <span className="text-2xl font-bold text-[#cebdff]">Level {level}</span>
        <div className="flex flex-1 flex-col items-center">
          <div
            className="relative h-8 w-full max-w-xl overflow-hidden border-2 border-black bg-[#36343b]"
            role="progressbar"
            aria-valuenow={currentXp}
            aria-valuemin={0}
            aria-valuemax={maxXp}
            aria-label={`${currentXp} of ${maxXp} XP`}
          >
            <div
              className="h-full bg-[#45dfa4] transition-all duration-500"
              style={{ width: `${pct}%`, boxShadow: 'inset -4px 0 0 rgba(0,0,0,0.2)' }}
            />
          </div>
          <span className="mt-1 text-sm font-bold text-[#ffc640]">
            {currentXp.toLocaleString()} / {maxXp.toLocaleString()} XP
          </span>
        </div>
        <span className="text-2xl font-bold text-[#cebdff]">Level {level + 1}</span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
        <div className="flex items-center gap-6">
          <BrutalistCard className="flex h-24 w-24 items-center justify-center bg-[#ffc640]" aria-label={`${streak} day streak`}>
            <span className="text-5xl font-black text-black">{streak}</span>
          </BrutalistCard>
          <div className="flex flex-col">
            <span className="flex items-center gap-2 font-bold uppercase text-[#ffc640]">
              <DashboardIcon filled name="local_fire_department" />
              Streak
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 md:items-end">
          <span className="flex items-center gap-2 font-bold uppercase text-[#45dfa4]">
            <DashboardIcon name="ac_unit" />
            {freezesAvailable} Freeze Available
          </span>
          <RetroButton className={`${modeStyle.bg} ${modeStyle.text} px-12 py-2 font-bold uppercase tracking-widest`}>
            {mode} Mode
          </RetroButton>
        </div>
      </div>
    </section>
  );
}

export function DashboardSectionTitle({ title }: { title: string }) {
  return <h3 className="text-2xl font-bold text-[#e6e0ea]">{title}</h3>;
}

export function DashboardSectionDivider() {
  return <div className="mx-4 h-1 flex-1 border-b-2 border-black bg-[#36343b]" />;
}

export function DashboardPlaceholder() {
  return (
    <BrutalistCard className="grid h-64 place-items-center bg-[#211e25] p-6">
      <p className="text-center text-sm text-[#cac4d4]">
        No priority quests yet — start a new quest to begin your adventure.
      </p>
    </BrutalistCard>
  );
}

type DashboardModeButtonsProps = {
  activeMode: QuestMode;
  onModeChange: (mode: QuestMode) => void;
};

const modeButtons: { label: QuestMode; className: string }[] = [
  { label: 'Normal', className: 'bg-[#45dfa4] text-[#003825]' },
  { label: 'Certs', className: 'bg-[#ffc640] text-[#261a00]' },
  { label: 'Exam', className: 'bg-[#ffb4ab] text-[#690005]' }
];

export function DashboardModeButtons({ activeMode, onModeChange }: DashboardModeButtonsProps) {
  return (
    <div className="brutalist-card flex flex-wrap gap-4 bg-[#211e25] p-6" role="group" aria-label="Select quest mode">
      {modeButtons.map((item) => {
        const isActive = activeMode === item.label;
        return (
          <RetroButton
            key={item.label}
            aria-pressed={isActive}
            className={`min-w-[120px] flex-1 justify-center font-black uppercase transition-all ${
              isActive ? item.className : 'bg-[#1e1c24] text-[#cac4d4]'
            }`}
            onClick={() => onModeChange(item.label)}
            style={
              isActive
                ? { boxShadow: 'none', transform: 'translate(3px, 3px)' }
                : undefined
            }
            type="button"
          >
            {item.label}
          </RetroButton>
        );
      })}
    </div>
  );
}

export function DashboardOverloadCard({ overloadPct }: { overloadPct: number }) {
  const circumference = 2 * Math.PI * 70;
  const filled = (overloadPct / 100) * circumference;

  return (
    <BrutalistCard className="border-red-400/30 bg-[#211e25] p-6">
      <div className="mb-6 flex items-center gap-2 text-[#ffb4ab]">
        <DashboardIcon name="warning" />
        <span className="text-2xl font-bold uppercase">System Overload</span>
      </div>
      <div className="relative mx-auto mb-6 flex h-40 w-40 items-center justify-center">
        <svg aria-label={`System overload at ${overloadPct}%`} className="h-full w-full -rotate-90 transform">
          <circle className="text-[#36343b]" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="12" />
          <circle
            className="text-[#ffb4ab]"
            cx="80"
            cy="80"
            fill="transparent"
            r="70"
            stroke="currentColor"
            strokeDasharray={`${filled} ${circumference}`}
            strokeLinecap="round"
            strokeWidth="12"
          />
        </svg>
        <span className="absolute text-4xl font-black">{overloadPct}%</span>
      </div>
      <p className="text-center text-[#cac4d4]">
        {overloadPct === 0
          ? 'You are new here! Go to quest and start your adventure.'
          : 'Consider pausing or rescheduling quests to recover.'}
      </p>
    </BrutalistCard>
  );
}

export function DashboardAnalysisCard() {
  const segments = [
    { pct: 45, color: '#cebdff', label: 'Classes (45%)' },
    { pct: 30, color: '#45dfa4', label: 'Certs (30%)' },
    { pct: 25, color: '#ffc640', label: 'Projects (25%)' }
  ];

  const r = 15.9;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  return (
    <BrutalistCard className="bg-[#211e25] p-6">
      <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-[#cac4d4]">Workload Analysis</h4>
      <div className="flex items-center gap-8">
        <div className="relative h-32 w-32">
          <svg aria-label="Workload analysis donut chart" className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
            <circle cx="18" cy="18" fill="transparent" r={r} stroke="#36343b" strokeWidth="4" />
            {segments.map((segment) => {
              const dash = (segment.pct / 100) * circumference;
              const slice = (
                <circle
                  key={segment.label}
                  cx="18"
                  cy="18"
                  fill="transparent"
                  r={r}
                  stroke={segment.color}
                  strokeDasharray={`${dash} ${circumference}`}
                  strokeDashoffset={-((offset / 100) * circumference)}
                  strokeWidth="4"
                />
              );
              offset += segment.pct;
              return slice;
            })}
            <circle cx="18" cy="18" fill="#211e25" r="12" />
          </svg>
        </div>
        <div className="flex flex-col gap-2">
          {segments.map((segment) => (
            <div key={segment.label} className="flex items-center gap-2">
              <div className="h-3 w-3 border border-black" style={{ backgroundColor: segment.color }} />
              <span className="text-xs font-bold text-[#cac4d4]">{segment.label}</span>
            </div>
          ))}
        </div>
      </div>
    </BrutalistCard>
  );
}

export function DashboardXpCard({ weeklyXp }: { weeklyXp: number }) {
  return (
    <BrutalistCard className="bg-[#a78bfa] p-6 text-[#3c1989]">
      <div className="mb-2 flex items-start justify-between">
        <h4 className="text-sm font-bold uppercase tracking-widest opacity-80">Weekly XP Potential</h4>
        <DashboardIcon name="trending_up" />
      </div>
      <span className="mb-4 block text-5xl font-black">+{weeklyXp} XP</span>
      <p className="text-sm opacity-90">No quests for now! You can earn your XP simply by logging in!</p>
    </BrutalistCard>
  );
}
