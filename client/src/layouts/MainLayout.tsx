import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content - No header/footer as components handle their own layout */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
