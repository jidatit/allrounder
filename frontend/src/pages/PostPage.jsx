import React, { useEffect, useRef, useState } from "react";
import {
  IoShareOutline,
  IoStarHalfSharp,
  IoStarOutline,
  IoStarSharp,
} from "react-icons/io5";
import FeaturedCard from "../UI Components/FeaturedCard";
import { PiCopy } from "react-icons/pi";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import ImageSlider from "../admin/components/ImageSlider";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import SetBoundsComponent from "../admin/components/SetBoundsComponent";
import useSliderSettings from "../admin/components/SliderSettings";
import useSliderSettingsActivity from "../admin/components/SliderSettingsActivity";
import MapModal from "../admin/components/MapModal";
import ShareButton from "../admin/components/SharedButton";
import ReviewSection from "../UI Components/ReviewSection";
import { useAuth } from "../context/authContext";
const createCustomIcon = (number) => {
  const mapMarkerIcon = `
    <svg viewBox="0 0 24 24" fill="currentColor" height="6rem" width="6rem">
      <path d="M12 11.5A2.5 2.5 0 019.5 9 2.5 2.5 0 0112 6.5 2.5 2.5 0 0114.5 9a2.5 2.5 0 01-2.5 2.5M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7z" />
    </svg>`;
  return L.divIcon({
    className: "custom-marker",
    html: `<div class="marker-icon  flex items-center justify-center  font-bold rounded-full px-3 w-[3rem] h-[3rem]">${mapMarkerIcon}</div>`,
    iconSize: [30, 30],
    iconAnchor: [30, 30],
  });
};

