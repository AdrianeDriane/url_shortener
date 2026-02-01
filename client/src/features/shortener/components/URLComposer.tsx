import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings2,
  Calendar,
  Link as LinkIcon,
  ChevronDown,
  ArrowRight,
  Info,
} from "lucide-react";

interface TooltipProps {
  text: string;
}

function Tooltip({ text }: TooltipProps) {
  return (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-zinc-900 text-white text-xs rounded-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900"></div>
    </div>
  );
}

interface URLComposerProps {
  onShorten: () => void;
}

export function URLComposer({ onShorten }: URLComposerProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) onShorten();
  };

  return (
    <div className="w-full bg-white border border-zinc-200 rounded-2xl shadow-sm">
      <form onSubmit={handleSubmit} className="p-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
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
              onChange={(e) => setUrl(e.target.value)}
              onFocus={() => setIsHovered(true)}
              onBlur={() => setIsHovered(false)}
              required
            />
          </div>
          <div className="mt-3 sm:mt-0 pr-0 sm:pr-3 sm:shrink-0">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full sm:w-auto justify-center bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-3 rounded-xl font-medium text-sm transition-colors flex items-center gap-2 shadow-lg shadow-zinc-200"
            >
              Shorten URL
              <ArrowRight size={16} />
            </motion.button>
          </div>
        </div>

        <div className="border-t border-zinc-100 mx-2">
          <button
            type="button"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 py-4 px-2 transition-colors w-full"
          >
            <Settings2 size={16} />
            <span>Advanced Settings</span>
            <motion.div
              animate={{ rotate: isAdvancedOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={16} />
            </motion.div>
          </button>

          <AnimatePresence>
            {isAdvancedOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-visible"
              >
                <div className="px-2 pb-6 pt-2 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                          Custom Slug
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
                          symph.live/
                        </span>
                        <input
                          type="text"
                          placeholder="custom-slug"
                          maxLength={20}
                          className="flex-1 bg-white border border-zinc-200 text-zinc-900 px-3 py-2.5 rounded-r-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                          Expiration
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
                          className="w-full bg-white border border-zinc-200 text-zinc-900 pl-10 pr-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                        UTM Builder
                      </label>
                      <div className="group relative">
                        <Info
                          size={14}
                          className="text-zinc-400 cursor-help hover:text-zinc-600"
                        />
                        <Tooltip text="UTM parameters track campaign source, medium, and content in analytics" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                        {
                          field: "Source",
                          description:
                            "Where the traffic comes from (e.g., google, facebook)",
                        },
                        {
                          field: "Medium",
                          description:
                            "The marketing medium (e.g., email, social, cpc)",
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
                          description:
                            "Used to differentiate similar content or links",
                        },
                      ].map(({ field, description }) => (
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
                            className="w-full bg-zinc-50/50 border border-zinc-200 text-zinc-900 px-3 py-2 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>
    </div>
  );
}
