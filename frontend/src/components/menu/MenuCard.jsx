import { motion } from "framer-motion";
import { formatINR } from "../../utils/format";

export default function MenuCard({ item, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.03, 0.25), ease: [0.22, 1, 0.36, 1] }}
      className={`group card-luxe overflow-hidden flex flex-row sm:flex-col items-center sm:items-stretch p-3 sm:p-0 hover:border-primary/40 hover:shadow-md transition-all ${
        !item.available ? "opacity-80" : ""
      }`}
      data-testid={`menu-card-${item.id}`}
    >
      {/* Dish Image */}
      <div className="w-24 h-24 sm:w-full sm:aspect-[16/11] rounded-xl sm:rounded-none overflow-hidden relative shrink-0 bg-stone-100">
        <img
          src={item.image || "/images/hotel-yashdeep/hotel main.png"}
          alt={item.name}
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/hotel-yashdeep/hotel main.png";
          }}
          className={`h-full w-full object-cover transition-transform duration-[1.2s] ease-luxe group-hover:scale-105 ${
            !item.available ? "grayscale-[40%]" : ""
          }`}
        />
        {item.tag && (
          <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-dark/90 backdrop-blur-md text-[9px] sm:text-[10px] uppercase tracking-wider text-secondary font-semibold border border-secondary/30 shadow-sm">
            {item.tag}
          </div>
        )}
        {!item.available && (
          <div className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-rose-800/95 backdrop-blur-md text-[9px] sm:text-[10px] uppercase tracking-wider text-white font-bold border border-rose-500/40 shadow-sm">
            Sold Out
          </div>
        )}
      </div>

      {/* Dish Details */}
      <div className="pl-3.5 sm:p-5 md:p-6 flex flex-col flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 sm:gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              {item.category === "veg" && (
                <span title="Pure Vegetarian" className="inline-flex items-center justify-center h-3.5 w-3.5 border border-emerald-600 rounded-[3px] shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                </span>
              )}
              {item.category === "nonveg" && (
                <span title="Non-Vegetarian" className="inline-flex items-center justify-center h-3.5 w-3.5 border border-red-800 rounded-[3px] shrink-0">
                  <span className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[5px] border-b-red-800" />
                </span>
              )}
              {item.category === "beer" && (
                <span title="Bar Selection" className="text-xs shrink-0">🍺</span>
              )}
              <h3 className="font-display text-base sm:text-lg md:text-xl text-dark group-hover:text-primary transition-colors truncate sm:whitespace-normal">
                {item.name}
              </h3>
            </div>
          </div>
          <span className="font-display text-base sm:text-lg text-primary whitespace-nowrap font-bold shrink-0">
            {formatINR(item.price)}
          </span>
        </div>

        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted leading-relaxed line-clamp-2 sm:line-clamp-3">
          {item.description}
        </p>

        <div className="hidden sm:flex mt-4 pt-3 border-t border-border/60 items-center justify-between text-[10px] sm:text-[11px] text-muted uppercase tracking-widest2">
          <span>
            {item.category === "veg" && "Pure Vegetarian"}
            {item.category === "nonveg" && "Non-Vegetarian"}
            {item.category === "beer" && "Bar Menu"}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
