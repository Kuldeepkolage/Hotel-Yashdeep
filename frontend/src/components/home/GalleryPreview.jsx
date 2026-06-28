import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "../common/SectionHeading";
import { GALLERY_IMAGES } from "../../constants/content";

export default function GalleryPreview() {
  const items = GALLERY_IMAGES.slice(0, 5);

  return (
    <section className="py-28 md:py-40" data-testid="gallery-preview">
      <div className="container-luxe">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <SectionHeading
            eyebrow="A look inside"
            title={
              <>
                Moments from our<br />
                <span className="italic text-primary">dining hall.</span>
              </>
            }
          />
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 self-start md:self-end text-sm text-dark border-b border-dark/30 pb-1 hover:text-primary hover:border-primary transition-colors"
            data-testid="gallery-preview-link"
          >
            Open gallery <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-6 grid-rows-2 gap-4 md:gap-5 h-[500px] md:h-[640px]">
          {items.map((img, i) => {
            const spans = [
              "col-span-3 row-span-2",
              "col-span-3 row-span-1",
              "col-span-2 row-span-1",
              "col-span-2 row-span-1",
              "col-span-2 row-span-1",
            ];
            return (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.9, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className={`${spans[i]} overflow-hidden rounded-2xl group`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="h-full w-full object-cover transition-transform duration-[1.4s] ease-luxe group-hover:scale-110"
                  loading="lazy"
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
