import React, { useState, useEffect } from "react";
import { IoStarSharp, IoTrashSharp, IoPencilSharp } from "react-icons/io5";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";

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

  const handleEditReview = async (reviewId, description) => {
    setEditingReviewId(reviewId);
    setEditedReviewDescription(description);
  };

  const handleSaveEditedReview = async (reviewId) => {
    try {
      // Find the activity document
      const activitiesRef = collection(db, "activities");
      const q = query(
        activitiesRef,
        where("activityId", "==", Number(activityId))
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const activityDoc = querySnapshot.docs[0];
        const activityData = activityDoc.data();

        // Update the edited review in the reviews array
        const updatedReviews = activityData.reviews.map((review) => {
          if (review.userId === reviewId) {
            return { ...review, description: editedReviewDescription };
          }
          return review;
        });

        // Update the activity document with the modified reviews array
        await updateDoc(doc(db, "activities", activityDoc.id), {
          reviews: updatedReviews,
        });

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
      // Find the activity document
      const activitiesRef = collection(db, "activities");
      const q = query(
        activitiesRef,
        where("activityId", "==", Number(activityId))
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const activityDoc = querySnapshot.docs[0];
        const activityData = activityDoc.data();

        // Remove the deleted review from the reviews array
        const updatedReviews = activityData.reviews.filter(
          (review) => review.userId !== reviewId
        );

        // Update the activity document with the modified reviews array
        await updateDoc(doc(db, "activities", activityDoc.id), {
          reviews: updatedReviews,
        });
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
                  src={avatar}
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
              {editingReviewId === review.userId ? (
                <div className="flex flex-col items-center gap-2">
                  <textarea
                    className="w-full p-2 h-[20vh] overflow-y-auto border-1 border-gray-400 rounded-xl"
                    value={editedReviewDescription}
                    onChange={(e) => setEditedReviewDescription(e.target.value)}
                  />
                  <div className="flex justify-end w-full items-end">
                    <button
                      className="bg-[#E55938] text-white rounded-xl shadow-md py-2 px-4 hover:bg-[#d44a2b] transition-colors"
                      onClick={() => handleSaveEditedReview(review.userId)}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-y-3">
                  <p className="custom-bold font-bold mb-2">{review.title}</p>
                  <p>{review.description}</p>
                  {editingReviewId !== review.userId && (
                    <div className="flex flex-row gap-x-3 justify-end">
                      <button
                        className="bg-[#E55938] text-white rounded-full shadow-md py-2 px-4 hover:bg-[#d44a2b] transition-colors"
                        onClick={() =>
                          handleEditReview(review.userId, review.description)
                        }
                      >
                        <IoPencilSharp size={18} />
                      </button>
                      <button
                        className="bg-[#E55938] text-white rounded-full shadow-md py-2 px-4 hover:bg-[#d44a2b] transition-colors"
                        onClick={() => handleDeleteReview(review.userId)}
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
