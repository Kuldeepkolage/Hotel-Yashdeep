import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Phone, Star } from "lucide-react";
import { SITE } from "../../constants/site";

export default function Hero() {
  return (
    <section
      className="relative min-h-[100svh] w-full overflow-hidden text-background"
      data-testid="hero-section"
    >
      <div className="absolute inset-0">
        <img
          src="/images/hotel-yashdeep/hotel main.png"          
          alt="Hotel Yashdeep ambience"
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark/85 via-dark/55 to-dark/90" />
        <div className="absolute inset-0 bg-grain opacity-50" />
      </div>

      <div className="relative container-luxe min-h-[100svh] flex flex-col">
        <div className="flex-1 grid lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-10 items-end pt-28 sm:pt-32 pb-12 sm:pb-16">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.15 } } }}
          >
            <motion.span
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } } }}
              className="eyebrow text-secondary"
            >
              Est. 2023 · Yermala, Maharashtra
            </motion.span>

            <motion.h1
              variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] } } }}
              className="heading-xl mt-4 sm:mt-7 text-background"
            >
              The slow taste<br />
              of the <span className="italic text-secondary">Marathwada</span><br />
              highway.
            </motion.h1>

            <motion.p
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] } } }}
              className="mt-4 sm:mt-6 max-w-xl text-sm sm:text-base md:text-lg text-background/80 leading-relaxed"
            >
              Authentic Maharashtrian family dining, fresh daily dam catch, and a chilled beer bar on the Yermala highway.
            </motion.p>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] } } }}
              className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 max-w-md sm:max-w-none"
            >
              <Link to="/reservations" className="btn-gold justify-center shadow-md hover:shadow-lg" data-testid="hero-reserve-btn">
                Reserve a Table <ArrowRight size={16} />
              </Link>
              <a href={SITE.phoneHref} className="inline-flex items-center justify-center gap-2 rounded-full border border-background/30 px-6 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-sm text-background hover:border-secondary hover:text-secondary transition-colors duration-500" data-testid="hero-call-btn">
                <Phone size={14} /> {SITE.phone}
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block"
          >
            <div className="border-l border-background/20 pl-8 max-w-xs ml-auto">
              <div className="flex items-center gap-1 text-secondary">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="mt-5 font-display text-2xl text-background leading-snug">
                "We've stopped here on every drive for years. The puran poli is unmatched."
              </p>
              <p className="mt-5 text-xs uppercase tracking-widest2 text-background/60">
                Aarti Deshmukh — Pune
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="border-t border-background/15 py-5 sm:py-6 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-background/80"
        >
          {[
            { k: "Cuisine", v: "Maharashtrian · Veg · Non-Veg" },
            { k: "Bar", v: "Curated Beer Selection" },
            { k: "Seating", v: "120 Guests · Family Hall" },
            { k: "Open", v: "11:00 — 23:00, Daily" },
          ].map((s) => (
            <div key={s.k}>
              <span className="block text-[10px] uppercase tracking-widest2 text-secondary/80">{s.k}</span>
              <span className="mt-2 block text-sm">{s.v}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
