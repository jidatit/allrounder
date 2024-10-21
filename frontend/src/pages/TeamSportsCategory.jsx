import React, { useEffect, useState } from "react";
import { CgMenuLeft } from "react-icons/cg";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { LuPhone } from "react-icons/lu";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import L from "leaflet";
import { Link } from "react-router-dom";
import { MdDeleteOutline, MdStarRate } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { toast } from "react-toastify";
import { useAuth } from "../context/authContext";

const createCustomIcon = (number) => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div class="marker-icon bg-white flex items-center justify-center shadow-lg font-bold rounded-full px-3  text-xl  ">${number}</div>`,
    iconSize: [30, 30],
    iconAnchor: [30, 30],
  });
};

const TeamSportsCategory = () => {
  const locations = [
    { id: 1, name: "Location 1", lat: 33.672326, lng: 73.001917 },
    { id: 2, name: "Location 2", lat: 33.655181, lng: 3.033181 },
    { id: 3, name: "Location 3", lat: 33.672326, lng: 73.001918 },
  ];
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationMap, setLocationMap] = useState([]);
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
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "activities"));
        const activitiesData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          docId: doc.id,
        }));
        setActivities(activitiesData);

        // Fetch the location coordinates using geocoding
        const locationss = await Promise.all(
          activitiesData.map(async (activity) => {
            const provider = new OpenStreetMapProvider();
            const results = await provider.search({ query: activity.location });
            return {
              id: activity.activityId,
              name: activity.location,
              lat: results[0]?.y,
              lng: results[0]?.x,
            };
          })
        );
        setLocationMap(locationss);
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
  return (
    <main className="h-full w-screen ">
      <section className="h-full w-full px-4 sm:px-8 pt-10 lg:px-16 mx-auto max-w-[1840px] flex flex-col gap-2 md:gap-3 lg:gap-5">
        <div className="w-full">
          <h2 className="custom-bold text-2xl md:text-4xl lg:text-5xl ">
            All Activities
          </h2>
          {/* filter buttons */}
          <div className="flex gap-3 custom-medium mt-3 lg:mt-8">
            <button className="bg-[#EBEBEB] flex items-center justify-center p-2 px-4  rounded-full text-xl gap-1">
              <CgMenuLeft />
              <p className="text-sm">Categories</p>
            </button>
            <button className="bg-[#EBEBEB] flex items-center justify-center lg:p-2 p-1 px-6 lg:px-8  rounded-full text-sm lg:text-xl gap-1">
              <HiOutlineAdjustmentsHorizontal />
              <p className="text-sm">Filters</p>
            </button>
          </div>
          <div className=" w-full flex mt-3 lg:pt-8 pt-4 flex-col lg:flex-row ">
            {/* Card Container */}

            <div className=" w-[80%] h-[860px]  p-4 overflow-auto scrollbar-custom">
              {activities.map((activity) => (
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
                />
              ))}
            </div>
            <div className=" lg:w-[40%] md:h-[600px] h-[500px] lg:h-[800px] p-4">
              <MapContainer
                center={[33.684422, 73.047882]}
                zoom={12}
                style={{ height: "100%", width: "100%" }}
                className="z-10"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {locations.map((location) => (
                  <Marker
                    key={location.id}
                    position={[location.lat, location.lng]}
                    icon={createCustomIcon(2)}
                  >
                    <Popup>{location.name}</Popup>
                  </Marker>
                ))}
              </MapContainer>
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
}) => {
  const { currentUser } = useAuth();
  const handleDelete = async () => {
    // Add delete functionality here
    if (window.confirm("Are you sure you want to delete this activity?")) {
      // Implement delete logic
    }
  };
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
  }, [featuredActivities]);
  return (
    <Link
      to={`/post/${activityIdParam}`}
      className="flex flex-col items-start gap-5 justify-start p-3 lg:p-4 w-full"
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

              {currentUser?.userType === "admin" && (
                <div className="flex items-center space-x-4">
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

export default TeamSportsCategory;
