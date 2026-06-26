'use client';

import { useEffect, useRef, useState } from 'react';

import { Icon } from './Icon';

const HELP_TOPICS = [
  {
    icon: 'star',
    title: 'XP & Levels',
    body: 'Every quest awards XP based on its category, difficulty, and deadline. Bank 500 XP to level up. Finishing early adds a bonus.'
  },
  {
    icon: 'local_fire_department',
    title: 'Streaks & Freezes',
    body: "Log in daily to grow your streak. Miss a day and a freeze (earned every 7-day streak) covers you automatically instead of resetting to zero."
  },
  {
    icon: 'warning',
    title: 'System Overload',
    body: "In Progress quests above your limit trigger an overload warning. Tune the limit yourself on the Profile page's Overload Threshold."
  },
  {
    icon: 'group',
    title: 'Guilds & Seasons',
    body: 'Found or join one guild at a time. The leaderboard ranks XP earned this week only and resets automatically every Monday.'
  },
  {
    icon: 'shield',
    title: 'Modes',
    body: 'Switch between Normal, Certs, and Exam to filter the Dashboard and Quest Board down to just that category of quest.'
  }
];

export function HelpPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        aria-expanded={isOpen}
        aria-label="Help"
        className="rounded-md border-2 border-black bg-[#1d1a21] p-2 text-[#cac4d4] transition-all hover:scale-110 hover:bg-[#2b2930] active:translate-y-1"
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
      >
        <Icon name="help" />
      </button>

      {isOpen ? (
        <div
          aria-label="Help and documentation"
          className="absolute right-0 top-full z-50 mt-2 w-80 border-2 border-black bg-[#1d1a21] shadow-[6px_6px_0px_0px_#000]"
          role="dialog"
        >
          <div className="border-b-2 border-[#2a2733] p-3">
            <p className="text-xs font-extrabold uppercase tracking-widest text-white">How IT Quest Works</p>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {HELP_TOPICS.map((topic) => (
              <div key={topic.title} className="flex items-start gap-3 border-b border-[#2a2733] p-3">
                <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center border-2 border-black bg-[#a78bfa] text-[#0f0f13]">
                  <Icon className="h-4 w-4" name={topic.icon} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-white">{topic.title}</span>
                  <span className="block text-xs leading-relaxed text-gray-400">{topic.body}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
