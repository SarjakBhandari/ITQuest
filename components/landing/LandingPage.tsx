'use client';

import { PublicNavbar } from '../ui/PublicNavbar';
import { ActionLink } from '../ui/ActionLink';
import { AppLogo } from '../ui/AppLogo';
import { Icon } from '../ui/Icon';

const features = [
  {
    icon: 'columns',
    color: '#a78bfa',
    label: 'QUEST BOARD',
    title: 'Drag-and-drop Kanban',
    description: 'Move quests across Backlog, In Progress, Rest, and Done — a board that actually matches how your workload flows.'
  },
  {
    icon: 'star',
    color: '#facc15',
    label: 'PROGRESSION',
    title: 'Earn XP, level up',
    description: 'Every quest you finish banks XP toward your next level, with a live progress bar that shows exactly how close you are.'
  },
  {
    icon: 'local_fire_department',
    color: '#f97316',
    label: 'MOMENTUM',
    title: 'Daily streaks & freezes',
    description: 'Log in to keep your streak alive. Miss a day? Spend a freeze to protect your progress instead of starting over.'
  },
  {
    icon: 'warning',
    color: '#f87171',
    label: 'BALANCE',
    title: 'System overload warnings',
    description: 'Too many overdue or urgent quests trip the overload meter, so you see the burnout risk before it hits.'
  },
  {
    icon: 'bedtime',
    color: '#60a5fa',
    label: 'FLEXIBILITY',
    title: 'Pause and resume anytime',
    description: 'Send a quest to Rest the moment life gets busy, then pull it back into action whenever you are ready to go again.'
  },
  {
    icon: 'trophy',
    color: '#23d97e',
    label: 'COMMUNITY',
    title: 'Groups & competition',
    description: 'Team up in groups, compare XP on shared leaderboards, and turn getting things done into friendly competition.'
  }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <PublicNavbar />

        <section className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:py-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 border-2 border-black bg-[#a78bfa] px-3 py-1 text-xs font-black uppercase tracking-[0.35em] text-[#1d1a21]">
              Gamified Kanban
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Level up your workload without losing your place.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-[#9ca3af] sm:text-lg">
              Track every assignment, project, and cert on a drag-and-drop quest board. Earn XP for what you finish,
              build a streak for showing up, and watch the overload meter before it tips into burnout.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <ActionLink href="/signup" tone="purple" icon={<Icon name="play" className="h-6 w-6" />} className="justify-center text-base sm:text-lg">
                Start a new quest
              </ActionLink>
              <ActionLink href="/login" tone="green" icon={<Icon name="arrow_right" className="h-6 w-6" />} className="justify-center text-base sm:text-lg">
                Resume existing account
              </ActionLink>
            </div>

            <div className="mt-5 flex flex-wrap gap-3 text-sm text-[#9ca3af]">
              <span className="border-2 border-[#2a2733] bg-[#1e1c24] px-3 py-1">Drag &amp; drop quests</span>
              <span className="border-2 border-[#2a2733] bg-[#1e1c24] px-3 py-1">XP every completion</span>
              <span className="border-2 border-[#2a2733] bg-[#1e1c24] px-3 py-1">Group leaderboards</span>
            </div>
          </div>

          <aside className="border-4 border-black bg-[#1e1c24] p-6 shadow-[10px_10px_0px_0px_#000]">
            <div className="flex flex-col items-center text-center">
              <div className="border-4 border-black bg-white p-2 shadow-[6px_6px_0px_0px_#a78bfa]">
                <AppLogo priority sizeClassName="h-28 w-28 sm:h-32 sm:w-32" />
              </div>
              <p className="mt-6 text-sm font-bold uppercase tracking-[0.35em] text-[#23d97e]">Quest board snapshot</p>
              <h2 className="mt-3 text-2xl font-black text-white">From Backlog to Done — gamified every step</h2>
              <p className="mt-3 text-sm leading-6 text-[#9ca3af]">
                Backlog, In Progress, Rest, and Done. Drag a quest forward, bank the XP, and let your level, streak, and
                overload meter track the rest.
              </p>
            </div>

            <div className="mt-6 grid gap-3 text-left sm:grid-cols-2 lg:grid-cols-1">
              <div className="border-2 border-[#2a2733] bg-[#141219] p-4">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-[#facc15]">Solo progress</p>
                <p className="mt-2 text-sm text-[#9ca3af]">Level up, keep your streak alive, and pause quests on Rest without losing them.</p>
              </div>
              <div className="border-2 border-[#2a2733] bg-[#141219] p-4">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-[#23d97e]">Team play</p>
                <p className="mt-2 text-sm text-[#9ca3af]">Join a group, compare XP on the leaderboard, and turn the grind into a competition.</p>
              </div>
            </div>
          </aside>
        </section>

        <section className="pb-10 lg:pb-14">
          <div className="mb-5 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#2a2733]" />
            <span className="text-xs font-black uppercase tracking-[0.35em] text-[#6b7280]">What you get</span>
            <div className="h-px flex-1 bg-[#2a2733]" />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="flex h-full items-start gap-4 border-4 border-black bg-[#1e1c24] p-5 shadow-[6px_6px_0px_0px_#000]"
              >
                <div
                  className="flex-shrink-0 border-2 border-black p-3"
                  style={{ backgroundColor: feature.color, color: '#1d1a21' }}
                >
                  <Icon name={feature.icon} className="h-6 w-6" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-black tracking-tight text-white">{feature.title}</h3>
                    <span
                      className="border-2 border-black px-2 py-0.5 text-[11px] font-black tracking-[0.3em]"
                      style={{ backgroundColor: feature.color, color: '#1d1a21' }}
                    >
                      {feature.label}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#9ca3af]">{feature.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <footer className="border-t-2 border-[#2a2733] py-6 text-center text-sm text-[#6b7280]">
          <p>Less friction. Fewer choices. Clearer next steps.</p>
        </footer>
      </div>
    </main>
  );
}
