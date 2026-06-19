'use client';

import { useEffect, useState } from 'react';

import { Icon } from '../ui/Icon';

type PauseQuestModalProps = {
  questTitle: string;
  onClose: () => void;
  onConfirm: (note: string) => Promise<void>;
};

export function PauseQuestModal({ questTitle, onClose, onConfirm }: PauseQuestModalProps) {
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(note);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#141219]/80 p-4 backdrop-blur-sm"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md border-2 border-[#a78bfa] bg-[#1d1a21] p-8 text-center shadow-[6px_6px_0px_0px_#141219,8px_8px_0px_0px_#a78bfa] md:p-12"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-8 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center bg-[#eab308] shadow-[4px_4px_0px_0px_#000]">
            <Icon name="bedtime" className="h-9 w-9" style={{ color: '#141219' }} />
          </div>
        </div>

        <h2 className="mb-2 text-2xl font-black text-[#a78bfa] md:text-3xl">Pausing the quest</h2>
        <p className="mb-8 text-sm italic text-gray-400">Write something to remember about the quest</p>

        <div className="mb-10 text-left">
          <textarea
            autoFocus
            className="min-h-[160px] w-full border border-gray-800 bg-[#141219] p-4 text-sm leading-relaxed text-gray-300 focus:border-[#a78bfa] focus:outline-none"
            maxLength={500}
            onChange={(event) => setNote(event.target.value)}
            placeholder="e.g. Stopped after the auth middleware, pick up from the token refresh logic next."
            value={note}
          />
        </div>

        <div className="flex flex-col justify-center gap-6 sm:flex-row">
          <button
            className="bg-[#a78bfa] px-10 py-3 font-black text-[#141219] shadow-[4px_4px_0px_0px_#5b47a1] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 disabled:opacity-70"
            disabled={isSubmitting}
            onClick={handleConfirm}
            type="button"
          >
            {isSubmitting ? 'Pausing...' : 'Sleep!!!'}
          </button>
          <button
            className="border border-[#3b383f] bg-[#3b383f]/30 px-10 py-3 font-black uppercase tracking-wider text-gray-300 shadow-[4px_4px_0px_0px_#000] transition-transform hover:translate-x-0.5 hover:translate-y-0.5"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
        </div>

        <p className="sr-only">Pausing quest: {questTitle}</p>
      </div>
    </div>
  );
}
