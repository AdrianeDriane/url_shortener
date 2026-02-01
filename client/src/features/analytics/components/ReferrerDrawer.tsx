import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { ReferrerStats } from "../utils/analytics.utils";

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

interface ReferrerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  stats: ReferrerStats[];
  totalClicks: number;
}

export function ReferrerDrawer({
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-50"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-white shadow-2xl z-50 flex flex-col"
          >
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

export { COLORS };
