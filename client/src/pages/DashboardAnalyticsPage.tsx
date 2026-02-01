import { useParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";
import { AnalyticsDashboard } from "../features/analytics/components/AnalyticsDashboard";

function DashboardAnalyticsPage() {
  const { shortCode } = useParams<{ shortCode: string }>();
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="bg-[#fafafa] min-h-screen pb-20">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 space-y-6 sm:space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackClick}
                className="p-2 -ml-2 rounded-lg hover:bg-zinc-100 transition-all group"
                title="Back to search"
              >
                <ArrowLeft
                  size={20}
                  className="text-zinc-500 group-hover:text-zinc-900 group-hover:-translate-x-0.5 transition-all"
                />
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
                  Link Insights
                </h1>
                <p className="text-sm text-zinc-500 mt-0.5">
                  Analytics for{" "}
                  <span className="font-mono text-indigo-600">{shortCode}</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-colors"
            >
              <Home size={16} />
              <span className="hidden sm:inline">Create New Link</span>
              <span className="sm:hidden">New Link</span>
            </button>
          </div>
        </motion.div>

        {/* Analytics Content */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <AnalyticsDashboard />
        </motion.section>
      </main>
    </div>
  );
}

export default DashboardAnalyticsPage;
