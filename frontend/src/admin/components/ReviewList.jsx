import React, { useState, useEffect } from "react";

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebase";
import { IoStarSharp } from "react-icons/io5";

const ReviewsList = ({
  activityId,
  loading,
  error,
  reviews,
  setShowAllReviews,
  showAllReviews,
}) => {
  if (loading) {
    return <div className="text-center py-4">Loading reviews...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  if (!reviews.length) {
    return <div className="text-center py-4">No reviews yet</div>;
  }

  return (
    <div className="">
      {reviews.map((review, index) => (
        <div key={index} className="">
          <div
            className={`flex flex-col lg:flex-row justify-between items-start gap-2 lg:gap-0 h-full py-6 ${
              index === 0 ? "" : "border-t"
            }`}
          >
            <div className="lg:w-[20%] flex items-start h-full gap-2">
              <div className="w-16 h-16 rounded-full overflow-hidden shadow-xl p-1">
                <img
                  src={review.avatarUrl}
                  alt=""
                  className="object-cover object-center w-full h-full rounded-full"
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
              <p className="custom-bold font-bold mb-2">{review.title}</p>
              <p>{review.description}</p>
            </div>
            <div className="lg:w-[20%] flex h-full lg:items-start lg:justify-end">
              <p className="lg:text-xl custom-semibold">{review.date}</p>
            </div>
          </div>
        </div>
      ))}

      {reviews.length > 3 && (
        <div className="w-full flex justify-center mt-6">
          <button
            onClick={() => setShowAllReviews(!showAllReviews)}
            className="px-6 py-2 bg-[#E55938] text-white rounded-3xl text-sm hover:bg-[#d44a2b] transition-colors"
          >
            {showAllReviews
              ? "Show Less Reviews"
              : `Show All Reviews (${reviews.length})`}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
