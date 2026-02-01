/**
 * Shared API types for the URL Shortener application
 * Used by both shortener and analytics features
 */

export interface ShortenRequestPayload {
  original_url: string;
  slug?: string;
  expiration_date?: string;
  utm_params?: Record<string, string>;
}

export interface ShortenResponse {
  id: string;
  original_url: string;
  short_url: string;
  slug: string;
  expiration_date?: string;
  utm_params?: Record<string, string>;
  createdAt: string;
}

export interface ClickLog {
  id: string;
  referrer: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface UrlDetails {
  id: string;
  original_url: string;
  slug: string;
  expiration_date: string | null;
  utm_params: Record<string, string> | null;
  click_count: number;
  expired_access_count: number;
  createdAt: string;
}

export interface AnalyticsResponse {
  url: UrlDetails | null;
  clicks: ClickLog[];
  isExpired: boolean;
}
