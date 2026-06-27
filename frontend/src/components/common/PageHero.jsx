import { motion } from "framer-motion";
import { cx } from "../../utils/format";

export default function PageHero({
  eyebrow,
  title,
  description,
  image,
  align = "left",
  height = "tall",
}) {
  return (
    <section
      className={cx(
        "relative w-full text-background overflow-hidden",
        height === "tall" ? "min-h-[78svh]" : "min-h-[58svh]"
      )}
      data-testid="page-hero"
    >
      <div className="absolute inset-0">
        <img src={image} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-dark/80 via-dark/55 to-dark/85" />
      </div>
      <div className={cx("relative container-luxe min-h-inherit flex flex-col justify-end pt-40 pb-20", align === "center" && "items-center text-center")}>
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="eyebrow text-secondary"
        >
          {eyebrow}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="heading-xl mt-6 text-background max-w-4xl"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 max-w-xl text-base md:text-lg text-background/70 leading-relaxed"
          >
            {description}
          </motion.p>
        )}
      </div>
    </section>
  );
}
