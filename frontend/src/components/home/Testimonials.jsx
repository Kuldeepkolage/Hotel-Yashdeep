import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Anjali Deshmukh",
    role: "Family Sunday Lunch",
    initials: "AD",
    rating: 5,
    quote:
      "Three generations of our family sat at one table and everyone, from my grandmother to my niece, found something they loved. That's rare.",
    highlight: "Three generations",
  },
  {
    name: "Rohit & Priya Kulkarni",
    role: "Anniversary Dinner",
    initials: "RK",
    rating: 5,
    quote:
      "The private dining area made our anniversary feel special without feeling formal. The staff remembered our order from last time.",
    highlight: "Staff remembered our order",
  },
  {
    name: "Vikram Sawant",
    role: "Highway Stopover",
    initials: "VS",
    rating: 5,
    quote:
      "I stop here every time I drive to Solapur. The thali is consistent, the parking is easy, and it never feels like a roadside compromise.",
    highlight: "Never feels like a roadside compromise",
  },
  {
    name: "Snehal Patil",
    role: "Friends' Evening",
    initials: "SP",
    rating: 4,
    quote:
      "The beer bar has a relaxed, garden feel that's hard to find nearby. We came for drinks and stayed for the Chicken Handi.",
    highlight: "Relaxed, garden feel",
  },
  {
    name: "Mahesh Joshi",
    role: "Corporate Group Dinner",
    initials: "MJ",
    rating: 5,
    quote:
      "Booked the private hall for a 20-person team dinner. Service was prompt, the room was ready before us, and nothing felt rushed.",
    highlight: "Nothing felt rushed",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

function StarRating({ count, total = 5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(total)].map((_, i) => (
        <Star
          key={i}
          size={13}
          fill={i < count ? "var(--secondary)" : "none"}
          stroke={i < count ? "var(--secondary)" : "var(--border)"}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

function Testimonials() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setActive((i) => (i + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setActive((i) => (i - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [paused, next]);

  const current = testimonials[active];

  return (
    <section
      className="relative bg-[var(--surface)] py-28 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Decorative accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 w-[520px] h-[520px] rounded-full opacity-[0.04]"
        style={{ background: "radial-gradient(circle, var(--secondary) 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-32 w-[400px] h-[400px] rounded-full opacity-[0.03]"
        style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)" }}
      />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-10">

        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
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
              Guest Voices
            </span>
            <div className="h-px w-10 bg-[var(--secondary)]" />
          </motion.div>

          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={0.1}
            className="font-['Playfair_Display'] text-[clamp(2rem,4vw,3.25rem)] font-bold text-[var(--text)] leading-tight"
          >
            Words From Our Table
          </motion.h2>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr] items-start">

          {/* Spotlight Quote Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative rounded-[32px] bg-[var(--background)] border border-[var(--border)] overflow-hidden"
          >
            {/* Decorative top bar */}
            <div className="h-1 w-full bg-gradient-to-r from-[var(--primary)] via-[var(--secondary)] to-[var(--primary)]" />

            <div className="px-10 py-12 md:px-14 md:py-14 min-h-[380px] flex flex-col justify-between">

              {/* Quote icon */}
              <div className="absolute top-8 left-8 opacity-[0.12]">
                <Quote size={52} fill="var(--secondary)" className="text-[var(--secondary)]" />
              </div>

              {/* Animated content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="relative z-10 mt-6"
                >
                  <p className="font-['Cormorant_Garamond'] text-[clamp(1.25rem,2.5vw,1.75rem)] italic leading-[1.55] text-[var(--text)] mb-10">
                    &ldquo;{current.quote}&rdquo;
                  </p>

                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)] to-[#9B2C2C] text-white font-['Playfair_Display'] text-lg font-bold shadow-md">
                      {current.initials}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-['Playfair_Display'] text-base font-bold text-[var(--text)] truncate">
                        {current.name}
                      </p>
                      <p className="text-[11px] uppercase tracking-[2px] text-[var(--text-muted)] mt-0.5">
                        {current.role}
                      </p>
                    </div>

                    <StarRating count={current.rating} />
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Controls */}
              <div className="relative z-10 flex items-center justify-between mt-10 pt-8 border-t border-[var(--border)]">
                <div className="flex items-center gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      aria-label={`Show testimonial ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-400 ${
                        i === active
                          ? "w-8 bg-[var(--primary)]"
                          : "w-2 bg-[var(--border)] hover:bg-[var(--secondary)]/50"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={prev}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all duration-200"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft size={15} />
                  </button>
                  <button
                    onClick={next}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all duration-200"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mini List */}
          <div className="flex flex-col gap-3">
            {testimonials.map((t, i) => (
              <motion.button
                key={i}
                onClick={() => setActive(i)}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true }}
                className={`group text-left rounded-2xl px-5 py-4 border transition-all duration-300 ${
                  i === active
                    ? "border-[var(--primary)] bg-[var(--background)] shadow-[0_8px_24px_rgba(122,31,31,0.10)]"
                    : "border-[var(--border)] bg-transparent hover:border-[var(--secondary)]/40 hover:bg-[var(--background)]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold font-['Playfair_Display'] transition-colors duration-300 ${
                        i === active
                          ? "bg-[var(--primary)] text-white"
                          : "bg-[var(--background-deep)] text-[var(--text-muted)] group-hover:bg-[var(--primary)]/10 group-hover:text-[var(--primary)]"
                      }`}
                    >
                      {t.initials}
                    </div>
                    <p className="font-['Playfair_Display'] text-sm font-bold text-[var(--text)]">
                      {t.name}
                    </p>
                  </div>
                  <StarRating count={t.rating} />
                </div>
                <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed pl-11">
                  {t.quote}
                </p>
              </motion.button>
            ))}

            {/* Overall rating badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="mt-2 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[#9B2C2C] px-6 py-5 flex items-center gap-5"
            >
              <div>
                <p className="font-['Playfair_Display'] text-4xl font-bold text-white leading-none">4.9</p>
                <div className="flex items-center gap-0.5 mt-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={11} fill="var(--secondary)" stroke="none" />
                  ))}
                </div>
              </div>
              <div className="border-l border-white/20 pl-5">
                <p className="text-sm font-semibold text-white">Average Rating</p>
                <p className="text-xs text-white/55 mt-0.5">Based on 10,000+ guest visits</p>
                <p className="text-[11px] uppercase tracking-[2px] text-[var(--secondary)] mt-2 font-medium">
                  Google · Zomato · Direct
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;