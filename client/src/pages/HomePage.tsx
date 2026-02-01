import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { URLComposer } from "../features/shortener/components/URLComposer";
import { SuccessState } from "../features/shortener/components/SuccessState";
import { AnalyticsDashboard } from "../features/analytics/components/AnalyticsDashboard";

function HomePage() {
  const [hasShortened, setHasShortened] = useState(false);

  return (
    <div className="min-h-screen bg-[#fafafa] pb-20">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 space-y-12">
        {/* Hero / Composer Section */}
        <section className="min-w-full space-y-8 min-h-[50vh] sm:min-h-[65vh] flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight">
              Shorten links.{" "}
              <span className="text-indigo-600">Measure impact.</span>
            </h1>
            <p className="text-base sm:text-lg text-zinc-500 max-w-2xl mx-auto">
              The modern URL shortener for brands that care about design and
              data. Create, track, and manage your links with precision.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full"
          >
            <URLComposer onShorten={() => setHasShortened(true)} />
          </motion.div>
        </section>

        {/* Success State - Conditionally Rendered */}
        <AnimatePresence>
          {hasShortened && (
            <section>
              <SuccessState />
            </section>
          )}
        </AnimatePresence>

        {/* Analytics Dashboard */}
        <section>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-xl font-semibold text-zinc-900">
              Dashboard Overview
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
        </section>
      </main>
    </div>
  );
}

export default HomePage;
