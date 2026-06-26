import { motion } from "framer-motion";

function Hero() {
  return (
    <section className="relative flex min-h-screen items-center bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-8">

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 tracking-[8px] text-[var(--secondary)] uppercase"
        >
          Family Restaurant & Bar
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl text-7xl font-bold leading-tight text-[var(--text)]"
        >
          Experience
          <br />
          Authentic
          <br />
          Taste.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 max-w-xl text-lg text-[var(--text-light)]"
        >
          Delicious Veg & Non-Veg cuisine served with tradition,
          warmth and unforgettable hospitality.
        </motion.p>

        <div className="mt-10 flex gap-5">

          <button className="rounded-xl bg-[var(--primary)] px-7 py-4 text-white">
            Explore Menu
          </button>

          <button className="rounded-xl border border-[var(--primary)] px-7 py-4 text-[var(--primary)]">
            Book Table
          </button>

        </div>

      </div>
    </section>
  );
}

export default Hero;