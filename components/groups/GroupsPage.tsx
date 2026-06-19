'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { logout } from '../../lib/api/auth';
import { getMyGroup } from '../../lib/api/groups';
import { DashboardSidebar } from '../dashboard/DashboardSidebar';
import { DashboardTopBar } from '../dashboard/DashboardTopBar';
import { Icon } from '../ui/Icon';
import { useToast } from '../ui/ToastProvider';

import { GroupEmptyState } from './GroupEmptyState';
import { GroupFormModal } from './GroupFormModal';
import { GroupLeaderboard } from './GroupLeaderboard';

import type { GroupSummary } from '../../types/group';

export function GroupsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [group, setGroup] = useState<GroupSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [formMode, setFormMode] = useState<'create' | 'join' | null>(null);

  useEffect(() => {
    let cancelled = false;

    getMyGroup()
      .then(({ group: fetched }) => {
        if (!cancelled) setGroup(fetched);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Unable to load your guild.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      router.push('/login');
    }
  };

  const handleFormSuccess = (next: GroupSummary, message?: string) => {
    setGroup(next);
    setFormMode(null);
    if (message) showToast(message, 'success');
  };

  return (
    <div className="flex min-h-screen bg-[#0f0f13] text-[#e5e7eb]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <DashboardSidebar onLogout={handleLogout} />
      <DashboardTopBar title="Groups" />

      <div className="ml-[240px] flex flex-1 flex-col overflow-auto pt-24">
        {error ? (
          <p className="border-b-2 border-[#f87171] bg-[#f87171]/10 px-6 py-2 text-sm text-[#fecaca]">{error}</p>
        ) : null}

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="flex items-center gap-2 text-sm text-gray-500">
              <Icon className="h-4 w-4 animate-spin" name="schedule" />
              Loading your guild...
            </p>
          </div>
        ) : group ? (
          <GroupLeaderboard group={group} onLeft={() => setGroup(null)} />
        ) : (
          <GroupEmptyState onCreate={() => setFormMode('create')} onJoin={() => setFormMode('join')} />
        )}
      </div>

      {formMode ? (
        <GroupFormModal initialMode={formMode} onClose={() => setFormMode(null)} onSuccess={handleFormSuccess} />
      ) : null}
    </div>
  );
}
