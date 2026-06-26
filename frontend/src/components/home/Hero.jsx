import { motion } from "framer-motion";
import { ChevronDown, Star } from "lucide-react";
import heroImage from "../../assets/images/hero.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

function Hero() {
  return (
    <section className="relative min-h-screen bg-[var(--background)] overflow-hidden">

      {/* Decorative background shapes */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-[0.06]"
        style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 -left-24 w-[400px] h-[400px] rounded-full opacity-[0.05]"
        style={{ background: "radial-gradient(circle, var(--secondary) 0%, transparent 70%)" }}
      />
      {/* Decorative thin lines */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 left-0 w-full h-px opacity-[0.06]"
        style={{ background: "linear-gradient(90deg, transparent, var(--primary) 40%, transparent)" }}
      />

      {/* Main grid */}
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-16 px-6 pt-28 pb-16 lg:grid-cols-2 lg:px-10 lg:pt-24 lg:pb-0">

        {/* Left — Copy */}
        <div className="flex flex-col">

          {/* Eyebrow pill */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.1}
            className="inline-flex items-center gap-2 self-start mb-7"
          >
            <span className="flex h-1.5 w-1.5 rounded-full bg-[var(--secondary)]" />
            <span className="text-[11px] font-medium uppercase tracking-[5px] text-[var(--secondary)]">
              Family Restaurant &amp; Bar · Yermala
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.25}
            className="font-['Playfair_Display'] text-[clamp(3rem,6vw,5.25rem)] font-bold leading-[1.07] text-[var(--text)] mb-7"
          >
            Where Every
            <br />
            <span className="italic text-[var(--primary)]">Meal</span> Tells
            <br />
            a Story.
          </motion.h1>

          {/* Divider */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.35}
            className="flex items-center gap-3 mb-7"
          >
            <div className="h-px w-12 bg-[var(--secondary)]" />
            <span className="font-['Cormorant_Garamond'] text-base italic text-[var(--text-muted)] tracking-wide">
              Authentic Veg &amp; Non-Veg Cuisine
            </span>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.42}
            className="max-w-md text-base leading-[1.85] text-[var(--text-light)] mb-10"
          >
            Nestled on the Maharashtra highway, Hotel Yashdeep serves generations of
            families with warm hospitality, authentic Maharashtrian flavours, and a
            dining experience that stays with you long after the last bite.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.52}
            className="flex flex-wrap gap-4 mb-12"
          >
            <button className="relative overflow-hidden rounded-full bg-[var(--primary)] px-8 py-[14px] text-sm font-semibold text-white shadow-[0_8px_24px_rgba(122,31,31,0.28)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(122,31,31,0.36)] group">
              <span className="relative z-10">Explore Our Menu</span>
              <span className="absolute inset-0 bg-gradient-to-r from-[var(--primary-light)] to-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            <button className="rounded-full border border-[var(--primary)]/40 px-8 py-[14px] text-sm font-semibold text-[var(--primary)] transition-all duration-300 hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] hover:-translate-y-1">
              Reserve a Table
            </button>
          </motion.div>

          {/* Social proof */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.62}
            className="flex items-center gap-4"
          >
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--border)] to-[var(--background-deep)] border-2 border-white shadow-sm"
                />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 mb-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={11} fill="var(--secondary)" stroke="none" />
                ))}
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                <span className="font-semibold text-[var(--text)]">10,000+</span> happy guests
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right — Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, x: 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex justify-center lg:justify-end"
        >
          {/* Decorative frame behind image */}
          <div
            aria-hidden
            className="absolute top-6 right-6 w-full h-full max-w-[520px] rounded-[40px] border border-[var(--secondary)]/20"
          />

          {/* Main image */}
          <div className="float-anim relative w-full max-w-[520px]">
            <img
              src={heroImage}
              alt="Hotel Yashdeep dining experience"
              className="w-full h-[580px] lg:h-[680px] rounded-[40px] object-cover shadow-[0_32px_80px_rgba(58,28,28,0.22)]"
            />

            {/* Overlay gradient */}
            <div className="absolute inset-0 rounded-[40px] bg-gradient-to-t from-[var(--text)]/30 via-transparent to-transparent" />

            {/* Floating badge — bottom left */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md rounded-2xl px-5 py-4 shadow-xl"
            >
              <p className="text-[10px] uppercase tracking-[3px] text-[var(--secondary)] mb-1">Today's Special</p>
              <p className="font-['Playfair_Display'] text-sm font-bold text-[var(--text)]">Special Veg Thali</p>
              <p className="text-xs text-[var(--text-muted)]">₹ 250 · Serves 1</p>
            </motion.div>

            {/* Floating badge — top right */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              className="absolute -top-5 -right-5 bg-[var(--secondary)] text-white rounded-2xl px-4 py-3 shadow-xl hidden lg:block"
            >
              <p className="font-['Playfair_Display'] text-2xl font-bold leading-none">Veg</p>
              <p className="font-['Playfair_Display'] text-2xl font-bold leading-none italic">&amp; Non-Veg</p>
              <p className="text-[9px] uppercase tracking-[2px] mt-1 opacity-80">Cuisine</p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[4px] text-[var(--text-muted)]">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={16} className="text-[var(--text-muted)]" />
        </motion.div>
      </motion.div>
    </section>
  );
}

export default Hero;