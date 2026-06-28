// File: src/admin/components/Header.jsx
import { LogOut, Menu as MenuIcon } from "lucide-react";
import useAuth from "../hooks/useAuth.js";

export default function Header({ onMenuClick }) {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="h-20 flex items-center justify-between gap-4 border-b border-border bg-white px-5 md:px-8">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden h-10 w-10 inline-flex items-center justify-center rounded-full border border-border text-dark hover:border-primary hover:text-primary transition-colors"
          aria-label="Open menu"
          data-testid="header-menu-toggle"
        >
          <MenuIcon size={18} />
        </button>
        <div>
          <h1 className="font-display text-lg text-dark leading-tight">Admin Dashboard</h1>
          <p className="text-xs text-muted">Hotel Yashdeep</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-dark leading-tight" data-testid="header-admin-name">
            {currentUser?.name}
          </p>
          <p className="text-xs uppercase tracking-widest2 text-secondary" data-testid="header-admin-role">
            {currentUser?.role}
          </p>
        </div>
        <span className="h-10 w-10 rounded-full bg-primary/10 text-primary inline-flex items-center justify-center font-display text-sm uppercase">
          {currentUser?.name?.charAt(0) || "A"}
        </span>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs uppercase tracking-widest2 text-dark hover:border-primary hover:text-primary transition-colors"
          data-testid="header-logout-btn"
        >
          <LogOut size={14} /> Logout
        </button>
      </div>
    </header>
  );
}