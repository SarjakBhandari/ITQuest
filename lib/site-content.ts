import type {
  ActionLinkConfig,
  DashboardMetric,
  DashboardNavItem,
  FieldConfig,
  OtpDigitConfig,
  SocialButtonConfig
} from '../types/content';

export const landingActions: ActionLinkConfig[] = [
  {
    href: '/signup',
    label: 'Begin Quest',
    tone: 'purple',
    icon: 'play'
  },
  {
    href: '/dashboard',
    label: 'Continue Quest',
    tone: 'green',
    icon: 'continue'
  },
  {
    href: '/login',
    label: 'Login with Google',
    tone: 'gray',
    icon: 'google',
    className: 'uppercase tracking-widest text-sm'
  }
];

export const loginFields: FieldConfig[] = [
  {
    id: 'email',
    label: 'Email Address',
    type: 'email',
    autoComplete: 'email',
    icon: 'mail'
  },
  {
    id: 'password',
    label: 'Password',
    type: 'password',
    autoComplete: 'current-password',
    icon: 'lock'
  }
];

export const signupFields: FieldConfig[] = [
  {
    id: 'heroName',
    label: 'Hero Name',
    type: 'text',
    placeholder: 'USER',
    autoComplete: 'nickname',
    icon: 'user'
  },
  {
    id: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'wizard@quest.com',
    autoComplete: 'email',
    icon: 'mail'
  },
  {
    id: 'password',
    label: 'Password',
    type: 'password',
    placeholder: '••••••••',
    autoComplete: 'new-password',
    icon: 'lock'
  }
];

export const authProviders: SocialButtonConfig[] = [
  {
    label: 'Login with Google',
    icon: 'google',
    tone: 'dark',
    href: '/login'
  }
];

export const otpDigits: OtpDigitConfig[] = [
  { id: 'otp-1', value: '1' },
  { id: 'otp-2', value: '1' },
  { id: 'otp-3', value: '1' },
  { id: 'otp-4', value: '1' },
  { id: 'otp-5', value: '1' },
  { id: 'otp-6', value: '1' }
];

export const dashboardNavItems: DashboardNavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: 'dashboard', active: true },
  { label: 'Quests', href: '#', icon: 'assignment' },
  { label: 'Groups', href: '#', icon: 'group' },
  { label: 'Stats', href: '#', icon: 'bar_chart' }
];

export const dashboardMetrics: DashboardMetric[] = [
  { title: 'Level 1', value: '50 / 5,000 XP', detail: 'Level 2', tone: 'primary' },
  { title: 'Streak', value: '1', detail: 'Freeze available', tone: 'secondary' },
  { title: 'System Overload', value: '0%', detail: 'You are new here', tone: 'error' },
  { title: 'Weekly XP Potential', value: '+340 XP', detail: 'Earn XP simply by logging in', tone: 'tertiary' }
];