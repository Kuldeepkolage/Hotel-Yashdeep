import { useState } from "react";
import { motion } from "framer-motion";
import PageTransition from "../components/common/PageTransition";
import PageHero from "../components/common/PageHero";
import GalleryCard from "../components/gallery/GalleryCard";
import Lightbox from "../components/gallery/Lightbox";
import { GALLERY_IMAGES } from "../constants/content";
import SEO from "../components/SEO";

export default function Gallery() {
  const [lightIdx, setLightIdx] = useState(null);

  const onNav = (dir) => {
    setLightIdx((idx) => {
      if (idx === null) return idx;
      const next = (idx + dir + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
      return next;
    });
  };

  return (
    <PageTransition>
      <SEO
        title="Gallery — Hotel Yashdeep | Yermala, Maharashtra"
        description="Explore the photo gallery of Hotel Yashdeep, showcasing our dining hall, authentic Maharashtrian dishes, beer bar, and highway dining hospitality."
        path="/gallery"
      />
      <PageHero
        eyebrow="Gallery"
        title={<>Inside Yashdeep —<br /><span className="italic text-secondary">light, plates, people.</span></>}
        description="A quiet look around the dining hall, the bar wing, the kitchen and the guests who keep it warm."
        image="/images/hotel-yashdeep/hotel main.png"
        height="short"
      />

      <section className="py-14 sm:py-20 md:py-28" data-testid="gallery-section">
        <div className="container-luxe">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 md:mb-16">
            <span className="eyebrow justify-center">Visual Tour</span>
            <h2 className="heading-md mt-4 font-display">
              Moments, flavours &amp; <span className="italic text-primary">ambience.</span>
            </h2>
            <p className="mt-3 text-sm text-muted leading-relaxed">
              A glimpse into our restaurant, handcrafted plates, warm dining hall, and the hospitality of Hotel Yashdeep.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-5 md:gap-6"
            data-testid="gallery-masonry"
          >
            {GALLERY_IMAGES.map((img, i) => (
              <GalleryCard
                key={img.id}
                image={img}
                index={i}
                onClick={() => setLightIdx(i)}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {lightIdx !== null && (
        <Lightbox
          images={GALLERY_IMAGES}
          index={lightIdx}
          onClose={() => setLightIdx(null)}
          onNav={onNav}
        />
      )}
    </PageTransition>
  );
}
