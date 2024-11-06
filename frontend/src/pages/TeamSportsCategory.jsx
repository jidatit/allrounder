import React, { useEffect, useState } from "react";
import { CgMenuLeft } from "react-icons/cg";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { LuPhone } from "react-icons/lu";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import L from "leaflet";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdDeleteOutline, MdStarRate } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { toast } from "react-toastify";
import { useAuth } from "../context/authContext";
import CategoryFilterDropdown from "../admin/components/CategoryDropdown";
import ActivitiesMap from "../admin/components/ActivitiesMap";
import ActivitySkeletonLoader from "../admin/components/ActivitySkeleton";
import { IoStar, IoStarOutline } from "react-icons/io5";

const createCustomIcon = (number) => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div class="marker-icon bg-white flex items-center justify-center shadow-lg font-bold rounded-full px-3  text-xl  ">${number}</div>`,
    iconSize: [30, 30],
    iconAnchor: [30, 30],
  });
};

const TeamSportsCategory = () => {
  // const locations = [
  //   { id: 1, name: "Location 1", lat: 33.672326, lng: 73.001917 },
  //   { id: 2, name: "Location 2", lat: 33.655181, lng: 3.033181 },
  //   { id: 3, name: "Location 3", lat: 33.672326, lng: 73.001918 },
  // ];
  const [activities, setActivities] = useState([]);
  const { name } = useParams(); // Get category from URL params
  const [loading, setLoading] = useState(true);
  const [locationMap, setLocationMap] = useState([]);
  const navigate = useNavigate();
  // Fetch all activities initially
  const updateMapLocations = async (activitiesToMap) => {
    const provider = new OpenStreetMapProvider();
    const locationPromises = activitiesToMap.map(async (activity) => {
      const results = await provider.search({ query: activity.location });
      return {
        id: activity.activityId,
        name: activity.location,
        lat: results[0]?.y,
        lng: results[0]?.x,
      };
    });

    const newLocations = await Promise.all(locationPromises);
    setLocationMap(newLocations);
  };
  useEffect(() => {
    const fetchAllActivities = async () => {
      try {
        setLoading(true);
        const activitiesRef = collection(db, "activities");
        const querySnapshot = await getDocs(activitiesRef);
        const activitiesData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          docId: doc.id,
        }));
        setActivities(activitiesData);

        // Apply initial filtering based on URL param
        const initialFiltered = name
          ? activitiesData.filter((activity) => activity.category === name)
          : activitiesData;

        setFilteredActivities(initialFiltered);

        // Update map locations
        await updateMapLocations(initialFiltered);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching activities:", error);

        setLoading(false);
      }
    };

    fetchAllActivities();
  }, []);
  // Single useEffect to fetch all activities
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        // Always fetch all activities
        const activitiesRef = collection(db, "activities");
        const querySnapshot = await getDocs(activitiesRef);
        const activitiesData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          docId: doc.id,
        }));

        setActivities(activitiesData);

        // Initially filter based on URL param
        const initialFiltered = name
          ? activitiesData.filter((activity) => activity.category === name)
          : activitiesData;

        setFilteredActivities(initialFiltered);

        // Update map locations
        const provider = new OpenStreetMapProvider();
        const locationPromises = initialFiltered.map(async (activity) => {
          const results = await provider.search({ query: activity.location });
          return {
            id: activity.activityId,
            name: activity.location,
            lat: results[0]?.y,
            lng: results[0]?.x,
          };
        });

        const locations = await Promise.all(locationPromises);
        setLocationMap(locations);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching activities:", error);

        setLoading(false);
      }
    };

    fetchActivities();
  }, [name]); // Only depend on name parameter

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
  const [filteredActivities, setFilteredActivities] = useState(activities);
  // useEffect(() => {
  //   setFilteredActivities(activities);
  // }, [activities]);

  const handleFilterChange = async (selectedCategories) => {
    setLoading(true);
    try {
      let filtered;

      if (selectedCategories.length === 0) {
        // Show all activities when no categories are selected
        filtered = activities;
      } else {
        // Filter by selected categories
        filtered = activities.filter((activity) =>
          selectedCategories.includes(activity.category)
        );
      }

      setFilteredActivities(filtered);

      // Update map
      const provider = new OpenStreetMapProvider();
      const locationPromises = filtered.map(async (activity) => {
        const results = await provider.search({ query: activity.location });
        return {
          id: activity.activityId,
          name: activity.location,
          lat: results[0]?.y,
          lng: results[0]?.x,
        };
      });

      const newLocations = await Promise.all(locationPromises);
      setLocationMap(newLocations);
    } catch (error) {
      console.error("Error updating filters:", error);
      toast.error("Error updating filters");
    }
    setLoading(false);
  };
  let featureActivityParam = "simpleActivity";
  return (
    <main className="h-full w-screen">
      <section className="h-full w-full px-4 sm:px-8 pt-10 xxl:px-16 mx-auto flex flex-col gap-2 md:gap-3 lg:gap-5 ">
        <div className="w-full">
          <h2 className="custom-bold text-2xl md:text-4xl lg:text-5xl">
            {name ? `${name} Activities` : "All Activities"}
          </h2>

          <div className="flex gap-3 custom-medium mt-3 lg:mt-8">
            <CategoryFilterDropdown
              activities={activities}
              onFilterChange={handleFilterChange}
              initialCategory={name}
            />
            {/* <button className="bg-[#EBEBEB] flex items-center justify-center lg:p-2 p-1 px-6 lg:px-8 rounded-full text-sm lg:text-xl gap-1">
              <HiOutlineAdjustmentsHorizontal />
              <p className="text-sm">Filters</p>
            </button> */}
          </div>

          <div className="w-full flex mt-3 lg:pt-8 pt-4 gap-y-6 flex-col lg:flex-row">
            {loading ? (
              <ActivitySkeletonLoader />
            ) : (
              <div className="lg:w-[70%] xxl:w-[60%] h-[860px] overflow-auto scrollbar-custom">
                {filteredActivities.length === 0 ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-2xl">No activities found</p>
                  </div>
                ) : (
                  filteredActivities.map((activity) => (
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
            )}
            <div className="lg:w-[40%] md:h-[600px] h-[500px] lg:h-[800px] xxl:p-4">
              <ActivitiesMap
                activities={filteredActivities}
                locations={locationMap}
                featureActivityParam="simpleActivity"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
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
  const [isInterested, setInterested] = useState(false);

  const handleDelete = async () => {
    // Add delete functionality here
    if (window.confirm("Are you sure you want to delete this activity?")) {
      // Implement delete logic
    }
  };

  const handleAddToFeature = async () => {
    try {
      const featuredRef = collection(db, "featuredActivities");
      const q = query(featuredRef, where("activityId", "==", activityIdParam));

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        toast.info("This activity is already featured!");
        return;
      }

      await addDoc(featuredRef, {
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
  let featureActivityParam = "simpleActivity";

  const [featuredActivities, setFeaturedActivities] = useState([]);
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "featuredActivities"),
      (snapshot) => {
        const activitiesData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          docId: doc.id,
        }));
        setFeaturedActivities(activitiesData);
      },
      (error) => {
        console.error("Error fetching featured activities:", error);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleInterestUpdate = async (userId, activityId) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        // Document exists, check for interests field
        if (userDocSnap.data().interests) {
          // Interests field exists, update it by pushing the new activityId
          await updateDoc(userDocRef, {
            interests: arrayUnion(activityId),
          });
        } else {
          // Interests field does not exist, create it with activityId in array
          await setDoc(
            userDocRef,
            {
              interests: [activityId],
            },
            { merge: true }
          );
        }
      } else {
        // Document does not exist, create it with the interests field
        await setDoc(userDocRef, {
          interests: [activityId],
        });
      }
      toast.success("Activity added to Interested");
      setInterested(true);
    } catch (error) {
      console.error("Error updating interests: ", error);
      toast.error("Error adding Interest", error);
    }
  };

  const removeInterest = async (userId, activityId) => {
    try {
      const userDocRef = doc(db, "users", userId);

      await updateDoc(userDocRef, {
        interests: arrayRemove(activityId),
      });
      toast.success("Activity removed from Interested");
      setInterested(false);
      // toast.success("Interest Removed");
    } catch (error) {
      console.error("Error removing interest: ", error);
    }
  };

  // Function to check if activityId exists in interests
  const checkInterestExists = async (userId, activityId) => {
    console.log(activityId);

    try {
      const userDocRef = doc(db, "users", userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const interests = userDocSnap.data().interests || [];

        return interests.includes(activityId);
      } else {
        console.warn("No document found for this user.");

        return false;
      }
    } catch (error) {
      console.error("Error checking interest: ", error);

      return false;
    }
  };

  useEffect(() => {
    const checkInterest = async () => {
      const isInterestAdded = await checkInterestExists(currentUser.id, docId);
      if (isInterestAdded) {
        setInterested(isInterestAdded);
        console.log("check Interested from function", isInterestAdded);
      }
    };

    checkInterest();
  });

  return (
    <Link
      to={`/post/${activityIdParam}/${featureActivityParam}`}
      className="flex flex-col items-start gap-3 sssm:gap-5 justify-start p-2 sm:p-3 lg:p-4 w-full z-40  "
    >
      <div className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden w-full ">
        <div className="flex flex-col gap-4 lg:gap-0 lg:flex-row p-3 sssm:p-4 ">
          {/* Image container */}
          <div className="w-full lg:w-[40%] smd:mr-4 h-[200px] sssm:h-[250px] smd:h-[30vh]">
            <img
              src={url}
              alt={name}
              className="w-full h-full object-cover rounded-md"
            />
          </div>

          {/* Content container */}
          <div className="w-full flex flex-col justify-between mt-4 smd:mt-0 xl:pl-3 relative">
            <div>
              {isInterested ? (
                <button
                  className="absolute bottom-1 right-0 bg-white p-2 rounded-full border-2 border-black text-2xl text-black"
                  title="Add to My Interests"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    console.log("activity removed", docId, currentUser);
                    // handleInterestUpdate(currentUser.id, docId);
                    removeInterest(currentUser.id, docId);
                  }}
                >
                  <IoStar className="text-yellow-500" />
                </button>
              ) : (
                <button
                  className="absolute bottom-1 right-0 bg-white p-2 rounded-full border-2 border-black text-2xl text-black"
                  title="Add to My Interests"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    console.log("activity added", docId, currentUser);
                    handleInterestUpdate(currentUser.id, docId);
                  }}
                >
                  <IoStarOutline />
                </button>
              )}
            </div>

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
                    // onClick={(e) => {
                    //   e.preventDefault();
                    //   handleAddToFeature();
                    // }}
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
              {currentUser?.userType === "admin" ? (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (
                      featuredActivities.some(
                        (featured) => featured.activityId === activityIdParam
                      )
                    ) {
                      // If the activity is already featured, remove it
                      deleteFeatured(activityIdParam);
                    } else {
                      // If the activity is not featured, add it
                      handleAddToFeature();
                    }
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
              ) : (
                ""
              )}

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
                    className="flex items-center text-black text-sm sssm:text-base w-full justify-center ssm:justify-start"
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

export default TeamSportsCategory;
