import type { DashboardNavItem } from '../types/content';

export const dashboardNavItems: DashboardNavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: 'dashboard', active: true },
  { label: 'Quests', href: '/quests', icon: 'assignment' },
  { label: 'Groups', href: '/groups', icon: 'group' },
  { label: 'Stats', href: '/stats', icon: 'bar_chart' }
];
