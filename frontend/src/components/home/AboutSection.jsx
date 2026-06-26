import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import heroImage from "../../assets/images/hero.jpg";

const stats = [
  { value: "10K+", label: "Happy Guests" },
  { value: "Veg &", label: "Non-Veg Cuisine" },
  { value: "Family", label: "Restaurant & Bar" },
  { value: "Highway", label: "Yermala Landmark" },
];

const highlights = [
  "Authentic Maharashtrian recipes passed through generations",
  "Warm, spacious seating for families and groups",
  "Beer Bar with a curated selection",
  "Ideal stopover for highway travellers",
];

function AboutSection() {
  return (
    <section className="relative bg-[var(--surface)] py-28 overflow-hidden">

      {/* Background accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 w-1/2 h-full opacity-[0.03]"
        style={{ background: "radial-gradient(ellipse at right top, var(--primary) 0%, transparent 65%)" }}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-20 lg:grid-cols-2">

          {/* Image column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Decorative box */}
            <div
              aria-hidden
              className="absolute -bottom-6 -left-6 w-48 h-48 rounded-3xl border border-[var(--secondary)]/20"
            />

            <img
              src={heroImage}
              alt="Hotel Yashdeep interior"
              className="relative z-10 w-full h-[580px] rounded-[36px] object-cover shadow-[0_24px_64px_rgba(58,28,28,0.14)]"
            />

            {/* Experience card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              viewport={{ once: true }}
              className="absolute -bottom-8 right-6 z-20 bg-[var(--primary)] text-white rounded-2xl px-6 py-5 shadow-xl"
            >
              <p className="font-['Cormorant_Garamond'] text-5xl font-bold leading-none">15+</p>
              <p className="text-xs mt-1 uppercase tracking-[3px] opacity-80">Years of</p>
              <p className="text-sm font-medium opacity-90">Warm Hospitality</p>
            </motion.div>
          </motion.div>

          {/* Copy column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-[var(--secondary)]" />
              <span className="text-[11px] uppercase tracking-[5px] text-[var(--secondary)] font-medium">
                Our Story
              </span>
            </div>

            <h2 className="font-['Playfair_Display'] text-[clamp(2.2rem,4vw,3.5rem)] font-bold leading-[1.1] text-[var(--text)] mb-6">
              More Than a Meal —<br />
              <span className="italic text-[var(--primary)]">A Family Tradition.</span>
            </h2>

            <p className="text-base leading-[1.9] text-[var(--text-light)] mb-5">
              Hotel Yashdeep was born from a simple belief: that great food, served with love, has the power to bring people together.
              Nestled along the highway in Yermala, we've been welcoming families, couples, travellers, and locals for over a decade.
            </p>
            <p className="text-base leading-[1.9] text-[var(--text-light)] mb-10">
              From hearty Maharashtrian thalis to sizzling non-veg platters and a laid-back bar atmosphere, every visit to Yashdeep is an experience unto itself.
            </p>

            {/* Highlights */}
            <ul className="flex flex-col gap-3 mb-12">
              {highlights.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.2, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 size={17} className="text-[var(--secondary)] mt-0.5 shrink-0" />
                  <span className="text-sm text-[var(--text-light)] leading-relaxed">{item}</span>
                </motion.li>
              ))}
            </ul>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-[var(--border)]">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 + 0.3, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <p className="font-['Playfair_Display'] text-2xl font-bold text-[var(--primary)] mb-1">
                    {stat.value}
                  </p>
                  <p className="text-xs uppercase tracking-[2px] text-[var(--text-muted)]">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;