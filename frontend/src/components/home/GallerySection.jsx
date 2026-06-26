import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, ChevronLeft, ChevronRight, Expand } from "lucide-react";
import heroImage from "../../assets/images/hero.jpg";

const categories = ["All", "Ambience", "Food & Bar", "Outdoor & Garden", "Celebrations"];

const galleryItems = [
  {
    id: 1,
    title: "The Main Dining Hall",
    category: "Ambience",
    image: heroImage,
    size: "tall",
    description: "Our grand dining hall — warm lanterns, arched ceilings, and memories made across generations.",
  },
  {
    id: 2,
    title: "Sizzling Tandoor Platter",
    category: "Food & Bar",
    image: heroImage,
    size: "wide",
    description: "Flame-kissed kebabs and tikkas, served straight from our clay tandoor.",
  },
  {
    id: 3,
    title: "Evenings at the Beer Bar",
    category: "Food & Bar",
    image: heroImage,
    size: "normal",
    description: "A laid-back bar atmosphere with curated beers and the best company.",
  },
  {
    id: 4,
    title: "Garden Seating at Dusk",
    category: "Outdoor & Garden",
    image: heroImage,
    size: "normal",
    description: "Open skies, fresh air, and a table under the stars.",
  },
  {
    id: 5,
    title: "Private Dining Room",
    category: "Celebrations",
    image: heroImage,
    size: "tall",
    description: "Intimate and elegant — perfect for anniversaries, milestones, and quiet celebrations.",
  },
  {
    id: 6,
    title: "Family Table, Sunday Lunch",
    category: "Ambience",
    image: heroImage,
    size: "normal",
    description: "Sunday lunches here are a ritual — big family, bigger thalis.",
  },
  {
    id: 7,
    title: "Highway Façade by Night",
    category: "Ambience",
    image: heroImage,
    size: "wide",
    description: "A landmark on the Maharashtra highway, glowing warm against the night sky.",
  },
  {
    id: 8,
    title: "Birthdays at Yashdeep",
    category: "Celebrations",
    image: heroImage,
    size: "normal",
    description: "From little ones to grandparents — we make every birthday unforgettable.",
  },
  {
    id: 9,
    title: "Open-Air Garden Bar",
    category: "Outdoor & Garden",
    image: heroImage,
    size: "normal",
    description: "Sip your favourite drink surrounded by greenery and soft evening light.",
  },
];

const sizeClasses = {
  tall: "row-span-2",
  wide: "md:col-span-2",
  normal: "",
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

function GallerySection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filtered =
    activeCategory === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxIndex]);

  useEffect(() => {
    const handleKey = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight")
        setLightboxIndex((i) => (i + 1) % filtered.length);
      if (e.key === "ArrowLeft")
        setLightboxIndex((i) => (i - 1 + filtered.length) % filtered.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, filtered.length]);

  return (
    <section className="relative bg-[var(--background)] py-28 overflow-hidden">

      {/* Decorative radial */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/4 -left-32 w-[480px] h-[480px] rounded-full opacity-[0.05]"
        style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 w-[360px] h-[360px] rounded-full opacity-[0.04]"
        style={{ background: "radial-gradient(circle, var(--secondary) 0%, transparent 70%)" }}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-10">

        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={0}
            className="flex items-center gap-3 mb-5"
          >
            <div className="h-px w-10 bg-[var(--secondary)]" />
            <span className="text-[11px] uppercase tracking-[5px] text-[var(--secondary)] font-medium">
              Gallery
            </span>
            <div className="h-px w-10 bg-[var(--secondary)]" />
          </motion.div>

          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={0.1}
            className="font-['Playfair_Display'] text-[clamp(2rem,4vw,3.25rem)] font-bold text-[var(--text)] leading-tight mb-5"
          >
            Moments Worth Remembering
          </motion.h2>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={0.18}
            className="max-w-lg text-base text-[var(--text-light)] leading-[1.85]"
          >
            A glimpse into our dining rooms, our garden, our bar, and the
            everyday moments that make Hotel Yashdeep feel like home.
          </motion.p>
        </div>

        {/* Category Filter */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          custom={0.26}
          className="flex flex-wrap items-center justify-center gap-3 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[2px] transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-[var(--primary)] text-white shadow-[0_8px_20px_rgba(122,31,31,0.25)]"
                  : "bg-[var(--surface)] text-[var(--text-light)] border border-[var(--border)] hover:border-[var(--primary)]/40 hover:text-[var(--primary)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Bento Grid */}
        <div className="grid auto-rows-[220px] grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, index) => (
              <motion.button
                key={item.id}
                layout
                onClick={() => setLightboxIndex(index)}
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className={`group relative overflow-hidden rounded-[24px] text-left shadow-[0_4px_24px_rgba(58,28,28,0.08)] hover:shadow-[0_20px_48px_rgba(58,28,28,0.18)] transition-shadow duration-500 ${sizeClasses[item.size]}`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Base gradient always visible */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--text)]/70 via-[var(--text)]/10 to-transparent" />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary)]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Expand icon */}
                <div className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <Expand size={14} className="text-white" />
                </div>

                {/* Label */}
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-1 group-hover:translate-y-0 transition-transform duration-400">
                  <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[2px] text-[var(--secondary)] font-semibold mb-1.5">
                    <Camera size={11} />
                    {item.category}
                  </span>
                  <p className="font-['Playfair_Display'] text-base font-semibold text-white leading-snug">
                    {item.title}
                  </p>
                  <p className="text-xs text-white/60 mt-1 leading-relaxed max-h-0 group-hover:max-h-10 overflow-hidden transition-all duration-500">
                    {item.description}
                  </p>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* View Gallery CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          custom={0}
          className="flex justify-center mt-14"
        >
          <button className="group flex items-center gap-3 rounded-full border border-[var(--primary)]/30 px-8 py-[13px] text-sm font-semibold text-[var(--primary)] transition-all duration-300 hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] hover:shadow-[0_8px_24px_rgba(122,31,31,0.25)] hover:-translate-y-0.5">
            <span>View Full Gallery</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </button>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && filtered[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1C0A0A]/90 backdrop-blur-lg px-6"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Close */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 z-10"
              aria-label="Close gallery"
            >
              <X size={18} className="text-white" />
            </button>

            {/* Counter */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[3px] text-white/40 z-10">
              {lightboxIndex + 1} / {filtered.length}
            </div>

            {/* Prev */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((i) => (i - 1 + filtered.length) % filtered.length);
              }}
              className="absolute left-4 md:left-8 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} className="text-white" />
            </button>

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full"
            >
              <img
                src={filtered[lightboxIndex].image}
                alt={filtered[lightboxIndex].title}
                className="w-full max-h-[72vh] rounded-[28px] object-cover shadow-[0_40px_100px_rgba(0,0,0,0.6)]"
              />
              <div className="mt-6 text-center">
                <span className="text-[11px] uppercase tracking-[4px] text-[var(--secondary)] font-medium">
                  {filtered[lightboxIndex].category}
                </span>
                <p className="font-['Playfair_Display'] text-xl font-semibold text-white mt-2">
                  {filtered[lightboxIndex].title}
                </p>
                <p className="text-sm text-white/40 mt-1 max-w-md mx-auto leading-relaxed">
                  {filtered[lightboxIndex].description}
                </p>
              </div>
            </motion.div>

            {/* Next */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((i) => (i + 1) % filtered.length);
              }}
              className="absolute right-4 md:right-8 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
              aria-label="Next image"
            >
              <ChevronRight size={20} className="text-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default GallerySection;