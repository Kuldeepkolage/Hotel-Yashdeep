import { useMemo, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import PageTransition from "../components/common/PageTransition";
import PageHero from "../components/common/PageHero";
import CategoryFilter from "../components/menu/CategoryFilter";
import MenuCard from "../components/menu/MenuCard";
import { Link } from "react-router-dom";
import { Sparkles, MapPin, ArrowRight } from "lucide-react";
import { MENU_CATEGORIES, MENU_ITEMS } from "../constants/menu";
import SEO from "../components/SEO";

export default function Menu() {
  const [active, setActive] = useState("all");

  const items = useMemo(() => {
    if (active === "all") return MENU_ITEMS;
    return MENU_ITEMS.filter((m) => m.category?.toLowerCase() === active.toLowerCase());
  }, [active]);

  return (
    <PageTransition>
      <SEO
        title="Menu — Hotel Yashdeep | Maharashtrian Specialties & Bar"
        description="Explore our menu of authentic Maharashtrian dishes, vegetarian and non-vegetarian specialties, thalis, and curated bar drinks."
        path="/menu"
      />
      <PageHero
        eyebrow="The Menu"
        title={<>Marathwada classics,<br /><span className="italic text-secondary">paired and poured.</span></>}
        description="A focused menu of authentic Maharashtrian plates — vegetarian, non-vegetarian and a bar built to pair with the food, not overshadow it."
        image="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=2200&q=70"
        height="short"
      />

      <section className="py-14 sm:py-20 md:py-28" data-testid="menu-section">
        <div className="container-luxe">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 sm:gap-8 mb-10 sm:mb-14">
            <div className="max-w-xl">
              <span className="eyebrow">Browse the kitchen</span>
              <h2 className="heading-md mt-5">
                Choose by mood —<br />
                <span className="italic text-primary">vegetarian, meat or a chilled glass.</span>
              </h2>
            </div>
            <LayoutGroup>
              <CategoryFilter
                categories={MENU_CATEGORIES}
                active={active}
                onChange={setActive}
              />
            </LayoutGroup>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              data-testid="menu-grid"
            >
              {items.map((m, i) => (
                <MenuCard key={m.id} item={m} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>

          {items.length === 0 && (
            <p className="text-center text-muted mt-12">No items in this category yet.</p>
          )}

          {/* In-Person Full Menu Reassurance Banner */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-16 sm:mt-20 md:mt-24 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1c1815] via-[#15110e] to-[#0c0908] border border-secondary/30 p-7 sm:p-10 md:p-14 text-background shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-3xl">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest2 text-secondary bg-secondary/10 px-3.5 py-1.5 rounded-full border border-secondary/20">
                <Sparkles size={14} className="text-secondary" /> Visit Us In Person
              </span>
              <h3 className="mt-4 font-display text-2xl sm:text-3xl md:text-4xl text-background leading-tight">
                This is only a curated preview online — <br />
                <span className="italic text-secondary">our full restaurant &amp; bar has everything!</span>
              </h3>
              <p className="mt-4 text-sm sm:text-base text-background/80 leading-relaxed font-light">
                What you see here on our website is just a small handpicked selection of highway favorites. When you dine in at Hotel Yashdeep in Yermala, explore our comprehensive dining menu with over <strong className="text-secondary font-medium">60+ authentic Maharashtrian specialties</strong>, fresh daily dam fish catches, sizzling tandoor platters, hearty veg curries &amp; thalis, Chinese starters, and a fully stocked bar counter featuring all premium whiskeys, chilled beers, and spirits.
              </p>

              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-white/10">
                <div>
                  <span className="block font-display text-2xl sm:text-3xl text-secondary">60+</span>
                  <span className="text-xs text-background/70 uppercase tracking-wider">Dishes &amp; Thalis</span>
                </div>
                <div>
                  <span className="block font-display text-2xl sm:text-3xl text-secondary">Daily</span>
                  <span className="text-xs text-background/70 uppercase tracking-wider">Fresh Fish Catch</span>
                </div>
                <div>
                  <span className="block font-display text-2xl sm:text-3xl text-secondary">Full</span>
                  <span className="text-xs text-background/70 uppercase tracking-wider">Bar &amp; Chilled Beer</span>
                </div>
                <div>
                  <span className="block font-display text-2xl sm:text-3xl text-secondary">Family</span>
                  <span className="text-xs text-background/70 uppercase tracking-wider">AC &amp; Garden Dining</span>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/reservations"
                  className="btn-gold inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wider uppercase px-6 py-3"
                >
                  Reserve Your Table <ArrowRight size={16} />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-background/90 hover:text-secondary border border-white/20 hover:border-secondary px-5 py-3 rounded-full transition-colors"
                >
                  <MapPin size={16} /> Highway Location &amp; Directions
                </Link>
              </div>
            </div>
          </motion.div>

          <div className="mt-20 max-w-2xl mx-auto text-center">
            <span className="divider-gold" />
            <p className="mt-6 font-display italic text-2xl text-dark">
              "Menus are written by the season — ask your server about today's specials."
            </p>
            <p className="mt-4 text-xs uppercase tracking-widest2 text-muted">— The Yashdeep Kitchen</p>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
