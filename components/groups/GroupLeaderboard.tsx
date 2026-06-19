'use client';

import { useEffect, useState } from 'react';

import { leaveGroup } from '../../lib/api/groups';
import { Icon } from '../ui/Icon';
import { useToast } from '../ui/ToastProvider';

import { SeasonCountdown } from './SeasonCountdown';

import type { GroupLeaderboardEntry, GroupSummary } from '../../types/group';

const AVATAR_COLORS = ['#a78bfa', '#facc15', '#23d97e', '#60a5fa', '#f87171', '#45dfa4'];
const RANK_ACCENTS: Record<number, string> = { 1: '#facc15', 2: '#9ca3af', 3: '#a78bfa' };

function avatarColor(heroName: string) {
  let hash = 0;
  for (let i = 0; i < heroName.length; i += 1) hash = (hash + heroName.charCodeAt(i)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[hash];
}

function Avatar({ heroName, size = 40 }: { heroName: string; size?: number }) {
  return (
    <div
      className="flex flex-shrink-0 items-center justify-center border-2 border-black font-extrabold text-[#0f0f13]"
      style={{ width: size, height: size, backgroundColor: avatarColor(heroName), fontSize: size / 2.4 }}
    >
      {heroName.charAt(0).toUpperCase()}
    </div>
  );
}

function gapCaption(entry: GroupLeaderboardEntry, aboveEntry: GroupLeaderboardEntry | undefined) {
  if (!aboveEntry) {
    return entry.seasonXp > 0 ? 'Leading the charge!' : 'Be the first to score this season!';
  }
  const gap = aboveEntry.seasonXp - entry.seasonXp;
  if (gap <= 0) {
    return `Tied with ${aboveEntry.heroName}!`;
  }
  return `${gap.toLocaleString()} XP to pass ${aboveEntry.heroName}`;
}

type RosterRowProps = {
  entry: GroupLeaderboardEntry;
  aboveEntry: GroupLeaderboardEntry | undefined;
  maxSeasonXp: number;
  animateIn: boolean;
};

function RosterRow({ entry, aboveEntry, maxSeasonXp, animateIn }: RosterRowProps) {
  const accent = RANK_ACCENTS[entry.rank];
  const widthPct = maxSeasonXp > 0 ? Math.max(3, Math.round((entry.seasonXp / maxSeasonXp) * 100)) : 3;

  return (
    <div
      className={`grid grid-cols-12 items-center gap-4 p-4 transition-colors ${
        entry.isYou ? 'border-2 border-[#a78bfa] bg-[#a78bfa]/10' : 'border-2 border-transparent hover:bg-[#2b2930]'
      }`}
    >
      <div className="col-span-1 flex items-center gap-1">
        <span className="text-lg font-bold" style={{ color: accent ?? '#9ca3af' }}>
          {entry.rank}
        </span>
        {accent ? <Icon className="h-4 w-4" name="crown" style={{ color: accent }} /> : null}
      </div>
      <div className="col-span-3 flex items-center gap-3">
        <Avatar heroName={entry.heroName} />
        <span className={`font-medium ${entry.isYou ? 'font-bold text-[#a78bfa]' : 'text-gray-200'}`}>
          {entry.heroName}
          {entry.isYou ? ' (You)' : ''}
          {entry.isOwner ? <Icon className="ml-1.5 inline h-3.5 w-3.5" name="crown" style={{ color: '#facc15' }} /> : null}
        </span>
      </div>
      <div className="col-span-6 px-2">
        <div className="h-4 w-full overflow-hidden border-2 border-black bg-[#141219]">
          <div
            className="h-full transition-all duration-700 ease-out"
            style={{
              width: animateIn ? `${widthPct}%` : '0%',
              backgroundColor: entry.isYou ? '#a78bfa' : '#45dfa4'
            }}
          />
        </div>
        <p className="mt-1 flex items-center gap-1 text-[11px] italic text-[#9ca3af]">
          <Icon className="h-3 w-3 flex-shrink-0" name="trending_up" />
          {gapCaption(entry, aboveEntry)}
        </p>
      </div>
      <div className="col-span-2 text-right font-bold" style={{ color: '#45dfa4' }}>
        {entry.seasonXp.toLocaleString()}
      </div>
    </div>
  );
}

type GroupLeaderboardProps = {
  group: GroupSummary;
  onLeft: () => void;
};

export function GroupLeaderboard({ group, onLeft }: GroupLeaderboardProps) {
  const { showToast } = useToast();
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimateIn(true), 150);
    return () => clearTimeout(timeout);
  }, [group.id]);

  const podium = group.leaderboard.slice(0, 3);
  const [first, second, third] = podium;
  const maxSeasonXp = group.leaderboard[0]?.seasonXp ?? 0;
  const guildSeasonXp = group.leaderboard.reduce((sum, entry) => sum + entry.seasonXp, 0);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(group.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      showToast('Could not copy the code - copy it manually.', 'error');
    }
  };

  const confirmLeave = async () => {
    setIsLeaving(true);
    try {
      await leaveGroup();
      showToast(`You left "${group.name}".`, 'info');
      onLeft();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to leave the guild.', 'error');
    } finally {
      setIsLeaving(false);
      setShowLeaveConfirm(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col p-6">
      <section className="mb-10 flex flex-wrap items-start justify-between gap-4 border-2 border-black bg-[#1d1a21] p-6 shadow-[6px_6px_0px_0px_#000]">
        <div className="flex items-center gap-6">
          <div
            className="flex h-16 w-16 flex-shrink-0 items-center justify-center border-4 border-black"
            style={{ backgroundColor: '#facc15', boxShadow: '4px 4px 0px 0px #000' }}
          >
            <Icon className="h-8 w-8" name="swords" style={{ color: '#0f0f13' }} />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">{group.name}</h2>
            <button
              className="mt-1 flex items-center gap-2 text-xs uppercase tracking-tighter text-[#9ca3af] transition-colors hover:text-white"
              onClick={handleCopyCode}
              type="button"
            >
              Group code: <span className="font-bold text-[#facc15]">{group.code}</span>
              <Icon className="h-3.5 w-3.5" name={copied ? 'check' : 'content_copy'} />
            </button>
          </div>
        </div>
        <button
          className="border-4 border-black px-8 py-3 text-sm font-bold uppercase tracking-wide transition-all hover:translate-y-1 hover:shadow-none"
          onClick={() => setShowLeaveConfirm(true)}
          style={{ backgroundColor: '#f87171', color: '#0f0f13', boxShadow: '4px 4px 0px 0px #000' }}
          type="button"
        >
          Leave
        </button>
      </section>

      {podium.length === 0 ? (
        <p className="mb-10 text-center text-sm text-gray-500">
          No quests completed yet this season - be the first to climb the board!
        </p>
      ) : (
        <section className="mb-12 flex flex-col items-center">
          <div className="flex w-full max-w-3xl items-end justify-center gap-4 px-4">
            {second ? (
              <div className="flex flex-1 flex-col items-center">
                <Avatar heroName={second.heroName} size={56} />
                <p className="mt-2 text-sm font-bold text-white">
                  {second.heroName}
                  {second.isYou ? ' (You)' : ''}
                </p>
                <p className="text-xs font-bold" style={{ color: '#45dfa4' }}>
                  {second.seasonXp.toLocaleString()} XP
                </p>
                <div className="mt-3 flex h-24 w-full items-center justify-center border-4 border-black bg-[#9ca3af]/30">
                  <span className="text-3xl font-black text-[#9ca3af]">2</span>
                </div>
              </div>
            ) : (
              <div className="flex-1" />
            )}

            {first ? (
              <div className="z-10 flex flex-1 flex-col items-center">
                <Icon className="mb-1 h-9 w-9" name="crown" style={{ color: '#facc15' }} />
                <Avatar heroName={first.heroName} size={80} />
                <p className="mt-2 text-base font-extrabold" style={{ color: '#facc15' }}>
                  {first.heroName}
                  {first.isYou ? ' (You)' : ''}
                </p>
                <p className="text-sm font-black" style={{ color: '#45dfa4' }}>
                  {first.seasonXp.toLocaleString()} XP
                </p>
                <div
                  className="mt-3 flex h-32 w-full items-center justify-center border-4 border-black"
                  style={{ backgroundColor: '#facc15', boxShadow: '6px 6px 0px 0px #000' }}
                >
                  <span className="text-5xl font-black text-black">1</span>
                </div>
              </div>
            ) : null}

            {third ? (
              <div className="flex flex-1 flex-col items-center">
                <Avatar heroName={third.heroName} size={56} />
                <p className="mt-2 text-sm font-bold text-white">
                  {third.heroName}
                  {third.isYou ? ' (You)' : ''}
                </p>
                <p className="text-xs font-bold" style={{ color: '#45dfa4' }}>
                  {third.seasonXp.toLocaleString()} XP
                </p>
                <div className="mt-3 flex h-16 w-full items-center justify-center border-4 border-black bg-[#a78bfa]/30">
                  <span className="text-3xl font-black text-[#a78bfa]">3</span>
                </div>
              </div>
            ) : (
              <div className="flex-1" />
            )}
          </div>
        </section>
      )}

      {group.leaderboard.length > 0 ? (
        <section className="mb-12 border-2 border-black bg-[#211e25] p-6 shadow-[8px_8px_0px_0px_#000]">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-white">Season Roster</h3>
            <p className="text-xs text-[#9ca3af]">Earn quest XP to climb the gauge below</p>
          </div>
          <div className="grid grid-cols-12 gap-4 border-b-2 border-black pb-4 pt-3 text-[10px] font-bold uppercase tracking-widest text-[#9ca3af]">
            <div className="col-span-1">Rank</div>
            <div className="col-span-3">Adventurer</div>
            <div className="col-span-6">Experience Gauge</div>
            <div className="col-span-2 text-right">Season XP</div>
          </div>
          <div className="mt-4 space-y-3">
            {group.leaderboard.map((entry, index) => (
              <RosterRow
                key={entry.id}
                animateIn={animateIn}
                aboveEntry={group.leaderboard[index - 1]}
                entry={entry}
                maxSeasonXp={maxSeasonXp}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-5 border-2 border-black bg-[#1d1a21] p-5 shadow-[4px_4px_0px_0px_#000]">
          <Icon className="h-9 w-9" name="trending_up" style={{ color: '#45dfa4' }} />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#9ca3af]">Current Season</p>
            <p className="text-base font-bold text-white">{group.season.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-5 border-2 border-black bg-[#1d1a21] p-5 shadow-[4px_4px_0px_0px_#000]">
          <Icon className="h-9 w-9" name="schedule" style={{ color: '#facc15' }} />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#9ca3af]">Season Ends In</p>
            <p className="text-base font-bold text-white">
              <SeasonCountdown endsAt={group.season.endsAt} />
            </p>
          </div>
        </div>
        <div className="flex items-center gap-5 border-2 border-black bg-[#1d1a21] p-5 shadow-[4px_4px_0px_0px_#000]">
          <Icon className="h-9 w-9" name="trophy" style={{ color: '#a78bfa' }} />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#9ca3af]">Active Members</p>
            <p className="text-base font-bold text-white">
              {group.memberCount} Hero{group.memberCount === 1 ? '' : 'es'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-5 border-2 border-black bg-[#1d1a21] p-5 shadow-[4px_4px_0px_0px_#000]">
          <Icon className="h-9 w-9" name="sparkle" style={{ color: '#23d97e' }} />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#9ca3af]">Guild Season XP</p>
            <p className="text-base font-bold text-white">{guildSeasonXp.toLocaleString()} XP</p>
          </div>
        </div>
      </section>

      {showLeaveConfirm ? (
        <div
          aria-modal="true"
          role="alertdialog"
          aria-labelledby="leave-guild-title"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
          onClick={() => setShowLeaveConfirm(false)}
        >
          <div
            className="w-full max-w-sm border-4 border-black bg-[#1e1c24] p-6 shadow-[8px_8px_0px_0px_#000]"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="leave-guild-title" className="mb-2 text-lg font-extrabold text-white">
              Leave &ldquo;{group.name}&rdquo;?
            </h2>
            <p className="mb-5 text-sm text-gray-400">
              You&apos;ll lose your spot on this season&apos;s leaderboard. You can rejoin later with the group code.
            </p>
            <div className="flex gap-3">
              <button
                className="flex-1 justify-center border-4 border-black bg-[#f87171] py-3 font-black text-black shadow-[4px_4px_0px_0px_#000] disabled:opacity-60"
                disabled={isLeaving}
                onClick={confirmLeave}
                type="button"
              >
                {isLeaving ? 'Leaving...' : 'Leave'}
              </button>
              <button
                className="flex-1 justify-center border-4 border-black bg-[#0f0f13] py-3 font-black text-white shadow-[4px_4px_0px_0px_#000]"
                onClick={() => setShowLeaveConfirm(false)}
                type="button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
