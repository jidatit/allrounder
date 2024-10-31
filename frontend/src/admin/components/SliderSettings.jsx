import { useMemo } from "react";

const useSliderSettings = (featuredActivities) => {
  const settings = useMemo(
    () => ({
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: Math.min(featuredActivities.length, 4),
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      centerMode: true,
      centerPadding: "90px",

      responsive: [
        {
          // Extra large screens
          breakpoint: 1340,
          settings: {
            slidesToShow: Math.min(featuredActivities.length, 3),
            slidesToScroll: 1,
            centerMode: true,
            centerPadding: "140px",
          },
        },
        {
          // Large screens
          breakpoint: 1120,
          settings: {
            slidesToShow: Math.min(
              featuredActivities.length,
              featuredActivities.length < 3 ? 2 : 3
            ),
            slidesToScroll: 1,
            centerMode: true,
            centerPadding: "60px",
          },
        },
        {
          // Medium screens
          breakpoint: 1100,
          settings: {
            slidesToShow: Math.min(featuredActivities.length, 3),
            slidesToScroll: 1,
            centerMode: true,
            centerPadding: "50px",
          },
        },
        {
          // Smaller screens (800px - 959px)
          breakpoint: 960,
          settings: {
            slidesToShow: Math.min(featuredActivities.length, 2),
            slidesToScroll: 1,
            centerMode: true,
            centerPadding: "120px",
          },
        },
        {
          // Tablet screens (640px - 799px)
          breakpoint: 800,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            centerMode: true,
            centerPadding: "10px",
          },
        },
        {
          // Large mobile screens (480px - 639px)
          breakpoint: 640,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            centerMode: true,
            centerPadding: "60px",
          },
        },
        {
          // Small mobile screens
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            centerMode: true,
            centerPadding: "30px",
          },
        },
      ],
    }),
    [featuredActivities.length]
  );

  return settings;
};

export default useSliderSettings;
