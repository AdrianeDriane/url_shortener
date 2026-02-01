import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  status?: "active" | "expired" | "neutral";
  trend?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  status,
  trend,
}: StatsCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm flex flex-col justify-between h-full"
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-sm font-medium text-zinc-500">{title}</span>
        <div
          className={`p-2 rounded-lg ${
            status === "active"
              ? "bg-green-50 text-green-600"
              : status === "expired"
                ? "bg-amber-50 text-amber-600"
                : "bg-zinc-50 text-zinc-500"
          }`}
        >
          <Icon size={18} />
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-zinc-900 tracking-tight">
            {value}
          </span>
          {status === "active" && (
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
          )}
        </div>
        {trend && (
          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
    </motion.div>
  );
}
