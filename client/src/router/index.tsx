import { Routes, Route } from "react-router";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import DashboardIndexPage from "../pages/DashboardIndexPage";
import DashboardAnalyticsPage from "../pages/DashboardAnalyticsPage";
import NotFoundPage from "../pages/NotFoundPage";
import ExpiredPage from "../pages/ExpiredPage";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardIndexPage />} />
        <Route
          path="/dashboard/:shortCode"
          element={<DashboardAnalyticsPage />}
        />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="/expired" element={<ExpiredPage />} />
      </Route>
    </Routes>
  );
}
