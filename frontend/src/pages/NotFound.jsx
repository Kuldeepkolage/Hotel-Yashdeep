import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageTransition from "../components/common/PageTransition";

export default function NotFound() {
  return (
    <PageTransition>
      <section className="min-h-[100svh] flex items-center bg-background relative overflow-hidden" data-testid="notfound-page">
        <div className="absolute inset-0 bg-grain opacity-30" />
        <div className="container-luxe relative text-center max-w-2xl mx-auto py-40">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="eyebrow"
          >
            404 · Off the highway
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="heading-xl mt-7"
          >
            That page took a<br />
            <span className="italic text-primary">wrong turn.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-8 text-muted leading-relaxed"
          >
            We couldn't find the page you were looking for. Step back into the dining room and we'll start over.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-3"
          >
            <Link to="/" className="btn-primary" data-testid="notfound-home-btn">Return home</Link>
            <Link to="/menu" className="btn-outline" data-testid="notfound-menu-btn">See the menu</Link>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
}
