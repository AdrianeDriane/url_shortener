import { Routes, Route } from "react-router";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import SecondPage from "../pages/SecondPage";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/analytics" element={<SecondPage />} />
      </Route>
    </Routes>
  );
}
