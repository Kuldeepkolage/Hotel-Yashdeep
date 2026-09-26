import { useEffect, useMemo, useState } from "react";
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
  const [menuList, setMenuList] = useState(MENU_ITEMS);

  useEffect(() => {
    let activeEffect = true;
    async function fetchLiveMenu() {
      try {
        const res = await fetch("/api/menu");
        if (!res.ok) return;
        const json = await res.json();
        const apiData = json?.data;
        if (Array.isArray(apiData) && apiData.length > 0 && activeEffect) {
          const mapped = apiData.map((m) => {
            let cat = "nonveg";
            if (m.isVeg) cat = "veg";
            else if (["Beer", "Beverage", "Mocktail"].includes(m.category)) cat = "beer";

            let tag = "";
            if (m.isSpecial) tag = "Signature";
            else if (m.isRecommended) tag = "Chef's Pick";
            else if (m.tag) tag = m.tag;

            return {
              id: m._id || m.id,
              name: m.name,
              category: cat,
              rawCategory: m.category,
              price: m.price,
              description: m.description,
              tag,
              isRecommended: Boolean(m.isRecommended),
              isSpecial: Boolean(m.isSpecial),
              image: m.image || m.image_url || "/images/hotel-yashdeep/hotel main.png",
              available: m.available !== false,
            };
          });
          setMenuList(mapped);
        }
      } catch (err) {
        // Silently fallback to MENU_ITEMS
      }
    }
    fetchLiveMenu();
    return () => { activeEffect = false; };
  }, []);

  const items = useMemo(() => {
    let list = menuList;
    if (active === "recommended") {
      return list.filter((m) => m.isRecommended || m.isSpecial || m.tag === "Chef's Pick" || m.tag === "Signature");
    }
    if (active !== "all") {
      list = list.filter((m) => m.category?.toLowerCase() === active.toLowerCase());
    }
    return list;
  }, [active, menuList]);

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
        description="Handcrafted Maharashtrian specialties, fresh dam fish, and a chilled beer bar on the Yermala highway."
        image="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=2200&q=70"
        height="short"
      />

      <section className="py-6 sm:py-12 md:py-20" data-testid="menu-section">
        <div className="container-luxe">
          {/* Header & Sticky Filter Bar */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 sm:gap-8 mb-6 sm:mb-10">
            <div className="max-w-xl">
              <span className="eyebrow">Browse by mood</span>
              <h2 className="heading-md mt-2 sm:mt-4 font-display">
                Handcrafted plates &amp; <span className="italic text-primary">chilled brews.</span>
              </h2>
            </div>
            <div className="sticky top-20 z-30 bg-background/95 backdrop-blur-md py-2.5 -mx-4 px-4 sm:mx-0 sm:px-0 sm:static border-b border-border/60 sm:border-0 shadow-xs sm:shadow-none">
              <LayoutGroup>
                <CategoryFilter
                  categories={MENU_CATEGORIES}
                  active={active}
                  onChange={setActive}
                />
              </LayoutGroup>
            </div>
          </div>

          {/* Menu Items Grid - Compact on mobile */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-8"
              data-testid="menu-grid"
            >
              {items.map((m, i) => (
                <MenuCard key={m.id} item={m} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>

          {items.length === 0 && (
            <p className="text-center text-muted mt-10">No items in this category yet.</p>
          )}

          {/* In-Person Full Menu Reassurance Banner - Concise for mobile */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 sm:mt-16 md:mt-20 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1c1815] via-[#15110e] to-[#0c0908] border border-secondary/30 p-5 sm:p-8 md:p-12 text-background shadow-xl"
          >
            <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-3xl">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-secondary bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
                <Sparkles size={13} className="text-secondary" /> Visit Us In Person
              </span>
              <h3 className="mt-3 font-display text-xl sm:text-2xl md:text-3xl text-background leading-snug">
                This is only a curated sample — <br className="hidden sm:inline" />
                <span className="italic text-secondary">our full restaurant &amp; bar has everything!</span>
              </h3>
              <p className="mt-2.5 text-xs sm:text-sm text-background/80 leading-relaxed font-light">
                Our physical restaurant in Yermala offers over <strong className="text-secondary font-medium">60+ authentic Maharashtrian dishes</strong>, fresh Chilapi dam catch, tandoor starters, Chinese specials, thalis, and a complete bar counter with all major whiskeys, spirits, and chilled beers.
              </p>

              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-white/10 text-center sm:text-left">
                <div>
                  <span className="block font-display text-xl sm:text-2xl text-secondary">60+</span>
                  <span className="text-[10px] sm:text-xs text-background/70 uppercase tracking-wider">Dishes &amp; Thalis</span>
                </div>
                <div>
                  <span className="block font-display text-xl sm:text-2xl text-secondary">Daily</span>
                  <span className="text-[10px] sm:text-xs text-background/70 uppercase tracking-wider">Fresh Fish Catch</span>
                </div>
                <div>
                  <span className="block font-display text-xl sm:text-2xl text-secondary">Full</span>
                  <span className="text-[10px] sm:text-xs text-background/70 uppercase tracking-wider">Bar &amp; Chilled Beer</span>
                </div>
                <div>
                  <span className="block font-display text-xl sm:text-2xl text-secondary">Family</span>
                  <span className="text-[10px] sm:text-xs text-background/70 uppercase tracking-wider">AC &amp; Dining Hall</span>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link
                  to="/reservations"
                  className="btn-gold inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase px-5 py-2.5"
                >
                  Reserve a Table <ArrowRight size={14} />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 text-xs font-medium text-background/90 hover:text-secondary border border-white/20 hover:border-secondary px-4 py-2.5 rounded-full transition-colors"
                >
                  <MapPin size={14} /> Location &amp; Directions
                </Link>
              </div>
            </div>
          </motion.div>

          <div className="mt-12 sm:mt-16 max-w-xl mx-auto text-center">
            <span className="divider-gold" />
            <p className="mt-4 font-display italic text-lg sm:text-xl text-dark">
              "Menus are written by the season — ask your server about today's specials."
            </p>
            <p className="mt-2 text-[10px] uppercase tracking-widest2 text-muted">— The Yashdeep Kitchen</p>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
