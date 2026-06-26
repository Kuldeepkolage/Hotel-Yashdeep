import { motion } from "framer-motion";
import { Leaf, Drumstick } from "lucide-react";
import heroImage from "../../assets/images/hero.jpg";

const dishes = [
  {
    title: "Special Veg Thali",
    description: "A royal spread of dal, sabzi, roti, rice, papad, pickle and dessert — the complete Maharashtrian meal.",
    price: "₹250",
    image: heroImage,
    veg: true,
    tag: "Chef's Pick",
  },
  {
    title: "Chicken Handi",
    description: "Slow-cooked tender chicken in a rich, aromatic gravy — the kind of dish that brings the whole table to silence.",
    price: "₹420",
    image: heroImage,
    veg: false,
    tag: "Best Seller",
  },
  {
    title: "Paneer Tikka",
    description: "Flame-kissed cottage cheese marinated in spiced yogurt, served with mint chutney and sliced onions.",
    price: "₹280",
    image: heroImage,
    veg: true,
    tag: "Popular",
  },
];

function FeaturedDishes() {
  return (
    <section className="relative bg-[var(--background)] py-28 overflow-hidden">

      {/* Subtle top gradient line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-10">

        {/* Section header */}
        <div className="flex flex-col items-center text-center mb-18">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-5"
          >
            <div className="h-px w-10 bg-[var(--secondary)]" />
            <span className="text-[11px] uppercase tracking-[5px] text-[var(--secondary)] font-medium">Signature Dishes</span>
            <div className="h-px w-10 bg-[var(--secondary)]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="font-['Playfair_Display'] text-[clamp(2rem,4vw,3.25rem)] font-bold text-[var(--text)] leading-tight mb-5"
          >
            Dishes Worth Coming Back For
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-lg text-base text-[var(--text-light)] leading-[1.85]"
          >
            Every dish on our menu is crafted from scratch, using recipes that have stood the test of time and the approval of thousands of guests.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid gap-8 mt-16 md:grid-cols-2 lg:grid-cols-3">
          {dishes.map((dish, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.12 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="group relative bg-[var(--surface)] rounded-[28px] overflow-hidden shadow-[0_4px_24px_rgba(58,28,28,0.06)] hover:shadow-[0_20px_56px_rgba(58,28,28,0.14)] transition-shadow duration-500"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={dish.image}
                  alt={dish.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Tag */}
                <div className="absolute top-4 left-4 bg-[var(--secondary)] text-white text-[10px] font-semibold uppercase tracking-[2px] px-3 py-1 rounded-full shadow">
                  {dish.tag}
                </div>

                {/* Veg/Non-Veg badge */}
                <div className={`absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold shadow-md backdrop-blur-sm ${
                  dish.veg
                    ? "bg-green-50/90 text-green-700 border border-green-200"
                    : "bg-red-50/90 text-red-700 border border-red-200"
                }`}>
                  {dish.veg ? <Leaf size={11} /> : <Drumstick size={11} />}
                  {dish.veg ? "Veg" : "Non Veg"}
                </div>
              </div>

              {/* Content */}
              <div className="p-7">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-['Playfair_Display'] text-xl font-bold text-[var(--text)]">
                    {dish.title}
                  </h3>
                  <span className="font-['Playfair_Display'] text-lg font-bold text-[var(--primary)] shrink-0">
                    {dish.price}
                  </span>
                </div>

                <p className="text-sm leading-[1.8] text-[var(--text-light)] mb-7">
                  {dish.description}
                </p>

                <button className="w-full rounded-full border border-[var(--primary)]/30 py-3 text-sm font-semibold text-[var(--primary)] transition-all duration-300 hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] hover:shadow-[0_8px_20px_rgba(122,31,31,0.25)]">
                  View Full Menu
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex justify-center mt-14"
        >
          <button className="flex items-center gap-2 text-sm font-semibold text-[var(--primary)] border-b border-[var(--primary)]/30 pb-0.5 hover:border-[var(--primary)] transition-colors duration-200">
            View All Dishes
            <span className="text-base">→</span>
          </button>
        </motion.div>

      </div>
    </section>
  );
}

export default FeaturedDishes;