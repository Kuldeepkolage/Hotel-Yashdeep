// File: src/admin/routes/AdminRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "../context/AuthContext.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import Login from "../pages/Login.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Reservations from "../pages/Reservations";
import WalkIns from "../pages/WalkIns";
import Tables from "../pages/Tables";
import Menu from "../pages/Menu";
import CMS from "../pages/CMS";
import Gallery from "../pages/Gallery";
import Uploads from "../pages/Uploads";
import Settings from "../pages/Settings";

export default function AdminRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="reservations" element={<Reservations />} />
            <Route path="walk-ins" element={<WalkIns />} />
            <Route path="tables" element={<Tables />} />
            <Route path="menu" element={<Menu />} />
            <Route path="cms" element={<CMS />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="uploads" element={<Uploads />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="login" replace />} />
      </Routes>
    </AuthProvider>
  );
}