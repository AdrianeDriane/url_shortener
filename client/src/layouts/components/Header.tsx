import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Github, Command, Menu, X } from "lucide-react";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  // Lock body scroll when drawer is open
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
    <>
      <header className="w-full border-b border-zinc-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white">
              <Command size={18} />
            </div>
            <span className="font-semibold text-zinc-900 tracking-tight">
              symph.live
            </span>
          </div>

          <nav className="flex items-center gap-2 sm:gap-4">
            <a
              href="/dashboard"
              className="hidden sm:inline text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              Dashboard
            </a>
            <a
              href="#"
              className="hidden sm:inline text-zinc-500 hover:text-zinc-900 transition-colors p-2 hover:bg-zinc-100 rounded-md"
              aria-label="Source Code"
            >
              <Github size={20} />
            </a>
            <button
              type="button"
              className="sm:hidden text-zinc-600 hover:text-zinc-900 p-2"
              aria-label="Open menu"
              onClick={() => setIsOpen(true)}
            >
              <Menu size={20} />
            </button>
          </nav>
        </div>
      </header>

      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="fixed inset-0 z-[9999] sm:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="absolute inset-0 bg-black/50"
                onClick={() => setIsOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              <motion.div
                className="absolute top-0 left-0 w-full bg-white shadow-xl border-b border-zinc-200 p-5"
                initial={{ y: "-100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
              >
                <div className="max-w-5xl mx-auto">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-zinc-900">Menu</span>
                    <button
                      type="button"
                      className="text-zinc-600 hover:text-zinc-900 p-2 -mr-2"
                      aria-label="Close menu"
                      onClick={() => setIsOpen(false)}
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <nav className="flex flex-col gap-1">
                    <a
                      href="/dashboard"
                      className="py-3 px-3 text-base font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </a>
                    <a
                      href="#"
                      className="py-3 px-3 text-base font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Source Code
                    </a>
                  </nav>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
