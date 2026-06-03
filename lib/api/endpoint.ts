import { siteConfig } from '../../lib/site-config';

const baseUrl = siteConfig.apiBaseUrl.replace(/\/$/, '');

export const apiEndpoints = {
  login: `${baseUrl}/login`,
  registrationRequestOtp: `${baseUrl}/registration/request-otp`,
  registrationVerifyOtp: `${baseUrl}/registration/verify-otp`
} as const;