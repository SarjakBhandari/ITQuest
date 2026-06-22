import { apiEndpoints } from './endpoint';
import { apiRequest } from './http';
import type { StatsResponse } from '../../types/stats';

export async function getMyStats(): Promise<StatsResponse> {
  return apiRequest<StatsResponse>(apiEndpoints.myStats, { method: 'GET' });
}
