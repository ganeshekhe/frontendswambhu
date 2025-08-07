

import HeroSection from "../components/HeroSection";
import ServicesSection from "../components/ServicesSection";
import HighlightsSection from "../components/HighlightsSection";
import StepsSection from "../components/StepsSection";
// import TestimonialsSection from "../components/TestimonialsSection";
import NoticesSection from "../components/NoticesSection";

import Footer from "../components/Footer";
 import HeroSlider from "../components/HeroSlider";

const Home = () => {
  return (
    <div>
        <HeroSlider /> 
      <HeroSection />
      <ServicesSection />
      <HighlightsSection />
      <StepsSection />
      {/* <TestimonialsSection /> */}
      <NoticesSection />

      <Footer />
    </div>
  );
};

export default Home;
