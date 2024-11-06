import { LuPhone } from "react-icons/lu";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { MdDeleteOutline, MdStarRate } from "react-icons/md";
import { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { toast } from "react-toastify";
import { useAuth } from "../../context/authContext";
import ActivitySkeletonLoader from "../components/ActivitySkeleton";

const FeaturedActivities = () => {
  const [activities, setActivities] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "featuredActivities")
        );
        const activitiesData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          docId: doc.id,
        }));
        setActivities(activitiesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching activities:", error);
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const handleDelete = async (activityId) => {
    try {
      // Create a query to find the document with matching activityId
      const activitiesRef = collection(db, "featuredActivities");
      const q = query(activitiesRef, where("activityId", "==", activityId));

      // Get the document that matches the activityId
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Get the first matching document
        const documentToDelete = querySnapshot.docs[0];

        // Delete the document using its document ID
        await deleteDoc(doc(db, "featuredActivities", documentToDelete.id));

        // Update the local state immediately
        setActivities((prevActivities) =>
          prevActivities.filter(
            (activity) => activity.activityId !== activityId
          )
        );

        toast.success("Activity deleted successfully");
      } else {
        toast.error("Activity not found");
      }
    } catch (error) {
      console.error("Error deleting activity:", error);
      toast.error("Error deleting activity: " + error.message);
    }
  };
  const deleteFeatured = async (activityId) => {
    try {
      // Create a query to find the document with matching activityId
      const activitiesRef = collection(db, "featuredActivities");
      const q = query(activitiesRef, where("activityId", "==", activityId));

      // Get the document that matches the activityId
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Get the first matching document
        const documentToDelete = querySnapshot.docs[0];

        // Delete the document using its document ID
        await deleteDoc(doc(db, "featuredActivities", documentToDelete.id));

        // Update the local state immediately
        setActivities((prevActivities) =>
          prevActivities.filter(
            (activity) => activity.activityId !== activityId
          )
        );

        toast.success("Activity deleted successfully");
      } else {
        toast.error("Activity not found");
      }
    } catch (error) {
      console.error("Error deleting activity:", error);
      toast.error("Error deleting activity: " + error.message);
    }
  };
  return (
    <div className="flex flex-col min-h-[80.9vh] items-start justify-start overflow-x-hidden w-full gap-y-12 z-50">
      <div className="flex flex-row items-center justify-between w-full ml-4">
        <h1 className="text-xl font-bold text-black">Featured Activities</h1>
      </div>
      <div className="p-4 scrollbar-custom w-full">
        {loading ? (
          <ActivitySkeletonLoader />
        ) : activities.length === 0 ? (
          <div>No activities found</div>
        ) : (
          activities.map((activity) => (
            <BlogCard
              key={activity.docId}
              activityIdParam={activity.activityId}
              docId={activity.docId}
              name={activity.title}
              address={activity.location}
              contact={activity.host?.phone || "N/A"}
              url={
                activity.imageUrls?.[0] ||
                "/Sports-banners/sports-teacher-with-her-students_23-2149070768.png"
              }
              activityData={activity}
              onDelete={handleDelete} // Pass the handleDelete function as a prop
              deleteFeatured={deleteFeatured}
            />
          ))
        )}
      </div>
    </div>
  );
};

const BlogCard = ({
  name,
  address,
  contact,
  url,
  activityIdParam,
  docId,
  activityData,
  onDelete,
  deleteFeatured,
  loading,
}) => {
  const { currentUser } = useAuth();
  const [featuredActivities, setFeaturedActivities] = useState([]);

  let featureActivityParam = "featureActivity";
  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "featuredActivities")
        );
        const activitiesData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          docId: doc.id,
        }));
        setFeaturedActivities(activitiesData);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchFeatures();
  }, []);
  const handleAddToFeature = async () => {
    try {
      // Check if the activity is already featured
      const featuredActivitiesRef = collection(db, "featuredActivities");
      const q = query(
        featuredActivitiesRef,
        where("activityId", "==", activityIdParam)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        toast.info("This activity is already featured!");
        return;
      }

      // Add the activity to the featuredActivities collection
      await addDoc(featuredActivitiesRef, {
        ...activityData,
        activityId: activityIdParam,
        featuredAt: new Date(),
      });

      toast.success("Activity added to featured list!");
    } catch (error) {
      console.error("Error adding activity to featured list:", error);
      toast.error("Failed to add activity to featured list");
    }
  };

  return loading ? (
    <ActivitySkeletonLoader /> // Show skeleton loader while loading
  ) : (
    <Link
      to={`/post/${activityIdParam}/${featureActivityParam}`}
      className="flex flex-col items-start gap-5 justify-start p-3 lg:p-4 w-full"
    >
      <div className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden w-full">
        <div className="flex p-4">
          <div className="w-[40%] mr-4 h-[30vh]">
            <img
              src={url}
              alt={name}
              className="w-full h-full object-cover rounded-md"
            />
          </div>
          <div className="w-2/3 flex pl-3 flex-col justify-between">
            <div>
              <div className="flex items-center justify-between w-full gap-2">
                <h3 className="text-xl font-semibold mb-2">
                  {" "}
                  {name.length > 65 ? `${name.slice(0, 65)}...` : name}
                </h3>
                {featuredActivities.some(
                  (featured) => featured.activityId === activityIdParam
                ) ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault(); // Prevent navigation
                      handleAddToFeature();
                    }}
                    className="flex items-center bg-[#E55938] text-white rounded-full px-4 py-2 hover:bg-[#dd4826]"
                  >
                    <MdStarRate className="mr-1" />
                    {featuredActivities.some(
                      (featured) => featured.activityId === activityIdParam
                    )
                      ? "Featured Activity"
                      : ""}
                  </button>
                ) : (
                  ""
                )}
              </div>

              <p className="text-gray-600 mb-2">{address}</p>
              <p className="flex items-center text-gray-600">
                <LuPhone className="mr-2" />
                {contact}
              </p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={(e) => {
                  e.preventDefault(); // Prevent navigation
                  deleteFeatured(activityIdParam);
                }}
                className="flex items-center bg-[#E55938] text-white rounded-full px-4 py-2 hover:bg-[#dd4826]"
              >
                <MdStarRate className="mr-1" />
                {featuredActivities.some(
                  (featured) => featured.activityId === activityIdParam
                )
                  ? "Remove from Featured"
                  : "Add to Feature"}
              </button>

              {currentUser?.userType === "admin" && (
                <div className="flex items-center space-x-4 mr-2">
                  <Link
                    to={
                      featuredActivities.some(
                        (featured) => featured.activityId === activityIdParam
                      )
                        ? `/AdminLayout/editActivity/${activityIdParam}/${(featureActivityParam =
                            "featureActivity")}`
                        : `/AdminLayout/editActivity/${activityIdParam}/${featureActivityParam} `
                    }
                    className="flex items-center text-black"
                    onClick={(e) => e.stopPropagation()} // Prevent navigation to activity details
                  >
                    <FaEdit className="mr-1" />
                    Edit Activity
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault(); // Prevent navigation
                      onDelete(activityIdParam);
                    }}
                    className="flex items-center text-black hover:text-black"
                  >
                    <MdDeleteOutline className="mr-1" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedActivities;
