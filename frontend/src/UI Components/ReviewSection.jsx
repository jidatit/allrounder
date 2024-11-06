import React, { useState, useEffect } from "react";

import { format } from "date-fns";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Card, CardContent } from "@mui/material";
import { IoStarHalfSharp, IoStarSharp } from "react-icons/io5";
import ReviewsList from "../admin/components/ReviewList";

const ReviewSection = ({ currentUser, activityId, avatar }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userImage, setUserImage] = useState("");

  const handleSubmitReview = async () => {
    if (!description || rating === 0) {
      alert("Please provide both a review and rating");
      return;
    }

    setIsSubmitting(true);
    try {
      // Query the users collection to find the document with the matching uid
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("uid", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error("User details not found");
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      const firstName = userData.firstName || "";
      const lastName = userData.lastName || "";
      const userProfileImage = userData.profileImage || userData.photoURL || ""; // Assuming profile image field name

      const newReview = {
        name: `${firstName} ${lastName}`.trim(),
        rating,
        description,
        title: description.split(" ").slice(0, 4).join(" ") + "...",
        date: format(new Date(), "dd MMMM, yyyy"),
        avatarUrl: userProfileImage,
        userId: currentUser.uid,
      };

      // Find the activity document
      const activitiesRef = collection(db, "activities");
      const qActivity = query(
        activitiesRef,
        where("activityId", "==", Number(activityId))
      );
      const activitySnapshot = await getDocs(qActivity);

      if (!activitySnapshot.empty) {
        const activityDoc = activitySnapshot.docs[0];
        // Update the reviews array
        await updateDoc(doc(db, "activities", activityDoc.id), {
          reviews: arrayUnion(newReview),
        });

        // Reset form
        setDescription("");
        setRating(0);
        setShowReviewForm(false);
      } else {
        throw new Error("Activity not found");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!activityId) return;

    const activitiesRef = collection(db, "activities");
    const q = query(
      activitiesRef,
      where("activityId", "==", Number(activityId))
    );

    // Set up real-time listener with onSnapshot
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        if (!querySnapshot.empty) {
          const activityDoc = querySnapshot.docs[0];
          const activityData = activityDoc.data();

          // Get and sort reviews
          const activityReviews = activityData.reviews || [];
          const sortedReviews = activityReviews.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );

          setReviews(sortedReviews);
          setError(null); // Clear any previous errors
        } else {
          setError("Activity not found");
          setReviews([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching reviews:", error);
        setError("Failed to load reviews");
        setLoading(false);
      }
    );

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, [activityId]);

  // Get displayed reviews based on showAllReviews state
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);
  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  };

  const averageRating = calculateAverageRating(reviews); // Decimal rating (e.g., 3.5)

  return (
    <section className="h-full w-full">
      <div className="h-full w-full mx-auto max-w-[1440px] flex flex-col gap-2 md:gap-3 lg:gap-5">
        <h2 className="custom-bold text-2xl md:text-4xl lg:text-5xl mb-5">
          Customer Reviews
        </h2>
        <div className="flex flex-col md:flex-row lg:items-center justify-between h-full">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <div>
                <p className="custom-bold text-2xl md:text-4xl lg:text-5xl mb-5">
                  {averageRating}
                </p>
              </div>
              <div>
                <p className="text-[#778088] custom-light">
                  {`${reviews.length} reviews`}
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="flex items-center text-5xl">
                {[...Array(5)].map((_, index) => {
                  if (index < Math.floor(averageRating)) {
                    return (
                      <IoStarSharp key={index} className="text-[#FFA432]" />
                    );
                  } else if (
                    index === Math.floor(averageRating) &&
                    averageRating % 1 >= 0.5
                  ) {
                    return (
                      <IoStarHalfSharp key={index} className="text-[#FFA432]" />
                    );
                  } else {
                    return (
                      <IoStarSharp key={index} className="text-[#CFD9DE]" />
                    );
                  }
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="md:mt-0 mt-3">
          {!showReviewForm ? (
            <div className="flex justify-end items-end w-full">
              <button
                onClick={() => setShowReviewForm(true)}
                className="w-[110px] h-[33px] md:w-[137px] lg:w-[181px] lg:h-[48px] bg-[#E55938] rounded-3xl text-xs md:text-sm lg:text-lg text-white custom-semibold flex items-center justify-center"
              >
                Write a Review
              </button>
            </div>
          ) : (
            <Card className="w-full mt-4 p-4 ">
              <CardContent>
                <div className="flex flex-col gap-4">
                  <textarea
                    placeholder="Write your review here..."
                    className="min-h-[150px] p-4 border-1 border-gray-300 rounded-xl"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-600">Your Rating:</p>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <IoStarSharp
                          key={star}
                          className={`text-2xl cursor-pointer ${
                            star <= (hoverRating || rating)
                              ? "text-[#FFA432]"
                              : "text-[#CFD9DE]"
                          }`}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowReviewForm(false)}
                      className="px-4 py-2 rounded-md border border-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitReview}
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-[#E55938] text-white rounded-md"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Review"}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        {/* <div className="">
          {CustomerReviews.map((review, index) => (
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
        </div> */}
        <ReviewsList
          activityId={activityId}
          setShowAllReviews={setShowAllReviews}
          showAllReviews={showAllReviews}
          error={error}
          loading={loading}
          reviews={displayedReviews}
          avatar={avatar}
        />
      </div>
    </section>
  );
};

export default ReviewSection;
