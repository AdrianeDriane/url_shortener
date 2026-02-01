import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  Search,
  ArrowRight,
  BarChart3,
  MousePointerClick,
  Globe,
  Clock,
} from "lucide-react";

function DashboardIndexPage() {
  const [shortCode, setShortCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (shortCode.trim()) {
      navigate(`/dashboard/${shortCode.trim()}`);
    }
  };

  const features = [
    {
      icon: MousePointerClick,
      title: "Click Tracking",
      description: "See total clicks and engagement",
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      icon: Globe,
      title: "Traffic Sources",
      description: "Know where visitors come from",
      color: "bg-violet-100 text-violet-600",
    },
    {
      icon: BarChart3,
      title: "Performance",
      description: "View detailed statistics",
      color: "bg-pink-100 text-pink-600",
    },
    {
      icon: Clock,
      title: "Expiration Check",
      description: "Monitor link expiration status",
      color: "bg-emerald-100 text-emerald-600",
    },
  ];

  return (
    <div className="bg-[#fafafa] min-h-screen pb-20">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        {/* Hero Section */}
        <section className="text-center mb-8 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-3 sm:space-y-4"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-900 tracking-tight">
              View your <span className="text-indigo-600">analytics</span>
            </h1>
            <p className="text-base sm:text-lg text-zinc-500 max-w-2xl mx-auto">
              Enter your shortened URL code to access detailed analytics and
              insights.
            </p>
          </motion.div>
        </section>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search Form - Full Width on Mobile, Large on Desktop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-2"
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 sm:p-8"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                      <Search size={18} />
                    </div>
                    <input
                      type="text"
                      value={shortCode}
                      onChange={(e) => setShortCode(e.target.value)}
                      placeholder="Enter your short code (e.g., abc123)"
                      className="w-full pl-10 pr-4 py-3.5 border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={!shortCode.trim()}
                  className="bg-zinc-900 text-white font-medium py-3.5 px-6 rounded-xl hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  View Analytics
                  <ArrowRight size={18} />
                </button>
              </div>
            </form>
          </motion.div>

          {/* Feature Cards - 2x2 Grid */}
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            >
              <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-5 sm:p-6 h-full hover:border-zinc-300 transition-colors">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${feature.color}`}
                  >
                    <feature.icon size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-zinc-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Info Card - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="md:col-span-2"
          >
            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <div className="flex-1">
                  <h3 className="font-semibold text-zinc-900 mb-1">
                    Don't have a short link yet?
                  </h3>
                  <p className="text-sm text-zinc-600">
                    Create a new shortened URL and start tracking your link
                    performance today.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/")}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-sm font-medium text-white transition-colors whitespace-nowrap"
                >
                  Create Short URL
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default DashboardIndexPage;
