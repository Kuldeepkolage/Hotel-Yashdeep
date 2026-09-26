import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Phone, User, LogOut } from "lucide-react";
import { NAV_LINKS, SITE } from "../../constants/site";
import useScrolled from "../../hooks/useScrolled";
import { useCustomerAuth } from "../../context/CustomerAuthContext.jsx";
import { cx } from "../../utils/format";

export default function Navbar() {
  const { customer, isAuthenticated, logout } = useCustomerAuth();
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled(28);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const onHome = pathname === "/";
  const hasDarkHero = ["/", "/about", "/menu", "/gallery", "/contact", "/reservations"].includes(pathname);
  const transparent = hasDarkHero && !scrolled;

  const handleNavigate = (to) => {
    setOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (pathname !== to) {
      navigate(to);
    }
  };

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cx(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300 ease-luxe",
          transparent
            ? "bg-transparent text-[#f8f4ee]"
            : "navbar-scrolled text-[#f8f4ee]"
        )}
        style={!transparent ? { backgroundColor: "#140e0a", color: "#f8f4ee" } : undefined}
        data-testid="navbar"
      >
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-14 flex items-center justify-between h-20 md:h-24">
        {/* LEFT SECTION: Logo + Nav Links (Home to Contact) */}
        <div className="flex items-center gap-6 lg:gap-8 xl:gap-12 min-w-0">
          <Link
            to="/"
            className="flex items-center gap-3 group shrink-0"
            data-testid="logo-link"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-secondary/60 bg-secondary/10 transition-transform duration-300 group-hover:scale-105 shadow-sm">
              <span className="font-display text-secondary text-lg leading-none font-bold">Y</span>
            </span>
            <span className="leading-tight">
              <span className="block font-display text-lg tracking-wide text-white">
                Hotel Yashdeep
              </span>
              <span className="block text-[10px] uppercase tracking-widest2 text-secondary/90 font-medium">
                Yermala · Est. 2023
              </span>
            </span>
          </Link>

          {/* Navigation Links: placed on the left beside the brand */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                data-testid={`nav-${link.label.toLowerCase()}`}
                className={({ isActive }) =>
                  cx(
                    "relative text-sm font-medium tracking-wide transition-colors duration-300 py-1 whitespace-nowrap",
                    isActive
                      ? "text-secondary font-bold"
                      : "text-white/90 hover:text-secondary"
                  )
                }
              >
                {({ isActive }) => (
                  <span className="relative">
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-secondary rounded-full"
                      />
                    )}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* RIGHT SECTION: Auth Actions + Call + Reserve a Table */}
        <div className="hidden md:flex items-center gap-2 sm:gap-2.5 lg:gap-3 shrink-0 ml-auto">
          {isAuthenticated ? (
            <div className="flex items-center gap-2 lg:gap-2.5">
              {/* Customer Profile Pill */}
              <div
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider px-3.5 py-2 rounded-full border border-secondary/40 text-white bg-dark/60 shadow-sm backdrop-blur-md"
                data-testid="navbar-customer-name"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <User size={13} className="text-secondary" />
                <span>{customer?.name?.split(" ")[0]}</span>
              </div>

              {/* Sign Out */}
              <button
                type="button"
                onClick={logout}
                title="Sign out"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 text-white hover:border-red-400 hover:text-red-300 hover:bg-red-950/20 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300"
                data-testid="navbar-logout-btn"
              >
                <LogOut size={13} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* Sign In */}
              <Link
                to="/login"
                data-testid="navbar-login-btn"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/25 text-white hover:border-secondary hover:text-secondary hover:bg-secondary/10 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-300 shadow-sm"
              >
                <User size={13} className="text-secondary" />
                Sign In
              </Link>

              {/* Create Account / Sign Up */}
              <Link
                to="/signup"
                data-testid="navbar-signup-btn"
                className="inline-flex items-center gap-1.5 rounded-full border border-secondary/60 text-secondary hover:bg-secondary hover:text-dark px-3.5 py-2 text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-300 shadow-sm"
              >
                <span className="hidden xl:inline">Create Account</span>
                <span className="xl:hidden">Sign Up</span>
              </Link>
            </div>
          )}

          {/* Call Button */}
          <a
            href={SITE.phoneHref}
            data-testid="navbar-call-btn"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/25 text-white hover:border-secondary hover:text-secondary hover:bg-secondary/10 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-300 shadow-sm"
          >
            <Phone size={13} className="text-secondary" />
            Call
          </a>

          {/* Reserve a Table Button */}
          <Link
            to="/reservations"
            data-testid="navbar-reserve-btn"
            className="inline-flex items-center rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap shadow-md hover:shadow-lg transition-all duration-300 bg-secondary text-dark hover:bg-white active:scale-95"
          >
            Reserve a Table
          </Link>
        </div>

        {/* Mobile top-right actions: Quick Book + 3-Lines Menu Icon */}
        <div className="flex items-center gap-2.5 lg:hidden">
          <button
            type="button"
            onClick={() => handleNavigate("/reservations")}
            className="inline-flex items-center rounded-full px-3.5 py-2 text-xs font-bold uppercase tracking-wider bg-secondary text-dark shadow-sm hover:bg-white active:scale-95 transition-all cursor-pointer"
            data-testid="mobile-quick-book"
          >
            Book
          </button>
          <button
            type="button"
            aria-label="Open navigation menu"
            className="relative z-50 inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-[#1f1510] border border-secondary/60 text-secondary shadow-md hover:bg-secondary hover:text-dark transition-all active:scale-95 cursor-pointer"
            onClick={() => setOpen(true)}
            data-testid="mobile-menu-open"
          >
            <Menu size={20} className="text-secondary" />
          </button>
        </div>
      </div>
    </header>

    {/* Portaled Mobile Drawer Menu mounted directly on document.body */}
    {typeof document !== "undefined" &&
      createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[99999] bg-dark/75 backdrop-blur-md lg:hidden"
              onClick={() => setOpen(false)}
            >
              <motion.aside
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="absolute right-0 top-0 h-full w-[88%] max-w-sm bg-background px-6 py-6 flex flex-col justify-between overflow-y-auto shadow-2xl z-[100000]"
                onClick={(e) => e.stopPropagation()}
                data-testid="mobile-drawer"
              >
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-4 border-b border-border/70">
                  <button
                    type="button"
                    onClick={() => handleNavigate("/")}
                    className="flex items-center gap-2.5 text-left group"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-secondary/60 bg-secondary/10 transition-transform group-hover:scale-105">
                      <span className="font-display text-secondary text-base font-bold leading-none">Y</span>
                    </span>
                    <div>
                      <span className="block font-display text-base text-dark font-semibold leading-tight">Hotel Yashdeep</span>
                      <span className="block text-[9px] uppercase tracking-widest text-secondary font-medium">Yermala · Est. 2023</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    aria-label="Close menu"
                    className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-dark/15 text-dark hover:bg-dark/5 active:scale-95 transition-all"
                    onClick={() => setOpen(false)}
                    data-testid="mobile-menu-close"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="my-5 flex flex-col divide-y divide-border/60">
                  {NAV_LINKS.map((link, i) => {
                    const isActive = pathname === link.to;
                    return (
                      <motion.div
                        key={link.to}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.04 * i, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <button
                          type="button"
                          onClick={() => handleNavigate(link.to)}
                          className={cx(
                            "w-full flex items-center justify-between py-3.5 font-display text-xl transition-colors text-left",
                            isActive ? "text-primary font-bold" : "text-dark hover:text-primary"
                          )}
                          data-testid={`mobile-nav-${link.label.toLowerCase()}`}
                        >
                          <span>{link.label}</span>
                          {isActive && <span className="h-2 w-2 rounded-full bg-secondary" />}
                        </button>
                      </motion.div>
                    );
                  })}
                </nav>

                {/* Drawer Bottom Actions */}
                <div className="pt-4 border-t border-border/70 space-y-2.5 mt-auto">
                  {isAuthenticated ? (
                    <div className="p-3 bg-secondary/10 border border-secondary/30 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <User size={15} className="text-secondary" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-dark">{customer?.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setOpen(false);
                        }}
                        className="text-xs text-red-600 hover:text-red-700 font-semibold inline-flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-red-50"
                        data-testid="mobile-logout-btn"
                      >
                        <LogOut size={13} /> Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleNavigate("/login")}
                        className="btn-outline justify-center text-xs py-2.5 font-semibold"
                        data-testid="mobile-login-btn"
                      >
                        <User size={13} className="text-secondary" /> Sign In
                      </button>
                      <button
                        type="button"
                        onClick={() => handleNavigate("/signup")}
                        className="btn-primary justify-center text-xs py-2.5 font-semibold"
                        data-testid="mobile-signup-btn"
                      >
                        Sign Up
                      </button>
                    </div>
                  )}
                  <a
                    href={SITE.phoneHref}
                    className="btn-outline w-full justify-center text-xs py-2.5 font-semibold"
                    data-testid="mobile-call-btn"
                  >
                    <Phone size={13} className="text-secondary" /> {SITE.phone}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleNavigate("/reservations")}
                    className="btn-gold w-full justify-center text-xs py-3 font-bold uppercase tracking-wider shadow-md"
                    data-testid="mobile-reserve-btn"
                  >
                    Reserve a Table
                  </button>
                </div>
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
  </>
  );
}
