import PageTransition from "../components/common/PageTransition";
import Hero from "../components/home/Hero";
import AboutPreview from "../components/home/AboutPreview";
import FeaturedDishes from "../components/home/FeaturedDishes";
import GalleryPreview from "../components/home/GalleryPreview";
import Testimonials from "../components/home/Testimonials";
import ReservationCTA from "../components/home/ReservationCTA";

export default function Home() {
  return (
    <PageTransition>
      <Hero />
      <AboutPreview />
      <FeaturedDishes />
      <GalleryPreview />
      <Testimonials />
      <ReservationCTA />
    </PageTransition>
  );
}
