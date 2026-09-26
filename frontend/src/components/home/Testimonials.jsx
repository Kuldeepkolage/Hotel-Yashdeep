import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Quote } from "lucide-react";
import { TESTIMONIALS } from "../../constants/content";
import SectionHeading from "../common/SectionHeading";

export default function Testimonials() {
  const [i, setI] = useState(0);
  const t = TESTIMONIALS[i];

  return (
    <section className="py-16 md:py-32 lg:py-40 bg-background border-y border-border" data-testid="testimonials">
      <div className="container-luxe grid lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-16 items-center">
        <SectionHeading
          eyebrow="From our guests"
          title={
            <>
              Stories told<br />
              <span className="italic text-primary">across the table.</span>
            </>
          }
          description="A small selection of the many notes guests have left in our visitors' book over the years."
        />
        <div className="relative">
          <Quote className="text-secondary/40 mb-4 sm:mb-6" size={44} />
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-snug text-dark"
              data-testid="testimonial-quote"
            >
              "{t.quote}"
              <footer className="mt-8 sm:mt-10 text-xs sm:text-sm font-body text-muted uppercase tracking-widest2">
                <span className="text-primary">{t.name}</span> · {t.role}
              </footer>
            </motion.blockquote>
          </AnimatePresence>

          <div className="mt-12 flex items-center gap-3" data-testid="testimonial-dots">
            {TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                aria-label={`Testimonial ${idx + 1}`}
                className={`h-px transition-all duration-500 ${idx === i ? "w-12 bg-primary" : "w-6 bg-border hover:bg-muted"}`}
                data-testid={`testimonial-dot-${idx}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
