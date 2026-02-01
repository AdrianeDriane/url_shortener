import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Unlink, Home, Search } from "lucide-react";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#fafafa] min-h-screen pb-20">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        <section className="min-h-[70vh] flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-20 h-20 bg-zinc-100 rounded-2xl flex items-center justify-center mb-6"
          >
            <Unlink size={40} className="text-zinc-400" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-3 mb-8"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 tracking-tight">
              404
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-zinc-600">
              URL not found
            </p>
            <p className="text-base text-zinc-500 max-w-md mx-auto">
              The link you're looking for doesn't exist or may have been
              removed.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 rounded-xl text-sm font-medium text-white transition-colors"
            >
              <Home size={18} />
              Go Home
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 rounded-xl text-sm font-medium text-zinc-700 transition-colors"
            >
              <Search size={18} />
              Find a Link
            </button>
          </motion.div>
        </section>
      </main>
    </div>
  );
}

export default NotFoundPage;
