import { LogOut, Menu as MenuIcon, ExternalLink } from "lucide-react";
import useAuth from "../hooks/useAuth.js";
import { Link } from "react-router-dom";

export default function Header({ onMenuClick }) {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="h-16 md:h-20 flex items-center justify-between gap-3 border-b border-border bg-white/95 backdrop-blur-md px-4 sm:px-6 md:px-8 sticky top-0 z-30 shadow-2xs">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden h-10 w-10 shrink-0 inline-flex items-center justify-center rounded-xl border border-border bg-white text-dark hover:border-primary hover:text-primary transition-colors active:scale-95"
          aria-label="Open menu"
          data-testid="header-menu-toggle"
        >
          <MenuIcon size={20} />
        </button>
        <div className="min-w-0">
          <h1 className="font-display text-base sm:text-lg text-dark leading-tight font-bold truncate">
            Admin Portal
          </h1>
          <p className="text-[11px] text-muted truncate">Hotel Yashdeep · Yermala</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          title="Open live website in new tab"
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold text-dark hover:border-secondary hover:text-secondary transition-colors"
        >
          <span className="hidden sm:inline">View Site</span>
          <ExternalLink size={12} />
        </Link>

        <div className="text-right hidden md:block">
          <p className="text-xs sm:text-sm font-semibold text-dark leading-tight" data-testid="header-admin-name">
            {currentUser?.name || "Administrator"}
          </p>
          <p className="text-[10px] uppercase tracking-widest text-secondary font-medium" data-testid="header-admin-role">
            {currentUser?.role || "Staff"}
          </p>
        </div>

        <span className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-primary/10 text-primary border border-primary/20 inline-flex items-center justify-center font-display text-sm font-bold uppercase shadow-2xs">
          {currentUser?.name?.charAt(0) || "A"}
        </span>

        <button
          type="button"
          onClick={handleLogout}
          title="Log out"
          className="inline-flex items-center gap-1.5 rounded-full border border-border hover:border-red-400 hover:text-red-600 hover:bg-red-50 px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold uppercase tracking-wider text-dark transition-all active:scale-95"
          data-testid="header-logout-btn"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}