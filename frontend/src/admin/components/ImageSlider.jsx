import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!Array.isArray(images) || images.length === 0) {
      setError("Invalid or empty images array provided to ImageSlider");
      return;
    }

    // Preload images
    const imagePromises = images.map((src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src; // Removed the timestamp
        img.onload = () => resolve(src);
        img.onerror = () => reject(`Failed to load image: ${src}`);
      });
    });

    Promise.all(imagePromises)
      .then((loadedSrcs) => {
        setLoadedImages(loadedSrcs);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load one or more images");
      });

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [images]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? loadedImages.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === loadedImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (loadedImages.length === 0) {
    return <div>Loading images...</div>;
  }

  return (
    <div className="relative w-full h-full min-h-[500px] max-h-[500px] group">
      <div className="w-full h-full relative">
        <img
          src={loadedImages[currentIndex]} // Fixed src without timestamp
          alt={`Slide ${currentIndex + 1}`}
          className="w-full h-full max-h-[500px] min-h-[500px] object-cover object-center overflow-hidden custom-shadow rounded-2xl"
        />

        {/* Left Arrow */}
        <button
          className="hidden group-hover:block absolute top-1/2 left-4 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all"
          onClick={(e) => {
            e.preventDefault();
            goToPrevious();
          }}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* Right Arrow */}
        <button
          className="hidden group-hover:block absolute top-1/2 right-4 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all"
          onClick={(e) => {
            e.preventDefault();
            goToNext();
          }}
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Dots/Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {loadedImages.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.preventDefault();
              goToSlide(index);
            }}
            className={`w-3 h-3 rounded-full transition-all ${
              currentIndex === index
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
