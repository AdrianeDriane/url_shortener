import { useState } from "react";
import { motion } from "framer-motion";
import {
  Link as LinkIcon,
  ArrowRight,
  Loader,
  AlertCircle,
} from "lucide-react";
import { AdvancedSettings } from "./AdvancedSettings";
import urlService, { ShortenResponse } from "../services/url.service";

interface URLComposerProps {
  onShorten: (result: ShortenResponse) => void;
}

interface ValidationErrors {
  url?: string;
  slug?: string;
  expirationDate?: string;
}

const validateUrl = (url: string): string | undefined => {
  if (!url) {
    return "URL is required";
  }
  try {
    new URL(url);
    return undefined;
  } catch {
    return "Please enter a valid URL (e.g., https://example.com)";
  }
};

const validateSlug = (slug: string): string | undefined => {
  if (!slug) return undefined;
  if (slug.length < 3) {
    return "Slug must be at least 3 characters";
  }
  if (slug.length > 20) {
    return "Slug must be 20 characters or less";
  }
  if (!/^[a-zA-Z0-9-_]+$/.test(slug)) {
    return "Slug can only contain letters, numbers, hyphens, and underscores";
  }
  return undefined;
};

const validateExpirationDate = (dateStr: string): string | undefined => {
  if (!dateStr) return undefined;
  const selectedDate = new Date(dateStr);
  const now = new Date();
  if (selectedDate <= now) {
    return "Expiration date must be in the future";
  }
  return undefined;
};

export function URLComposer({ onShorten }: URLComposerProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Advanced settings state
  const [slug, setSlug] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [utmParams, setUtmParams] = useState<Record<string, string>>({
    Source: "",
    Medium: "",
    Campaign: "",
    Term: "",
    Content: "",
  });

  const handleUtmParamChange = (field: string, value: string) => {
    setUtmParams((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    const urlError = validateUrl(url);
    if (urlError) newErrors.url = urlError;

    const slugError = validateSlug(slug);
    if (slugError) newErrors.slug = slugError;

    const expirationError = validateExpirationDate(expirationDate);
    if (expirationError) newErrors.expirationDate = expirationError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Convert local datetime to ISO 8601 format with timezone offset
    let isoExpirationDate: string | undefined;
    if (expirationDate) {
      const date = new Date(expirationDate);
      // Get timezone offset and format as ISO string with offset
      // e.g., "2026-02-15T14:30:00-05:00"
      isoExpirationDate =
        date.toISOString().split("Z")[0] +
        new Date()
          .toLocaleTimeString("en-US", { timeZoneName: "short" })
          .slice(-5);
      // Simpler approach: just send ISO string, backend will handle comparison
      isoExpirationDate = new Date(expirationDate).toISOString();
    }

    // Filter out empty UTM params
    const filteredUtmParams = Object.entries(utmParams)
      .filter(([, value]) => value)
      .reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key.toLowerCase()]: value,
        }),
        {},
      );

    const result = await urlService.createShortenedUrl({
      original_url: url,
      slug: slug || undefined,
      expiration_date: isoExpirationDate || undefined,
      utm_params:
        Object.keys(filteredUtmParams).length > 0
          ? filteredUtmParams
          : undefined,
    });

    setIsLoading(false);

    if (result) {
      // Reset form
      setUrl("");
      setSlug("");
      setExpirationDate("");
      setUtmParams({
        Source: "",
        Medium: "",
        Campaign: "",
        Term: "",
        Content: "",
      });
      setErrors({});
      onShorten(result);
    }
  };

  return (
    <div className="w-full bg-white border border-zinc-200 rounded-2xl shadow-sm">
      <form onSubmit={handleSubmit} className="p-2">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 sm:pr-3 pr-0">
            <div className="relative group flex-1">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <LinkIcon
                  className={`h-5 w-5 transition-colors duration-200 ${
                    isHovered ? "text-indigo-600" : "text-zinc-400"
                  }`}
                />
              </div>
              <input
                type="url"
                placeholder="Paste your long URL here..."
                className="w-full pl-12 pr-4 sm:pr-6 py-4 sm:py-6 text-base sm:text-lg bg-transparent border-none focus:ring-0 text-zinc-900 placeholder-zinc-400 outline-none"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (errors.url) setErrors({ ...errors, url: undefined });
                }}
                onFocus={() => setIsHovered(true)}
                onBlur={() => setIsHovered(false)}
              />
            </div>
            <motion.button
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-500 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium text-sm transition-colors flex items-center justify-center sm:justify-start gap-2 shadow-lg shadow-zinc-200 sm:shrink-0"
            >
              {isLoading ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Shortening...
                </>
              ) : (
                <>
                  Shorten URL
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </div>
          {errors.url && (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-red-600">
              <AlertCircle size={16} />
              {errors.url}
            </div>
          )}
        </div>

        <AdvancedSettings
          isOpen={isAdvancedOpen}
          onToggle={() => setIsAdvancedOpen(!isAdvancedOpen)}
          slug={slug}
          onSlugChange={setSlug}
          expirationDate={expirationDate}
          onExpirationChange={setExpirationDate}
          utmParams={utmParams}
          onUtmParamChange={handleUtmParamChange}
          slugError={errors.slug}
          expirationError={errors.expirationDate}
        />
      </form>
    </div>
  );
}
