import { useNavigate, useSearchParams } from "react-router";
import { motion } from "framer-motion";
import { Clock, BarChart3, Home } from "lucide-react";

function ExpiredPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const slug = searchParams.get("slug");

  return (
    <div className="bg-[#fafafa] min-h-screen pb-20">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        <section className="min-h-[70vh] flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-20 h-20 bg-amber-100 rounded-2xl flex items-center justify-center mb-6"
          >
            <Clock size={40} className="text-amber-600" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-3 mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight">
              This link has expired
            </h1>
            <p className="text-base text-zinc-500 max-w-md mx-auto">
              The URL you're trying to access is no longer active. The owner may
              have set an expiration date for this link.
            </p>
            {slug && (
              <p className="text-sm text-zinc-400 font-mono">Slug: {slug}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            {slug && (
              <button
                onClick={() => navigate(`/dashboard/${slug}`)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-sm font-medium text-white transition-colors"
              >
                <BarChart3 size={18} />
                View Analytics
              </button>
            )}
            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 rounded-xl text-sm font-medium text-zinc-700 transition-colors"
            >
              <Home size={18} />
              Create New Link
            </button>
          </motion.div>
        </section>
      </main>
    </div>
  );
}

export default ExpiredPage;
