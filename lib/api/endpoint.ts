import { siteConfig } from '../site-config';

const baseUrl = siteConfig.apiBaseUrl.replace(/\/$/, '');

export const apiEndpoints = {
  login: `${baseUrl}/auth/login`,
  logout: `${baseUrl}/auth/logout`,
  me: `${baseUrl}/auth/me`,
  registrationRequestOtp: `${baseUrl}/auth/registration/request-otp`,
  registrationVerifyOtp: `${baseUrl}/auth/registration/verify-otp`,
  tasks: `${baseUrl}/tasks`,
  task: (id: string) => `${baseUrl}/tasks/${id}`,
  snoozeTask: (id: string) => `${baseUrl}/tasks/${id}/snooze`,
  dashboardSummary: (mode?: string) => `${baseUrl}/dashboard/summary${mode ? `?mode=${encodeURIComponent(mode)}` : ''}`,
  myGroup: `${baseUrl}/groups/me`,
  groups: `${baseUrl}/groups`,
  joinGroup: `${baseUrl}/groups/join`,
  leaveGroup: `${baseUrl}/groups/leave`
} as const;
