import { apiEndpoints } from './endpoint';
import { apiRequest } from './http';
import type { GroupResponse } from '../../types/group';

export async function getMyGroup(): Promise<GroupResponse> {
  return apiRequest<GroupResponse>(apiEndpoints.myGroup, { method: 'GET' });
}

export async function createGroup(name: string): Promise<GroupResponse> {
  return apiRequest<GroupResponse>(apiEndpoints.groups, {
    method: 'POST',
    body: JSON.stringify({ name })
  });
}

export async function joinGroup(code: string): Promise<GroupResponse> {
  return apiRequest<GroupResponse>(apiEndpoints.joinGroup, {
    method: 'POST',
    body: JSON.stringify({ code })
  });
}

export async function leaveGroup(): Promise<{ ok: boolean; message: string }> {
  return apiRequest(apiEndpoints.leaveGroup, { method: 'POST' });
}
