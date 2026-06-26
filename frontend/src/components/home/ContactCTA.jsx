import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Users, CheckCircle2 } from "lucide-react";
import heroImage from "../../assets/images/hero.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

const infoItems = [
  { icon: MapPin, label: "Address", value: "Yedeshwari Mandir Road, Yermala, Maharashtra" },
  { icon: Phone, label: "Phone", value: "+91 XXXXX XXXXX" },
  { icon: Clock, label: "Open Today", value: "11:00 AM – 10:30 PM" },
];

function ContactCTA() {
  const [form, setForm] = useState({ name: "", phone: "", date: "", time: "", guests: "2" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="relative bg-[#1C0A0A] py-0 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[640px]">

        {/* Left — Image + Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true }}
          className="relative flex flex-col justify-between p-10 lg:p-16 overflow-hidden"
        >
          <img
            src={heroImage}
            alt="Hotel Yashdeep ambience"
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C0A0A] via-[#1C0A0A]/85 to-[#1C0A0A]/60" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-[var(--secondary)]" />
              <span className="text-[11px] uppercase tracking-[5px] text-[var(--secondary)] font-medium">
                Visit Us
              </span>
            </div>
            <h2 className="font-['Playfair_Display'] text-[clamp(2.2rem,4vw,3.4rem)] font-bold leading-[1.12] text-white mb-6">
              A Table Is Always
              <br />
              <span className="italic text-[var(--secondary)]">Being Set for You.</span>
            </h2>
            <p className="max-w-md text-sm leading-[1.9] text-white/60">
              Off the highway in Yermala, ready for families, friends, and travellers — every day, all year round.
            </p>
          </div>

          <div className="relative z-10 flex flex-col gap-5 mt-12">
            {infoItems.map(({ icon: Icon, label, value }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 + 0.2, duration: 0.5 }}
                viewport={{ once: true }}
                className="flex items-start gap-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--secondary)]/15 border border-[var(--secondary)]/25">
                  <Icon size={15} className="text-[var(--secondary)]" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[3px] text-white/35 mb-0.5">{label}</p>
                  <p className="text-sm text-white/75">{value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right — Reservation panel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative bg-[var(--background)] flex items-center p-10 lg:p-16"
        >
          <div className="w-full max-w-md mx-auto">

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center text-center py-16"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary)]/10 mb-6">
                  <CheckCircle2 size={28} className="text-[var(--primary)]" />
                </div>
                <h3 className="font-['Playfair_Display'] text-2xl font-bold text-[var(--text)] mb-3">
                  Request Received
                </h3>
                <p className="text-sm text-[var(--text-light)] leading-relaxed max-w-sm">
                  Thank you, {form.name.split(" ")[0] || "Guest"}. Our team will call you shortly at {form.phone || "your number"} to confirm your table for {form.guests} {form.guests === "1" ? "guest" : "guests"}.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", date: "", time: "", guests: "2" }); }}
                  className="mt-8 text-sm font-semibold text-[var(--primary)] border-b border-[var(--primary)]/30 pb-0.5 hover:border-[var(--primary)] transition-colors duration-200"
                >
                  Make another request
                </button>
              </motion.div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-px w-10 bg-[var(--secondary)]" />
                  <span className="text-[11px] uppercase tracking-[5px] text-[var(--secondary)] font-medium">
                    Reserve
                  </span>
                </div>
                <h3 className="font-['Playfair_Display'] text-3xl font-bold text-[var(--text)] mb-2">
                  Book Your Table
                </h3>
                <p className="text-sm text-[var(--text-light)] mb-9 leading-relaxed">
                  Tell us when you're coming — we'll have it ready.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div>
                    <label className="block text-[11px] uppercase tracking-[2px] text-[var(--text-muted)] mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange("name")}
                      placeholder="Your name"
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none transition-colors duration-200 focus:border-[var(--primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-[2px] text-[var(--text-muted)] mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={handleChange("phone")}
                      placeholder="+91"
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none transition-colors duration-200 focus:border-[var(--primary)]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-[2px] text-[var(--text-muted)] mb-2">
                        Date
                      </label>
                      <input
                        type="date"
                        required
                        value={form.date}
                        onChange={handleChange("date")}
                        className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none transition-colors duration-200 focus:border-[var(--primary)]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-[2px] text-[var(--text-muted)] mb-2">
                        Time
                      </label>
                      <input
                        type="time"
                        required
                        value={form.time}
                        onChange={handleChange("time")}
                        className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none transition-colors duration-200 focus:border-[var(--primary)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-[2px] text-[var(--text-muted)] mb-2">
                      Guests
                    </label>
                    <div className="relative">
                      <Users size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                      <select
                        value={form.guests}
                        onChange={handleChange("guests")}
                        className="w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--surface)] pl-11 pr-4 py-3 text-sm text-[var(--text)] outline-none transition-colors duration-200 focus:border-[var(--primary)]"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                          <option key={n} value={n}>{n} {n === 1 ? "Guest" : "Guests"}</option>
                        ))}
                        <option value="9+">9+ Guests (Group)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="relative mt-2 overflow-hidden rounded-full bg-[var(--primary)] py-[14px] text-sm font-semibold text-white shadow-[0_8px_24px_rgba(122,31,31,0.28)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(122,31,31,0.36)] group"
                  >
                    <span className="relative z-10">Confirm Reservation</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-[var(--primary-light)] to-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default ContactCTA;