import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";
import { SITE, NAV_LINKS } from "../../constants/site";
import { useCMS } from "../../context/CMSContext";

export default function Footer() {
  const { cms } = useCMS();

  const addr = cms?.contact?.address;
  const addressText = addr?.line1
    ? [addr.line1, addr.line2, addr.city, addr.state, addr.pincode].filter(Boolean).join(", ")
    : SITE.address;
  const phone = cms?.contact?.phone || SITE.phone;
  const phoneHref = cms?.contact?.phone ? `tel:${cms.contact.phone.replace(/\s+/g, "")}` : SITE.phoneHref;
  const email = cms?.contact?.email || SITE.email;
  const tagline = cms?.footer?.tagline || "Authentic Maharashtrian family restaurant, fresh dam fish, and chilled beer bar on the Yermala highway — honest cooking and warm hospitality.";
  const copyrightName = cms?.footer?.copyrightName || "Hotel Yashdeep";

  return (
    <footer
      className="relative bg-[#20120C] text-background pt-12 md:pt-16 pb-12 overflow-hidden border-t border-secondary/15"
      data-testid="footer"
    >
      <div className="container-luxe">
        <div className="grid gap-10 md:gap-12 lg:grid-cols-[1.2fr_1fr_1.4fr] items-start">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-secondary/60 bg-secondary/10 shadow-sm">
                <span className="font-display text-secondary text-xl leading-none font-bold">Y</span>
              </span>
              <div>
                <span className="block font-display text-2xl tracking-wide text-background">{copyrightName}</span>
                <span className="block text-[10px] uppercase tracking-widest text-secondary font-medium">Yermala · Est. 2023</span>
              </div>
            </div>
            <p className="mt-5 text-sm text-background/70 leading-relaxed max-w-sm">
              {tagline}
            </p>
          </div>

          {/* Visit / Contact Column */}
          <div>
            <h4 className="text-[11px] uppercase tracking-widest2 text-secondary font-semibold">Visit Us</h4>
            <ul className="mt-5 space-y-3.5 text-sm text-background/75">
              <li className="flex gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0 text-secondary" />
                <span>{addressText}</span>
              </li>
              <li className="flex gap-3">
                <Phone size={16} className="mt-0.5 shrink-0 text-secondary" />
                <a href={phoneHref} className="hover:text-secondary transition-colors font-medium">
                  {phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail size={16} className="mt-0.5 shrink-0 text-secondary" />
                <a href={`mailto:${email}`} className="hover:text-secondary transition-colors">
                  {email}
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links Column (Rendered Side by Side) */}
          <div>
            <h4 className="text-[11px] uppercase tracking-widest2 text-secondary font-semibold mb-4">
              Quick Links
            </h4>
            <ul className="flex flex-wrap items-center gap-x-6 sm:gap-x-7 gap-y-3 text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "instant" })}
                    className="text-background/80 hover:text-secondary transition-colors inline-block py-1 hover:underline underline-offset-4 font-medium"
                    data-testid={`footer-link-${l.label.toLowerCase()}`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Credit */}
        <div className="mt-12 pt-8 border-t border-background/10 flex flex-col sm:flex-row gap-4 items-center justify-between text-xs text-background/55">
          <span>© {new Date().getFullYear()} Hotel Yashdeep. All rights reserved.</span>
          <span>Developed by <b className="text-secondary/80">Kuldeep Kolage</b></span>
        </div>
      </div>
    </footer>
  );
}
