'use client';

import { useEffect, useMemo } from 'react';

import { Icon } from '../ui/Icon';

const FLAVOR_LINES = [
  "You're unstoppable today!",
  'Another one down!',
  'Keep this momentum going!',
  'Quest log getting lighter!'
];

const PROGRESS_SEGMENTS = 11;

type QuestCompleteModalProps = {
  xpEarned: number;
  bonusXp: number;
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  onClose: () => void;
};

export function QuestCompleteModal({ xpEarned, bonusXp, level, xpIntoLevel, xpForNextLevel, onClose }: QuestCompleteModalProps) {
  const flavor = useMemo(() => FLAVOR_LINES[Math.floor(Math.random() * FLAVOR_LINES.length)], []);
  const filledSegments = Math.round((xpIntoLevel / xpForNextLevel) * PROGRESS_SEGMENTS);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[#141219]/80 p-4 backdrop-blur-sm"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg border-2 border-white p-1 shadow-[0_0_0_2px_#141219,0_0_0_4px_#a78bfa]"
        style={{ backgroundColor: '#141219' }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col items-center border-2 border-white/10 p-8 text-center md:p-12">
          <div className="mb-6 flex h-20 w-20 items-center justify-center bg-[#10b981] shadow-[4px_4px_0px_0px_#000]">
            <Icon name="check" className="h-10 w-10" style={{ color: '#141219' }} />
          </div>

          <h2 className="mb-2 text-3xl font-extrabold tracking-tight text-white md:text-4xl">Quest Complete!</h2>
          <p className="mb-10 text-lg text-gray-400">&ldquo;{flavor}&rdquo;</p>

          <div className="mb-10 w-full space-y-4">
            <div className="flex items-center justify-between border-2 border-[#3b383f] bg-[#1d1a21] p-4 shadow-[2px_2px_0px_0px_#000]">
              <div className="flex items-center gap-3">
                <Icon name="star" filled className="h-6 w-6" style={{ color: '#fbbf24' }} />
                <span className="text-xs font-bold uppercase tracking-widest text-gray-300">XP Earned</span>
              </div>
              <span className="text-xl font-extrabold" style={{ color: '#fbbf24' }}>
                +{xpEarned} XP
              </span>
            </div>

            {bonusXp > 0 ? (
              <div className="flex items-center justify-between border-2 border-dashed border-[#10b981]/50 p-4">
                <div className="flex items-center gap-3">
                  <Icon name="swords" className="h-6 w-6" style={{ color: '#10b981' }} />
                  <span className="text-sm font-bold text-[#10b981]">Early Bonus</span>
                </div>
                <span className="font-bold text-[#10b981]">+{bonusXp} XP</span>
              </div>
            ) : null}
          </div>

          <div className="mb-12 w-full">
            <div className="mb-3 flex items-end justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Level {level} Progress</span>
              <span className="text-sm font-bold" style={{ color: '#fbbf24' }}>
                {xpIntoLevel.toLocaleString()} / {xpForNextLevel.toLocaleString()} XP
              </span>
            </div>
            <div className="flex">
              {Array.from({ length: PROGRESS_SEGMENTS }, (_, index) => (
                <div
                  key={index}
                  className="mr-1 h-3 flex-1 last:mr-0"
                  style={{ backgroundColor: index < filledSegments ? '#a78bfa' : '#2d2a33' }}
                />
              ))}
            </div>
          </div>

          <button
            className="w-full bg-[#a78bfa] py-5 text-2xl font-black text-[#141219] shadow-[4px_4px_0px_0px_#7c3aed] transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none"
            onClick={onClose}
            type="button"
          >
            Awesome!
          </button>
        </div>
      </div>
    </div>
  );
}
