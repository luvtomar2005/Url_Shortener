import { apiClient } from './axios';
import type { ApiResponse, CreateUrlPayload, ShortUrl } from '../types/api';

const RECENT_STORAGE_KEY = 'url_shortener_recent';

function normalizeShortUrlResponse(
  payload: ApiResponse<ShortUrl>,
  originalUrl: string,
): ShortUrl {
  const data = payload.data;

  if (data) {
    return {
      _id: data._id,
      originalUrl: data.originalUrl,
      shortCode: data.shortCode,
      shortUrl: data.shortUrl,
      clicks: data.clicks ?? 0,
      status: data.status ?? 'active',
      expiresAt: data.expiresAt ?? null,
      createdAt: data.createdAt ?? new Date().toISOString(),
    };
  }

  return {
    originalUrl,
    shortCode: '',
    shortUrl: '',
    clicks: 0,
    status: 'active',
    expiresAt: null,
    createdAt: new Date().toISOString(),
  };
}

export async function createShortUrl(payload: CreateUrlPayload): Promise<ShortUrl> {
  const body: Record<string, string> = {
    originalUrl: payload.originalUrl,
  };

  if (payload.customAlias?.trim()) {
    body.customAlias = payload.customAlias.trim();
  }

  if (payload.expiresAt) {
    body.expiresAt = payload.expiresAt;
  }

  const { data } = await apiClient.post<ApiResponse<ShortUrl>>('/api/url/shorten', body);
  const result = normalizeShortUrlResponse(data, payload.originalUrl);
  saveRecentUrl(result);
  return result;
}

export async function getRecentUrls(): Promise<ShortUrl[]> {
  try {
    const { data } = await apiClient.get<ApiResponse<ShortUrl[]>>('/api/url/recent');
    if (data.success && Array.isArray(data.data)) {
      return data.data;
    }
  } catch {
    // Fall back to locally stored URLs if the endpoint is unavailable.
  }

  return loadRecentUrls();
}

function loadRecentUrls(): ShortUrl[] {
  try {
    const raw = localStorage.getItem(RECENT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ShortUrl[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveRecentUrl(url: ShortUrl): void {
  const existing = loadRecentUrls().filter((item) => item.shortCode !== url.shortCode);
  const updated = [url, ...existing].slice(0, 20);
  localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(updated));
}

export function clearRecentUrls(): void {
  localStorage.removeItem(RECENT_STORAGE_KEY);
}
