import PageTransition from "../components/common/PageTransition";
import Hero from "../components/home/Hero";
import AboutPreview from "../components/home/AboutPreview";
import FeaturedDishes from "../components/home/FeaturedDishes";
import GalleryPreview from "../components/home/GalleryPreview";
import Testimonials from "../components/home/Testimonials";
import ReservationCTA from "../components/home/ReservationCTA";
import SEO from "../components/SEO";

export default function Home() {
  return (
    <PageTransition>
      <SEO
        title="Hotel Yashdeep — Yermala, Maharashtra"
        description="Hotel Yashdeep — Authentic Maharashtrian family restaurant, beer bar and highway dining in Yermala, Maharashtra."
        path="/"
      />

      <Hero />
      <AboutPreview />
      <FeaturedDishes />
      <GalleryPreview />
      <Testimonials />
      <ReservationCTA />
    </PageTransition>
  );
}