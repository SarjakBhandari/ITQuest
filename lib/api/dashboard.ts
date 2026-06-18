import { apiEndpoints } from './endpoint';
import { apiRequest } from './http';
import type { DashboardSummaryResponse } from '../../types/dashboard';

export async function getDashboardSummary(): Promise<DashboardSummaryResponse> {
  return apiRequest<DashboardSummaryResponse>(apiEndpoints.dashboardSummary, { method: 'GET' });
}
