import React, { useState, useEffect, useRef } from "react";
import { IoStarSharp, IoTrashSharp, IoPencilSharp } from "react-icons/io5";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { useAuth } from "../../context/authContext";

const ReviewsList = ({
  activityId,
  loading,
  error,
  reviews,
  setShowAllReviews,
  showAllReviews,
  avatar,
}) => {
  const [editingReviewId, setEditingReviewId] = useState(null);

  const [editedReviewDescription, setEditedReviewDescription] = useState("");
  const { currentUser } = useAuth();
  const reviewContainerRef = useRef(null);

  // Scroll to top when showing only 3 reviews
  useEffect(() => {
    if (!showAllReviews && reviewContainerRef.current) {
      reviewContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [showAllReviews]);
  const handleEditReview = async (reviewId, description) => {
    setEditingReviewId(reviewId);
    setEditedReviewDescription(description);
  };

  const handleSaveEditedReview = async (reviewId) => {
    try {
      // References to both collections
      const activitiesRef = collection(db, "activities");
      const featuredActivitiesRef = collection(db, "featuredActivities");

      // Query for the specific activity in the `activities` collection
      const qActivities = query(
        activitiesRef,
        where("activityId", "==", Number(activityId))
      );
      const activitiesSnapshot = await getDocs(qActivities);

      if (!activitiesSnapshot.empty) {
        const activityDoc = activitiesSnapshot.docs[0];
        const activityData = activityDoc.data();

        // Query for the specific activity in the `featuredActivities` collection
        const qFeaturedActivities = query(
          featuredActivitiesRef,
          where("activityId", "==", Number(activityId))
        );
        const featuredActivitiesSnapshot = await getDocs(qFeaturedActivities);

        // Update the edited review in the reviews array
        const updatedReviews = activityData.reviews.map((review) => {
          if (String(review.id) === String(reviewId)) {
            return { ...review, description: editedReviewDescription };
          }
          return review;
        });

        // Define an update promise for the `activities` collection
        const activityUpdate = updateDoc(
          doc(db, "activities", activityDoc.id),
          { reviews: updatedReviews }
        );

        // Define an update promise for the `featuredActivities` collection, if a match is found
        let featuredActivityUpdate = null;
        if (!featuredActivitiesSnapshot.empty) {
          const featuredActivityDoc = featuredActivitiesSnapshot.docs[0];
          featuredActivityUpdate = updateDoc(
            doc(db, "featuredActivities", featuredActivityDoc.id),
            { reviews: updatedReviews }
          );
        }

        // Check if user document exists before updating
        const userDocRef = doc(db, "users", reviewId);
        const userDocSnapshot = await getDoc(userDocRef);

        let userUpdate = null;
        if (userDocSnapshot.exists()) {
          userUpdate = updateDoc(userDocRef, {
            reviews: updatedReviews,
          });
        }

        // Execute updates concurrently
        const updatePromises = [activityUpdate];
        if (userUpdate) updatePromises.push(userUpdate);
        if (featuredActivityUpdate) updatePromises.push(featuredActivityUpdate);

        await Promise.all(updatePromises);

        // Reset the editing state
        setEditingReviewId(null);
        setEditedReviewDescription("");
      }
    } catch (error) {
      console.error("Error updating review:", error);
      alert("Failed to update review. Please try again.");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      // References to both collections
      const activitiesRef = collection(db, "activities");
      const featuredActivitiesRef = collection(db, "featuredActivities");

      // Query to find the activity document in the `activities` collection
      const qActivities = query(
        activitiesRef,
        where("activityId", "==", Number(activityId))
      );
      const activitiesSnapshot = await getDocs(qActivities);

      if (!activitiesSnapshot.empty) {
        const activityDoc = activitiesSnapshot.docs[0];
        const activityData = activityDoc.data();

        // Remove the specific review from the reviews array
        const updatedReviews = activityData.reviews.filter(
          (review) => String(review.id) !== String(reviewId)
        );

        // Update the `activities` collection
        const activityUpdate = updateDoc(
          doc(db, "activities", activityDoc.id),
          { reviews: updatedReviews }
        );

        // Check for a matching document in `featuredActivities` and update if found
        const qFeaturedActivities = query(
          featuredActivitiesRef,
          where("activityId", "==", Number(activityId))
        );
        const featuredActivitiesSnapshot = await getDocs(qFeaturedActivities);

        let featuredActivityUpdate = null;
        if (!featuredActivitiesSnapshot.empty) {
          const featuredActivityDoc = featuredActivitiesSnapshot.docs[0];
          featuredActivityUpdate = updateDoc(
            doc(db, "featuredActivities", featuredActivityDoc.id),
            { reviews: updatedReviews }
          );
        }

        // Check if user document exists before updating
        const userDocRef = doc(db, "users", reviewId);
        const userDocSnapshot = await getDoc(userDocRef);

        let userUpdate = null;
        if (userDocSnapshot.exists()) {
          // Filter out the specific review in the user's document
          const userData = userDocSnapshot.data();
          const updatedUserReviews = userData.reviews.filter(
            (review) => String(review.id) !== String(reviewId)
          );

          userUpdate = updateDoc(userDocRef, {
            reviews: updatedUserReviews,
          });
        }

        // Execute updates concurrently
        const updatePromises = [activityUpdate];
        if (featuredActivityUpdate) updatePromises.push(featuredActivityUpdate);
        if (userUpdate) updatePromises.push(userUpdate);

        await Promise.all(updatePromises);

        alert("Review deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review. Please try again.");
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading reviews...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  if (!reviews.length) {
    return <div className="text-center py-4">No reviews yet</div>;
  }
  const calculateAverageRating = (reviews) => {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : "0";
  };

  const averageRating = calculateAverageRating(reviews);
  return (
    <div className="">
      <div
        ref={reviewContainerRef}
        className={`${
          reviews.length > 3 && !showAllReviews
            ? "max-h-[calc(3*230px)] overflow-hidden"
            : "max-h-[700px] overflow-x-auto"
        } transition-all`}
        style={{
          display: showAllReviews ? "flex" : "block",
          flexDirection: showAllReviews ? "column" : "column",
          gap: showAllReviews ? "1rem" : "0",
          overflowX: showAllReviews ? "scroll" : "hidden",
        }}
      >
        {reviews.map((review, index) => (
          <div
            key={index}
            className={`${index >= 3 && !showAllReviews ? "hidden" : ""}`}
          >
            <div
              className={`flex flex-col lg:flex-row justify-between items-start gap-2 lg:gap-0 h-full py-6 ${
                index === 0 ? "" : "border-t"
              }`}
            >
              <div className="lg:w-[20%] flex items-start h-full gap-2">
                <div className="w-16 h-16 rounded-full overflow-hidden shadow-xl p-1">
                  <img
                    src={review.profilePicture || avatar}
                    alt=""
                    className="object-cover object-center w-full h-full rounded-full"
                  />
                </div>
                <div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, index) => (
                      <IoStarSharp
                        key={index}
                        className={
                          index < review.rating
                            ? "text-[#FFA432]"
                            : "text-[#CFD9DE]"
                        }
                      />
                    ))}
                  </div>
                  <p className="mt-2">{review.name}</p>
                </div>
              </div>
              <div className="lg:w-[60%]">
                {editingReviewId === review.id ? (
                  <div className="flex flex-col items-center gap-2">
                    <textarea
                      className="w-full p-2 h-[20vh] overflow-y-auto border-1 border-gray-400 rounded-xl"
                      value={editedReviewDescription}
                      onChange={(e) =>
                        setEditedReviewDescription(e.target.value)
                      }
                    />
                    <div className="flex justify-end w-full items-end">
                      <button
                        className="bg-[#E55938] text-white rounded-xl shadow-md py-2 px-4 hover:bg-[#d44a2b] transition-colors"
                        onClick={() => handleSaveEditedReview(review.id)}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-y-3">
                    <p className="custom-bold font-bold mb-2">{review.title}</p>
                    <p>{review.description}</p>
                    {currentUser?.userType === "admin" &&
                      editingReviewId !== review.id && (
                        <div className="flex flex-row gap-x-3 justify-end">
                          <button
                            className="bg-[#E55938] text-white rounded-full shadow-md py-2 px-4 hover:bg-[#d44a2b] transition-colors"
                            onClick={() =>
                              handleEditReview(review.id, review.description)
                            }
                          >
                            <IoPencilSharp size={18} />
                          </button>
                          <button
                            className="bg-[#E55938] text-white rounded-full shadow-md py-2 px-4 hover:bg-[#d44a2b] transition-colors"
                            onClick={() => handleDeleteReview(review.id)}
                          >
                            <IoTrashSharp size={18} />
                          </button>
                        </div>
                      )}
                  </div>
                )}
              </div>
              <div className="lg:w-[20%] flex h-full lg:items-start lg:justify-end">
                <div className="flex items-center gap-2">
                  <p className="lg:text-xl custom-semibold">{review.date}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

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
