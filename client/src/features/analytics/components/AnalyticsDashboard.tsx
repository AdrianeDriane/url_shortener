import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  MousePointerClick,
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
  Link2,
  PieChart as PieChartIcon,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import urlService, {
  AnalyticsResponse,
  ClickLog,
} from "../../shortener/services/url.service";
import apiConfig from "../../../config/api";

// Color palette for pie chart
const COLORS = [
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#f43f5e", // rose
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#14b8a6", // teal
  "#06b6d4", // cyan
  "#3b82f6", // blue
];

function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm ${className}`}
    >
      <div className="space-y-3">
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
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function formatDate(dateString: string): string {
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

function formatDateTime(dateString: string): string {
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

interface ReferrerStats {
  name: string;
  value: number;
  percentage: number;
}

function calculateReferrerStats(clicks: ClickLog[]): ReferrerStats[] {
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

// Drawer Component for Referrer Details
interface ReferrerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  stats: ReferrerStats[];
  totalClicks: number;
}

function ReferrerDrawer({
  isOpen,
  onClose,
  stats,
  totalClicks,
}: ReferrerDrawerProps) {
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
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900">
                  Traffic Sources
                </h2>
                <p className="text-sm text-zinc-500">
                  {totalClicks} total click{totalClicks !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-zinc-500" />
              </button>
            </div>

            {/* Chart */}
            <div className="p-6 border-b border-zinc-100">
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {stats.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value} clicks`, "Clicks"]}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #e4e4e7",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-auto p-6">
              <div className="space-y-3">
                {stats.map((stat, index) => (
                  <div
                    key={stat.name}
                    className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl"
                  >
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-zinc-900 truncate">
                        {stat.name}
                      </p>
                      <p className="text-sm text-zinc-500">
                        {stat.value} click{stat.value !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <span className="text-lg font-semibold text-zinc-900">
                      {stat.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Activity Modal
interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  clicks: ClickLog[];
  limit: number;
  onLimitChange: (limit: number) => void;
}

function ActivityModal({
  isOpen,
  onClose,
  clicks,
  limit,
  onLimitChange,
}: ActivityModalProps) {
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl max-h-[80vh] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900">
                  Recent Activity
                </h2>
                <p className="text-sm text-zinc-500">
                  Showing {clicks.length} click{clicks.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={limit}
                  onChange={(e) => onLimitChange(Number(e.target.value))}
                  className="px-3 py-1.5 text-sm bg-zinc-100 border-0 rounded-lg focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value={10}>Last 10</option>
                  <option value={50}>Last 50</option>
                  <option value={100}>Last 100</option>
                </select>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
                >
                  <X size={20} className="text-zinc-500" />
                </button>
              </div>
            </div>

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
                <div className="divide-y divide-zinc-100">
                  {clicks.map((click) => (
                    <div
                      key={click.id}
                      className="px-6 py-4 flex items-center gap-4 hover:bg-zinc-50/50"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Globe size={14} className="text-zinc-400" />
                          <span className="font-medium text-zinc-900">
                            {parseReferrer(click.referrer)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-zinc-500">
                          <span className="flex items-center gap-1">
                            {parseDevice(click.user_agent) === "mobile" ? (
                              <Smartphone size={12} />
                            ) : (
                              <Monitor size={12} />
                            )}
                            {parseDevice(click.user_agent) === "mobile"
                              ? "Mobile"
                              : "Desktop"}
                          </span>
                          <span>•</span>
                          <span>{formatRelativeTime(click.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
  const [showReferrerDrawer, setShowReferrerDrawer] = useState(false);
  const [activityLimit, setActivityLimit] = useState(10);

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

  // Filter clicks for the modal based on selected limit
  const modalClicks = analytics?.clicks?.slice(0, activityLimit) ?? [];

  const handleCopy = () => {
    if (!analytics?.url) return;
    const shortUrl = `${apiConfig.baseURL}/${analytics.url.slug}`;
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SkeletonCard className="md:col-span-2" />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard className="md:col-span-2" />
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
  const referrerStats = calculateReferrerStats(clicks);
  const topReferrer = referrerStats[0];

  return (
    <>
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {/* Click Count - Large Card */}
        <ScrollReveal className="col-span-2 row-span-2">
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 shadow-sm h-full flex flex-col justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <MousePointerClick size={24} className="text-indigo-600" />
              </div>
            </div>
            <div className="mt-auto">
              <p className="text-zinc-600 mb-2">Your link has been clicked</p>
              <p className="text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight">
                {formatNumber(url.click_count)}
              </p>
              <p className="text-lg md:text-xl font-medium text-zinc-400">
                {url.click_count === 1 ? "time" : "times"}
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Link Status - Tall Card */}
        <ScrollReveal className="col-span-1 row-span-2">
          <div
            className={`rounded-2xl p-5 md:p-6 shadow-sm h-full flex flex-col ${
              isExpired
                ? "bg-amber-50 border border-amber-200"
                : "bg-green-50 border border-green-200"
            }`}
          >
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
            <div className="mt-auto">
              <p className="text-zinc-600 text-sm mb-1">
                Your link is currently
              </p>
              <div className="flex items-center gap-2">
                <p
                  className={`text-2xl md:text-3xl font-bold ${
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
                <p className="text-xs text-zinc-500 mt-2">
                  {isExpired ? "Expired on" : "Expires on"}{" "}
                  {formatDateTime(url.expiration_date)}
                </p>
              )}
            </div>
          </div>
        </ScrollReveal>

        {/* Created Date - Small Card */}
        <ScrollReveal className="col-span-1">
          <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm h-full">
            <p className="text-xs text-zinc-400 uppercase tracking-wide mb-1">
              Created
            </p>
            <p className="text-base md:text-lg font-semibold text-zinc-900">
              {formatDate(url.createdAt)}
            </p>
          </div>
        </ScrollReveal>

        {/* Recent Activity CTA - Small Card */}
        <ScrollReveal className="col-span-1">
          <button
            onClick={() => setShowActivityModal(true)}
            className="w-full bg-zinc-900 hover:bg-zinc-800 rounded-2xl p-5 shadow-sm h-full text-left transition-colors group"
          >
            <p className="text-xs text-zinc-400 uppercase tracking-wide mb-1">
              Activity
            </p>
            <div className="flex items-center gap-1">
              <p className="text-base md:text-lg font-semibold text-white">
                View Logs
              </p>
              <ChevronRight
                size={16}
                className="text-zinc-400 group-hover:translate-x-0.5 transition-transform"
              />
            </div>
          </button>
        </ScrollReveal>

        {/* Traffic Sources - Wide Card */}
        {clicks.length > 0 && topReferrer && (
          <ScrollReveal className="col-span-2 md:col-span-4">
            <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                    <PieChartIcon size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-lg md:text-xl font-semibold text-white">
                      {topReferrer.percentage}% of your clicks are from{" "}
                      <span className="text-indigo-200">
                        {topReferrer.name}
                      </span>
                    </p>
                    <p className="text-sm text-indigo-200 mt-0.5">
                      See where your traffic is coming from
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowReferrerDrawer(true)}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-indigo-50 rounded-xl text-sm font-medium text-indigo-600 transition-colors shadow-sm"
                >
                  More Details
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Expired Access Count */}
        {url.expired_access_count > 0 && (
          <ScrollReveal className="col-span-2 md:col-span-4">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle size={20} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-zinc-600 mb-1">
                    While inactive, visitors tried to access your link
                  </p>
                  <p className="text-2xl font-bold text-amber-600">
                    {formatNumber(url.expired_access_count)}{" "}
                    <span className="text-lg font-semibold text-amber-500">
                      {url.expired_access_count === 1 ? "time" : "times"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* UTM Parameters */}
        {hasUtmParams && (
          <ScrollReveal className={`col-span-2 md:col-span-4`}>
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Tag size={20} className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-zinc-900 font-medium">
                    Your UTM parameters
                  </p>
                  <p className="text-xs text-zinc-500">
                    Tracking data attached to this link
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {Object.entries(url.utm_params || {}).map(
                  ([key, value]) =>
                    value && (
                      <div
                        key={key}
                        className="p-3 bg-zinc-50 rounded-xl border border-zinc-100"
                      >
                        <span className="text-[10px] font-medium text-zinc-400 uppercase block">
                          {key}
                        </span>
                        <span className="text-sm font-mono text-zinc-900 truncate block">
                          {value}
                        </span>
                      </div>
                    ),
                )}
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Destination URL - Full Width */}
        <ScrollReveal className="col-span-2 md:col-span-4">
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Link2 size={20} className="text-zinc-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-zinc-600 mb-1">Your link redirects to</p>
                <a
                  href={url.original_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-2"
                >
                  <span className="text-base font-medium text-zinc-900 break-all group-hover:text-indigo-600 transition-colors">
                    {url.original_url}
                  </span>
                  <ExternalLink
                    size={14}
                    className="text-zinc-400 group-hover:text-indigo-600 transition-colors flex-shrink-0 mt-1"
                  />
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Quick Actions - Full Width */}
        <ScrollReveal className="col-span-2 md:col-span-4">
          <div className="bg-zinc-900 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-zinc-400 uppercase tracking-wide mb-1">
                  Your Short URL
                </p>
                <p className="font-mono text-lg text-white truncate">
                  {shortUrl.replace(/^https?:\/\//, "")}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    copied
                      ? "bg-green-500 text-white"
                      : "bg-white text-zinc-900 hover:bg-zinc-100"
                  }`}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener"
                  className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium text-white transition-colors"
                >
                  <ExternalLink size={16} />
                  <span className="hidden sm:inline">Open</span>
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Modals */}
      <ActivityModal
        isOpen={showActivityModal}
        onClose={() => setShowActivityModal(false)}
        clicks={modalClicks}
        limit={activityLimit}
        onLimitChange={setActivityLimit}
      />

      <ReferrerDrawer
        isOpen={showReferrerDrawer}
        onClose={() => setShowReferrerDrawer(false)}
        stats={referrerStats}
        totalClicks={clicks.length}
      />
    </>
  );
}
