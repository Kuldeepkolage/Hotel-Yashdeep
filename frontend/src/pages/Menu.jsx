import { useMemo, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import PageTransition from "../components/common/PageTransition";
import PageHero from "../components/common/PageHero";
import CategoryFilter from "../components/menu/CategoryFilter";
import MenuCard from "../components/menu/MenuCard";
import { MENU_CATEGORIES, MENU_ITEMS } from "../constants/menu";

export default function Menu() {
  const [active, setActive] = useState("all");

  const items = useMemo(() => {
    if (active === "all") return MENU_ITEMS;
    return MENU_ITEMS.filter((m) => m.category === active);
  }, [active]);

  return (
    <PageTransition>
      <PageHero
        eyebrow="The Menu"
        title={<>Marathwada classics,<br /><span className="italic text-secondary">paired and poured.</span></>}
        description="A focused menu of authentic Maharashtrian plates — vegetarian, non-vegetarian and a bar built to pair with the food, not overshadow it."
        image="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=2200&q=70"
        height="short"
      />

      <section className="py-20 md:py-28" data-testid="menu-section">
        <div className="container-luxe">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14">
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

          <div className="mt-24 max-w-2xl mx-auto text-center">
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
