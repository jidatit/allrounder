import React, { useMemo } from "react";

const useSliderSettingsActivity = (relatedActivities) => {
  const settings2 = useMemo(
    () => ({
      dots: true,
      infinite: relatedActivities.length > 1,
      speed: 500,
      slidesToShow: Math.min(relatedActivities.length),
      slidesToScroll: 1,
      autoplay: relatedActivities.length > 1,
      autoplaySpeed: 3000,
      centerMode: relatedActivities.length === 1,
      centerPadding: "0px",
      responsive: [
        {
          breakpoint: 1360,
          settings: {
            slidesToShow: Math.min(2, relatedActivities.length),
            slidesToScroll: 1,
            centerMode: relatedActivities.length === 1,
            centerPadding: "0px",
          },
        },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: Math.min(2, relatedActivities.length),
            slidesToScroll: 1,
            centerMode: relatedActivities.length === 1,
            centerPadding: "0px",
          },
        },
        {
          breakpoint: 960,
          settings: {
            slidesToShow: Math.min(2, relatedActivities.length),
            slidesToScroll: 1,
            centerMode: relatedActivities.length === 1,
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
    [relatedActivities.length]
  );

  return settings2;
};

export default useSliderSettingsActivity;
