import { useState } from "react";
import { motion } from "framer-motion";
import { Link as LinkIcon, ArrowRight } from "lucide-react";
import { AdvancedSettings } from "./AdvancedSettings";

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

        <AdvancedSettings
          isOpen={isAdvancedOpen}
          onToggle={() => setIsAdvancedOpen(!isAdvancedOpen)}
        />
      </form>
    </div>
  );
}
