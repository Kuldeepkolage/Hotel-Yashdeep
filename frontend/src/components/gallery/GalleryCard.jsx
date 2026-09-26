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
        className="w-full h-auto object-cover transition-transform duration-[1.2s] ease-luxe group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-dark/85 via-dark/20 to-transparent opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 text-left translate-y-0 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 transition-all duration-500 text-background">
        <span className="text-[10px] sm:text-[11px] uppercase tracking-widest2 text-secondary font-medium">{image.category}</span>
        <p className="mt-1 font-display text-sm sm:text-base md:text-lg leading-snug drop-shadow-sm">{image.alt}</p>
      </div>
    </motion.button>
  );
}
