'use client';

import { useEffect, useState } from 'react';

import { deleteAdminGuild, getAdminGuild, kickAdminGuildMember, listAdminGuilds, renameAdminGuild } from '../../lib/api/admin';
import { Icon } from '../ui/Icon';
import { useToast } from '../ui/ToastProvider';

import { AdminShell } from './AdminShell';

import type { AdminGuildDetail, AdminGuildSummary } from '../../types/admin';

function GuildDetailModal({
  guildId,
  onClose,
  onChanged
}: {
  guildId: string;
  onClose: () => void;
  onChanged: () => void;
}) {
  const { showToast } = useToast();
  const [guild, setGuild] = useState<AdminGuildDetail | null>(null);

  function refresh() {
    getAdminGuild(guildId)
      .then(({ guild: fetched }) => setGuild(fetched))
      .catch((err) => showToast(err instanceof Error ? err.message : 'Unable to load guild.', 'error'));
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guildId]);

  const handleKick = async (memberId: string, heroName: string) => {
    try {
      await kickAdminGuildMember(guildId, memberId);
      showToast(`Removed ${heroName} from the guild.`, 'info');
      refresh();
      onChanged();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to remove member.', 'error');
    }
  };

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg border-4 border-black bg-[#1e1c24] p-6 shadow-[8px_8px_0px_0px_#000]"
        onClick={(event) => event.stopPropagation()}
      >
        {!guild ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : (
          <>
            <h2 className="mb-1 text-lg font-extrabold text-white">{guild.name}</h2>
            <p className="mb-4 text-xs uppercase text-gray-500">{guild.members.length} members</p>
            <div className="max-h-72 space-y-2 overflow-y-auto">
              {guild.members.map((member) => (
                <div key={member.id} className="flex items-center justify-between gap-3 border-2 border-[#2a2733] bg-[#141219] p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-white">
                      {member.heroName}
                      {member.isOwner ? <Icon className="ml-1.5 inline h-3.5 w-3.5" name="crown" style={{ color: '#facc15' }} /> : null}
                    </p>
                    <p className="truncate text-xs text-gray-500">{member.email}</p>
                  </div>
                  <button
                    className="flex-shrink-0 border-2 border-black bg-[#f87171] px-3 py-1.5 text-[10px] font-bold uppercase text-[#0f0f13]"
                    onClick={() => handleKick(member.id, member.heroName)}
                    type="button"
                  >
                    Kick
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
        <button
          className="mt-5 w-full border-4 border-black bg-[#0f0f13] py-3 font-black text-white shadow-[4px_4px_0px_0px_#000]"
          onClick={onClose}
          type="button"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export function AdminGuildsPage() {
  const { showToast } = useToast();
  const [guilds, setGuilds] = useState<AdminGuildSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingGuildId, setViewingGuildId] = useState<string | null>(null);
  const [renamingGuild, setRenamingGuild] = useState<AdminGuildSummary | null>(null);
  const [newName, setNewName] = useState('');
  const [deleteCandidate, setDeleteCandidate] = useState<AdminGuildSummary | null>(null);

  function refresh() {
    setIsLoading(true);
    listAdminGuilds()
      .then(({ guilds: fetched }) => setGuilds(fetched))
      .catch((err) => showToast(err instanceof Error ? err.message : 'Unable to load guilds.', 'error'))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitRename = async () => {
    if (!renamingGuild) return;
    try {
      await renameAdminGuild(renamingGuild.id, newName);
      showToast('Guild renamed.', 'success');
      setRenamingGuild(null);
      refresh();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to rename guild.', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deleteCandidate) return;
    try {
      await deleteAdminGuild(deleteCandidate.id);
      showToast(`"${deleteCandidate.name}" disbanded.`, 'info');
      setGuilds((prev) => prev.filter((item) => item.id !== deleteCandidate.id));
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to disband guild.', 'error');
    } finally {
      setDeleteCandidate(null);
    }
  };

  return (
    <AdminShell title="Guilds">
      <main className="flex flex-col gap-4 p-6">
        {isLoading ? (
          <p className="flex items-center gap-2 text-sm text-gray-500">
            <Icon className="h-4 w-4 animate-spin" name="schedule" />
            Loading guilds...
          </p>
        ) : guilds.length === 0 ? (
          <p className="text-sm text-gray-500">No guilds have been founded yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {guilds.map((guild) => (
              <div key={guild.id} className="border-2 border-black bg-[#1e1c24] p-5 shadow-[4px_4px_0px_0px_#000]">
                <p className="text-lg font-extrabold text-white">{guild.name}</p>
                <p className="text-xs uppercase tracking-widest text-[#facc15]">{guild.code}</p>
                <p className="mt-2 text-xs text-gray-400">Owner: {guild.ownerName}</p>
                <p className="text-xs text-gray-400">{guild.memberCount} members</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    className="border-2 border-black bg-[#a78bfa] px-3 py-1.5 text-[10px] font-bold uppercase text-[#0f0f13]"
                    onClick={() => setViewingGuildId(guild.id)}
                    type="button"
                  >
                    View Members
                  </button>
                  <button
                    className="border-2 border-black bg-[#facc15] px-3 py-1.5 text-[10px] font-bold uppercase text-[#0f0f13]"
                    onClick={() => {
                      setRenamingGuild(guild);
                      setNewName(guild.name);
                    }}
                    type="button"
                  >
                    Rename
                  </button>
                  <button
                    className="border-2 border-black bg-[#f87171] px-3 py-1.5 text-[10px] font-bold uppercase text-[#0f0f13]"
                    onClick={() => setDeleteCandidate(guild)}
                    type="button"
                  >
                    Disband
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {viewingGuildId ? (
        <GuildDetailModal guildId={viewingGuildId} onChanged={refresh} onClose={() => setViewingGuildId(null)} />
      ) : null}

      {renamingGuild ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          onClick={() => setRenamingGuild(null)}
        >
          <div
            className="w-full max-w-sm border-4 border-black bg-[#1e1c24] p-6 shadow-[8px_8px_0px_0px_#000]"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="mb-4 text-lg font-extrabold text-white">Rename Guild</h2>
            <input
              autoFocus
              className="w-full border-2 border-[#3f3d46] bg-[#2a2733] px-4 py-3 text-white focus:border-[#a78bfa] focus:outline-none"
              onChange={(event) => setNewName(event.target.value)}
              value={newName}
            />
            <div className="mt-5 flex gap-3">
              <button
                className="flex-1 border-4 border-black bg-[#a78bfa] py-3 font-black text-[#0f0f13] shadow-[4px_4px_0px_0px_#000]"
                onClick={submitRename}
                type="button"
              >
                Save
              </button>
              <button
                className="flex-1 border-4 border-black bg-[#0f0f13] py-3 font-black text-white shadow-[4px_4px_0px_0px_#000]"
                onClick={() => setRenamingGuild(null)}
                type="button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {deleteCandidate ? (
        <div
          aria-modal="true"
          role="alertdialog"
          aria-labelledby="delete-guild-title"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
          onClick={() => setDeleteCandidate(null)}
        >
          <div
            className="w-full max-w-sm border-4 border-black bg-[#1e1c24] p-6 shadow-[8px_8px_0px_0px_#000]"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="delete-guild-title" className="mb-2 text-lg font-extrabold text-white">
              Disband &ldquo;{deleteCandidate.name}&rdquo;?
            </h2>
            <p className="mb-5 text-sm text-gray-400">
              All {deleteCandidate.memberCount} members will be removed from the guild. This can&apos;t be undone.
            </p>
            <div className="flex gap-3">
              <button
                className="flex-1 border-4 border-black bg-[#f87171] py-3 font-black text-black shadow-[4px_4px_0px_0px_#000]"
                onClick={confirmDelete}
                type="button"
              >
                Disband
              </button>
              <button
                className="flex-1 border-4 border-black bg-[#0f0f13] py-3 font-black text-white shadow-[4px_4px_0px_0px_#000]"
                onClick={() => setDeleteCandidate(null)}
                type="button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminShell>
  );
}
