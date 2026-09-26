import { motion } from "framer-motion";
import { cx } from "../../utils/format";

export default function CategoryFilter({ categories, active, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5" data-testid="menu-filters">
      {categories.map((c) => {
        const isActive = active === c.id;
        return (
          <button
            key={c.id}
            onClick={() => onChange(c.id)}
            data-testid={`filter-${c.id}`}
            className={cx(
              "relative rounded-full px-3.5 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-xs uppercase tracking-wider sm:tracking-widest2 font-medium transition-all duration-500 ease-luxe border",
              isActive
                ? "bg-dark text-background border-dark shadow-sm"
                : "bg-transparent text-dark border-border hover:border-primary hover:text-primary"
            )}
          >
            {isActive && (
              <motion.span
                layoutId="filter-bg"
                className="absolute inset-0 rounded-full bg-dark -z-10"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            {c.label}
          </button>
        );
      })}
    </div>
  );
}
