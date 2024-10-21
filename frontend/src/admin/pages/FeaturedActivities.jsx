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
  }, [activities]);

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

  return (
    <div className="flex flex-col min-h-[80.9vh] items-start justify-start overflow-x-hidden w-full gap-y-12 z-50">
      <div className="flex flex-row items-center justify-between w-full ml-4">
        <h1 className="text-xl font-bold text-black">Featured Activities</h1>
      </div>
      <div className="p-4 scrollbar-custom w-full">
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
              onDelete={handleDelete} // Pass the handleDelete function as a prop
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
}) => {
  const [featuredActivities, setFeaturedActivities] = useState([]);
  const featureActivityParam = "featureActivity";
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
  }, [featuredActivities]);
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
      to={`/post/${activityIdParam}`}
      className="flex flex-col items-start gap-5 justify-start p-3 lg:p-4 h-full w-full"
    >
      <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden w-full">
        <div className="flex p-4">
          <div className="w-[40%] mr-4 h-[30vh]">
            <img
              src={url}
              alt={name}
              className="w-full h-full object-cover rounded-md"
            />
          </div>
          <div className="w-2/3 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">{name}</h3>
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
                  handleAddToFeature();
                }}
                className="flex items-center bg-[#E55938] text-white rounded-full px-4 py-2 hover:bg-[#dd4826]"
              >
                <MdStarRate className="mr-1" />
                {featuredActivities.some(
                  (featured) => featured.activityId === activityIdParam
                )
                  ? "Featured Activity"
                  : "Add to Feature"}
              </button>
              <div className="flex items-center space-x-4">
                <Link
                  to={`/AdminLayout/editActivity/${activityIdParam}/${featureActivityParam}`}
                  className="flex items-center text-black"
                  onClick={(e) => e.stopPropagation()} // Prevent navigation to activity details
                >
                  <FaEdit className="mr-1" />
                  Edit Activity
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onDelete(activityIdParam);
                  }}
                  className="flex items-center text-black hover:text-black"
                >
                  <MdDeleteOutline className="mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedActivities;
