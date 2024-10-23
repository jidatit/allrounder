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
import ContentLoader from "react-content-loader";
import { useAuth } from "../../context/authContext";
import ActivitySkeletonLoader from "../components/ActivitySkeleton";

const ActivityManagement = () => {
  const [activities, setActivities] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "activities"));
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
  if (loading) {
    return <ActivitySkeletonLoader />;
  }
  const handleDelete = async (activityId) => {
    try {
      // Create a query to find the document with matching activityId
      const activitiesRef = collection(db, "activities");
      const q = query(activitiesRef, where("activityId", "==", activityId));

      // Get the document that matches the activityId
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Get the first matching document
        const documentToDelete = querySnapshot.docs[0];

        // Delete the document using its document ID
        await deleteDoc(doc(db, "activities", documentToDelete.id));

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
    <div className="flex flex-col min-h-[94.9vh] items-start justify-start overflow-x-hidden w-full gap-y-6 sm:gap-y-8 lg:gap-y-12 p-2 sm:p-4 z-50">
      {/* Header section */}
      <div className="flex flex-col smd:flex-row items-start sssm:items-center justify-between w-full gap-4 smd:gap-0">
        <h1 className="text-lg sssm:text-xl font-bold text-black">
          Activity Management
        </h1>
        <Link to="/AdminLayout/addActivity">
          <button className="py-2 px-8 sssm:py-3 sssm:px-14 bg-[#E55938] text-white rounded-full shadow-lg cursor-pointer text-base sssm:text-lg w-full sssm:w-auto">
            Create Event
          </button>
        </Link>
      </div>
      <div className="p-2 sssm:p-4 scrollbar-custom w-full">
        {loading ? (
          <div className="flex items-center justify-center h-screen w-full">
            <div role="status">
              <svg
                aria-hidden="true"
                className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
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
              onDelete={handleDelete}
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
}) => {
  const { currentUser } = useAuth();
  let featureActivityParam = "simpleActivity";
  const [featuredActivities, setFeaturedActivities] = useState([]);
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

  return (
    <Link
      to={`/post/${activityIdParam}/${featureActivityParam}`}
      className="flex flex-col items-start gap-3 sssm:gap-5 justify-start p-2 sm:p-3 lg:p-4 w-full"
    >
      <div className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden w-full">
        <div className="flex flex-col gap-4 lg:gap-0 lg:flex-row p-3 sssm:p-4">
          {/* Image container */}
          <div className="w-full lg:w-[40%] smd:mr-4 h-[200px] sssm:h-[250px] smd:h-[30vh]">
            <img
              src={url}
              alt={name}
              className="w-full h-full object-cover rounded-md"
            />
          </div>

          {/* Content container */}
          <div className="w-full flex flex-col justify-between mt-4 smd:mt-0 xl:pl-3">
            <div>
              {/* Title and Featured button */}
              <div className="flex flex-col ssm:flex-row items-start ssm:items-center justify-between w-full gap-2">
                <h3 className="text-lg sssm:text-xl font-semibold mb-2">
                  {name}
                </h3>
                {featuredActivities.some(
                  (featured) => featured.activityId === activityIdParam
                ) && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToFeature();
                    }}
                    className="flex items-center bg-[#E55938] text-white rounded-full px-3 py-1 sssm:px-4 sssm:py-2 hover:bg-[#dd4826] text-sm sssm:text-base"
                  >
                    <MdStarRate className="mr-1" />
                    Featured Activity
                  </button>
                )}
              </div>

              {/* Address and Contact */}
              <p className="text-gray-600 mb-2 text-sm sssm:text-base">
                {address}
              </p>
              <p className="flex items-center text-gray-600 text-sm sssm:text-base">
                <LuPhone className="mr-2" />
                {contact}
              </p>
            </div>

            {/* Bottom buttons */}
            <div className="flex flex-col w-full smd:flex-row justify-between items-start ssm:items-center gap-4 smd:gap-0 mt-4">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  deleteFeatured(activityIdParam);
                }}
                className="flex items-center  bg-[#E55938] text-white rounded-full px-3 py-1 lg:px-2.5 xl::px-4 sssm:py-2 hover:bg-[#dd4826] text-sm sssm:text-base w-full ssm:w-auto justify-center ssm:justify-start"
              >
                <MdStarRate className="mr-1" />
                {featuredActivities.some(
                  (featured) => featured.activityId === activityIdParam
                )
                  ? "Remove from Featured"
                  : "Add to Feature"}
              </button>

              {currentUser?.userType === "admin" && (
                <div className="flex flex-col ssm:flex-row items-start ssm:items-center space-x-2 md:space-x-0 lg:space-x-4 w-full ssm:w-auto">
                  <Link
                    to={`/AdminLayout/editActivity/${activityIdParam}/${
                      featuredActivities.some(
                        (featured) => featured.activityId === activityIdParam
                      )
                        ? "featureActivity"
                        : featureActivityParam
                    }`}
                    className="flex items-center text-black text-sm sssm:text-base w-auto justify-center ssm:justify-start"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaEdit className="mr-1" />
                    Edit Activity
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      onDelete(activityIdParam);
                    }}
                    className="flex items-center text-black hover:text-black text-sm sssm:text-base w-full ssm:w-auto justify-center ssm:justify-start"
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

export default ActivityManagement;
