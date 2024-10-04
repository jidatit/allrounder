import React from "react";
import { IoStarSharp } from "react-icons/io5";
import {
  MdCalendarMonth,
  MdOutlinePeopleAlt,
  MdOutlineWatchLater,
} from "react-icons/md";
import { Link } from "react-router-dom";

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
}) => {
  return (
    <Link to={"/post/1"}>
      <div className="max-w-[270px]  min-w-[240px] rounded-lg  shadow-lg overflow-hidden bg-white">
        <div className="relative">
          <img
            src={imageUrl}
            alt={title}
            className="max-w-[250px] min-w-[240px] mx-auto h-[180px] object-cover rounded-lg"
          />
          {sponsored && (
            <span className="absolute bottom-3 right-5 bg-[#E55938] font-Montserrat  text-white text-sm px-5 py-1 rounded-full">
              Sponsored
            </span>
          )}
        </div>
        <div className="py-4">
          <h3 className=" px-4 text-lg custom-regular leading-[20px]">
            {title}
          </h3>
          <div className=" px-4 py-3">
            <div className="flex items-center gap-2 ">
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
          <div className=" flex items-center justify-between border-t px-4  ">
            <div className="flex  flex-col items-start  ">
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
              <span className=" text-sm text-[#778088] custom-semibold mt-[4px] ">
                {reviews} reviews
              </span>
            </div>
            <div className="flex justify-between  flex-col items-end">
              <span className="text-xl font-bold text-[#E55938]">
                ${price.toFixed(2)}
              </span>
              <span className="text-sm text-[#778088] custom-semibold  ">
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
