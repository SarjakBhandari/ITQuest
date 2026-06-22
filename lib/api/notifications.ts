import { apiEndpoints } from './endpoint';
import { apiRequest } from './http';
import type { NotificationListResponse } from '../../types/notification';

export async function listNotifications(): Promise<NotificationListResponse> {
  return apiRequest<NotificationListResponse>(apiEndpoints.notifications, { method: 'GET' });
}

export async function markNotificationRead(id: string): Promise<{ ok: boolean; message: string }> {
  return apiRequest(apiEndpoints.markNotificationRead(id), { method: 'PATCH' });
}

export async function markAllNotificationsRead(): Promise<{ ok: boolean; message: string }> {
  return apiRequest(apiEndpoints.markAllNotificationsRead, { method: 'POST' });
}
