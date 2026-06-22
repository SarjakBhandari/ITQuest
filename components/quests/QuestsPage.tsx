'use client';

import { useRouter } from 'next/navigation';

import { logout } from '../../lib/api/auth';
import { DashboardSidebar } from '../dashboard/DashboardSidebar';
import { DashboardTopBar } from '../dashboard/DashboardTopBar';

import { KanbanBoard } from './KanbanBoard';

export function QuestsPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      router.push('/login');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0f0f13] text-[#e5e7eb]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <DashboardSidebar onLogout={handleLogout} />
      <DashboardTopBar title="Quests" />
      <div className="flex flex-1 flex-col overflow-auto pt-20 lg:ml-[240px] lg:pt-24">
        <KanbanBoard />
      </div>
    </div>
  );
}
