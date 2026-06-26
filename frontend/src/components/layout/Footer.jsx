import { NavLink } from "react-router-dom";
import {
MapPin,
Phone,
Clock,
UtensilsCrossed,
} from "lucide-react";

import {
FaInstagram,
FaFacebookF,
FaTwitter,
} from "react-icons/fa";
import { motion } from "framer-motion";

const links = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Menu", path: "/menu" },
  { name: "Gallery", path: "/gallery" },
  { name: "Contact", path: "/contact" },
];

const hours = [
  { day: "Monday – Thursday", time: "11:00 AM – 10:30 PM" },
  { day: "Friday – Saturday", time: "11:00 AM – 11:00 PM" },
  { day: "Sunday", time: "10:00 AM – 10:00 PM" },
];

function Footer() {
  return (
    <footer className="bg-[#1C0A0A] text-white/80">
      {/* Top divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-[var(--secondary)]/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-full bg-[var(--secondary)]/20 border border-[var(--secondary)]/30 flex items-center justify-center">
                <UtensilsCrossed size={16} className="text-[var(--secondary)]" />
              </div>
              <div>
                <p className="font-['Playfair_Display'] text-lg font-bold text-white">Hotel Yashdeep</p>
                <p className="text-[10px] uppercase tracking-[4px] text-[var(--secondary)]/70">Est. Yermala</p>
              </div>
            </div>
            <p className="text-sm leading-7 text-white/50 max-w-xs">
              A family restaurant offering authentic flavours, warm hospitality, and unforgettable dining on the Maharashtra highway.
            </p>

            {/* Social */}
            <div className="flex gap-3 mt-8">
              {[
                { icon: FaInstagram, href: "#" },
                { icon: FaFacebookF, href: "#" },
                { icon: FaTwitter, href: "#" },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:border-[var(--secondary)]/60 hover:bg-[var(--secondary)]/10 transition-all duration-300"
                >
                  <Icon size={15} className="text-white/50 hover:text-[var(--secondary)] transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-['Playfair_Display'] text-sm font-semibold text-white mb-6 tracking-wide">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-3">
              {links.map((link) => (
                <li key={link.name}>
                  <NavLink
                    to={link.path}
                    className="text-sm text-white/50 hover:text-[var(--secondary)] transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-4 h-px bg-[var(--secondary)]/30 group-hover:w-6 group-hover:bg-[var(--secondary)] transition-all duration-300" />
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-['Playfair_Display'] text-sm font-semibold text-white mb-6 tracking-wide">
              Visit Us
            </h4>
            <ul className="flex flex-col gap-5">
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-[var(--secondary)] mt-0.5 shrink-0" />
                <span className="text-sm text-white/50 leading-6">
                  Shop No.1, Yedeshwari Mandir Road,<br />Yermala, Maharashtra
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={15} className="text-[var(--secondary)] shrink-0" />
                <a href="tel:+91XXXXXXXXXX" className="text-sm text-white/50 hover:text-[var(--secondary)] transition-colors duration-200">
                  +91 XXXXX XXXXX
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-['Playfair_Display'] text-sm font-semibold text-white mb-6 tracking-wide">
              Opening Hours
            </h4>
            <ul className="flex flex-col gap-4">
              {hours.map((h, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Clock size={13} className="text-[var(--secondary)] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-white/30 mb-0.5">{h.day}</p>
                    <p className="text-sm text-white/60">{h.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/25">
            © {new Date().getFullYear()} Hotel Yashdeep. All Rights Reserved.
          </p>
          <p className="text-xs text-white/20">
            Crafted with care · Yermala, Maharashtra
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;