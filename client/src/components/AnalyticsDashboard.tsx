import { motion } from "framer-motion";
import { BarChart3, Activity, AlertTriangle, Tag } from "lucide-react";
import { StatsCard } from "./StatsCard";
import { ClickLogTable } from "./ClickLogTable";

export function AnalyticsDashboard() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <motion.div variants={item} className="h-full">
          <StatsCard
            title="Total Clicks"
            value="1,247"
            icon={BarChart3}
            trend="+12.5%"
          />
        </motion.div>
        <motion.div variants={item} className="h-full">
          <StatsCard
            title="Link Status"
            value="Active"
            icon={Activity}
            status="active"
          />
        </motion.div>
        <motion.div variants={item} className="h-full">
          <StatsCard
            title="Expired Access"
            value="23"
            icon={AlertTriangle}
            status="expired"
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="lg:col-span-2">
          <ClickLogTable />
        </motion.div>

        <motion.div variants={item} className="space-y-6">
          <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm h-full">
            <div className="flex items-center gap-2 mb-4">
              <Tag size={18} className="text-zinc-400" />
              <h3 className="font-semibold text-zinc-900">
                Active UTM Parameters
              </h3>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                <span className="text-xs font-medium text-zinc-500 uppercase block mb-1">
                  Source
                </span>
                <span className="text-sm font-mono text-zinc-900">twitter</span>
              </div>
              <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                <span className="text-xs font-medium text-zinc-500 uppercase block mb-1">
                  Medium
                </span>
                <span className="text-sm font-mono text-zinc-900">social</span>
              </div>
              <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                <span className="text-xs font-medium text-zinc-500 uppercase block mb-1">
                  Campaign
                </span>
                <span className="text-sm font-mono text-zinc-900">
                  launch_v2
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
