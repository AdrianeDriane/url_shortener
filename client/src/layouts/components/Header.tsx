import { Github, Command } from "lucide-react";

export function Header() {
  return (
    <header className="w-full border-b border-zinc-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white">
            <Command size={18} />
          </div>
          <span className="font-semibold text-zinc-900 tracking-tight">
            symph.live
          </span>
        </div>

        <nav className="flex items-center gap-6">
          <a
            href="#"
            className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            Documentation
          </a>
          <a
            href="#"
            className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            API
          </a>
          <div className="h-4 w-px bg-zinc-200 mx-2"></div>
          <a
            href="#"
            className="text-zinc-500 hover:text-zinc-900 transition-colors p-2 hover:bg-zinc-100 rounded-md"
            aria-label="Source Code"
          >
            <Github size={20} />
          </a>
        </nav>
      </div>
    </header>
  );
}
