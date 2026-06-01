export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface ShortUrl {
  _id?: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  clicks?: number;
  status?: string;
  expiresAt?: string | null;
  createdAt?: string;
}

export interface CreateUrlPayload {
  originalUrl: string;
  customAlias?: string;
  expiresAt?: string;
}

export interface AnalyticsEntry {
  _id: string;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  createdAt: string;
}

export interface AnalyticsPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface AnalyticsData {
  analytics: AnalyticsEntry[];
  pagination: AnalyticsPagination;
  totalClicks?: number;
}
