import { apiEndpoints } from './endpoint';
import { apiRequest } from './http';

import type { AdminGuildDetail, AdminGuildSummary, AdminOverview, AdminUser, Announcement } from '../../types/admin';

export async function getAdminOverview(): Promise<{ ok: boolean; overview: AdminOverview }> {
  return apiRequest(apiEndpoints.adminOverview, { method: 'GET' });
}

export async function listAdminUsers(search?: string): Promise<{ ok: boolean; users: AdminUser[] }> {
  return apiRequest(apiEndpoints.adminUsers(search), { method: 'GET' });
}

export async function updateAdminUser(
  id: string,
  input: { xp?: number; streak?: number; freezesAvailable?: number; maxActiveQuests?: number; isAdmin?: boolean }
): Promise<{ ok: boolean; message: string; user: AdminUser }> {
  return apiRequest(apiEndpoints.adminUser(id), { method: 'PATCH', body: JSON.stringify(input) });
}

export async function setAdminUserSuspension(
  id: string,
  input: { suspended: boolean; reason?: string }
): Promise<{ ok: boolean; message: string; user: AdminUser }> {
  return apiRequest(apiEndpoints.adminUserSuspension(id), { method: 'PATCH', body: JSON.stringify(input) });
}

export async function deleteAdminUser(id: string): Promise<{ ok: boolean; message: string }> {
  return apiRequest(apiEndpoints.adminUser(id), { method: 'DELETE' });
}

export async function listAdminGuilds(): Promise<{ ok: boolean; guilds: AdminGuildSummary[] }> {
  return apiRequest(apiEndpoints.adminGuilds, { method: 'GET' });
}

export async function getAdminGuild(id: string): Promise<{ ok: boolean; guild: AdminGuildDetail }> {
  return apiRequest(apiEndpoints.adminGuild(id), { method: 'GET' });
}

export async function renameAdminGuild(id: string, name: string): Promise<{ ok: boolean; message: string }> {
  return apiRequest(apiEndpoints.adminGuild(id), { method: 'PATCH', body: JSON.stringify({ name }) });
}

export async function deleteAdminGuild(id: string): Promise<{ ok: boolean; message: string }> {
  return apiRequest(apiEndpoints.adminGuild(id), { method: 'DELETE' });
}

export async function kickAdminGuildMember(guildId: string, memberId: string): Promise<{ ok: boolean; message: string }> {
  return apiRequest(apiEndpoints.adminGuildMember(guildId, memberId), { method: 'DELETE' });
}

export async function listAdminAnnouncements(): Promise<{ ok: boolean; announcements: Announcement[] }> {
  return apiRequest(apiEndpoints.adminAnnouncements, { method: 'GET' });
}

export async function createAdminAnnouncement(input: {
  title: string;
  body: string;
  audience: 'all' | 'user';
  targetEmail?: string;
}): Promise<{ ok: boolean; message: string; announcement: Announcement }> {
  return apiRequest(apiEndpoints.adminAnnouncements, { method: 'POST', body: JSON.stringify(input) });
}
