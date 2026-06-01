import { apiClient } from './axios';
import type { AnalyticsData, ApiResponse } from '../types/api';

export async function getAnalytics(
  shortCode: string,
  page = 1,
  limit = 10,
): Promise<AnalyticsData> {
  const { data } = await apiClient.get<ApiResponse<AnalyticsData>>(
    `/api/analytics/${encodeURIComponent(shortCode)}`,
    { params: { page, limit } },
  );

  const result = data.data ?? { analytics: [], pagination: {
    total: 0,
    page,
    limit,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  }};

  return {
    ...result,
    totalClicks: result.pagination?.total ?? result.totalClicks ?? 0,
  };
}
