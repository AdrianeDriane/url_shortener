import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  MousePointerClick,
  Clock,
  Tag,
  Activity,
  AlertTriangle,
  ExternalLink,
  Copy,
  Check,
  ChevronRight,
  X,
  Globe,
  Monitor,
  Smartphone,
} from "lucide-react";
import urlService, {
  AnalyticsResponse,
  ClickLog,
} from "../../shortener/services/url.service";
import apiConfig from "../../../config/api";

function SkeletonCard() {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm">
      <div className="space-y-4">
        <div className="h-4 bg-zinc-200 rounded w-1/3 animate-pulse"></div>
        <div className="h-8 bg-zinc-200 rounded w-2/3 animate-pulse"></div>
      </div>
    </div>
  );
}

function formatNumber(num: number): string {
  return num.toLocaleString();
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString();
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Unknown date";
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "Unknown date";
  }
}

function parseReferrer(referrer: string | null): string {
  if (!referrer) return "Direct";
  try {
    const url = new URL(referrer);
    const hostname = url.hostname.replace("www.", "");
    const knownSources: Record<string, string> = {
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
    return knownSources[hostname] || hostname;
  } catch {
    return referrer || "Direct";
  }
}

function parseDevice(userAgent: string | null): "desktop" | "mobile" {
  if (!userAgent) return "desktop";
  const mobileKeywords = [
    "mobile",
    "android",
    "iphone",
    "ipad",
    "ipod",
    "blackberry",
    "windows phone",
  ];
  return mobileKeywords.some((keyword) =>
    userAgent.toLowerCase().includes(keyword),
  )
    ? "mobile"
    : "desktop";
}

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
}

function ScrollReveal({ children, className = "" }: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  clicks: ClickLog[];
}

