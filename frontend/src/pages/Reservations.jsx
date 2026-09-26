import { Link } from "react-router-dom";
import PageTransition from "../components/common/PageTransition";
import PageHero from "../components/common/PageHero";
import ReservationForm from "../components/reservation/ReservationForm";
import { SITE } from "../constants/site";
import { Clock, MapPin, Phone, Users, Lock, LogIn, UserPlus } from "lucide-react";
import { useCustomerAuth } from "../context/CustomerAuthContext";
import SEO from "../components/SEO";

export default function Reservations() {
  const { isAuthenticated, loading } = useCustomerAuth();

  return (
    <PageTransition>
      <SEO
        title="Book a Table — Hotel Yashdeep | Reservations"
        description="Reserve your table at Hotel Yashdeep in Yermala, Maharashtra. Guaranteed seating, verified guest dining, family halls, and special occasions."
        path="/reservations"
      />
      <PageHero
        eyebrow="Reservations"
        title={<>Hold a table.<br /><span className="italic text-secondary">Stay a while.</span></>}
        description="Reservations are confirmed manually during opening hours. For same-day bookings within an hour of arrival, please call us directly."
        image="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=2200&q=70"
        height="short"
      />

      <section className="py-10 sm:py-16 md:py-24" data-testid="reservation-section">
        <div className="container-luxe grid lg:grid-cols-[1fr_1.2fr] gap-8 sm:gap-14 lg:gap-20 items-start">
          <div className="lg:sticky lg:top-32">
            <span className="eyebrow">Good to know</span>
            <h2 className="heading-md mt-4 sm:mt-5">
              A few notes before<br />
              <span className="italic text-primary">you arrive.</span>
            </h2>
            <div className="mt-6 sm:mt-8 space-y-5 sm:space-y-6">
              <Info icon={MapPin} title="Find us" text={SITE.address} />
              <Info icon={Phone} title="Call ahead" text={SITE.phone} />
              <Info icon={Clock} title="Open daily" text="Everyday: 11:00 AM — 11:00 PM" />
              <Info icon={Users} title="Larger groups" text="For parties of 10+, please call us to plan the menu and seating." />
            </div>
            <div className="mt-8 sm:mt-12 rounded-2xl border border-border p-5 sm:p-6 bg-white">
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                <span className="text-primary font-semibold">Tip — </span>
                Sunset hours (18:30 onwards) fill quickly on weekends. Reserve at least 24 hours ahead for the best window seats.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="card-luxe p-8 sm:p-12 text-center flex flex-col items-center justify-center min-h-[320px] sm:min-h-[360px]">
              <div className="h-10 w-10 rounded-full border-2 border-secondary/30 border-t-primary animate-spin" />
              <p className="mt-5 text-xs text-muted uppercase tracking-widest2 font-medium">Checking reservation credentials…</p>
            </div>
          ) : isAuthenticated ? (
            <ReservationForm />
          ) : (
            <div
              className="rounded-3xl bg-gradient-to-b from-white via-white to-[#faf6ef] border border-secondary/30 p-6 sm:p-8 md:p-12 text-center shadow-[0_24px_64px_-16px_rgba(44,24,16,0.12)] relative overflow-hidden"
              data-testid="auth-required-card"
            >
              {/* Subtle background glow */}
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-secondary/15 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10">
                {/* Gold Crest */}
                <div className="mx-auto h-16 w-16 rounded-full border-2 border-secondary/60 bg-secondary/10 flex items-center justify-center mb-6 shadow-sm">
                  <Lock size={26} className="text-secondary" />
                </div>

                <span className="eyebrow justify-center">Verified Dining</span>
                <h3 className="heading-md mt-3 font-display">Sign In to Reserve Your Table</h3>
                
                <p className="mt-4 max-w-lg mx-auto text-sm text-muted leading-relaxed">
                  To ensure personalized hospitality and keep your table ready upon arrival, reservations are linked to a verified guest account.
                </p>

                {/* Exclusive Guest Benefits */}
                <div className="my-8 max-w-md mx-auto p-5 rounded-2xl border border-secondary/20 bg-background/60 text-left space-y-3">
                  <div className="flex items-center gap-3 text-xs text-dark/85">
                    <span className="h-5 w-5 rounded-full bg-secondary/20 text-secondary flex items-center justify-center shrink-0 text-[10px] font-bold">✓</span>
                    <span>Guaranteed seating prepared before your arrival</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-dark/85">
                    <span className="h-5 w-5 rounded-full bg-secondary/20 text-secondary flex items-center justify-center shrink-0 text-[10px] font-bold">✓</span>
                    <span>Direct coordination with the chef for dietary or occasion preferences</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-dark/85">
                    <span className="h-5 w-5 rounded-full bg-secondary/20 text-secondary flex items-center justify-center shrink-0 text-[10px] font-bold">✓</span>
                    <span>Real-time email and SMS updates on your booking status</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/login?redirect=/reservations"
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold tracking-wider uppercase transition-all duration-300 shadow-md hover:shadow-xl bg-gradient-to-r from-primary via-[#8a2424] to-primary hover:from-dark hover:to-dark text-white transform active:scale-[0.99]"
                    data-testid="reservation-login-btn"
                  >
                    <LogIn size={16} /> Sign In to Book
                  </Link>
                  <Link
                    to="/signup?redirect=/reservations"
                    className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold tracking-wider uppercase transition-all duration-300 border-2 border-secondary/60 text-dark hover:bg-secondary/15 hover:border-secondary transform active:scale-[0.99]"
                    data-testid="reservation-signup-btn"
                  >
                    <UserPlus size={16} /> Create Account
                  </Link>
                </div>

                <p className="mt-8 text-xs text-muted">
                  Need an urgent same-day table? Call us directly at{" "}
                  <a href={SITE.phoneHref} className="text-primary underline font-semibold">
                    {SITE.phone}
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
}

function Info({ icon: Icon, title, text }) {
  return (
    <div className="flex items-start gap-4">
      <span className="h-11 w-11 rounded-full bg-primary/10 text-primary inline-flex items-center justify-center shrink-0">
        <Icon size={18} />
      </span>
      <div>
        <h4 className="text-[11px] uppercase tracking-widest2 text-muted">{title}</h4>
        <p className="mt-1 text-dark">{text}</p>
      </div>
    </div>
  );
}
