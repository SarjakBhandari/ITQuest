export type RoutePath = '/' | '/login' | '/signup' | '/otp-signup' | '/dashboard';

export type ButtonTone = 'purple' | 'green' | 'gray' | 'gold' | 'primary' | 'secondary' | 'danger' | 'dark';

export type ButtonIcon = 'play' | 'continue' | 'google' | 'login' | 'sword' | 'shield';

export type FieldIcon = 'mail' | 'lock' | 'user';

export interface ActionLinkConfig {
  href: RoutePath;
  label: string;
  tone: ButtonTone;
  icon: ButtonIcon;
  className?: string;
}

export interface FieldConfig {
  id: string;
  label: string;
  type: 'text' | 'email' | 'password';
  placeholder?: string;
  autoComplete?: string;
  icon?: FieldIcon;
}

export interface SocialButtonConfig {
  label: string;
  icon: ButtonIcon;
  tone: ButtonTone;
  href?: RoutePath;
  uppercase?: boolean;
}

export interface DashboardNavItem {
  label: string;
  href: RoutePath | '#';
  icon: string;
  active?: boolean;
}

export interface DashboardMetric {
  title: string;
  value: string;
  detail: string;
  tone: 'primary' | 'secondary' | 'tertiary' | 'error';
}

export interface OtpDigitConfig {
  id: string;
  value: string;
}