
import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://swambhu-backend.onrender.com";

const HeroSlider = () => {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/heroslides`);

      // ✅ FILTER only slides which have an image
      const validSlides = res.data.filter(
        (slide) => slide.image && slide.image.filename
      );

      setSlides(validSlides);
    } catch (err) {
      console.error("Error fetching slides:", err);
    }
  };

  useEffect(() => {
    if (slides.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [slides]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // ✅ Hide entire slider if no image-backed slides are available
  if (slides.length === 0) {
    return null; // Hide component completely
  }

  const currentSlide = slides[currentIndex];
  const imageURL = `${BASE_URL}/api/files/${currentSlide.image.filename}`;

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-b-3xl shadow-2xl">
      {/* Image Background */}
      <div
        className="absolute inset-0 bg-cover bg-center w-full h-full transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${imageURL})` }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-[rgba(255,120,80,0.35)] md:bg-[rgba(255,90,90,0.4)] backdrop-brightness-75"></div>

      {/* Text Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
        <h2 className="text-3xl md:text-5xl font-bold drop-shadow-lg leading-tight">
          {currentSlide.title}
        </h2>
        <p className="text-md md:text-xl mt-4 max-w-2xl drop-shadow-md">
          {currentSlide.subtitle}
        </p>
      </div>

      {/* Arrows */}
      <button
        onClick={goToPrev}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 p-2 rounded-full"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 p-2 rounded-full"
      >
        <ChevronRight size={28} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`w-3 h-3 rounded-full ${
              idx === currentIndex ? "bg-white" : "bg-white/50"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
