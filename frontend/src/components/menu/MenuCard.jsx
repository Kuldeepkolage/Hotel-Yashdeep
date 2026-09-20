import { motion } from "framer-motion";
import { formatINR } from "../../utils/format";

export default function MenuCard({ item, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group card-luxe overflow-hidden flex flex-col"
      data-testid={`menu-card-${item._id}`}
    >
      <div className="aspect-[16/11] overflow-hidden relative">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1.4s] ease-luxe group-hover:scale-110"
        />
        {item.tag && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-dark/85 backdrop-blur-md text-[10px] uppercase tracking-widest2 text-secondary font-semibold border border-secondary/30 shadow-sm">
            {item.tag}
          </div>
        )}
      </div>
      <div className="p-6 md:p-7 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              {item.category === "veg" && (
                <span title="Pure Vegetarian" className="inline-flex items-center justify-center h-4 w-4 border border-emerald-600 rounded-[3px] shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                </span>
              )}
              {item.category === "nonveg" && (
                <span title="Non-Vegetarian" className="inline-flex items-center justify-center h-4 w-4 border border-red-800 rounded-[3px] shrink-0">
                  <span className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[5px] border-b-red-800" />
                </span>
              )}
              {item.category === "beer" && (
                <span title="Bar Selection" className="text-xs">🍺</span>
              )}
              <h3 className="font-display text-xl text-dark group-hover:text-primary transition-colors">{item.name}</h3>
            </div>
          </div>
          <span className="font-display text-lg text-primary whitespace-nowrap font-medium">
            {formatINR(item.price)}
          </span>
        </div>
        <p className="mt-3 text-sm text-muted leading-relaxed flex-1">
          {item.description}
        </p>
        <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-[11px] text-muted uppercase tracking-widest2">
          <span>
            {item.category === "veg" && "Pure Vegetarian"}
            {item.category === "nonveg" && "Non-Vegetarian"}
            {item.category === "beer" && "Bar Menu"}
          </span>
          <span className="h-px w-6 bg-secondary/60 group-hover:w-12 group-hover:bg-secondary transition-all duration-500" />
        </div>
      </div>
    </motion.article>
  );
}
