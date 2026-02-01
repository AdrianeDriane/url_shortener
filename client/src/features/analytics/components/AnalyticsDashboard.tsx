import { useState, useEffect } from "react";
import { useParams } from "react-router";
import {
  MousePointerClick,
  Tag,
  Activity,
  AlertTriangle,
  ExternalLink,
  Copy,
  Check,
  ChevronRight,
  Link2,
  PieChart as PieChartIcon,
} from "lucide-react";
import urlService from "../../../services/url.service";
import type { AnalyticsResponse } from "../../../types/api.types";
import apiConfig from "../../../config/api";
import {
  formatNumber,
  formatDate,
  formatDateTime,
  calculateReferrerStats,
} from "../utils/analytics.utils";
import { ScrollReveal } from "./ScrollReveal";
import { SkeletonCard } from "./SkeletonCard";
import { ActivityModal } from "./ActivityModal";
import { ReferrerDrawer } from "./ReferrerDrawer";

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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <ClickCountCard clickCount={url.click_count} />
        <LinkStatusCard
          isExpired={isExpired}
          expirationDate={url.expiration_date}
        />
        <CreatedDateCard createdAt={url.createdAt} />
        <ActivityCTACard onOpenModal={() => setShowActivityModal(true)} />

        {clicks.length > 0 && topReferrer && (
          <TrafficSourcesCard
            topReferrer={topReferrer}
            onOpenDrawer={() => setShowReferrerDrawer(true)}
          />
        )}

        {url.expired_access_count > 0 && (
          <ExpiredAccessCard count={url.expired_access_count} />
        )}

        {hasUtmParams && <UtmParamsCard utmParams={url.utm_params!} />}

        <DestinationUrlCard originalUrl={url.original_url} />
        <QuickActionsCard
          shortUrl={shortUrl}
          copied={copied}
          onCopy={handleCopy}
        />
      </div>

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

// ============================================================================
// Sub-Components (co-located as they are tightly coupled to the dashboard)
// ============================================================================

function ClickCountCard({ clickCount }: { clickCount: number }) {
  return (
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
            {formatNumber(clickCount)}
          </p>
          <p className="text-lg md:text-xl font-medium text-zinc-400">
            {clickCount === 1 ? "time" : "times"}
          </p>
        </div>
      </div>
    </ScrollReveal>
  );
}

function LinkStatusCard({
  isExpired,
  expirationDate,
}: {
  isExpired: boolean;
  expirationDate: string | null;
}) {
  return (
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
          <p className="text-zinc-600 text-sm mb-1">Your link is currently</p>
          <div className="flex items-center gap-2">
            <p
              className={`text-2xl md:text-3xl font-bold ${
                isExpired ? "text-amber-600" : "text-green-600"
              }`}
            >
              {isExpired ? "Expired" : "Active"}
            </p>
            {!isExpired && <ActivePulse />}
          </div>
          {expirationDate && (
            <p className="text-xs text-zinc-500 mt-2">
              {isExpired ? "Expired on" : "Expires on"}{" "}
              {formatDateTime(expirationDate)}
            </p>
          )}
        </div>
      </div>
    </ScrollReveal>
  );
}

function ActivePulse() {
  return (
    <span className="flex h-2.5 w-2.5 relative">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
    </span>
  );
}

function CreatedDateCard({ createdAt }: { createdAt: string }) {
  return (
    <ScrollReveal className="col-span-1">
      <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm h-full">
        <p className="text-xs text-zinc-400 uppercase tracking-wide mb-1">
          Created
        </p>
        <p className="text-base md:text-lg font-semibold text-zinc-900">
          {formatDate(createdAt)}
        </p>
      </div>
    </ScrollReveal>
  );
}

function ActivityCTACard({ onOpenModal }: { onOpenModal: () => void }) {
  return (
    <ScrollReveal className="col-span-1">
      <button
        onClick={onOpenModal}
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
  );
}

interface TrafficSourcesCardProps {
  topReferrer: { name: string; percentage: number };
  onOpenDrawer: () => void;
}

function TrafficSourcesCard({
  topReferrer,
  onOpenDrawer,
}: TrafficSourcesCardProps) {
  return (
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
                <span className="text-indigo-200">{topReferrer.name}</span>
              </p>
              <p className="text-sm text-indigo-200 mt-0.5">
                See where your traffic is coming from
              </p>
            </div>
          </div>
          <button
            onClick={onOpenDrawer}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-indigo-50 rounded-xl text-sm font-medium text-indigo-600 transition-colors shadow-sm"
          >
            More Details
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </ScrollReveal>
  );
}

function ExpiredAccessCard({ count }: { count: number }) {
  return (
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
              {formatNumber(count)}{" "}
              <span className="text-lg font-semibold text-amber-500">
                {count === 1 ? "time" : "times"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

function UtmParamsCard({ utmParams }: { utmParams: Record<string, string> }) {
  return (
    <ScrollReveal className="col-span-2 md:col-span-4">
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm h-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Tag size={20} className="text-indigo-600" />
          </div>
          <div>
            <p className="text-zinc-900 font-medium">Your UTM parameters</p>
            <p className="text-xs text-zinc-500">
              Tracking data attached to this link
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.entries(utmParams).map(
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
  );
}

function DestinationUrlCard({ originalUrl }: { originalUrl: string }) {
  return (
    <ScrollReveal className="col-span-2 md:col-span-4">
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Link2 size={20} className="text-zinc-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-zinc-600 mb-1">Your link redirects to</p>
            <a
              href={originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-2"
            >
              <span className="text-base font-medium text-zinc-900 break-all group-hover:text-indigo-600 transition-colors">
                {originalUrl}
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
  );
}

interface QuickActionsCardProps {
  shortUrl: string;
  copied: boolean;
  onCopy: () => void;
}

function QuickActionsCard({ shortUrl, copied, onCopy }: QuickActionsCardProps) {
  return (
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
              onClick={onCopy}
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
  );
}
