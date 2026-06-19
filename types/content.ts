export type RoutePath = '/' | '/login' | '/signup' | '/otp-signup' | '/dashboard' | '/quests' | '/groups';

export interface DashboardNavItem {
  label: string;
  href: RoutePath | '#';
  icon: string;
  active?: boolean;
}
