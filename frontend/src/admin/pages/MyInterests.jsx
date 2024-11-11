// import { useAuth } from "../../context/authContext";
// import React, { useState, useEffect } from "react";
// import {
//   collection,
//   getDocs,
//   query,
//   where,
//   doc,
//   getDoc,
//   updateDoc,
//   arrayRemove,
// } from "firebase/firestore";

// import { Star } from "lucide-react";
// import { db } from "../../config/firebase";
// import { IoStar, IoStarOutline } from "react-icons/io5";
// import { toast } from "react-toastify";

// // const ActivityCards = ({ currentUser }) => {
// //   const [activities, setActivities] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   console.log(activities);

// //   useEffect(() => {
// //     const fetchActivities = async () => {
// //       try {
// //         if (!currentUser?.interests?.length) {
// //           setActivities([]);
// //           setLoading(false);
// //           return;
// //         }

// //         const activitiesData = await Promise.all(
// //           currentUser.interests.map(async (interestId) => {
// //             const activityDoc = await getDoc(doc(db, "activities", interestId));
// //             if (activityDoc.exists()) {
// //               return { id: activityDoc.id, ...activityDoc.data() };
// //             }
// //             return null;
// //           })
// //         );

// //         setActivities(activitiesData.filter((activity) => activity !== null));
// //         setLoading(false);
// //       } catch (err) {
// //         console.error("Error fetching activities:", err);
// //         setError("Failed to load activities");
// //         setLoading(false);
// //       }
// //     };

// //     fetchActivities();
// //   }, [currentUser]);

// //   if (loading) {
// //     return (
// //       <div className="flex justify-center items-center min-h-[200px]">
// //         <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return <div className="text-red-500 text-center p-4">{error}</div>;
// //   }

// //   return (
// //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
// //       {activities.map((activity) => (
// //         <div
// //           key={activity.id}
// //           className="relative bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
// //         >
// //           {/* Star Icon */}
// //           <div className="absolute top-2 right-2 z-10">
// //             <Star className="w-6 h-6 text-red-500 fill-current" />
// //           </div>

// //           {/* Activity Image */}
// //           <div className="relative h-48 w-full bg-gray-200">
// //             <img
// //               src={activity.imageUrl || "/api/placeholder/400/320"}
// //               alt={activity.title}
// //               className="w-full h-full object-cover"
// //             />
// //           </div>

// //           {/* Content Container */}
// //           <div className="p-4">
// //             {/* Title */}
// //             <h3 className="text-lg font-semibold text-gray-800 mb-2">
// //               {activity.title || "Toy shop - Grand launch, PWD Islamabad"}
// //             </h3>

// //             {/* Address */}
// //             <p className="text-sm text-gray-600 mb-2">
// //               {activity.address || "1234 Main Street New York, NY 10024"}
// //             </p>

// //             {/* Phone Number */}
// //             <div className="flex items-center text-sm text-gray-600">
// //               <svg
// //                 className="w-4 h-4 mr-2"
// //                 fill="none"
// //                 stroke="currentColor"
// //                 viewBox="0 0 24 24"
// //                 xmlns="http://www.w3.org/2000/svg"
// //               >
// //                 <path
// //                   strokeLinecap="round"
// //                   strokeLinejoin="round"
// //                   strokeWidth="2"
// //                   d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
// //                 />
// //               </svg>
// //               <span>{activity.phoneNumber || "(917) 888-1234"}</span>
// //             </div>
// //           </div>

// //           {/* Delete Button */}
// //           <button
// //             className="absolute bottom-2 right-2 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
// //             aria-label="Delete activity"
// //           >
// //             <svg
// //               className="w-5 h-5 text-gray-600"
// //               fill="none"
// //               stroke="currentColor"
// //               viewBox="0 0 24 24"
// //               xmlns="http://www.w3.org/2000/svg"
// //             >
// //               <path
// //                 strokeLinecap="round"
// //                 strokeLinejoin="round"
// //                 strokeWidth="2"
// //                 d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
// //               />
// //             </svg>
// //           </button>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // };

// const ActivityCards = ({ currentUser }) => {
//   const [activities, setActivities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activityUpdate, setActivityUpdate] = useState(false);
//   console.log(activities);

//   const removeInterest = async (userId, activityId) => {
//     try {
//       const userDocRef = doc(db, "users", userId);

//       await updateDoc(userDocRef, {
//         interests: arrayRemove(activityId),
//       });
//       toast.success("Activity removed from Interested");
//       setActivityUpdate(!activityUpdate);
//     } catch (error) {
//       console.error("Error removing interest: ", error);
//       setActivityUpdate(!activityUpdate);
//     }
//   };

//   useEffect(() => {
//     const fetchActivities = async () => {
//       console.log("activities fetching");

//       try {
//         if (!currentUser?.interests?.length) {
//           setActivities([]);
//           setLoading(false);
//           return;
//         }

//         const activitiesData = await Promise.all(
//           currentUser.interests.map(async (interestId) => {
//             const activityDoc = await getDoc(doc(db, "activities", interestId));
//             if (activityDoc.exists()) {
//               return { id: activityDoc.id, ...activityDoc.data() };
//             }
//             return null;
//           })
//         );

//         setActivities(activitiesData.filter((activity) => activity !== null));
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching activities:", err);
//         setError("Failed to load activities");
//         setLoading(false);
//       }
//     };

//     fetchActivities();
//   }, [currentUser, activityUpdate]);

//   // Function to check if activityId exists in interests

//   useEffect(() => {
//     const fetchActivities = async () => {
//       try {
//         if (!currentUser?.interests?.length) {
//           setActivities([]);
//           setLoading(false);
//           return;
//         }

