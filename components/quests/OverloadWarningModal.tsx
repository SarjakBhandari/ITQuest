'use client';

import { useEffect } from 'react';

import { Icon } from '../ui/Icon';

type OverloadWarningModalProps = {
  onDismiss: () => void;
};

export function OverloadWarningModal({ onDismiss }: OverloadWarningModalProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onDismiss();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onDismiss]);

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      role="alertdialog"
      onClick={onDismiss}
    >
      <div className="w-full max-w-md border-2 border-[#c4b5fd] bg-[#141219] p-1" onClick={(event) => event.stopPropagation()}>
        <div className="flex flex-col items-center border-2 border-black bg-[#242129] p-8 text-center">
          <div className="mb-8 flex h-24 w-24 items-center justify-center border-b-4 border-r-4 border-emerald-950 bg-[#ff0000]">
            <Icon name="close" className="h-12 w-12" style={{ color: '#000000' }} />
          </div>

          <h2 className="mb-4 text-2xl font-black uppercase italic tracking-tight text-white">You&apos;re overloaded!!</h2>
          <p className="mb-10 max-w-xs text-sm font-medium italic leading-relaxed text-gray-300">
            You have too many active quests — put one to Rest or finish it before adding more.
          </p>

          <button
            className="w-full bg-[#c4b5fd] py-4 text-xl font-extrabold text-[#1d1a21] shadow-[0_6px_0_0_#4c1d95] transition-all duration-75 active:translate-y-1 active:shadow-none"
            onClick={onDismiss}
            type="button"
          >
            Okay!
          </button>
        </div>
      </div>
    </div>
  );
}
