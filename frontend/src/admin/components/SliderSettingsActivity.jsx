import React, { useMemo } from "react";

const useSliderSettingsActivity = (relatedActivities) => {
  const settings2 = useMemo(
    () => ({
      dots: false,
      infinite: relatedActivities.length > 1, // Disable infinite for 1 slide
      speed: 500,
      slidesToShow: Math.min(relatedActivities.length, 4),
      slidesToScroll: 1,
      autoplay: relatedActivities.length > 1, // Disable autoplay for 1 slide
      autoplaySpeed: 3000,
      centerMode: relatedActivities.length > 1, // Disable centerMode for 1 slide
      centerPadding: relatedActivities.length > 1 ? "80px" : "0px", // No padding for 1 slide
      responsive: [
        {
          // Extra large screens
          breakpoint: 1340,
          settings: {
            slidesToShow: Math.min(relatedActivities.length, 3),
            slidesToScroll: 1,
            centerMode: relatedActivities.length > 1,
            centerPadding: relatedActivities.length > 1 ? "100px" : "0px",
          },
        },
        {
          // Large screens
          breakpoint: 1120,
          settings: {
            slidesToShow: Math.min(
              relatedActivities.length,
              relatedActivities.length < 3 ? 2 : 3
            ),
            slidesToScroll: 1,
            centerMode: relatedActivities.length > 1,
            centerPadding: relatedActivities.length > 1 ? "60px" : "0px",
          },
        },
        {
          // Medium screens
          breakpoint: 1100,
          settings: {
            slidesToShow: Math.min(relatedActivities.length, 3),
            slidesToScroll: 1,
            centerMode: relatedActivities.length > 1,
            centerPadding: relatedActivities.length > 1 ? "50px" : "0px",
          },
        },
        {
          // Smaller screens (800px - 959px)
          breakpoint: 960,
          settings: {
            slidesToShow: Math.min(relatedActivities.length, 2),
            slidesToScroll: 1,
            centerMode: relatedActivities.length > 1,
            centerPadding: relatedActivities.length > 1 ? "120px" : "0px",
          },
        },
        {
          // Tablet screens (640px - 799px)
          breakpoint: 800,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            centerMode: relatedActivities.length > 1,
            centerPadding: relatedActivities.length > 1 ? "10px" : "0px",
          },
        },
        {
          // Large mobile screens (480px - 639px)
          breakpoint: 640,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            centerMode: relatedActivities.length > 1,
            centerPadding: relatedActivities.length > 1 ? "60px" : "0px",
          },
        },
        {
          // Small mobile screens
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            centerMode: relatedActivities.length > 1,
            centerPadding: relatedActivities.length > 1 ? "30px" : "0px",
          },
        },
      ],
    }),
    [relatedActivities.length]
  );
  return settings2;
};

export default useSliderSettingsActivity;
