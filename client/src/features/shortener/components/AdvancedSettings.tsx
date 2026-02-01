import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Calendar,
  ChevronDown,
  Info,
  Settings2,
} from "lucide-react";
import { Tooltip } from "./Tooltip";
import { apiConfig } from "../../../config/api";
import { validateSlug, validateUtmField } from "../utils/validation";

interface AdvancedSettingsProps {
  isOpen: boolean;
  onToggle: () => void;
  slug: string;
  onSlugChange: (value: string) => void;
  expirationDate: string;
  onExpirationChange: (value: string) => void;
  utmParams: Record<string, string>;
  onUtmParamChange: (field: string, value: string) => void;
  slugError?: string;
  expirationError?: string;
}

const UTM_FIELDS = [
  {
    field: "Source",
    description: "Where the traffic comes from (e.g., google, facebook)",
  },
  {
    field: "Medium",
    description: "The marketing medium (e.g., email, social, cpc)",
  },
  {
    field: "Campaign",
    description: "The campaign name or identifier",
  },
  {
    field: "Term",
    description: "The search keywords if applicable",
  },
  {
    field: "Content",
    description: "Used to differentiate similar content or links",
  },
];

export function AdvancedSettings({
  isOpen,
  onToggle,
  slug,
  onSlugChange,
  expirationDate,
  onExpirationChange,
  utmParams,
  onUtmParamChange,
  slugError,
  expirationError,
}: AdvancedSettingsProps) {
  const [utmErrors, setUtmErrors] = useState<Record<string, string>>({});

  const displaySlugError = slugError || validateSlug(slug);

  const handleUtmChange = (field: string, value: string) => {
    onUtmParamChange(field, value);
    const error = validateUtmField(value);
    setUtmErrors((prev) => ({ ...prev, [field]: error || "" }));
  };
  return (
    <div className="border-t border-zinc-100 mx-2">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 py-4 px-2 transition-colors w-full"
      >
        <Settings2 size={16} />
        <span>Advanced Settings</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-visible"
          >
            <div className="px-2 pb-6 pt-2 space-y-6">
              <p className="text-xs text-zinc-400 italic">
                All fields below are optional — leave blank if not needed
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      Custom Slug{" "}
                      <span className="font-normal text-zinc-400">
                        (Optional)
                      </span>
                    </label>
                    <div className="group relative">
                      <Info
                        size={14}
                        className="text-zinc-400 cursor-help hover:text-zinc-600"
                      />
                      <Tooltip text="Create a memorable custom URL slug instead of a random code" />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="bg-zinc-50 border border-r-0 border-zinc-200 text-zinc-500 px-3 py-2.5 rounded-l-lg text-sm font-mono">
                      {apiConfig.baseURL.replace(/^https?:\/\//, "")}/
                    </span>
                    <input
                      type="text"
                      placeholder="custom-slug"
                      maxLength={8}
                      value={slug}
                      onChange={(e) => onSlugChange(e.target.value)}
                      className="flex-1 bg-white border border-zinc-200 text-zinc-900 px-3 py-2.5 rounded-r-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>
                  {displaySlugError && (
                    <div className="flex items-center gap-2 text-xs text-red-600 mt-2">
                      <AlertCircle size={14} />
                      {displaySlugError}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      Expiration{" "}
                      <span className="font-normal text-zinc-400">
                        (Optional)
                      </span>
                    </label>
                    <div className="group relative">
                      <Info
                        size={14}
                        className="text-zinc-400 cursor-help hover:text-zinc-600"
                      />
                      <Tooltip text="Set when this shortened URL will expire and become inactive" />
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-400">
                      <Calendar size={16} />
                    </div>
                    <input
                      type="datetime-local"
                      value={expirationDate}
                      onChange={(e) => onExpirationChange(e.target.value)}
                      className="w-full bg-white border border-zinc-200 text-zinc-900 pl-10 pr-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>
                  {expirationError && (
                    <div className="flex items-center gap-2 text-xs text-red-600 mt-2">
                      <AlertCircle size={14} />
                      {expirationError}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    UTM Builder{" "}
                    <span className="font-normal text-zinc-400">
                      (Optional)
                    </span>
                  </label>
                  <div className="group relative">
                    <Info
                      size={14}
                      className="text-zinc-400 cursor-help hover:text-zinc-600"
                    />
                    <Tooltip text="UTM parameters track campaign source, medium, and content in analytics (input fields override URL parameters)" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {UTM_FIELDS.map(({ field, description }) => (
                    <div key={field} className="space-y-1">
                      <div className="flex items-center gap-1">
                        <label className="text-[10px] text-zinc-400 font-medium ml-1">
                          {field}
                        </label>
                        <div className="group relative">
                          <Info
                            size={12}
                            className="text-zinc-300 cursor-help hover:text-zinc-500"
                          />
                          <Tooltip text={description} />
                        </div>
                      </div>
                      <input
                        type="text"
                        placeholder={`utm_${field.toLowerCase()}`}
                        maxLength={100}
                        value={utmParams[field] || ""}
                        onChange={(e) => handleUtmChange(field, e.target.value)}
                        className={`w-full bg-zinc-50/50 border text-zinc-900 px-3 py-2 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                          utmErrors[field]
                            ? "border-red-300 focus:border-red-500"
                            : "border-zinc-200 focus:border-indigo-500"
                        }`}
                      />
                      {utmErrors[field] && (
                        <div className="flex items-center gap-1 text-xs text-red-600 mt-1">
                          <AlertCircle size={12} />
                          {utmErrors[field]}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
