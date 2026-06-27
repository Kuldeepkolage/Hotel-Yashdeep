import { motion } from "framer-motion";
import { cx } from "../../utils/format";

export default function CategoryFilter({ categories, active, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2 md:gap-3" data-testid="menu-filters">
      {categories.map((c) => {
        const isActive = active === c.id;
        return (
          <button
            key={c.id}
            onClick={() => onChange(c.id)}
            data-testid={`filter-${c.id}`}
            className={cx(
              "relative rounded-full px-5 py-2.5 text-xs uppercase tracking-widest2 transition-all duration-500 ease-luxe border",
              isActive
                ? "bg-dark text-background border-dark"
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
