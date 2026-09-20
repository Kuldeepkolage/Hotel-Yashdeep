import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AdminRoutes from "../admin/routes/AdminRoutes";

const Home = lazy(() => import("../pages/Home"));
const About = lazy(() => import("../pages/About"));
const Menu = lazy(() => import("../pages/Menu"));
const Gallery = lazy(() => import("../pages/Gallery"));
const Reservations = lazy(() => import("../pages/Reservations"));
const Contact = lazy(() => import("../pages/Contact"));
const Login = lazy(() => import("../pages/Login"));
const Signup = lazy(() => import("../pages/Signup"));
const VerifyEmail = lazy(() => import("../pages/VerifyEmail"));
const NotFound = lazy(() => import("../pages/NotFound"));


function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="h-8 w-8 rounded-full border-2 border-border border-t-primary animate-spin" />
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
  {/* Public Website */}
  <Route element={<MainLayout />}>
    <Route index element={<Home />} />
    <Route path="about" element={<About />} />
    <Route path="menu" element={<Menu />} />
    <Route path="gallery" element={<Gallery />} />
    <Route path="reservations" element={<Reservations />} />
    <Route path="contact" element={<Contact />} />
    <Route path="login" element={<Login />} />
    <Route path="signup" element={<Signup />} />
    <Route path="verify-email" element={<VerifyEmail />} />
  </Route>

  {/* Admin */}
  <Route path="/admin/*" element={<AdminRoutes />} />

  {/* 404 */}
  <Route path="*" element={<NotFound />} />
</Routes>
    </Suspense>
  );
}
