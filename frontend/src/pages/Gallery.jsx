import { useMemo, useState } from "react";
import { AnimatePresence, motion, LayoutGroup } from "framer-motion";
import PageTransition from "../components/common/PageTransition";
import PageHero from "../components/common/PageHero";
import CategoryFilter from "../components/menu/CategoryFilter";
import GalleryCard from "../components/gallery/GalleryCard";
import Lightbox from "../components/gallery/Lightbox";
import { GALLERY_CATEGORIES, GALLERY_IMAGES } from "../constants/content";

export default function Gallery() {
  const [active, setActive] = useState("all");
  const [lightIdx, setLightIdx] = useState(null);

  const items = useMemo(() => {
    if (active === "all") return GALLERY_IMAGES;
    return GALLERY_IMAGES.filter((g) => g.category === active);
  }, [active]);

  const onNav = (dir) => {
    setLightIdx((idx) => {
      if (idx === null) return idx;
      const next = (idx + dir + items.length) % items.length;
      return next;
    });
  };

  return (
    <PageTransition>
      <PageHero
        eyebrow="Gallery"
        title={<>Inside Yashdeep —<br /><span className="italic text-secondary">light, plates, people.</span></>}
        description="A quiet look around the dining hall, the bar wing, the kitchen and the guests who keep it warm."
        image="https://images.unsplash.com/photo-1592861956120-e524fc739696?auto=format&fit=crop&w=2200&q=70"
        height="short"
      />

      <section className="py-20 md:py-28" data-testid="gallery-section">
        <div className="container-luxe">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-14">
            <h2 className="heading-md max-w-xl">
              Browse by <span className="italic text-primary">moment.</span>
            </h2>
            <LayoutGroup>
              <CategoryFilter
                categories={GALLERY_CATEGORIES}
                active={active}
                onChange={setActive}
              />
            </LayoutGroup>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="columns-1 sm:columns-2 lg:columns-3 gap-5 md:gap-6"
              data-testid="gallery-masonry"
            >
              {items.map((img, i) => (
                <GalleryCard
                  key={img.id}
                  image={img}
                  index={i}
                  onClick={() => setLightIdx(i)}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>


    {lightIdx !== null && (
      <Lightbox
        images={items}
        index={lightIdx}
        onClose={() => setLightIdx(null)}
        onNav={onNav}
      />
    )}
    </PageTransition>
  );
}
