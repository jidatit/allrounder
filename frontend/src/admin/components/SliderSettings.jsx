import React, { useMemo } from "react";

const useSliderSettings = (featuredActivities) => {
  const settings2 = useMemo(
    () => ({
      dots: true,
      infinite: featuredActivities.length > 1,
      speed: 500,
      slidesToShow: Math.min(5, featuredActivities.length),
      slidesToScroll: 1,
      autoplay: featuredActivities.length > 1,
      autoplaySpeed: 3000,
      centerMode: featuredActivities.length < 3,
      centerPadding: "0px",
      responsive: [
        {
          breakpoint: 1360,
          settings: {
            slidesToShow: Math.min(4, featuredActivities.length),
            slidesToScroll: 1,
            centerMode: featuredActivities.length < 3,
            centerPadding: "0px",
          },
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: Math.min(3, featuredActivities.length),
            slidesToScroll: 1,
            centerMode: featuredActivities.length < 3,
            centerPadding: "0px",
          },
        },
        {
          breakpoint: 960,
          settings: {
            slidesToShow: Math.min(2, featuredActivities.length),
            slidesToScroll: 1,
            centerMode: featuredActivities.length < 2,
            centerPadding: "0px",
          },
        },
        {
          breakpoint: 696,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            centerMode: true,
            centerPadding: "0px",
          },
        },
      ],
    }),
    [featuredActivities.length]
  );

  return settings2;
};

export default useSliderSettings;
