import PageTransition from "../components/common/PageTransition";
import PageHero from "../components/common/PageHero";
import ReservationForm from "../components/reservation/ReservationForm";
import { SITE } from "../constants/site";
import { Clock, MapPin, Phone, Users } from "lucide-react";

export default function Reservations() {
  return (
    <PageTransition>
      <PageHero
        eyebrow="Reservations"
        title={<>Hold a table.<br /><span className="italic text-secondary">Stay a while.</span></>}
        description="Reservations are confirmed manually during opening hours. For same-day bookings within an hour of arrival, please call us directly."
        image="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=2200&q=70"
        height="short"
      />

      <section className="py-20 md:py-28" data-testid="reservation-section">
        <div className="container-luxe grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-start">
          <div className="lg:sticky lg:top-32">
            <span className="eyebrow">Good to know</span>
            <h2 className="heading-md mt-5">
              A few notes before<br />
              <span className="italic text-primary">you arrive.</span>
            </h2>
            <div className="mt-10 space-y-7">
              <Info icon={MapPin} title="Find us" text={SITE.address} />
              <Info icon={Phone} title="Call ahead" text={SITE.phone} />
              <Info icon={Clock} title="Open daily" text="11:00 — 23:00 (24:00 Fri/Sat)" />
              <Info icon={Users} title="Larger groups" text="For parties of 10+, please call us to plan the menu and seating." />
            </div>
            <div className="mt-12 rounded-2xl border border-border p-6 bg-white">
              <p className="text-sm text-muted leading-relaxed">
                <span className="text-primary">Tip — </span>
                Sunset hours (18:30 onwards) fill quickly on weekends. Reserve at least 24 hours ahead for the best window seats.
              </p>
            </div>
          </div>
          <ReservationForm />
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
