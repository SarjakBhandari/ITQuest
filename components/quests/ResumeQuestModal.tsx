'use client';

import { useEffect } from 'react';

import { Icon } from '../ui/Icon';

type ResumeQuestModalProps = {
  questTitle: string;
  note: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

export function ResumeQuestModal({ questTitle, note, onClose, onConfirm }: ResumeQuestModalProps) {
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
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[500px] border-2 border-[#a78bfa] bg-[#1d1a21] p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-6 flex h-20 w-20 items-center justify-center bg-[#4ade80]">
            <Icon name="play" className="h-10 w-10" style={{ color: '#141219' }} />
          </div>

          <h2 className="mb-2 text-3xl font-extrabold tracking-tight text-gray-200">Resuming the quest</h2>
          <div className="mb-8">
            <p className="text-sm italic text-gray-400">Forgot where you were?</p>
            <p className="text-sm italic text-gray-400">Here&apos;s something you wrote for yourself!</p>
          </div>

          <div className="mb-8 h-48 w-full overflow-y-auto border-2 border-[#2d2a33] bg-[#1a181e] p-6 text-left">
            <p className="text-sm leading-relaxed text-gray-300">
              {note || 'No note was left for this quest — jump back in whenever you are ready.'}
            </p>
          </div>

          <div className="flex w-full gap-4">
            <button
              className="flex-1 border-b-4 border-r-4 border-[#7c3aed] bg-[#a78bfa] px-6 py-4 text-lg font-extrabold uppercase tracking-wider text-[#141219] transition-all active:translate-x-0.5 active:translate-y-0.5 active:border-b-2 active:border-r-2"
              onClick={onConfirm}
              type="button"
            >
              Let&apos;s Goo
            </button>
            <button
              className="flex-1 border-2 border-[#3b383f] border-b-4 border-r-4 border-b-black border-r-black bg-[#1d1a21] px-6 py-4 text-lg font-extrabold uppercase tracking-wider text-gray-200 transition-all active:translate-x-0.5 active:translate-y-0.5 active:border-b-2 active:border-r-2"
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>

        <p className="sr-only">Resuming quest: {questTitle}</p>
      </div>
    </div>
  );
}
