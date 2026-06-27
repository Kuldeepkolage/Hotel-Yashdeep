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
      data-testid={`menu-card-${item.id}`}
    >
      <div className="aspect-[16/11] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1.4s] ease-luxe group-hover:scale-110"
        />
      </div>
      <div className="p-6 md:p-7 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            {item.tag && (
              <span className="text-[10px] uppercase tracking-widest2 text-secondary">
                {item.tag}
              </span>
            )}
            <h3 className="mt-2 font-display text-xl text-dark">{item.name}</h3>
          </div>
          <span className="font-display text-lg text-primary whitespace-nowrap">
            {formatINR(item.price)}
          </span>
        </div>
        <p className="mt-4 text-sm text-muted leading-relaxed flex-1">
          {item.description}
        </p>
        <div className="mt-6 flex items-center gap-3">
          <span className="h-px w-8 bg-secondary" />
          <span className="text-[10px] uppercase tracking-widest2 text-muted">
            {item.category === "veg" && "Pure Vegetarian"}
            {item.category === "nonveg" && "Non-Vegetarian"}
            {item.category === "beer" && "Bar Menu"}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
