import { apiEndpoints } from './endpoint';
import { apiRequest } from './http';
import type { DashboardSummaryResponse } from '../../types/dashboard';

export async function getDashboardSummary(mode?: string): Promise<DashboardSummaryResponse> {
  return apiRequest<DashboardSummaryResponse>(apiEndpoints.dashboardSummary(mode), { method: 'GET' });
}
