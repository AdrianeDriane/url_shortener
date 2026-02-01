import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Monitor, Smartphone, MousePointerClick, X } from "lucide-react";
import type { ClickLog } from "../../../types/api.types";
import {
  parseReferrer,
  parseDevice,
  formatRelativeTime,
} from "../utils/analytics.utils";

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  clicks: ClickLog[];
  limit: number;
  onLimitChange: (limit: number) => void;
}

export function ActivityModal({
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
                    <ClickLogItem key={click.id} click={click} />
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

function ClickLogItem({ click }: { click: ClickLog }) {
  const device = parseDevice(click.user_agent);

  return (
    <div className="px-6 py-4 flex items-center gap-4 hover:bg-zinc-50/50">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Globe size={14} className="text-zinc-400" />
          <span className="font-medium text-zinc-900">
            {parseReferrer(click.referrer)}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-1 text-sm text-zinc-500">
          <span className="flex items-center gap-1">
            {device === "mobile" ? (
              <Smartphone size={12} />
            ) : (
              <Monitor size={12} />
            )}
            {device === "mobile" ? "Mobile" : "Desktop"}
          </span>
          <span>•</span>
          <span>{formatRelativeTime(click.created_at)}</span>
        </div>
      </div>
    </div>
  );
}
