import { motion } from "framer-motion";
import PageTransition from "../components/common/PageTransition";
import PageHero from "../components/common/PageHero";
import SectionHeading from "../components/common/SectionHeading";
import { STATS, VALUES } from "../constants/content";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SEO from "../components/SEO";

export default function About() {
  return (
    <PageTransition>
      <SEO
  title="About Hotel Yashdeep — Yermala, Maharashtra"
  description="Learn about Hotel Yashdeep, an authentic Maharashtrian family restaurant, beer bar and highway dining destination in Yermala, Maharashtra."
  path="/about"
/>
      <PageHero
        eyebrow="Our story · Since 2020"
        title={<>A family. A highway.<br /><span className="italic text-secondary">A kitchen that never stopped.</span></>}
        description="From a single tandoor on the Yermala highway to a full-service family restaurant and beer bar — every plate still passes through the same hands that began this story almost three decades ago."
        image="/images/hotel-yashdeep/bar-counter.jpeg"
      />

      {/* Story */}
      <section className="py-14 sm:py-20 md:py-32" data-testid="about-story">
        <div className="container-luxe grid lg:grid-cols-[1fr_1.2fr] gap-8 sm:gap-14 lg:gap-20">
          <SectionHeading
            eyebrow="The Story"
            title={<>Built on hand-ground masalas and unhurried evenings.</>}
          />
          <div className="space-y-5 sm:space-y-6 text-muted leading-relaxed text-sm sm:text-base md:text-lg">
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
      <section className="py-14 sm:py-20 md:py-28 bg-dark text-background" data-testid="about-mission">
        <div className="container-luxe grid lg:grid-cols-2 gap-8 sm:gap-14 items-center">
          <SectionHeading
            light
            eyebrow="Our Mission"
            title={<>To make the highway feel like<br /><span className="italic text-secondary">someone's home.</span></>}
          />
          <p className="text-background/70 leading-relaxed text-sm sm:text-base md:text-lg">
            We believe a restaurant on a highway carries a quiet responsibility — to be the warm room a tired traveller didn't know they needed. Our mission is to keep that promise on every plate, every shift, every evening.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 sm:py-16 md:py-20 border-y border-border bg-background" data-testid="about-stats">
        <div className="container-luxe grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="font-display text-4xl sm:text-5xl md:text-6xl text-primary">{s.value}</div>
              <div className="mt-2.5 sm:mt-4 text-[10px] sm:text-[11px] uppercase tracking-widest2 text-muted">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-14 sm:py-20 md:py-32" data-testid="about-values">
        <div className="container-luxe">
          <SectionHeading
            eyebrow="What we hold to"
            title={<>Values that show up on the plate.</>}
            className="max-w-3xl"
          />
          <div className="mt-10 sm:mt-16 grid md:grid-cols-2 gap-5 sm:gap-6">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="card-luxe p-6 sm:p-8 md:p-10 hover:border-primary/40 hover:shadow-luxe"
              >
                <span className="text-[11px] uppercase tracking-widest2 text-secondary">0{i + 1}</span>
                <h3 className="mt-3 sm:mt-4 font-display text-xl sm:text-2xl text-dark">{v.title}</h3>
                <p className="mt-3 sm:mt-4 text-muted text-sm sm:text-base leading-relaxed">{v.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Owner message */}
      <section className="py-14 sm:py-20 md:py-32 bg-dark text-background" data-testid="about-owner">
        <div className="container-luxe grid lg:grid-cols-[1fr_1.4fr] gap-8 sm:gap-14 items-center">
          <div className="aspect-[4/5] overflow-hidden rounded-2xl max-w-sm">
            <img
              src="/images/hotel-yashdeep/couple-portrait.jpeg"
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
