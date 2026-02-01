import { Routes, Route } from "react-router";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import SecondPage from "../pages/SecondPage";
import DashboardIndexPage from "../pages/DashboardIndexPage";
import DashboardAnalyticsPage from "../pages/DashboardAnalyticsPage";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/analytics" element={<SecondPage />} />
        <Route path="/dashboard" element={<DashboardIndexPage />} />
        <Route
          path="/dashboard/:shortCode"
          element={<DashboardAnalyticsPage />}
        />
      </Route>
    </Routes>
  );
}
