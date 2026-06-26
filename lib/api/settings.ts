import { apiEndpoints } from './endpoint';
import { apiRequest } from './http';
import type { SettingsResponse } from '../../types/settings';

export async function getMySettings(): Promise<SettingsResponse> {
  return apiRequest<SettingsResponse>(apiEndpoints.mySettings, { method: 'GET' });
}

export async function updateProfile(input: {
  heroName?: string;
  avatarColor?: string | null;
  theme?: string;
}): Promise<SettingsResponse> {
  return apiRequest<SettingsResponse>(apiEndpoints.updateProfile, {
    method: 'PATCH',
    body: JSON.stringify(input)
  });
}

export async function updatePreferences(input: {
  maxActiveQuests?: number;
  emailNudgesEnabled?: boolean;
  weeklyXpTarget?: number;
}): Promise<SettingsResponse> {
  return apiRequest<SettingsResponse>(apiEndpoints.updatePreferences, {
    method: 'PATCH',
    body: JSON.stringify(input)
  });
}

export async function changePassword(input: { currentPassword: string; newPassword: string }): Promise<{ ok: boolean; message: string }> {
  return apiRequest(apiEndpoints.changePassword, {
    method: 'PATCH',
    body: JSON.stringify(input)
  });
}
