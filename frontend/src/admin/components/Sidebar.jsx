// File: src/admin/components/Sidebar.jsx
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  LayoutGrid,
  UtensilsCrossed,
  FileText,
  Image,
  UploadCloud,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import useAuth from "../hooks/useAuth.js";

const NAV_ITEMS = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/reservations", label: "Reservations", icon: CalendarCheck },
  { to: "/admin/walk-ins", label: "Walk-ins", icon: Users },
  { to: "/admin/tables", label: "Tables", icon: LayoutGrid },
  { to: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
  { to: "/admin/cms", label: "CMS", icon: FileText },
  { to: "/admin/gallery", label: "Gallery", icon: Image },
  { to: "/admin/uploads", label: "Uploads", icon: UploadCloud },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ open, onClose }) {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const content = (
    <div className="flex h-full flex-col bg-dark text-background">
      <div className="flex items-center justify-between px-6 py-7 border-b border-background/10">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-secondary/60">
            <span className="font-display text-secondary text-lg leading-none">Y</span>
          </span>
          <span className="font-display text-lg">Hotel Yashdeep</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="lg:hidden h-9 w-9 inline-flex items-center justify-center rounded-full border border-background/20 text-background"
          aria-label="Close menu"
          data-testid="sidebar-close"
        >
          <X size={16} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-8 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            data-testid={`sidebar-link-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors duration-300 ${
                isActive
                  ? "bg-secondary/15 text-secondary"
                  : "text-background/70 hover:bg-background/5 hover:text-background"
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-6 border-t border-background/10">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-background/70 hover:bg-background/5 hover:text-background transition-colors duration-300"
          data-testid="sidebar-logout-btn"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex lg:w-72 lg:flex-shrink-0" data-testid="sidebar-desktop">
        {content}
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" data-testid="sidebar-drawer">
          <div
            className="absolute inset-0 bg-dark/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="absolute left-0 top-0 h-full w-72 shadow-luxe">
            {content}
          </div>
        </div>
      )}
    </>
  );
}