const PostPage = () => {
  const { activityIdParam } = useParams();
  const [relatedActivities, setRelatedActivities] = useState([]);
  const [featuredActivities, setFeaturedActivities] = useState([]);
  const [activities, setActivities] = useState([]);
  const [locationMap, setLocationMap] = useState([]);
  const { currentUser } = useAuth();
  const [singleActivity, setSingleActivity] = useState([]);
  useEffect(() => {
    fetchFeaturedActivities();
    // ... your existing useEffect logic
  }, [activityIdParam]);
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

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const activitiesRef = collection(db, "activities");
        const q = query(
          activitiesRef,
          where("activityId", "==", Number(activityIdParam))
        );
        const querySnapshot = await getDocs(q);

        const activitiesData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          docId: doc.id,
        }));
        setActivities(activitiesData);

        // Fetch the location coordinates using geocoding
        const locations = await Promise.all(
          activitiesData.map(async (activity) => {
            const provider = new OpenStreetMapProvider();
            const results = await provider.search({ query: activity.location });
            if (
              results.length > 0 &&
              results[0].y !== undefined &&
              results[0].x !== undefined
            ) {
              return {
                id: activity.activityId,
                name: activity.location,
                lat: results[0].y,
                lng: results[0].x,
              };
            } else {
              return null;
            }
          })
        );
        const validLocations = locations.filter(
          (location) => location !== null
        );
        setLocationMap(validLocations);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching activities:", error);
        setLoading(false);
      }
    };

    fetchActivities();
  }, [activityIdParam]);

  const [formData, setFormData] = useState({
    activityId: "",
    images: Array(3).fill(null),
    imagesPreviews: Array(3).fill(null),
    title: "",
    description: "",
    details: [""],
    location: "",
    hashtags: [""],
    category: "",
    showGoogleMap: false,
    host: {
      name: "",
      phone: "",
      email: "",
      about: "",
      website: "",
      profilePic: null,
      profilePicPreview: null,
    },
    startingHours: "",
    endingHours: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivityData = () => {
      if (!activityIdParam) return;

      setLoading(true);

      const activitiesRef = collection(db, "activities");
      const q = query(
        activitiesRef,
        where("activityId", "==", Number(activityIdParam))
      );

      // Set up the real-time listener using onSnapshot
      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          if (querySnapshot.empty) {
            console.error("Activity not found");
            toast.error("Activity not found");
            setLoading(false);
            return;
          }

          const activityDoc = querySnapshot.docs[0];
          const activityData = activityDoc.data();

          setSingleActivity(activityData);

          // Update formData with fetched data
          setFormData({
            ...formData,
            activityId: activityData.activityId,
            imagesPreviews: activityData.imageUrls || Array(3).fill(null),
            title: activityData.title || "",
            description: activityData.description || "",
            details: activityData.details?.length ? activityData.details : [""],
            location: activityData.location || "",
            hashtags: activityData.hashtags?.length
              ? activityData.hashtags
              : [""],
            category: activityData.category || "",
            showGoogleMap: activityData.showGoogleMap || false,
            host: {
              name: activityData.host?.name || "",
              phone: activityData.host?.phone || "",
              email: activityData.host?.email || "",
              about: activityData.host?.about || "",
              website: activityData.host?.website || "",
              profilePic: null,
              profilePicPreview: activityData.host?.profilePicUrl || null,
            },
            startingHours: activityData.startingHours || "",
            endingHours: activityData.endingHours || "",
            documentId: activityDoc.id, // Store the document ID for updates
          });

          fetchRelatedActivities(activityData.category); // Fetch related activities
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching activity:", error);
          toast.error("Failed to load activity data");
          setLoading(false);
        }
      );

      // Cleanup function to unsubscribe from the listener when the component unmounts
      return () => unsubscribe();
    };

    fetchActivityData();
  }, [activityIdParam]);
  const fetchRelatedActivities = async (category) => {
    try {
      const activitiesRef = collection(db, "activities");
      const q = query(activitiesRef, where("category", "==", category));
      const querySnapshot = await getDocs(q);

      const relatedActivitiesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("Related activities:", relatedActivitiesData); // For debugging

      setRelatedActivities(relatedActivitiesData);
    } catch (error) {
      console.error("Error fetching related activities:", error);
      toast.error("Failed to load related activities");
    }
  };

  const currentUrl = window.location.href;
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  let sliderRef = useRef(null);
  let sliderRef2 = useRef(null);
  const next = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const previous = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };
  const next2 = () => {
    if (sliderRef2.current) {
      sliderRef2.current.slickNext();
    }
  };

  const previous2 = () => {
    if (sliderRef2.current) {
      sliderRef2.current.slickPrev();
    }
  };
  const settings = {
    dots: true,
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

  const settings23 = useSliderSettings(featuredActivities);
  const settings24 = useSliderSettingsActivity(relatedActivities);
  const getBounds = (locations) => {
    if (!locations || locations.length === 0) return null;

    const validLocations = locations.filter((loc) => loc.lat && loc.lng);
    if (validLocations.length === 0) return null;

    let minLat = validLocations[0].lat;
    let maxLat = validLocations[0].lat;
    let minLng = validLocations[0].lng;
    let maxLng = validLocations[0].lng;

    validLocations.forEach((loc) => {
      minLat = Math.min(minLat, loc.lat);
      maxLat = Math.max(maxLat, loc.lat);
      minLng = Math.min(minLng, loc.lng);
      maxLng = Math.max(maxLng, loc.lng);
    });

    return [
      [minLat - 0.1, minLng - 0.1], // Add padding
      [maxLat + 0.1, maxLng + 0.1], // Add padding
    ];
  };

  const mapRef = useRef(null);

  // Effect to fit bounds when locations change
  useEffect(() => {
    if (mapRef.current && locationMap.length > 0) {
      const bounds = getBounds(locationMap);
      if (bounds) {
        mapRef.current.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 15, // Prevent too much zoom on single location
          duration: 1, // Animation duration in seconds
        });
      }
    }
  }, [locationMap]);

  const getCenterCoordinates = (locations) => {
    if (!locations || locations.length === 0) {
      return [33.684422, 73.047882]; // Default center if no locations
    }

    const validLocations = locations.filter((loc) => loc.lat && loc.lng);
    if (validLocations.length === 0) return [33.684422, 73.047882];

    const totalLat = validLocations.reduce((sum, loc) => sum + loc.lat, 0);
    const totalLng = validLocations.reduce((sum, loc) => sum + loc.lng, 0);
    return [totalLat / validLocations.length, totalLng / validLocations.length];
  };
  const [slideToShow, setSlidesToShow] = useState(3);
  const showNavigation = relatedActivities.length > slideToShow;

  const settings2 = {
    dots: true,
    infinite: featuredActivities.length > 1,
    speed: 500,
    slidesToShow: slideToShow,
    slidesToScroll: 1,
    autoplay: featuredActivities.length > 1,
    autoplaySpeed: 3000,
    centerMode: false,
    centerPadding: "0px",
    responsive: [
      {
        breakpoint: 1360,
        settings: {
          slidesToShow: Math.min(3, featuredActivities.length),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(3, featuredActivities.length),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 960,
        settings: {
          slidesToShow: Math.min(2, featuredActivities.length),
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

  useEffect(() => {
    const updateSlidesToShow = () => {
      if (window.innerWidth < 800) {
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

  const getContainerWidth2 = () => {
    const totalItems = featuredActivities?.length || 0;

    // Create classes for different screen sizes
    const baseClasses = {
      1: "w-full sssm:w-[100%] smd:w-[50%] md:w-[40%] lg:w-[40%] xl:w-[25%]", // Full on mobile, 80% on tablet, 50% on desktop, 40% on xl
      2: "w-full sssm:w-[85%] ssm:w-[90%] smd:w-[88%] md:w-[65%] lg:w-[70%] xl:w-[58%] xxl:w-[60%]", // Full on mobile, 85% on tablet, 70% on desktop, 60% on xl
      3: "w-full sssm:w-[82%] smd:w-[99%] md:w-[100%] lg:w-[94%] xl:w-[83%] xxl:w-[82%]", // Full on mobile, 90% on tablet, 75% on desktop, 66% on xl
      4: "w-full sssm:w-[92%] ssm:w-[92%] smd:w-[100%] md:w-[95%] lg:w-[96%] xl:w-[100%] xxl:w-[98%]", // Full on mobile and tablet, 85% on desktop, 80% on xl
      5: "w-full sssm:w-[92%] ssm:w-[92%] smd:w-[100%] md:w-[95%] lg:w-[96%] xl:w-[100%] xxl:w-[98%]", // Full on mobile and tablet, 85% on desktop, 85% on xl
      6: "w-full sssm:w-[92%] ssm:w-[92%] smd:w-[100%] md:w-[95%] lg:w-[96%] xl:w-[100%] xxl:w-[98%]", // Full on mobile and tablet, 95% on desktop, 90% on xl
      default:
        "w-full sssm:w-[92%] ssm:w-[92%] smd:w-[100%] md:w-[95%] lg:w-[96%] xl:w-[100%] xxl:w-[98%]", // Default responsive widths
    };

    return baseClasses[totalItems] || baseClasses.default;
  };

  const getContainerWidth = () => {
    const totalItems = relatedActivities?.length || 0;

    // Create classes for different screen sizes
    const baseClasses = {
      1: "w-full sssm:w-[100%] smd:w-[50%] md:w-[40%] lg:w-[40%] xl:w-[25%]", // Full on mobile, 80% on tablet, 50% on desktop, 40% on xl
      2: "w-full sssm:w-[85%] ssm:w-[90%] smd:w-[88%] md:w-[65%] lg:w-[70%] xl:w-[58%] xxl:w-[60%]", // Full on mobile, 85% on tablet, 70% on desktop, 60% on xl
      3: "w-full sssm:w-[82%] smd:w-[99%] md:w-[100%] lg:w-[94%] xl:w-[83%] xxl:w-[82%]", // Full on mobile, 90% on tablet, 75% on desktop, 66% on xl
      4: "w-full sssm:w-[92%] ssm:w-[92%] smd:w-[100%] md:w-[95%] lg:w-[96%] xl:w-[100%] xxl:w-[98%]", // Full on mobile and tablet, 85% on desktop, 80% on xl
      5: "w-full sssm:w-[92%] ssm:w-[92%] smd:w-[100%] md:w-[95%] lg:w-[96%] xl:w-[100%] xxl:w-[98%]", // Full on mobile and tablet, 90% on desktop, 85% on xl
      6: "w-full sssm:w-[92%] ssm:w-[92%] smd:w-[100%] md:w-[95%] lg:w-[96%] xl:w-[100%] xxl:w-[98%]", // Full on mobile and tablet, 95% on desktop, 85% on xl
      default:
        "w-full sssm:w-[92%] ssm:w-[92%] smd:w-[100%] md:w-[95%] lg:w-[96%] xl:w-[100%] xxl:w-[98%]", // Default responsive widths
    };

    return baseClasses[totalItems] || baseClasses.default;
  };
  const calculateAverageRating = (reviews) => {
    if (reviews?.length === 0) return 0;
    const totalRating = reviews?.reduce(
      (sum, review) => sum + review?.rating,
      0
    );
    return totalRating / reviews?.length;
  };

  const averageRating = calculateAverageRating(singleActivity.reviews); // Decimal rating (e.g., 3.5)
  return (
    <main className="h-full w-full ">
      <section className="h-full w-full px-4 sm:px-8  pt-5  md:pt-8 lg:pt-10 lg:px-16 mx-auto max-w-[1440px] flex flex-col gap-2 md:gap-3 lg:gap-5 ">
        {/* head */}
        <header className="flex flex-col md:flex-row ">
          <div className="lg:w-44 lg:h-44 md:w-32 md:h-32 w-24 h-24  bg-orange-100 rounded-xl overflow-hidden ">
            <img
              src={formData.imagesPreviews?.[0]}
              alt=""
              className="object-cover object-center w-full h-full"
            />
          </div>
          <div className="md:ml-7 mt-2 md:mt-0 flex justify-center items-start flex-col">
            <h2 className="custom-bold text-[20px] md:text-[28px] lg:text-[35px] ">
              {formData.title}
            </h2>
            <div className="flex md:items-center justify-between    flex-col md:flex-row md:w-[500px] lg:w-[650px]  mt-2 md:mt-6">
              <div className="lg:text-2xl text-xl flex items-center lg:gap-2 gap-1">
                <IoStarOutline /> <p>im Interested</p>
              </div>
              <ShareButton />
              <div className="lg:text-2xl text-xl flex items-center lg:gap-2 gap-1">
                <div className="flex flex-col">
                  <div className="flex">
                    <div className="flex items-center text-4xl -mt-1">
                      {[...Array(5)].map((_, index) => {
                        if (index < Math.floor(averageRating)) {
                          return (
                            <IoStarSharp
                              key={index}
                              className="text-[#FFA432]"
                            />
                          );
                        } else if (
                          index === Math.floor(averageRating) &&
                          averageRating % 1 >= 0.5
                        ) {
                          return (
                            <IoStarHalfSharp
                              key={index}
                              className="text-[#FFA432]"
                            />
                          );
                        } else {
                          return (
                            <IoStarSharp
                              key={index}
                              className="text-[#CFD9DE]"
                            />
                          );
                        }
                      })}
                    </div>
                  </div>
                </div>
                <span>
                  {" "}
                  (
                  {singleActivity.reviews?.length
                    ? singleActivity.reviews?.length
                    : 0}
                  reviews)
                </span>
              </div>
            </div>
          </div>
        </header>
        {/* body */}
        <div className=" flex flex-col lg:flex-row lg:gap-4 mt-6 lg:mt-12">
          <div className="lg:w-[59%] ">
            {/* blog body */}
            <article className="mb-16">
              {/* main image */}
              <ImageSlider images={formData.imagesPreviews} />
              {/* tags */}
              <div className="w-full flex flex-wrap gap-2  pt-9">
                {formData.hashtags.map((tag, index) => {
                  return (
                    <p
                      key={index}
                      className="bg-[#E559381A] border-2 border-[#E55938] px-2 py-0.5 text-xl rounded-xl"
                    >
                      #{tag}
                    </p>
                  );
                })}
              </div>
              <p className="md:text-xl  text-lg lg:text-2xl custom-semibold my-4">
                DESCRIPTION
              </p>
              <div className="gilroy-regular text-xl mb-6 lg:mb-10">
                <p>{formData.description}</p>
              </div>

              <p className="md:text-xl  text-lg lg:text-2xl custom-semibold my-4">
                ACTIVITY DETAILS
              </p>
              <ul className="">
                {formData.details.map((acitivity, index) => {
                  return (
                    <li
                      key={index}
                      className="text-xl custom-regular m-2 before:content-['•'] before:text-2xl before:mr-4"
                    >
                      {acitivity}
                    </li>
                  );
                })}
              </ul>
            </article>
            <p className="md:text-xl  text-lg lg:text-2xl custom-semibold my-4">
              {formData.showGoogleMap && "Location"}
            </p>
            {formData.showGoogleMap && (
              <div className="100% md:h-[400px] h-[500px]">
                <MapContainer
                  ref={mapRef}
                  center={getCenterCoordinates(locationMap)}
                  zoom={12}
                  style={{ height: "100%", width: "100%" }}
                  className="z-10"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />

                  {/* Add a component to handle bounds fitting */}
                  <SetBoundsComponent
                    locations={locationMap}
                    getBounds={getBounds}
                  />

                  {locationMap.map((location) => (
                    <Marker
                      key={location.id}
                      position={[location.lat, location.lng]}
                      icon={createCustomIcon(2)}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-bold">{location.name}</h3>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            )}
          </div>
          <div className="lg:w-[39%] custom-shadow h-full  rounded-xl   lg:mt-0 mt-5 ">
            <div className="py-7 px-9 border-b border-[#8D8D8D]">
              <h2 className="text-xl custom-semibold mb-5">Host Details</h2>
              <div className="flex">
                <img
                  src={formData.host.profilePicPreview}
                  alt=""
                  className="h-28 w-28 object-cover object-center rounded-md"
                />
                <div className="ml-3">
                  <h4 className="text-lg custom-medium">
                    {formData.host.name}
                  </h4>
                  <p className="text-sm custom-light">{formData.host.email}</p>
                </div>
              </div>
              <div>
                <h5 className="my-4 custom-medium text-lg">About The Host:</h5>
                <p className="text-sm custom-light">{formData.host.about}</p>
                <p className="text-sm custom-light my-3">
                  <span className="custom-medium text-lg mr-2">
                    Operational Hours:
                  </span>
                  {formData.startingHours} - {formData.endingHours}
                </p>

                <p className="text-sm custom-light my-3">
                  <span className="custom-medium text-lg mr-2">
                    Website Link:
                  </span>
                  {formData.host.website}
                </p>
              </div>
            </div>
            <div className="pb-7 pt-2 px-9 w-full">
              <div className="flex flex-col gap-2">
                <h5 className="custom-medium text-lg">Location:</h5>
                <p className="text-sm custom-light">{formData.location}</p>
              </div>
              <MapModal
                location={formData.location}
                locationMap={locationMap}
                createCustomIcon={createCustomIcon}
              />
              <h5 className="my-4  mt-7 text-xl custom-semibold">
                Spread the word
              </h5>
              <div className="">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-full max-w-md">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/activity/${formData.activityId}`}
                    className="flex-grow px-4 py-2  text-gray-800 border-none outline-none"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-4 bg-[#E55938]   text-[11px] md:text-sm  text-white custom-semibold hover:bg-[hsl(11,87%,56%)] focus:outline-none flex items-center"
                  >
                    {copied ? "Copied!" : "Copy link"}

                    <PiCopy className="text-xl ml-1 md:block hidden" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Activities */}

        <section className="h-full w-full mb-16 mt-10 ">
          <div className="h-full w-full items-center mx-auto max-w-[1440px] flex flex-col gap-2 md:gap-3 lg:gap-5">
            {relatedActivities?.length === 0 ? (
              ""
            ) : (
              <>
                <h2 className="custom-bold text-2xl md:text-4xl lg:text-5xl mb-10">
                  Related Activities
                </h2>
                <div
                  className={`relative pb-5 pt-5 mx-auto ${getContainerWidth()}`}
                >
                  <Slider ref={sliderRef} {...settings24}>
                    {relatedActivities.map((activity, index) => (
                      <div key={index} className="px-4 py-4">
                        <FeaturedCard
                          title={activity.title}
                          duration={activity.duration || "Duration 2 hours"}
                          date={activity.date || "2nd July – 2nd August"}
                          ageRange={activity.ageRange || "6 – 12 Years"}
                          reviews={activity.reviews} // Pass the full reviews array
                          price={activity.price || 35.0}
                          imageUrl={activity.imageUrls?.[0]}
                          sponsored={activity.sponsored}
                          activityId={activity.activityId}
                          count={featuredActivities.length}
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
              </>
            )}
          </div>
        </section>
        {/* Featured Activities */}

        <section className="h-full w-full mb-16 mt-6">
          <div className="h-full w-full mx-auto justify-center items-center max-w-[1440px] flex flex-col gap-2 md:gap-3 lg:gap-5">
            {featuredActivities?.length === 0 ? (
              ""
            ) : (
              <>
                <h2 className="custom-bold text-2xl md:text-4xl lg:text-5xl mb-10">
                  Featured Activities
                </h2>
                <div
                  className={`relative pb-5 pt-5 mx-auto ${getContainerWidth2()}`}
                >
                  <Slider {...settings23} ref={sliderRef2}>
                    {featuredActivities.map((activity, index) => (
                      <div key={index} className="px-4 py-4">
                        <FeaturedCard
                          title={activity.title}
                          duration={activity.duration || "Duration 2 hours"}
                          date={activity.date || "2nd July – 2nd August"}
                          ageRange={activity.ageRange || "6 – 12 Years"}
                          reviews={activity.reviews} // Pass the full reviews array
                          price={activity.price || 35.0}
                          imageUrl={activity.imageUrls?.[0]}
                          sponsored={activity.sponsored}
                          activityId={activity.activityId}
                          count={featuredActivities.length}
                        />
                      </div>
                    ))}
                  </Slider>

                  <>
                    <button
                      className="button absolute smd:-ml-6 top-[48%] left-2 bg-[#E55938] text-white w-6 h-6 lg:w-8 lg:h-8 rounded-full custom-shadow flex items-center justify-center text-sm lg:text-lg"
                      onClick={previous2}
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      className="button absolute top-[48%] smd:-mr-6 right-2 bg-[#E55938] text-white h-6 w-6 lg:w-8 lg:h-8 rounded-full custom-shadow flex items-center justify-center text-sm lg:text-lg"
                      onClick={next2}
                    >
                      <FaChevronRight />
                    </button>
                  </>
                </div>
              </>
            )}
          </div>
        </section>
        <ReviewSection
          currentUser={currentUser}
          activityId={activityIdParam}
          avatar={"/avatar.jpeg"}
        />
        {/* <section className="h-full w-full  ">
          <div className="h-full w-full mx-auto max-w-[1440px] flex flex-col gap-2 md:gap-3 lg:gap-5">
            <h2 className="custom-bold text-2xl md:text-4xl lg:text-5xl mb-5">
              Customer Reviews
            </h2>
            <div className="flex flex-col md:flex-row  lg:items-center justify-between h-full">
              <div className="flex flex-col ">
                <div className="flex items-center gap-2">
                  <div>
                    <p className="custom-bold text-2xl md:text-4xl lg:text-5xl mb-5">
                      4.3
                    </p>
                  </div>
                  <div>
                    <p className="text-[#778088] custom-light">
                      {"584 reviews"}
                    </p>{" "}
                  </div>
                </div>
                <div className="flex">
                  <div className="flex items-center text-5xl">
                    {[...Array(5)].map((_, index) => (
                      <IoStarSharp
                        key={index}
                        className={`text-[#FFA432] ${
                          index < rating ? "" : "text-[#CFD9DE]"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="md:mt-0 mt-3">
                <button className="w-[110px] h-[33px] md:w-[137px] lg:w-[181px] lg:h-[48px] bg-[#E55938] rounded-3xl text-xs md:text-sm  lg:text-lg text-white custom-semibold flex items-center justify-center">
                  Write a Review
                </button>
              </div>
            </div>

            <div className="">
              {CustomerReviews.map((review, index) => {
                return (
                  <div key={index} className="">
                    <div
                      className={`flex  flex-col lg:flex-row justify-between items-start gap-2 lg:gap-0 h-full py-6 ${
                        index === 0 ? "" : "border-t  "
                      }`}
                    >
                      <div className=" lg:w-[20%] flex items-start  h-full gap-2">
                        <div className="w-16 h-16 rounded-full overflow-hidden shadow-xl p-1">
                          <img
                            src={review.avatarUrl}
                            alt=""
                            className=" object-cover object-center w-full h-full rounded-full"
                          />
                        </div>
                        <div>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, index) => (
                              <IoStarSharp
                                key={index}
                                className={`text-[#FFA432] ${
                                  index < review.rating ? "" : "text-[#CFD9DE]"
                                }`}
                              />
                            ))}
                          </div>
                          <p>{review.name}</p>
                        </div>
                      </div>
                      <div className="lg:w-[60%]">
                        <p className="custom-bold font-bold mb-2">
                          {review.title}
                        </p>
                        <p>{review.description}</p>
                      </div>
                      <div className=" lg:w-[20%] flex  h-full  lg:items-start lg:justify-end ">
                        <p className="  lg:text-xl custom-semibold">
                          {review.date}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section> */}
      </section>
    </main>
  );
};

export default PostPage;
