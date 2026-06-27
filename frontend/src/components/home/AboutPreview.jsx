import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "../common/SectionHeading";

export default function AboutPreview() {
  return (
    <section className="py-28 md:py-40" data-testid="about-preview">
      <div className="container-luxe grid lg:grid-cols-2 gap-14 lg:gap-24 items-center">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="aspect-[4/5] overflow-hidden rounded-2xl"
          >
            <img
              src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=70"
              alt="Hotel Yashdeep dining"
              className="h-full w-full object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -bottom-8 -right-4 md:-right-12 w-44 md:w-56 aspect-[4/5] overflow-hidden rounded-2xl border-8 border-background shadow-luxe hidden sm:block"
          >
            <img
              src="https://images.unsplash.com/photo-1604908554007-91d5b5e3f4c8?auto=format&fit=crop&w=900&q=70"
              alt="Thali detail"
              className="h-full w-full object-cover"
            />
          </motion.div>
          <div className="absolute -top-6 -left-6 hidden md:flex flex-col items-center">
            <span className="h-16 w-px bg-secondary" />
            <span className="text-[10px] uppercase tracking-widest2 text-secondary mt-3 rotate-180 [writing-mode:vertical-rl]">
              Since 1997
            </span>
          </div>
        </div>

        <div>
          <SectionHeading
            eyebrow="Our Story"
            title={
              <>
                Twenty-eight years on a quiet highway —
                <span className="italic text-primary"> still cooking the way it was taught.</span>
              </>
            }
            description="What began as a small dhaba on the road to Yedeshwari has grown into a full family restaurant and beer bar. The masalas are still hand-ground, the bhakris still wood-charred, the welcome still the same."
          />
          <div className="mt-10 grid grid-cols-2 gap-6 max-w-md">
            <div>
              <div className="font-display text-4xl text-primary">28<span className="text-secondary">+</span></div>
              <div className="text-xs uppercase tracking-widest2 text-muted mt-2">Years of Service</div>
            </div>
            <div>
              <div className="font-display text-4xl text-primary">60<span className="text-secondary">+</span></div>
              <div className="text-xs uppercase tracking-widest2 text-muted mt-2">Recipes on the Menu</div>
            </div>
          </div>
          <Link
            to="/about"
            className="mt-12 inline-flex items-center gap-2 text-sm tracking-wide text-dark border-b border-dark/30 pb-1 hover:text-primary hover:border-primary transition-colors"
            data-testid="about-preview-link"
          >
            Read our story <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
