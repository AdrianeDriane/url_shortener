import type { ClickLog } from "../../../types/api.types";

export interface ReferrerStats {
  name: string;
  value: number;
  percentage: number;
}

const KNOWN_SOURCES: Record<string, string> = {
  "twitter.com": "Twitter",
  "x.com": "Twitter",
  "facebook.com": "Facebook",
  "linkedin.com": "LinkedIn",
  "instagram.com": "Instagram",
  "reddit.com": "Reddit",
  "t.co": "Twitter",
  "google.com": "Google",
  "bing.com": "Bing",
  "slack.com": "Slack",
  "localhost:3000": "This App",
};

const MOBILE_KEYWORDS = [
  "mobile",
  "android",
  "iphone",
  "ipad",
  "ipod",
  "blackberry",
  "windows phone",
];

export function formatNumber(num: number): string {
  return num.toLocaleString();
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Unknown date";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "Unknown date";
  }
}

export function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Unknown date";
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
    });
  } catch {
    return "Unknown date";
  }
}

export function parseReferrer(referrer: string | null): string {
  if (!referrer) return "Direct";
  try {
    const url = new URL(referrer);
    const hostname = url.hostname.replace("www.", "");
    return KNOWN_SOURCES[hostname] || hostname;
  } catch {
    return referrer || "Direct";
  }
}

export function parseDevice(userAgent: string | null): "desktop" | "mobile" {
  if (!userAgent) return "desktop";
  return MOBILE_KEYWORDS.some((keyword) =>
    userAgent.toLowerCase().includes(keyword),
  )
    ? "mobile"
    : "desktop";
}

export function calculateReferrerStats(clicks: ClickLog[]): ReferrerStats[] {
  const referrerCounts: Record<string, number> = {};

  clicks.forEach((click) => {
    const source = parseReferrer(click.referrer);
    referrerCounts[source] = (referrerCounts[source] || 0) + 1;
  });

  const total = clicks.length;
  return Object.entries(referrerCounts)
    .map(([name, value]) => ({
      name,
      value,
      percentage: total > 0 ? Math.round((value / total) * 100) : 0,
    }))
    .sort((a, b) => b.value - a.value);
}
