import { NavLink } from "react-router-dom";
import { Menu, X, UtensilsCrossed, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Menu", path: "/menu" },
  { name: "Gallery", path: "/gallery" },
  { name: "Contact", path: "/contact" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed left-0 top-0 z-50 w-full transition-all duration-500 ${
          scrolled
            ? "bg-[var(--background)]/80 shadow-[0_4px_30px_rgba(58,28,28,0.08)] backdrop-blur-xl border-b border-[var(--border-light)]"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-[80px] max-w-7xl items-center justify-between px-6 lg:px-10">

          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full bg-[var(--primary)] flex items-center justify-center shadow-md transition group-hover:scale-105 duration-300">
              <UtensilsCrossed size={16} color="white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-['Playfair_Display'] text-xl font-bold text-[var(--primary)] tracking-tight">
                Hotel Yashdeep
              </span>
              <span className="text-[10px] uppercase tracking-[4px] text-[var(--secondary)] font-medium">
                Est. Yermala
              </span>
            </div>
          </NavLink>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `relative text-sm font-medium tracking-wide transition-colors duration-200 group ${
                    isActive
                      ? "text-[var(--primary)]"
                      : "text-[var(--text)] hover:text-[var(--primary)]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}
                    <span
                      className={`absolute -bottom-1 left-0 h-[1.5px] bg-[var(--secondary)] transition-all duration-300 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Reserve Button */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="tel:+91XXXXXXXXXX"
              className="flex items-center gap-2 text-sm text-[var(--text-light)] hover:text-[var(--primary)] transition-colors duration-200"
            >
              <Phone size={14} />
              <span className="font-medium">Call Us</span>
            </a>
            <button className="relative overflow-hidden rounded-full bg-[var(--primary)] px-7 py-[10px] text-sm font-medium text-white transition-all duration-300 hover:shadow-[0_8px_24px_rgba(122,31,31,0.35)] hover:-translate-y-0.5 group">
              <span className="relative z-10">Reserve Table</span>
              <span className="absolute inset-0 bg-gradient-to-r from-[var(--primary-light)] to-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center shadow-sm transition hover:border-[var(--primary)]"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={18} className="text-[var(--primary)]" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={18} className="text-[var(--text)]" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-[var(--text)]/40 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 250 }}
              className="fixed right-0 top-0 z-50 h-full w-[280px] bg-[var(--surface)] shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-[var(--border-light)]">
                <span className="font-['Playfair_Display'] text-lg font-bold text-[var(--primary)]">Hotel Yashdeep</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 rounded-full bg-[var(--background)] flex items-center justify-center"
                >
                  <X size={16} className="text-[var(--text)]" />
                </button>
              </div>

              <nav className="flex flex-col p-6 gap-1 flex-1">
                {links.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 + 0.1 }}
                  >
                    <NavLink
                      to={link.path}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-[var(--background-deep)] text-[var(--primary)]"
                            : "text-[var(--text)] hover:bg-[var(--background)] hover:text-[var(--primary)]"
                        }`
                      }
                    >
                      {link.name}
                    </NavLink>
                  </motion.div>
                ))}
              </nav>

              <div className="p-6 border-t border-[var(--border-light)]">
                <button className="w-full rounded-xl bg-[var(--primary)] py-3 text-sm font-medium text-white shadow-md hover:shadow-lg transition-all duration-200">
                  Reserve a Table
                </button>
                <p className="text-center text-xs text-[var(--text-muted)] mt-4">
                  Yermala, Maharashtra
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;