import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-xl font-bold text-blue-600">URL Shortener</div>
          <div className="flex gap-4">
            <a href="/" className="text-gray-700 hover:text-blue-600">
              Home
            </a>
            <a href="/analytics" className="text-gray-700 hover:text-blue-600">
              Analytics
            </a>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-sm text-gray-600">
          © 2026 URL Shortener. Built for the take-home assignment.
        </div>
      </footer>
    </div>
  );
}
