import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect } from "react";

export default function Lightbox({ images, index, onClose, onNav }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav(1);
      if (e.key === "ArrowLeft") onNav(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onNav]);

  const img = images[index];

  return (
    <AnimatePresence>
      {img && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[80] bg-dark/95 backdrop-blur-md flex items-center justify-center p-4 md:p-10"
          onClick={onClose}
          data-testid="lightbox"
        >
          <button
            aria-label="Close"
            className="absolute top-6 right-6 h-12 w-12 inline-flex items-center justify-center rounded-full border border-background/30 text-background hover:border-secondary hover:text-secondary transition-colors"
            onClick={onClose}
            data-testid="lightbox-close"
          >
            <X size={20} />
          </button>
          <button
            aria-label="Previous"
            className="absolute left-4 md:left-8 h-12 w-12 inline-flex items-center justify-center rounded-full border border-background/30 text-background hover:border-secondary hover:text-secondary transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onNav(-1);
            }}
            data-testid="lightbox-prev"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            aria-label="Next"
            className="absolute right-4 md:right-8 h-12 w-12 inline-flex items-center justify-center rounded-full border border-background/30 text-background hover:border-secondary hover:text-secondary transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onNav(1);
            }}
            data-testid="lightbox-next"
          >
            <ArrowRight size={20} />
          </button>
          <motion.img
            key={img.id}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            src={img.src}
            alt={img.alt}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-luxe"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-background/70 text-xs uppercase tracking-widest2">
            {index + 1} / {images.length} · {img.alt}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
