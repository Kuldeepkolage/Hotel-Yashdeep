import Hero from "../components/home/Hero";
import AboutSection from "../components/home/AboutSection";
import FeaturedDishes from "../components/home/FeaturedDishes";
import GallerySection from "../components/home/GallerySection";
import Testimonials from "../components/home/Testimonials";
import ContactCTA from "../components/home/ContactCTA";

function Home() {
  return (
    <>
      <Hero />
      <AboutSection />
      <FeaturedDishes />
      <GallerySection />
      <Testimonials />
      <ContactCTA />
    </>
  );
}

export default Home;