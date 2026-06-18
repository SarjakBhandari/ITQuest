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
  dashboardSummary: `${baseUrl}/dashboard/summary`
} as const;
