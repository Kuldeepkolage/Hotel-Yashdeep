import { motion } from "framer-motion";
import PageTransition from "../components/common/PageTransition";
import PageHero from "../components/common/PageHero";
import SectionHeading from "../components/common/SectionHeading";
import { STATS, TIMELINE, VALUES } from "../constants/content";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function About() {
  return (
    <PageTransition>
      <PageHero
        eyebrow="Our story · Since 2020"
        title={<>A family. A highway.<br /><span className="italic text-secondary">A kitchen that never stopped.</span></>}
        description="From a single tandoor on the Yermala highway to a full-service family restaurant and beer bar — every plate still passes through the same hands that began this story almost three decades ago."
        image="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2200&q=70"
      />

      {/* Story */}
      <section className="py-28 md:py-40" data-testid="about-story">
        <div className="container-luxe grid lg:grid-cols-[1fr_1.2fr] gap-14 lg:gap-20">
          <SectionHeading
            eyebrow="The Story"
            title={<>Built on hand-ground masalas and unhurried evenings.</>}
          />
          <div className="space-y-6 text-muted leading-relaxed text-base md:text-lg">
            <p>
              Yashdeep was founded in 2020 by the Kolage family, who set up a small dhaba beside the Yedeshwari Mandir road. The plan was modest — feed travellers warm, honest Maharashtrian food on their way to Tuljapur.
            </p>
            <p>
              Twenty-eight years later, the dhaba has grown into a full family restaurant with a dedicated beer bar wing, a quiet courtyard for unhurried meals, and a kitchen that still treats every plate as if a traveller was waiting at the door.
            </p>
            <p>
              We've kept things the same where it matters: the masalas are still hand-ground, the bhakris still wood-charred, the recipes still passed down rather than printed.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 md:py-32 bg-dark text-background" data-testid="about-mission">
        <div className="container-luxe grid lg:grid-cols-2 gap-14 items-center">
          <SectionHeading
            light
            eyebrow="Our Mission"
            title={<>To make the highway feel like<br /><span className="italic text-secondary">someone's home.</span></>}
          />
          <p className="text-background/70 leading-relaxed text-lg">
            We believe a restaurant on a highway carries a quiet responsibility — to be the warm room a tired traveller didn't know they needed. Our mission is to keep that promise on every plate, every shift, every evening.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 md:py-24 border-y border-border bg-background" data-testid="about-stats">
        <div className="container-luxe grid grid-cols-2 md:grid-cols-4 gap-10">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="font-display text-5xl md:text-6xl text-primary">{s.value}</div>
              <div className="mt-4 text-[11px] uppercase tracking-widest2 text-muted">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-28 md:py-40" data-testid="about-values">
        <div className="container-luxe">
          <SectionHeading
            eyebrow="What we hold to"
            title={<>Values that show up on the plate.</>}
            className="max-w-3xl"
          />
          <div className="mt-16 grid md:grid-cols-2 gap-6">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="card-luxe p-8 md:p-10 hover:border-primary/40 hover:shadow-luxe"
              >
                <span className="text-[11px] uppercase tracking-widest2 text-secondary">0{i + 1}</span>
                <h3 className="mt-4 font-display text-2xl text-dark">{v.title}</h3>
                <p className="mt-4 text-muted leading-relaxed">{v.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-28 md:py-40 bg-background border-t border-border" data-testid="about-timeline">
        <div className="container-luxe">
          <SectionHeading
            eyebrow="A short timeline"
            title={<>Four chapters,<br /><span className="italic text-primary">one kitchen.</span></>}
          />
          <div className="mt-20 relative">
            <span className="absolute left-3 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-16 md:space-y-24">
              {TIMELINE.map((t, i) => (
                <motion.div
                  key={t.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.9, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className={`relative pl-12 md:pl-0 md:grid md:grid-cols-2 md:gap-16 ${i % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""}`}
                >
                  <span className="absolute left-0 md:left-1/2 md:-translate-x-1/2 top-2 h-6 w-6 rounded-full bg-background border-2 border-secondary flex items-center justify-center">
                    <span className="h-2 w-2 rounded-full bg-secondary" />
                  </span>
                  <div className={i % 2 === 1 ? "md:text-right md:pr-12" : "md:pl-12"}>
                    <span className="font-display text-5xl text-primary">{t.year}</span>
                    <h3 className="mt-3 font-display text-2xl text-dark">{t.title}</h3>
                  </div>
                  <div className={i % 2 === 1 ? "md:pl-12" : "md:text-right md:pr-12"}>
                    <p className="text-muted leading-relaxed mt-6 md:mt-3">{t.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Owner message */}
      <section className="py-28 md:py-40 bg-dark text-background" data-testid="about-owner">
        <div className="container-luxe grid lg:grid-cols-[1fr_1.4fr] gap-14 items-center">
          <div className="aspect-[4/5] overflow-hidden rounded-2xl max-w-sm">
            <img
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=900&q=70"
              alt="Owner"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <span className="eyebrow text-secondary">A note from the family</span>
            <blockquote className="mt-7 font-display text-2xl md:text-4xl leading-snug text-background">
              "When my father started Yashdeep, he wanted travellers to feel like family. That's still the brief. Everything else is just menu."
            </blockquote>
            <footer className="mt-10 text-sm uppercase tracking-widest2 text-secondary">
              Kishan Kolage & Yogita Kolage · Owner
            </footer>
            <Link to="/reservations" className="btn-gold mt-10" data-testid="about-cta-reserve">
              Reserve your table <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
