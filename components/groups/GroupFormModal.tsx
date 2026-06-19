'use client';

import { useEffect, useState } from 'react';

import { createGroup, joinGroup } from '../../lib/api/groups';
import { Icon } from '../ui/Icon';

import type { GroupSummary } from '../../types/group';

type FormMode = 'create' | 'join';

type GroupFormModalProps = {
  initialMode: FormMode;
  onClose: () => void;
  onSuccess: (group: GroupSummary, message?: string) => void;
};

export function GroupFormModal({ initialMode, onClose, onSuccess }: GroupFormModalProps) {
  const [mode, setMode] = useState<FormMode>(initialMode);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const switchMode = (next: FormMode) => {
    setMode(next);
    setError('');
  };

  const submit = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      if (mode === 'create') {
        const trimmed = name.trim();
        if (trimmed.length < 3) {
          setError('Guild name must be at least 3 characters.');
          return;
        }
        const { group, message } = await createGroup(trimmed);
        if (group) onSuccess(group, message);
      } else {
        const trimmed = code.trim();
        if (!trimmed) {
          setError('Enter a group code.');
          return;
        }
        const { group, message } = await joinGroup(trimmed);
        if (group) onSuccess(group, message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl border-2 border-[#a78bfa] bg-[#1d1a21] p-10 shadow-[6px_6px_0px_0px_#000]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          aria-label="Close modal"
          className="absolute -right-2 -top-2 z-10 flex h-11 w-11 items-center justify-center border-4 border-black font-extrabold transition-all hover:brightness-110"
          onClick={onClose}
          style={{ backgroundColor: '#f87171', color: '#0f0f13', boxShadow: '3px 3px 0px 0px #7f1d1d' }}
          type="button"
        >
          <Icon name="close" className="h-4 w-4" />
        </button>

        <div className="mb-8 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center border-2 border-black bg-black">
            <Icon className="h-12 w-12" name="swords" style={{ color: '#facc15' }} />
          </div>
        </div>

        <div className="mb-8 flex gap-3" role="tablist">
          <button
            aria-selected={mode === 'create'}
            className="flex-1 border-4 border-black py-3 text-sm font-extrabold uppercase tracking-wide transition-all"
            onClick={() => switchMode('create')}
            role="tab"
            style={{
              backgroundColor: mode === 'create' ? '#a78bfa' : '#1e1c24',
              color: mode === 'create' ? '#0f0f13' : '#a78bfa',
              boxShadow: mode === 'create' ? 'none' : '3px 3px 0px 0px #312e81',
              transform: mode === 'create' ? 'translate(3px, 3px)' : undefined
            }}
            type="button"
          >
            Create a Guild
          </button>
          <button
            aria-selected={mode === 'join'}
            className="flex-1 border-4 border-black py-3 text-sm font-extrabold uppercase tracking-wide transition-all"
            onClick={() => switchMode('join')}
            role="tab"
            style={{
              backgroundColor: mode === 'join' ? '#23d97e' : '#1e1c24',
              color: mode === 'join' ? '#0f0f13' : '#23d97e',
              boxShadow: mode === 'join' ? 'none' : '3px 3px 0px 0px #065f46',
              transform: mode === 'join' ? 'translate(3px, 3px)' : undefined
            }}
            type="button"
          >
            Join a Guild
          </button>
        </div>

        {mode === 'create' ? (
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-widest" htmlFor="group-name" style={{ color: '#facc15' }}>
              Enter Group Name!
            </label>
            <input
              autoFocus
              id="group-name"
              className="w-full border-2 px-4 py-4 text-base text-white placeholder-gray-600 transition-colors focus:outline-none"
              placeholder="The Debugger's Guild"
              style={{ backgroundColor: '#2a2733', borderColor: error ? '#f87171' : '#3f3d46' }}
              value={name}
              onChange={(event) => setName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') submit();
              }}
            />
          </div>
        ) : (
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-widest" htmlFor="group-code" style={{ color: '#facc15' }}>
              Enter Group Code!
            </label>
            <input
              autoFocus
              id="group-code"
              className="w-full border-2 px-4 py-4 text-base uppercase text-white placeholder-gray-600 transition-colors focus:outline-none"
              placeholder="e.g. X89-3D9D"
              style={{ backgroundColor: '#2a2733', borderColor: error ? '#f87171' : '#3f3d46' }}
              value={code}
              onChange={(event) => setCode(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') submit();
              }}
            />
          </div>
        )}

        {error ? <p className="mt-3 text-sm text-[#f87171]" role="alert">{error}</p> : null}

        <button
          className="mt-8 flex w-full items-center justify-center gap-3 border-4 border-black py-5 text-lg font-extrabold uppercase tracking-wide transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          onClick={submit}
          style={{
            backgroundColor: mode === 'create' ? '#a78bfa' : '#23d97e',
            color: '#0f0f13',
            boxShadow: isSubmitting ? 'none' : '4px 4px 0px 0px #000'
          }}
          type="button"
        >
          {isSubmitting ? 'Working...' : mode === 'create' ? "Let's Found It" : "Let's Goo"}
        </button>

        <div className="mt-8 text-center">
          <p className="text-sm italic text-gray-500">&ldquo;Unity is the soul&apos;s greatest shield.&rdquo; - Elder Gaffer</p>
        </div>
      </div>
    </div>
  );
}
