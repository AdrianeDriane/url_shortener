import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";

function DashboardIndexPage() {
  const [shortCode, setShortCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (shortCode.trim()) {
      navigate(`/dashboard/${shortCode.trim()}`);
    }
  };

  return (
    <div className="bg-[#fafafa] pb-20">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        <section className="min-w-full space-y-8 min-h-[65vh] flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight">
              View your <span className="text-indigo-600">analytics</span>
            </h1>
            <p className="text-base sm:text-lg text-zinc-500 max-w-2xl mx-auto">
              Enter your shortened URL code to access detailed analytics and
              insights about your link's performance.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full max-w-2xl"
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 sm:p-8 space-y-6"
            >
              <div className="space-y-2">
                <label
                  htmlFor="shortCode"
                  className="block text-sm font-medium text-zinc-700"
                >
                  Shortened URL Code
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                    <Search size={18} />
                  </div>
                  <input
                    id="shortCode"
                    type="text"
                    value={shortCode}
                    onChange={(e) => setShortCode(e.target.value)}
                    placeholder="e.g., abc123"
                    className="w-full pl-10 pr-4 py-3 border border-zinc-200 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <p className="text-xs text-zinc-500">
                  Enter the short code from your shortened URL (the part after
                  the domain)
                </p>
              </div>

              <button
                type="submit"
                disabled={!shortCode.trim()}
                className="w-full bg-zinc-900 text-white font-medium py-3 px-4 rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                View Dashboard
                <ArrowRight size={18} />
              </button>
            </form>
          </motion.div>
        </section>
      </main>
    </div>
  );
}

export default DashboardIndexPage;
