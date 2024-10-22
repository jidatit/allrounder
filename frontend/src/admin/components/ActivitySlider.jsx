import React, { useRef } from "react";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ActivitySlider = ({ relatedActivities }) => {
  const sliderRef = useRef(null);

  // Helper function to determine container width
  const getContainerWidth = () => {
    const totalItems = relatedActivities?.length || 0;

    switch (totalItems) {
      case 1:
        return "w-1/2"; // 50%
      case 2:
        return "w-1/2"; // 50%
      case 3:
        return "w-3/5"; // 60%
      case 4:
      case 5:
      case 6:
        return "w-4/5"; // 80%
      default:
        return "w-1/2"; // 50% as default
    }
  };

  const slidesToShow = Math.min(4, relatedActivities.length);

  const settings = {
    dots: true,
    infinite: relatedActivities.length > 1,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    autoplay: relatedActivities.length > 1,
    autoplaySpeed: 3000,
    centerMode: false,
    centerPadding: "0px",
    responsive: [
      {
        breakpoint: 1360,
        settings: {
          slidesToShow: Math.min(3, relatedActivities.length),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(3, relatedActivities.length),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 960,
        settings: {
          slidesToShow: Math.min(2, relatedActivities.length),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 696,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const next = () => {
    sliderRef.current?.slickNext();
  };

  const previous = () => {
    sliderRef.current?.slickPrev();
  };

  const showNavigation = relatedActivities.length > slidesToShow;

  return (
    <div className={`relative pb-5 mx-auto ${getContainerWidth()}`}>
      <Slider ref={sliderRef} {...settings}>
        {relatedActivities.map((activity, index) => (
          <div key={index} className="px-2">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold">{activity.title}</h3>
              <p className="text-gray-600">{activity.description}</p>
            </div>
          </div>
        ))}
      </Slider>

      {showNavigation && (
        <div className="absolute w-full top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
          <button
            onClick={previous}
            className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center pointer-events-auto transform -translate-x-1/2 hover:bg-gray-50 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={next}
            className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center pointer-events-auto transform translate-x-1/2 hover:bg-gray-50 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivitySlider;
