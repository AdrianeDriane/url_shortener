import { useParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { AnalyticsDashboard } from "../features/analytics/components/AnalyticsDashboard";

function DashboardAnalyticsPage() {
  const { shortCode } = useParams<{ shortCode: string }>();
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/dashboard");
  };

  return (
    <div className="bg-[#fafafa] pb-20">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 space-y-8">
        {/* Header with Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <button
            onClick={handleBackClick}
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors group"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
            View Another Link
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <BarChart3 size={20} className="text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
                  Analytics Dashboard
                </h1>
                <p className="text-sm text-zinc-500">
                  Viewing data for{" "}
                  <span className="font-mono font-medium text-zinc-700">
                    {shortCode}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Analytics Content */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-xl font-semibold text-zinc-900">
              Performance Overview
            </h2>
            <div className="flex gap-2">
              <select className="w-full sm:w-auto bg-white border border-zinc-200 text-sm rounded-lg px-3 py-2 text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                <option>Last 24 Hours</option>
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
          </div>
          <AnalyticsDashboard />
        </motion.section>
      </main>
    </div>
  );
}

export default DashboardAnalyticsPage;
