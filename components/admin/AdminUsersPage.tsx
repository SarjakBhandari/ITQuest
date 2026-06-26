'use client';

import { useEffect, useState } from 'react';

import { deleteAdminUser, listAdminUsers, setAdminUserSuspension, updateAdminUser } from '../../lib/api/admin';
import { Icon } from '../ui/Icon';
import { useToast } from '../ui/ToastProvider';

import { AdminShell } from './AdminShell';

import type { AdminUser } from '../../types/admin';

function EditUserModal({ user, onClose, onSaved }: { user: AdminUser; onClose: () => void; onSaved: (user: AdminUser) => void }) {
  const { showToast } = useToast();
  const [xp, setXp] = useState(user.xp);
  const [streak, setStreak] = useState(user.streak);
  const [freezesAvailable, setFreezesAvailable] = useState(user.freezesAvailable);
  const [maxActiveQuests, setMaxActiveQuests] = useState(user.maxActiveQuests);
  const [isSaving, setIsSaving] = useState(false);

  const save = async () => {
    setIsSaving(true);
    try {
      const { user: updated } = await updateAdminUser(user.id, { xp, streak, freezesAvailable, maxActiveQuests });
      onSaved(updated);
      showToast(`Updated ${user.heroName}.`, 'success');
      onClose();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to update user.', 'error');
    } finally {
      setIsSaving(false);
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
        className="w-full max-w-sm border-4 border-black bg-[#1e1c24] p-6 shadow-[8px_8px_0px_0px_#000]"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="mb-4 text-lg font-extrabold text-white">Edit {user.heroName}</h2>
        <div className="flex flex-col gap-3">
          {(
            [
              ['XP', xp, setXp],
              ['Streak', streak, setStreak],
              ['Freezes Available', freezesAvailable, setFreezesAvailable],
              ['Max Active Quests', maxActiveQuests, setMaxActiveQuests]
            ] as const
          ).map(([label, value, setter]) => (
            <label key={label} className="flex flex-col gap-1 text-xs font-bold uppercase tracking-widest text-[#a78bfa]">
              {label}
              <input
                className="border-2 border-[#3f3d46] bg-[#2a2733] px-3 py-2 text-sm text-white focus:border-[#a78bfa] focus:outline-none"
                min={0}
                onChange={(event) => setter(Number(event.target.value))}
                type="number"
                value={value}
              />
            </label>
          ))}
        </div>
        <div className="mt-6 flex gap-3">
          <button
            className="flex-1 border-4 border-black bg-[#a78bfa] py-3 font-black text-[#0f0f13] shadow-[4px_4px_0px_0px_#000] disabled:opacity-60"
            disabled={isSaving}
            onClick={save}
            type="button"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button
            className="flex-1 border-4 border-black bg-[#0f0f13] py-3 font-black text-white shadow-[4px_4px_0px_0px_#000]"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminUsersPage() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<AdminUser | null>(null);

  function refresh(query?: string) {
    setIsLoading(true);
    listAdminUsers(query)
      .then(({ users: fetched }) => setUsers(fetched))
      .catch((err) => showToast(err instanceof Error ? err.message : 'Unable to load users.', 'error'))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    refresh(search);
  };

  const toggleSuspension = async (user: AdminUser) => {
    try {
      const { user: updated } = await setAdminUserSuspension(user.id, {
        suspended: !user.suspended,
        reason: user.suspended ? undefined : 'Suspended by administrator.'
      });
      setUsers((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      showToast(updated.suspended ? `${updated.heroName} suspended.` : `${updated.heroName} reinstated.`, 'info');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to update suspension.', 'error');
    }
  };

  const togglePromotion = async (user: AdminUser) => {
    try {
      const { user: updated } = await updateAdminUser(user.id, { isAdmin: !user.isAdmin });
      setUsers((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      showToast(updated.isAdmin ? `${updated.heroName} is now an administrator.` : `${updated.heroName} is no longer an administrator.`, 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to update administrator access.', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!deleteCandidate) return;
    try {
      await deleteAdminUser(deleteCandidate.id);
      setUsers((prev) => prev.filter((item) => item.id !== deleteCandidate.id));
      showToast(`${deleteCandidate.heroName} deleted.`, 'info');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to delete user.', 'error');
    } finally {
      setDeleteCandidate(null);
    }
  };

  return (
    <AdminShell title="Users">
      <main className="flex flex-col gap-4 p-6">
        <form className="flex gap-3" onSubmit={handleSearchSubmit}>
          <input
            className="flex-1 border-2 border-[#3f3d46] bg-[#2a2733] px-4 py-3 text-white placeholder-gray-600 focus:border-[#a78bfa] focus:outline-none"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by hero name or email..."
            value={search}
          />
          <button className="border-2 border-black bg-[#a78bfa] px-5 py-3 text-sm font-bold uppercase text-[#0f0f13]" type="submit">
            Search
          </button>
        </form>

        {isLoading ? (
          <p className="flex items-center gap-2 text-sm text-gray-500">
            <Icon className="h-4 w-4 animate-spin" name="schedule" />
            Loading users...
          </p>
        ) : (
          <div className="overflow-x-auto border-2 border-black bg-[#1e1c24] shadow-[6px_6px_0px_0px_#000]">
            <div className="min-w-[860px]">
              <div className="grid grid-cols-12 gap-3 border-b-2 border-black p-4 text-[10px] font-bold uppercase tracking-widest text-[#9ca3af]">
                <div className="col-span-3">Hero</div>
                <div className="col-span-2">XP</div>
                <div className="col-span-1">Streak</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-4 text-right">Actions</div>
              </div>
              {users.map((user) => (
                <div key={user.id} className="grid grid-cols-12 items-center gap-3 border-b border-[#2a2733] p-4">
                  <div className="col-span-3 min-w-0">
                    <p className="truncate text-sm font-bold text-white">
                      {user.heroName}
                      {user.isAdmin ? <Icon className="ml-1.5 inline h-3.5 w-3.5" name="crown" style={{ color: '#facc15' }} /> : null}
                    </p>
                    <p className="truncate text-xs text-gray-500">{user.email}</p>
                  </div>
                  <div className="col-span-2 text-sm font-bold text-[#45dfa4]">{user.xp.toLocaleString()}</div>
                  <div className="col-span-1 text-sm font-bold text-[#f97316]">{user.streak}</div>
                  <div className="col-span-2">
                    {user.suspended ? (
                      <span className="border-2 border-[#f87171] bg-[#f87171]/10 px-2 py-1 text-[10px] font-bold uppercase text-[#f87171]">
                        Suspended
                      </span>
                    ) : (
                      <span className="border-2 border-[#23d97e] bg-[#23d97e]/10 px-2 py-1 text-[10px] font-bold uppercase text-[#23d97e]">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="col-span-4 flex flex-wrap justify-end gap-2">
                    <button
                      className="border-2 border-black bg-[#a78bfa] px-3 py-1.5 text-[10px] font-bold uppercase text-[#0f0f13]"
                      onClick={() => setEditingUser(user)}
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      className="border-2 border-black bg-[#facc15] px-3 py-1.5 text-[10px] font-bold uppercase text-[#0f0f13]"
                      onClick={() => togglePromotion(user)}
                      type="button"
                    >
                      {user.isAdmin ? 'Demote' : 'Promote'}
                    </button>
                    <button
                      className="border-2 border-black bg-[#60a5fa] px-3 py-1.5 text-[10px] font-bold uppercase text-[#0f0f13]"
                      onClick={() => toggleSuspension(user)}
                      type="button"
                    >
                      {user.suspended ? 'Reinstate' : 'Suspend'}
                    </button>
                    <button
                      className="border-2 border-black bg-[#f87171] px-3 py-1.5 text-[10px] font-bold uppercase text-[#0f0f13]"
                      onClick={() => setDeleteCandidate(user)}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {users.length === 0 ? <p className="p-6 text-center text-sm text-gray-500">No users match that search.</p> : null}
            </div>
          </div>
        )}
      </main>

      {editingUser ? (
        <EditUserModal
          onClose={() => setEditingUser(null)}
          onSaved={(updated) => setUsers((prev) => prev.map((item) => (item.id === updated.id ? updated : item)))}
          user={editingUser}
        />
      ) : null}

      {deleteCandidate ? (
        <div
          aria-modal="true"
          role="alertdialog"
          aria-labelledby="delete-user-title"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
          onClick={() => setDeleteCandidate(null)}
        >
          <div
            className="w-full max-w-sm border-4 border-black bg-[#1e1c24] p-6 shadow-[8px_8px_0px_0px_#000]"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="delete-user-title" className="mb-2 text-lg font-extrabold text-white">
              Delete {deleteCandidate.heroName}?
            </h2>
            <p className="mb-5 text-sm text-gray-400">
              This permanently removes their account, quests, and notifications. This can&apos;t be undone.
            </p>
            <div className="flex gap-3">
              <button
                className="flex-1 border-4 border-black bg-[#f87171] py-3 font-black text-black shadow-[4px_4px_0px_0px_#000]"
                onClick={confirmDelete}
                type="button"
              >
                Delete
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
