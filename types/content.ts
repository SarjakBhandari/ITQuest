export type RoutePath = '/' | '/login' | '/signup' | '/otp-signup' | '/dashboard' | '/quests';

export interface DashboardNavItem {
  label: string;
  href: RoutePath | '#';
  icon: string;
  active?: boolean;
}
