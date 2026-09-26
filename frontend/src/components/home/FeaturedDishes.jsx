import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "../common/SectionHeading";
import { MENU_ITEMS } from "../../constants/menu";
import { formatINR } from "../../utils/format";

export default function FeaturedDishes() {
  const featured = MENU_ITEMS.filter((m) => m.tag).slice(0, 4);

  return (
    <section className="py-16 md:py-32 lg:py-40 bg-dark text-background relative overflow-hidden" data-testid="featured-dishes">
      <div className="absolute inset-0 bg-grain opacity-30 pointer-events-none" />
      <div className="container-luxe relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-8">
          <SectionHeading
            light
            eyebrow="Featured on the table"
            title={
              <>
                Plates worth the<br />
                <span className="italic text-secondary">long drive.</span>
              </>
            }
          />
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 self-start md:self-end text-sm text-background/80 border-b border-background/30 pb-1 hover:text-secondary hover:border-secondary transition-colors"
            data-testid="featured-view-menu"
          >
            View full menu <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="mt-12 sm:mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((dish, i) => (
            <motion.article
              key={dish.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-2xl bg-background/5 border border-background/10"
              data-testid={`featured-dish-${dish.id}`}
            >
              <div className="aspect-[16/10] sm:aspect-[4/5] overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="h-full w-full object-cover transition-transform duration-[1.4s] ease-luxe group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="p-5 sm:p-6">
                <span className="text-[10px] uppercase tracking-widest2 text-secondary font-medium">
                  {dish.tag}
                </span>
                <h3 className="mt-2.5 font-display text-lg sm:text-xl text-background">{dish.name}</h3>
                <p className="mt-2 text-xs sm:text-sm text-background/60 leading-relaxed line-clamp-2">
                  {dish.description}
                </p>
                <div className="mt-4 sm:mt-5 flex items-center justify-between">
                  <span className="text-secondary font-semibold text-sm">{formatINR(dish.price)}</span>
                  <span className="h-px w-8 group-hover:w-14 group-hover:bg-secondary bg-background/20 transition-all duration-500" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
