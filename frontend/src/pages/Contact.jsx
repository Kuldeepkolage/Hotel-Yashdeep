import { useState } from "react";
import { motion } from "framer-motion";
import PageTransition from "../components/common/PageTransition";
import PageHero from "../components/common/PageHero";
import { Input, Textarea } from "../components/common/Input";
import { SITE } from "../constants/site";
import { MapPin, Phone, Mail, Send, Check } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = "Please share your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Enter a valid email.";
    if (!form.message.trim() || form.message.trim().length < 8)
      errs.message = "A short note (8+ characters) helps us respond.";
    if (Object.keys(errs).length) return setErrors(errs);
    setErrors({});
    setTimeout(() => setSent(true), 500);
  };

  return (
    <PageTransition>
      <PageHero
        eyebrow="Contact"
        title={<>Stop in, ring up,<br /><span className="italic text-secondary">or drop a note.</span></>}
        description="Questions, large bookings, or just need directions off the highway — we're here."
        image="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2200&q=70"
        height="short"
      />

      {/* Contact cards */}
      <section className="py-20 md:py-28" data-testid="contact-cards">
        <div className="container-luxe grid md:grid-cols-3 gap-6">
          {[
            { icon: MapPin, title: "Visit us", lines: [SITE.address], cta: { label: "Get directions", href: SITE.mapEmbed } },
            { icon: Phone, title: "Call us", lines: [SITE.phone, "Daily, 10:00 — 23:00"], cta: { label: "Tap to call", href: SITE.phoneHref } },
            { icon: Mail, title: "Email us", lines: [SITE.email, "Replies within 24 hours"], cta: { label: "Send a message", href: `mailto:${SITE.email}` } },
          ].map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="card-luxe p-8 md:p-10 hover:border-primary/30 hover:shadow-luxe group"
              data-testid={`contact-card-${i}`}
            >
              <span className="h-12 w-12 rounded-full bg-primary/10 text-primary inline-flex items-center justify-center">
                <c.icon size={18} />
              </span>
              <h3 className="mt-7 font-display text-2xl text-dark">{c.title}</h3>
              {c.lines.map((l) => (
                <p key={l} className="mt-2 text-muted text-sm leading-relaxed">{l}</p>
              ))}
              <a
                href={c.cta.href}
                target={c.cta.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="mt-7 inline-flex items-center gap-2 text-sm border-b border-dark/30 pb-1 text-dark hover:text-primary hover:border-primary transition-colors"
              >
                {c.cta.label}
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Form + Map */}
      <section className="pb-28 md:pb-40" data-testid="contact-form-map">
        <div className="container-luxe grid lg:grid-cols-2 gap-10">
          <div className="card-luxe p-8 md:p-10">
            <span className="eyebrow">Drop a note</span>
            <h2 className="heading-md mt-5">Tell us what you need.</h2>

            {sent ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mt-10 flex flex-col items-center text-center"
                data-testid="contact-success"
              >
                <span className="h-14 w-14 rounded-full bg-secondary/15 text-secondary inline-flex items-center justify-center">
                  <Check size={24} />
                </span>
                <h3 className="font-display text-xl mt-6 text-dark">Thank you, {form.name}.</h3>
                <p className="mt-3 text-muted text-sm max-w-sm">
                  Your note is on its way to our inbox. We typically reply within 24 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={onSubmit} className="mt-10 space-y-7" data-testid="contact-form">
                <Input label="Name" name="name" value={form.name} onChange={onChange} error={errors.name} placeholder="Your name" />
                <Input label="Email" name="email" type="email" value={form.email} onChange={onChange} error={errors.email} placeholder="you@email.com" />
                <Textarea label="Message" name="message" rows={5} value={form.message} onChange={onChange} error={errors.message} placeholder="A few words about your visit, booking or enquiry…" />
                <button type="submit" className="btn-primary" data-testid="contact-submit">
                  Send message <Send size={16} />
                </button>
              </form>
            )}
          </div>

          <div className="overflow-hidden rounded-2xl border border-border min-h-[480px] bg-white">
            <iframe
              title="Hotel Yashdeep location"
              src={SITE.mapEmbed}
              className="w-full h-full min-h-[480px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              data-testid="contact-map"
            />
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
