import React, { useMemo } from "react";

const useSliderSettings = (featuredActivities) => {
  const settings = useMemo(
    () => ({
      dots: true,
      infinite: featuredActivities.length > 1,
      speed: 500,
      slidesToShow: Math.min(4, featuredActivities.length),
      slidesToScroll: 1,
      autoplay: featuredActivities.length > 1,
      autoplaySpeed: 3000,
      centerMode: featuredActivities.length < 3,
      centerPadding: "0px",
      responsive: [
        {
          // Extra large screens
          breakpoint: 1360,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            infinite: true,
            dots: true,
            centerMode: featuredActivities.length < 3,
            centerPadding: "0px",
          },
        },
        {
          // Large screens
          breakpoint: 1100,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            infinite: true,
            dots: true,
            centerMode: featuredActivities.length < 3,
            centerPadding: "0px",
          },
        },
        {
          // Medium screens
          breakpoint: 960,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            infinite: true,
            dots: true,
            centerMode: featuredActivities.length < 2,
            centerPadding: "0px",
          },
        },
        {
          // Mobile screens
          breakpoint: 696,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            dots: true,
            centerMode: true,
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
