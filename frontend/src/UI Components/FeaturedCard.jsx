import React from "react";
import { IoStarSharp } from "react-icons/io5";
import {
  MdCalendarMonth,
  MdOutlinePeopleAlt,
  MdOutlineWatchLater,
} from "react-icons/md";
import { Link } from "react-router-dom";

import { useState, useEffect } from "react";
import { db } from "../config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const FeaturedCard = ({
  title,
  duration,
  date,
  ageRange,
  reviews,
  rating,
  price,
  imageUrl,
  sponsored,
  activityId,
  relatedActivities = 4,
}) => {
  const [isFeatured, setIsFeatured] = useState(false);
  const featureActivityParam = "simpleActivity";

  useEffect(() => {
    const checkFeaturedStatus = async () => {
      try {
        // Create a query to check if the activity exists in featured activities
        const featuredActivitiesRef = collection(db, "featuredActivities");
        const q = query(
          featuredActivitiesRef,
          where("activityId", "==", activityId)
        );

        const querySnapshot = await getDocs(q);
        setIsFeatured(!querySnapshot.empty); // Will be true if the activity is found
      } catch (error) {
        console.error("Error checking featured status:", error);
        setIsFeatured(false);
      }
    };

    if (activityId) {
      checkFeaturedStatus();
    }
  }, [activityId]);

  return (
    <Link
      to={`/post/${activityId}/${featureActivityParam}`}
      className="block w-full"
    >
      <div
        className={`mx-auto w-full rounded-lg shadow-lg overflow-hidden bg-white`}
      >
        <div className="relative p-3">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-[180px] object-cover rounded-lg"
          />
          {isFeatured && (
            <span className="absolute bottom-5 right-4 bg-[#E55938] font-Montserrat text-white text-sm px-5 py-2 rounded-full">
              Sponsored
            </span>
          )}
        </div>
        <div className="py-4">
          <h3 className="px-4 text-lg custom-regular leading-[20px]">
            {title}
          </h3>
          <div className="px-4 py-3">
            <div className="flex items-center gap-2">
              <MdOutlineWatchLater />
              <p className="text-sm text-[#808080]">{duration}</p>
            </div>
            <div className="flex items-center gap-2">
              <MdCalendarMonth />
              <p className="text-sm text-[#808080]">{date}</p>
            </div>
            <div className="flex items-center gap-2">
              <MdOutlinePeopleAlt />
              <p className="text-sm text-[#808080]">{ageRange}</p>
            </div>
          </div>
          <div className="flex items-center justify-between border-t px-4">
            <div className="flex flex-col items-start">
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                  <IoStarSharp
                    key={index}
                    className={`text-[#FFA432] ${
                      index < rating ? "" : "text-[#CFD9DE]"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-[#778088] custom-semibold mt-[4px]">
                {reviews} reviews
              </span>
            </div>
            <div className="flex justify-between flex-col items-end">
              <span className="text-xl font-bold text-[#E55938]">${price}</span>
              <span className="text-sm text-[#778088] custom-semibold">
                per person
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedCard;