function ActivityModal({ isOpen, onClose, clicks }: ActivityModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl max-h-[80vh] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900">
                  Recent Activity
                </h2>
                <p className="text-sm text-zinc-500">
                  {clicks.length} click{clicks.length !== 1 ? "s" : ""} recorded
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-zinc-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
              {clicks.length === 0 ? (
                <div className="p-12 text-center">
                  <MousePointerClick
                    size={40}
                    className="mx-auto text-zinc-300 mb-3"
                  />
                  <p className="text-zinc-500">No clicks recorded yet</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-zinc-50 sticky top-0">
                    <tr>
                      <th className="text-left px-6 py-3 font-medium text-zinc-500 text-xs uppercase">
                        Time
                      </th>
                      <th className="text-left px-6 py-3 font-medium text-zinc-500 text-xs uppercase">
                        Source
                      </th>
                      <th className="text-left px-6 py-3 font-medium text-zinc-500 text-xs uppercase">
                        Device
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {clicks.map((click) => (
                      <tr key={click.id} className="hover:bg-zinc-50/50">
                        <td className="px-6 py-4 text-zinc-600">
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-zinc-400" />
                            {formatRelativeTime(click.created_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-zinc-900">
                          <div className="flex items-center gap-2">
                            <Globe size={14} className="text-zinc-400" />
                            {parseReferrer(click.referrer)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-zinc-600">
                          <div className="flex items-center gap-2">
                            {parseDevice(click.user_agent) === "mobile" ? (
                              <Smartphone size={14} className="text-zinc-400" />
                            ) : (
                              <Monitor size={14} className="text-zinc-400" />
                            )}
                            {parseDevice(click.user_agent) === "mobile"
                              ? "Mobile"
                              : "Desktop"}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function AnalyticsDashboard() {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);

  useEffect(() => {
    async function fetchAnalytics() {
      if (!shortCode) return;
      setIsLoading(true);
      const data = await urlService.getAnalytics(shortCode);
      setAnalytics(data);
      setIsLoading(false);
    }
    fetchAnalytics();
  }, [shortCode]);

  const handleCopy = () => {
    if (!analytics?.url) return;
    const shortUrl = `${apiConfig.baseURL}/${analytics.url.slug}`;
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (!analytics?.url) {
    return (
      <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm text-center">
        <AlertTriangle size={40} className="mx-auto text-amber-500 mb-3" />
        <h3 className="text-lg font-semibold text-zinc-900 mb-1">
          Link Not Found
        </h3>
        <p className="text-zinc-500 text-sm">
          We couldn't find any data for this link.
        </p>
      </div>
    );
  }

  const { url, clicks, isExpired } = analytics;
  const hasUtmParams =
    url.utm_params && Object.values(url.utm_params).some((v) => v);
  const shortUrl = `${apiConfig.baseURL}/${url.slug}`;

  return (
    <>
      <div className="space-y-6">
        {/* Click Count */}
        <ScrollReveal>
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MousePointerClick size={20} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-zinc-600 mb-1">
                  While active, your link has been clicked
                </p>
                <p className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight">
                  {formatNumber(url.click_count)}{" "}
                  <span className="text-xl sm:text-2xl font-semibold text-zinc-400">
                    {url.click_count === 1 ? "time" : "times"}
                  </span>
                </p>
                <p className="text-sm text-zinc-500 mt-2">
                  Created on {formatDate(url.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Link Status */}
        <ScrollReveal>
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-4">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isExpired ? "bg-amber-100" : "bg-green-100"
                }`}
              >
                <Activity
                  size={20}
                  className={isExpired ? "text-amber-600" : "text-green-600"}
                />
              </div>
              <div>
                <p className="text-zinc-600 mb-1">
                  Your link status is currently
                </p>
                <div className="flex items-center gap-2">
                  <p
                    className={`text-2xl font-bold ${
                      isExpired ? "text-amber-600" : "text-green-600"
                    }`}
                  >
                    {isExpired ? "Expired" : "Active"}
                  </p>
                  {!isExpired && (
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                    </span>
                  )}
                </div>
                {url.expiration_date && (
                  <p className="text-sm text-zinc-500 mt-2 flex items-center gap-1.5">
                    <Clock size={14} />
                    {isExpired ? "Expired" : "Expires"} on{" "}
                    {formatDate(url.expiration_date)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Expired Access Count */}
        {url.expired_access_count > 0 && (
          <ScrollReveal>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle size={20} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-zinc-600 mb-1">
                    While inactive, your link has been clicked
                  </p>
                  <p className="text-2xl font-bold text-amber-600">
                    {formatNumber(url.expired_access_count)}{" "}
                    <span className="text-lg font-semibold text-amber-500">
                      {url.expired_access_count === 1 ? "time" : "times"}
                    </span>
                  </p>
                  <p className="text-sm text-zinc-500 mt-2">
                    These visitors were shown an expiration notice
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* UTM Parameters */}
        {hasUtmParams && (
          <ScrollReveal>
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Tag size={20} className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-zinc-900 font-medium">
                    Here are your active UTM parameters for this link
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ml-14">
                {Object.entries(url.utm_params || {}).map(
                  ([key, value]) =>
                    value && (
                      <div
                        key={key}
                        className="p-3 bg-zinc-50 rounded-lg border border-zinc-100"
                      >
                        <span className="text-xs font-medium text-zinc-500 uppercase block mb-0.5">
                          {key}
                        </span>
                        <span className="text-sm font-mono text-zinc-900">
                          {value}
                        </span>
                      </div>
                    ),
                )}
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Recent Activity CTA */}
        <ScrollReveal>
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-zinc-900 font-medium">
                  Want to see who's clicking?
                </p>
                <p className="text-sm text-zinc-500">
                  View detailed activity logs for this link
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowActivityModal(true)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 rounded-lg text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
              >
                Check Recent Activity
                <ChevronRight size={16} />
              </motion.button>
            </div>
          </div>
        </ScrollReveal>

        {/* Quick Actions */}
        <ScrollReveal>
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <p className="text-zinc-900 font-medium mb-4">Quick Actions</p>
            <div className="space-y-3">
              {/* Short URL Display */}
              <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                <span className="flex-1 font-mono text-sm text-indigo-600 truncate">
                  {shortUrl.replace(/^https?:\/\//, "")}
                </span>
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    copied
                      ? "bg-green-100 text-green-700"
                      : "bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                  }`}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>

              {/* Open Link */}
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener"
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-zinc-100 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-200 transition-colors"
              >
                <ExternalLink size={16} />
                Open Link
              </a>
            </div>

            {/* Original URL */}
            <div className="mt-4 pt-4 border-t border-zinc-100">
              <p className="text-xs text-zinc-500 mb-1">Redirects to</p>
              <a
                href={url.original_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-zinc-600 hover:text-indigo-600 transition-colors break-all"
              >
                {url.original_url}
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Activity Modal */}
      <ActivityModal
        isOpen={showActivityModal}
        onClose={() => setShowActivityModal(false)}
        clicks={clicks}
      />
    </>
  );
}
