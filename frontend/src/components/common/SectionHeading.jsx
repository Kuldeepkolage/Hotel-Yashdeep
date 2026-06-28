import { motion } from "framer-motion";
import { fadeUp } from "../../utils/motion";
import { cx } from "../../utils/format";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  light = false,
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className={cx(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <span className={cx("eyebrow", light && "text-secondary")}>
          {eyebrow}
        </span>
      )}
      <h2
        className={cx(
          "heading-lg mt-5",
          light && "text-background"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cx(
            "mt-6 text-base md:text-lg leading-relaxed",
            light ? "text-background/70" : "text-muted"
          )}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
