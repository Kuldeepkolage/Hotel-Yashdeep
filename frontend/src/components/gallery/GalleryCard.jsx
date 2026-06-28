import { motion } from "framer-motion";

export default function GalleryCard({ image, index, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay: (index % 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group relative block w-full overflow-hidden rounded-2xl break-inside-avoid mb-5 md:mb-6"
      data-testid={`gallery-item-${image.id}`}
    >
      <img
        src={image.src}
        alt={image.alt}
        loading="lazy"
        style={{ height: `${image.h}px` }}
        className="w-full object-cover transition-transform duration-[1.4s] ease-luxe group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/0 to-dark/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute bottom-5 left-5 right-5 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 text-background">
        <span className="text-[10px] uppercase tracking-widest2 text-secondary">{image.category}</span>
        <p className="mt-1 font-display text-lg">{image.alt}</p>
      </div>
    </motion.button>
  );
}
