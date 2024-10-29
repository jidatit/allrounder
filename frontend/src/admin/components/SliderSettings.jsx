import { useMemo } from "react";

const useSliderSettings = (featuredActivities) => {
  const settings = useMemo(
    () => ({
      dots: false,
      infinite: featuredActivities.length > 1,
      speed: 500,
      slidesToShow: Math.min(featuredActivities.length, 4),
      slidesToScroll: 1,
      autoplay: featuredActivities.length > 1,
      autoplaySpeed: 3000,
      centerMode:
        featuredActivities.length > 1 && featuredActivities.length < 3,
      centerPadding: "0px",
      responsive: [
        {
          // Extra large screens
          breakpoint: 1340,
          settings: {
            slidesToShow: Math.min(featuredActivities.length, 4),
            slidesToScroll: 1,

            centerMode:
              featuredActivities.length > 1 && featuredActivities.length < 3,
            centerPadding: "0px",
          },
        },
        {
          // Large screens
          breakpoint: 1300,
          settings: {
            slidesToShow: Math.min(
              featuredActivities.length,
              featuredActivities.length < 3 ? 2 : 3
            ),
            slidesToScroll: 1,

            centerMode:
              featuredActivities.length > 1 && featuredActivities.length < 3,
            centerPadding: "0px",
          },
        },
        {
          // Medium screens
          breakpoint: 1100,
          settings: {
            slidesToShow: Math.min(featuredActivities.length, 3),
            slidesToScroll: 1,

            centerMode:
              featuredActivities.length > 1 && featuredActivities.length < 3,
            centerPadding: "0px",
          },
        },
        {
          // Smaller screens
          breakpoint: 960,
          settings: {
            slidesToShow: Math.min(featuredActivities.length, 2),
            slidesToScroll: 1,

            centerMode:
              featuredActivities.length > 1 && featuredActivities.length < 2,
            centerPadding: "0px",
          },
        },
        {
          // Mobile screens
          breakpoint: 696,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,

            centerMode: featuredActivities.length > 1,
            centerPadding: "0px",
          },
        },
      ],
    }),
    [featuredActivities.length]
  );

  return settings;
};

export default useSliderSettings;
