import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import { SITE } from "../../constants/site";

export default function ReservationCTA() {
  return (
    <section
      className="relative py-28 md:py-40 text-background overflow-hidden"
      data-testid="reservation-cta"
    >
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1592861956120-e524fc739696?auto=format&fit=crop&w=2400&q=70"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-dark/75" />
      </div>

      <div className="relative container-luxe grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="eyebrow text-secondary">Tonight, or whenever</span>
          <h2 className="heading-lg mt-6 text-background">
            Settle in.<br />
            <span className="italic text-secondary">We've saved you a chair.</span>
          </h2>
          <p className="mt-7 max-w-lg text-background/70 leading-relaxed">
            From quick highway meals to long, unhurried family dinners — book ahead and walk in to a table already set in your name.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="card-luxe bg-background/5 backdrop-blur border-background/15 p-8 md:p-10"
        >
          <div className="flex items-start gap-4 text-background/80">
            <MapPin size={20} className="mt-1 text-secondary shrink-0" />
            <div>
              <span className="block text-[10px] uppercase tracking-widest2 text-secondary">Address</span>
              <p className="mt-1 text-sm leading-relaxed">{SITE.address}</p>
            </div>
          </div>
          <div className="mt-6 flex items-start gap-4 text-background/80">
            <Calendar size={20} className="mt-1 text-secondary shrink-0" />
            <div>
              <span className="block text-[10px] uppercase tracking-widest2 text-secondary">Open</span>
              <p className="mt-1 text-sm leading-relaxed">All days · 11:00 — 23:00</p>
            </div>
          </div>
          <Link
            to="/reservations"
            className="mt-10 w-full justify-center btn-gold"
            data-testid="home-cta-reserve"
          >
            Book your table
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
