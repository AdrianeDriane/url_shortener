import { useParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { AnalyticsDashboard } from "../features/analytics/components/AnalyticsDashboard";

function DashboardAnalyticsPage() {
  const { shortCode } = useParams<{ shortCode: string }>();
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/dashboard");
  };

  return (
    <div className="bg-[#fafafa] pb-20">
      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 space-y-8">
        {/* Header */}
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
            Back
          </button>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
              Link Insights
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Analytics for{" "}
              <span className="font-mono text-indigo-600">{shortCode}</span>
            </p>
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