//         const activitiesData = await Promise.all(
//           currentUser.interests.map(async (interestId) => {
//             const activityDoc = await getDoc(doc(db, "activities", interestId));
//             if (activityDoc.exists()) {
//               return { id: activityDoc.id, ...activityDoc.data() };
//             }
//             return null;
//           })
//         );

//         setActivities(activitiesData.filter((activity) => activity !== null));
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching activities:", err);
//         setError("Failed to load activities");
//         setLoading(false);
//       }
//     };

//     fetchActivities();
//   }, [currentUser]);

//   const getFirstImageUrl = (imageUrls) => {
//     if (Array.isArray(imageUrls) && imageUrls.length > 0) {
//       return imageUrls[0];
//     }
//     return "/api/placeholder/400/320"; // Fallback image
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-[200px]">
//         <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return <div className="text-red-500 text-center p-4">{error}</div>;
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-4 ">
//       {activities.map((activity) => (
//         <div
//           key={activity.id}
//           className="relative bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300  pb-6"
//         >
//           {/* Star Icon */}
//           <div>
//             <button
//               className="absolute bottom-4 right-4 bg-white p-2 rounded-full border-2 border-black text-2xl text-black"
//               title="Add to My Interests"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 e.preventDefault();
//                 console.log("activity removed", currentUser);
//                 // handleInterestUpdate(currentUser.id, docId);
//                 removeInterest(currentUser.id, activity.id);
//               }}
//             >
//               <IoStar className="text-[#E55938]" />
//             </button>
//           </div>

//           {/* Activity Image */}
//           <div className="relative h-48 w-full bg-gray-200">
//             <img
//               src={getFirstImageUrl(activity.imageUrls)}
//               alt={activity.title}
//               className="w-full h-full object-cover"
//               onError={(e) => {
//                 e.target.onerror = null;
//                 // e.target.src = "/api/placeholder/400/320"; // Fallback image
//               }}
//             />
//           </div>

//           {/* Content Container */}
//           <div className="p-4">
//             {/* Title */}
//             <h3 className="text-xl custom-semibold text-gray-800 mb-2">
//               {activity.title || "Toy shop - Grand launch, PWD Islamabad"}
//             </h3>

//             {/* Address */}
//             <p className="text-sm text-gray-600 mb-2 custom-regular">
//               {activity.address || "1234 Main Street New York, NY 10024"}
//             </p>

//             {/* Phone Number */}
//             <div className="flex items-center text-sm custom-regular text-gray-600">
//               <svg
//                 className="w-4 h-4 mr-2"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
//                 />
//               </svg>
//               <span>{activity.phoneNumber || "(917) 888-1234"}</span>
//             </div>
//           </div>

//           {/* Delete Button */}
//           <button
//             className="absolute bottom-2 right-2 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
//             aria-label="Delete activity"
//           ></button>
//         </div>
//       ))}
//     </div>
//   );
// };

import { useAuth } from "../../context/authContext";
import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { IoStar } from "react-icons/io5";
import { db } from "../../config/firebase";
import { toast } from "react-toastify";

const ActivityCards = ({ currentUser }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const removeInterest = async (userId, activityId) => {
    try {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, {
        interests: arrayRemove(activityId),
      });

      // Update local state to trigger immediate re-render
      setActivities((prevActivities) =>
        prevActivities.filter((activity) => activity.id !== activityId)
      );

      toast.success("Activity removed from Interests");
    } catch (error) {
      console.error("Error removing interest: ", error);
      toast.error("Failed to remove activity");
    }
  };

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        if (!currentUser?.interests?.length) {
          setActivities([]);
          setLoading(false);
          return;
        }

        const activitiesData = await Promise.all(
          currentUser.interests.map(async (interestId) => {
            const activityDoc = await getDoc(doc(db, "activities", interestId));
            if (activityDoc.exists()) {
              return { id: activityDoc.id, ...activityDoc.data() };
            }
            return null;
          })
        );

        setActivities(activitiesData.filter((activity) => activity !== null));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching activities:", err);
        setError("Failed to load activities");
        setLoading(false);
      }
    };

    fetchActivities();
  }, [currentUser]);

  const getFirstImageUrl = (imageUrls) => {
    if (Array.isArray(imageUrls) && imageUrls.length > 0) {
      return imageUrls[0];
    }
    return "/api/placeholder/400/320";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="relative bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 pb-6"
        >
          <div>
            <button
              className="absolute bottom-4 right-4 bg-white p-2 rounded-full border-2 border-black text-2xl text-black"
              title="Remove from My Interests"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                removeInterest(currentUser.id, activity.id);
              }}
            >
              <IoStar className="text-[#E55938]" />
            </button>
          </div>

          <div className="relative h-48 w-full bg-gray-200">
            <img
              src={getFirstImageUrl(activity.imageUrls)}
              alt={activity.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
              }}
            />
          </div>

          <div className="p-4">
            <h3 className="text-xl custom-semibold text-gray-800 mb-2">
              {activity.title || "Toy shop - Grand launch, PWD Islamabad"}
            </h3>

            <p className="text-sm text-gray-600 mb-2 custom-regular">
              {activity.address || "1234 Main Street New York, NY 10024"}
            </p>

            <div className="flex items-center text-sm custom-regular text-gray-600">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span>{activity.phoneNumber || "(917) 888-1234"}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const MyInterests = () => {
  const { currentUser } = useAuth();
  console.log(currentUser);

  return (
    <div>
      <h1 className="custom-bold text-4xl">My Interests</h1>
      <ActivityCards currentUser={currentUser} />
    </div>
  );
};
export default MyInterests;
