import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { SITE, NAV_LINKS } from "../../constants/site";

export default function Footer() {
  return (
    <footer
      className="relative bg-dark text-background overflow-hidden"
      data-testid="footer"
    >
      {/* CTA above footer */}
      <div className="container-luxe">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="-translate-y-24 rounded-3xl bg-background text-dark px-8 md:px-16 py-14 md:py-20 shadow-luxe border border-border"
        >
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-14 items-center">
            <div>
              <span className="eyebrow">Plan your visit</span>
              <h3 className="heading-lg mt-5">
                A table waits.<br />
                <span className="italic text-primary">Yours for the evening.</span>
              </h3>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
              <Link to="/reservations" className="btn-primary justify-center" data-testid="footer-cta-reserve">
                Reserve a Table
              </Link>
              <a href={SITE.phoneHref} className="btn-outline justify-center" data-testid="footer-cta-call">
                Call {SITE.phone}
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="container-luxe pb-16 -mt-10">
        <div className="grid gap-12 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-secondary/60">
                <span className="font-display text-secondary text-xl leading-none">Y</span>
              </span>
              <span className="font-display text-2xl">Hotel Yashdeep</span>
            </div>
            <p className="mt-6 text-sm text-background/70 leading-relaxed max-w-xs">
              A Maharashtrian family restaurant and beer bar on the Yermala highway — honest food, warm rooms, since 1997.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <a href={SITE.social.instagram} aria-label="Instagram" className="h-10 w-10 inline-flex items-center justify-center rounded-full border border-background/20 hover:border-secondary hover:text-secondary transition-colors" data-testid="social-instagram">
                <FaInstagram />
              </a>
              <a href={SITE.social.facebook} aria-label="Facebook" className="h-10 w-10 inline-flex items-center justify-center rounded-full border border-background/20 hover:border-secondary hover:text-secondary transition-colors" data-testid="social-facebook">
                <FaFacebookF />
              </a>
              <a href={SITE.social.twitter} aria-label="Twitter" className="h-10 w-10 inline-flex items-center justify-center rounded-full border border-background/20 hover:border-secondary hover:text-secondary transition-colors" data-testid="social-twitter">
                <FaTwitter />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-widest2 text-secondary">Visit</h4>
            <ul className="mt-6 space-y-4 text-sm text-background/75">
              <li className="flex gap-3"><MapPin size={16} className="mt-0.5 shrink-0 text-secondary" /><span>{SITE.address}</span></li>
              <li className="flex gap-3"><Phone size={16} className="mt-0.5 shrink-0 text-secondary" /><a href={SITE.phoneHref} className="hover:text-secondary">{SITE.phone}</a></li>
              <li className="flex gap-3"><Mail size={16} className="mt-0.5 shrink-0 text-secondary" /><a href={`mailto:${SITE.email}`} className="hover:text-secondary">{SITE.email}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-widest2 text-secondary">Quick Links</h4>
            <ul className="mt-6 space-y-3 text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-background/75 hover:text-secondary transition-colors" data-testid={`footer-link-${l.label.toLowerCase()}`}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-widest2 text-secondary">Opening Hours</h4>
            <ul className="mt-6 space-y-3 text-sm">
              {SITE.hours.map((h) => (
                <li key={h.day} className="flex items-start gap-3 text-background/75">
                  <Clock size={16} className="mt-0.5 shrink-0 text-secondary" />
                  <span>
                    <span className="block">{h.day}</span>
                    <span className="text-background/55">{h.time}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-background/10 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between text-xs text-background/55">
          <span>© {new Date().getFullYear()} Hotel Yashdeep. All rights reserved.</span>
          <span>Crafted with care in Yermala, Maharashtra.</span>
        </div>
      </div>
    </footer>
  );
}
