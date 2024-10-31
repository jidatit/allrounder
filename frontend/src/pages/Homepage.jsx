import React, { useEffect, useRef, useState } from "react";
import Layout from "../UI Components/Layout";
import CategoryCard from "../UI Components/CategoryCard";
import FeaturedCard from "../UI Components/FeaturedCard";
import { Link } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import useSliderSettings from "../admin/components/SliderSettings";

const Homepage = () => {
  const [featuredActivities, setFeaturedActivities] = useState([]);
  useEffect(() => {
    fetchFeaturedActivities();
    // ... your existing useEffect logic
  }, []);
  const settings23 = useSliderSettings(featuredActivities);
  const fetchFeaturedActivities = async () => {
    try {
      const featuredActivitiesRef = collection(db, "featuredActivities");
      const querySnapshot = await getDocs(featuredActivitiesRef);
      const featuredActivitiesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFeaturedActivities(featuredActivitiesData);
    } catch (error) {
      console.error("Error fetching featured activities:", error);
    }
  };
  const CategoryCards = [
    {
      title: "Team Sports",
      url: "/full-shot-happy-kids-with-trophy.png",
    },
    {
      title: "Dance",
      url: "/kids-dance-school-ballet-hiphop-street-funky-modern-dancers_155003-2610.png",
    },
    {
      title: "Martial Arts",
      url: "/kids-martial-arts-class_1237301-108760.png",
    },
    {
      title: "Stem",
      url: "/elementary-school-students-sitting-table-group-building-space-rocket-generative-ai_1259709-116255.png",
    },
    {
      title: "Athletics",
      url: "/children-running-athletic-track-with-energy-joy_641503-89566.png",
    },
    {
      title: "Music",
      url: "/kids-learning-music-school_978119-1161.png",
    },
    {
      title: "Arts",
      url: "/kids-learning-art-school_978119-1384.png",
    },
    {
      title: "Social",
      url: "/children-group-with-globe_23-2148107396.png",
    },
  ];

  const activityCards = [
    {
      title: "Vivamus elementum semper nisi. Aenean dolor",
      duration: "Duration 2 hours",
      date: "2nd July – 2nd August",
      ageRange: "6 – 12 Years",
      reviews: 584,
      rating: 4.5,
      price: 35.0,
      imageUrl: "/Featured/card.png",
      sponsored: true,
    },
    {
      title: "Vivamus elementum semper nisi. Aenean dolor",
      duration: "Duration 2 hours",
      date: "2nd July – 2nd August",
      ageRange: "6 – 12 Years",
      reviews: 584,
      rating: 4.5,
      price: 35.0,
      imageUrl: "/Featured/card-2.png",
      sponsored: true,
    },
    {
      title: "Vivamus elementum semper nisi. Aenean dolor",
      duration: "Duration 2 hours",
      date: "2nd July – 2nd August",
      ageRange: "6 – 12 Years",
      reviews: 584,
      rating: 4.5,
      price: 35.0,
      imageUrl: "/Featured/card-3.png",
      sponsored: true,
    },
    {
      title: "Vivamus elementum semper nisi. Aenean dolor",
      duration: "Duration 2 hours",
      date: "2nd July – 2nd August",
      ageRange: "6 – 12 Years",
      reviews: 584,
      rating: 4.5,
      price: 35.0,
      imageUrl: "/Featured/card-4.png",
      sponsored: true,
    },
    {
      title: "Vivamus elementum semper nisi. Aenean dolor",
      duration: "Duration 2 hours",
      date: "2nd July – 2nd August",
      ageRange: "6 – 12 Years",
      reviews: 584,
      rating: 4.5,
      price: 35.0,
      imageUrl: "/Featured/card-5.png",
      sponsored: true,
    },
  ];
  let sliderRef = useRef(null);
  const next = () => {
    if (sliderRef2.current) {
      sliderRef2.current.slickNext();
    }
  };

  const previous = () => {
    if (sliderRef2.current) {
      sliderRef2.current.slickPrev();
    }
  };

  const settings = {
    // dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    centerMode: true,
    responsive: [
      {
        breakpoint: 1360,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 2,
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
  let sliderRef2 = useRef(null);
  const [slidesToShow, setSlidesToShow] = useState(3);

  useEffect(() => {
    const updateSlidesToShow = () => {
      if (window.innerWidth < 600) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(3);
      }
    };

    updateSlidesToShow();
    window.addEventListener("resize", updateSlidesToShow);

    return () => window.removeEventListener("resize", updateSlidesToShow);
  }, []);
  const settings2 = {
    dots: true,
    infinite: featuredActivities.length > 1,
    speed: 500,
    slidesToShow: Math.min(4, featuredActivities.length),
    slidesToScroll: 1,
    autoplay: featuredActivities.length > 1,
    autoplaySpeed: 3000,
    centerMode: false, // Disabled centerMode to prevent extra spacing
    centerPadding: "0px",
    responsive: [
      {
        breakpoint: 1360,
        settings: {
          slidesToShow: Math.min(3, featuredActivities.length),
          slidesToScroll: 1,
          centerMode: false,
          centerPadding: "0px",
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(3, featuredActivities.length),
          slidesToScroll: 1,
          centerMode: false,
          centerPadding: "0px",
        },
      },
      {
        breakpoint: 960,
        settings: {
          slidesToShow: Math.min(2, featuredActivities.length),
          slidesToScroll: 1,
          centerMode: false,
          centerPadding: "0px",
        },
      },
      {
        breakpoint: 696,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false,
          centerPadding: "0px",
        },
      },
    ],
  };
  const getContainerWidth2 = () => {
    const totalItems = featuredActivities?.length || 0;

    // Create classes for different screen sizes
    const baseClasses = {
      1: "w-full sssm:w-[100%] smd:w-[50%] md:w-[40%] lg:w-[40%] xl:w-[25%]", // Full on mobile, 80% on tablet, 50% on desktop, 40% on xl
      2: "w-full sssm:w-[85%] ssm:w-[90%] smd:w-[88%] md:w-[65%] lg:w-[70%] xl:w-[58%] xxl:w-[50%]", // Full on mobile, 85% on tablet, 70% on desktop, 60% on xl
      3: "w-full sssm:w-[88%] smd:w-[94%] md:w-[100%] lg:w-[88%] xl:w-[83%] xxl:w-[72%]", // Full on mobile, 90% on tablet, 75% on desktop, 66% on xl
      4: "w-full sssm:w-[92%] ssm:w-[80%] smd:w-[94%] md:w-[95%] lg:w-[88%] xl:w-[92%] xxl:w-[94%]", // Full on mobile and tablet, 85% on desktop, 80% on xl
      5: "w-full sssm:w-[92%] ssm:w-[80%] smd:w-[94%] md:w-[95%] lg:w-[88%] xl:w-[92%] xxl:w-[94%]", // Full on mobile and tablet, 90% on desktop, 85% on xl
      6: "w-full sssm:w-[92%] ssm:w-[80%] smd:w-[94%] md:w-[95%] lg:w-[88%] xl:w-[92%] xxl:w-[94%]", // Full on mobile and tablet, 95% on desktop, 90% on xl
      default:
        "w-full sssm:w-[92%] ssm:w-[80%] smd:w-[94%] md:w-[95%] lg:w-[88%] xl:w-[92%] xxl:w-[94%]", // Default responsive widths
    };

    return baseClasses[totalItems] || baseClasses.default;
  };

  return (
    <main>
      <section>
        <div
          className="relative h-[90vh] w-full bg-cover bg-center "
          style={{
            backgroundImage: `url('/hero.png')`,
          }}
        >
          <div className="absolute inset-0 bg-[#000] bg-opacity-30 flex flex-col items-center justify-center text-center">
            <h1 className="text-white  text-3xl md:text-4xl md:text-5xl font-bold mb-4 custom-bold">
              Find the extracurricular activities <br />
              you're looking for
            </h1>
            <div className=" w-[65%]  text-[10px] sm:text-xs md:text-sm   lg:h-16 md:h-14 h-10 rounded-lg overflow-hidden mt-8 ">
              <form className="flex items-center h-full relative">
                <IoIosSearch className="absolute left-4 text-xl md:text-2xl" />
                <input
                  type="text"
                  name="keywords"
                  id="keywords"
                  className=" h-full lg:w-[85%] w-[75%] placeholder:text-black  placeholder:custom-light placeholder:text-sm px-4 pl-10 md:pl-14 rounded-none"
                  placeholder="Keyword"
                />
                <button
                  type="submit"
                  className="bg-[#E55938] custom-semibold h-full text-white  w-[25%]  lg:w-[15%] uppercase "
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      {/* CATEGORIES SECTION */}
      <section className="h-full w-full   ">
        <div className="h-full max-w-[1440px] ssm:max-w-[1540px] px-4 sm:px-8 pt-20 lg:px-16 mx-auto flex flex-col gap-2 md:gap-3 lg:gap-5">
          <h2 className="custom-bold text-2xl md:text-4xl lg:text-5xl ">
            Discover Categories
          </h2>
          <p className="custom-regular md:text-lg lg:text-xl">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
          </p>
          <div className="flex gap-3 flex-wrap w-full  content-start  justify-between">
            {CategoryCards.map((card, index) => {
              return (
                <CategoryCard key={index} name={card.title} url={card.url} />
              );
            })}
          </div>
        </div>
      </section>
      {/* FEATURED CARD */}
      <section className="h-full w-full mb-16 mt-10">
        <div className="h-full px-4 sm:px-4 md:pt-20 max-w-[1440px] ssm:max-w-[1540px] justify-center items-center lg:items-start mx-auto flex flex-col gap-2 md:gap-3 smd:mt-0 mt-20 lg:gap-5 ">
          {featuredActivities?.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-2xl">No Featured activities </p>
            </div>
          ) : (
            <>
              <h2 className="custom-bold text-2xl ml-10 md:text-4xl lg:text-5xl mb-10">
                Featured Activities
              </h2>
              <div
                className={`relative pb-5 pt-5 mx-auto ${getContainerWidth2()}`}
              >
                <Slider {...settings23} ref={sliderRef2}>
                  {featuredActivities.map((activity, index) => (
                    <div key={index} className="slide-item px-4">
                      <FeaturedCard
                        title={activity.title}
                        duration={activity.duration || "Duration 2 hours"}
                        date={activity.date || "2nd July – 2nd August"}
                        ageRange={activity.ageRange || "6 – 12 Years"}
                        reviews={activity.reviews || 584}
                        rating={activity.rating || 4.5}
                        price={activity.price || 35.0}
                        imageUrl={activity.imageUrls?.[0]}
                        sponsored={activity.sponsored}
                        activityId={activity.activityId}
                      />
                    </div>
                  ))}
                </Slider>

                <>
                  <button
                    className="button absolute smd:-ml-6 top-[48%] left-2 bg-[#E55938] text-white w-6 h-6 lg:w-8 lg:h-8 rounded-full custom-shadow flex items-center justify-center text-sm lg:text-lg"
                    onClick={previous}
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    className="button absolute top-[48%] smd:-mr-6 right-2 bg-[#E55938] text-white h-6 w-6 lg:w-8 lg:h-8 rounded-full custom-shadow flex items-center justify-center text-sm lg:text-lg"
                    onClick={next}
                  >
                    <FaChevronRight />
                  </button>
                </>
              </div>
              <div className="flex item items-center w-full justify-center mt-4">
                <Link
                  to={`/allActivities`}
                  className=" w-[110px] h-[33px]  md:w-[137px]  lg:w-[181px] lg:h-[48px] bg-[#E55938] rounded-3xl text-xs md:text-sm  lg:text-lg text-white custom-semibold flex items-center justify-center"
                >
                  View More
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
      {/* EXPLORE PROGRAM */}
      <section className="h-full w-full  mb-12 md:mb-24  ">
        <div className="h-full max-w-[1440px] ssm:max-w-[1540px] px-4 sm:px-8 pt-20 lg:px-16 mx-auto flex flex-col gap-2 md:gap-3 lg:gap-5 ">
          <h2 className="custom-bold text-2xl md:text-4xl lg:text-5xl  mb-10 text-center  lg:text-start">
            Explore programs
          </h2>
          <div className="flex flex-wrap">
            <div className="flex flex-col items-center justify-center md:w-1/2 lg:w-1/4 py-4">
              <div className="bg-[#E5593833] w-24 h-24 rounded-lg border-2 mb-6 border-[#E55938] flex items-center justify-center">
                <img
                  src="/Programs-icons/Vector.png"
                  alt="explore-icon"
                  className="max-w-[64px] max-h-[64px]"
                />
              </div>
              <h3 className=" custom-semibold text-3xl my-1">Discover</h3>
              <p className="custom-regular text-center text-lg  px-6 lg:px-0">
                Vitae sapien pellentesque habitant morbi tristique senectus et
                netus et.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center md:w-1/2 lg:w-1/4 py-4">
              <div className="bg-[#E5593833] w-24 h-24 rounded-lg border-2 mb-6 border-[#E55938] flex items-center justify-center">
                <img
                  src="/Programs-icons/icon-2.png"
                  alt="review-icon"
                  className="max-w-[64px] max-h-[64px]"
                />
              </div>
              <h3 className=" custom-semibold text-3xl my-1">Review</h3>
              <p className="custom-regular text-center text-lg  px-6 lg:px-0">
                Vitae sapien pellentesque habitant morbi tristique senectus et
                netus et.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center md:w-1/2 lg:w-1/4 py-4">
              <div className="bg-[#E5593833] w-24 h-24 rounded-lg border-2 mb-6 border-[#E55938] flex items-center justify-center">
                <img
                  src="/Programs-icons/icon-3.png"
                  alt="enroll-icon"
                  className="max-w-[64px] max-h-[64px]"
                />
              </div>
              <h3 className=" custom-semibold text-3xl my-1 ">Enroll</h3>
              <p className="custom-regular text-center text-lg  px-6 lg:px-0">
                Vitae sapien pellentesque habitant morbi tristique senectus et
                netus et.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center md:w-1/2 lg:w-1/4 py-4">
              <div className="bg-[#E5593833] w-24 h-24 rounded-lg border-2 mb-6 border-[#E55938] flex items-center justify-center">
                <img
                  src="/Programs-icons/Vector.png"
                  alt="explore-icon"
                  className="max-w-[64px] max-h-[64px]"
                />
              </div>
              <h3 className=" custom-semibold text-3xl my-1 ">Get Started</h3>
              <p className="custom-regular text-center text-lg  px-6 lg:px-0">
                Vitae sapien pellentesque habitant morbi tristique senectus et
                netus et.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Contact Us */}
      <section className="h-full w-full  bg-[#FFF5F2] pb-20 ">
        <div className="h-full w-full px-4 sm:px-8 md:pt-10 lg:pt-20 lg:px-16 mx-auto max-w-[1440px] flex lg:flex-row flex-col-reverse">
          <div className="lg:w-[587px] lg:max-h-[655px]   md:p-3 bg-white  rounded-lg flex  items-center justify-center ">
            <img src="/contact.png" alt="" className="w-full h-full " />
          </div>
          <div className="my-10  lg:my-0 lg:ml-16  lg:w-1/2 flex flex-col items-center lg:items-start  justify-center ">
            <h2 className="custom-bold text-2xl md:text-4xl lg:text-5xl mb-10">
              What is Allrounder?
            </h2>
            <p className="custom-regular lg:text-xl">
              Lorem ipsum dolor sit amet consectetur. Sit eu quisque dolor
              semper ullamcorper non parturient. Amet ultrices amet ipsum
              tristique. Tempus libero eu volutpat sollicitudin tortor eu
              suscipit sit. Tortor dui vel congue lorem viverra pellentesque
              tristique. Eget dolor dapibus dictumst amet elementum enim
              ridiculus. Enim dictum at purus pulvinar est lectus quis cum
              tortor. Et auctor amet amet aenean. Sed velit id parturient urna
              quis pellentesque senectus. Dictum aliquam posuere metus fames
              morbi et vulputate dolor. Eu in sem tincidunt magna posuere est
              ipsum. Leo nam mus arcu ipsum faucibus eu orci. Vel amet aenean
              blandit mi odio tempor cum. Eros facilisi sagittis pulvinar netus
              maecenas quam nibh sed mattis. In pellentesque accumsan tincidunt
              in dignissim mi et leo. Morbi in ridiculus dolor amet. Et duis
              dolor malesuada a elit nisl. Dui sit mi turpis sed nisi et at.
              Ullamcorper curabitur at arcu elementum dui aliquam vitae dictum.
            </p>
            <Link className="mt-11 w-[110px] h-[33px]  md:w-[137px]  lg:w-[181px] lg:h-[48px] bg-[#E55938] rounded-3xl text-xs md:text-sm  lg:text-lg text-white custom-semibold flex items-center justify-center">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Homepage;
