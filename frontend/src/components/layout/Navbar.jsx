import { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { NAV_LINKS, SITE } from "../../constants/site";
import useScrolled from "../../hooks/useScrolled";
import { cx } from "../../utils/format";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled(32);
  const { pathname } = useLocation();
  const onHome = pathname === "/";
  const transparent = onHome && !scrolled;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cx(
        "fixed top-0 inset-x-0 z-50 transition-all duration-700 ease-luxe",
        transparent ? "bg-transparent" : "glass"
      )}
      data-testid="navbar"
    >
      <div className="container-luxe flex items-center justify-between h-20 md:h-24">
        <Link
          to="/"
          className="flex items-center gap-3 group"
          data-testid="logo-link"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-secondary/60">
            <span className="font-display text-secondary text-lg leading-none">Y</span>
          </span>
          <span className="leading-tight">
            <span
              className={cx(
                "block font-display text-lg",
                transparent ? "text-background" : "text-dark"
              )}
            >
              Hotel Yashdeep
            </span>
            <span
              className={cx(
                "block text-[10px] uppercase tracking-widest2",
                transparent ? "text-background/70" : "text-muted"
              )}
            >
              Yermala · Est. 2020
            </span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-9">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              data-testid={`nav-${link.label.toLowerCase()}`}
              className={({ isActive }) =>
                cx(
                  "relative text-sm transition-colors duration-300",
                  transparent ? "text-background/85 hover:text-secondary" : "text-dark/80 hover:text-primary",
                  isActive && (transparent ? "text-secondary" : "text-primary")
                )
              }
            >
              {({ isActive }) => (
                <span className="relative">
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-2 left-0 right-0 h-px bg-current"
                    />
                  )}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a
            href={SITE.phoneHref}
            data-testid="navbar-call-btn"
            className={cx(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs uppercase tracking-widest2 transition-colors duration-500",
              transparent
                ? "border-background/40 text-background hover:border-secondary hover:text-secondary"
                : "border-dark/15 text-dark hover:border-primary hover:text-primary"
            )}
          >
            <Phone size={14} />
            Call
          </a>
          <Link
            to="/reservations"
            data-testid="navbar-reserve-btn"
            className={cx(
              "rounded-full px-5 py-2.5 text-xs uppercase tracking-widest2 transition-all duration-500 ease-luxe",
              transparent
                ? "bg-secondary text-dark hover:bg-background"
                : "bg-primary text-background hover:bg-dark"
            )}
          >
            Reserve a Table
          </Link>
        </div>

        <button
          aria-label="Open menu"
          className={cx(
            "lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors",
            transparent
              ? "border-background/40 text-background"
              : "border-dark/15 text-dark"
          )}
          onClick={() => setOpen(true)}
          data-testid="mobile-menu-open"
        >
          <Menu size={20} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-dark/40 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-0 h-full w-[88%] max-w-sm bg-background px-7 py-8 flex flex-col"
              onClick={(e) => e.stopPropagation()}
              data-testid="mobile-drawer"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-xl text-dark">Hotel Yashdeep</span>
                <button
                  aria-label="Close menu"
                  className="h-11 w-11 inline-flex items-center justify-center rounded-full border border-dark/15"
                  onClick={() => setOpen(false)}
                  data-testid="mobile-menu-close"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="mt-12 flex flex-col gap-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.06 * i, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <NavLink
                      to={link.to}
                      end={link.to === "/"}
                      className={({ isActive }) =>
                        cx(
                          "block py-4 font-display text-3xl border-b border-border",
                          isActive ? "text-primary" : "text-dark"
                        )
                      }
                      data-testid={`mobile-nav-${link.label.toLowerCase()}`}
                    >
                      {link.label}
                    </NavLink>
                  </motion.div>
                ))}
              </nav>
              <div className="mt-auto space-y-3">
                <a
                  href={SITE.phoneHref}
                  className="btn-outline w-full"
                  data-testid="mobile-call-btn"
                >
                  <Phone size={16} /> {SITE.phone}
                </a>
                <Link
                  to="/reservations"
                  className="btn-primary w-full"
                  data-testid="mobile-reserve-btn"
                >
                  Reserve a Table
                </Link>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
