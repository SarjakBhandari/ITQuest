'use client';

import { Icon } from '../ui/Icon';

type GroupEmptyStateProps = {
  onCreate: () => void;
  onJoin: () => void;
};

export function GroupEmptyState({ onCreate, onJoin }: GroupEmptyStateProps) {
  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="w-full max-w-2xl border-2 border-[#2a2733] bg-[#1d1a21] p-12 text-center shadow-[8px_8px_0px_0px_#000]">
        <div className="mb-8 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center border-2 border-[#3f3d46] bg-black/40">
            <Icon className="h-14 w-14" name="swords" style={{ color: '#facc15' }} />
          </div>
        </div>

        <h3 className="mb-4 text-4xl font-extrabold tracking-tight text-white">No Guild Yet</h3>
        <p className="mx-auto mb-10 max-w-md text-base leading-relaxed text-gray-400">
          It&apos;s dangerous to go alone! Join a party of fellow squires or lead your own band of adventurers.
        </p>

        <div className="mb-10 flex flex-col items-center justify-center gap-6 sm:flex-row">
          <button
            className="flex items-center gap-3 border-4 border-black px-8 py-4 text-xl font-bold transition-transform hover:scale-105 active:scale-95"
            onClick={onCreate}
            style={{ backgroundColor: '#a78bfa', color: '#0f0f13', boxShadow: '4px 4px 0px 0px #000' }}
            type="button"
          >
            <Icon name="add" className="h-6 w-6" />
            Create a Guild
          </button>
          <button
            className="flex items-center gap-3 border-4 px-8 py-4 text-xl font-bold transition-transform hover:scale-105 hover:bg-[#23d97e]/10 active:scale-95"
            onClick={onJoin}
            style={{ borderColor: '#23d97e', color: '#23d97e', boxShadow: '4px 4px 0px 0px #000' }}
            type="button"
          >
            <Icon name="group" className="h-6 w-6" />
            Join a Guild
          </button>
        </div>

        <div className="border-t border-[#2a2733] pt-8">
          <p className="text-sm italic text-gray-500">&ldquo;Unity is the soul&apos;s greatest shield.&rdquo; - Elder Gaffer</p>
        </div>
      </div>
    </div>
  );
}
