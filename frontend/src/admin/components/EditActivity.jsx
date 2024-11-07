import React, { useEffect, useState } from "react";
import { Camera, Plus, Search, X } from "lucide-react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../config/firebase";
import {
  addDoc,
  collection,
  deleteField,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { ActivityImages, ProfilePicture } from "./ImageMnagment";

const EditActivityComponent = () => {
  const { activityIdParam, featureActivityParam } = useParams();

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    activityId: "",
    images: Array(3).fill(null),
    imagesPreviews: Array(3).fill(null),
    title: "",
    price: "",
    description: "",
    details: [""],
    location: "",
    hashtags: [""],
    category: "",
    showGoogleMap: false,
    host: {
      name: "",
      phone: "",
      email: "",
      about: "",
      website: "",
      profilePic: null,
      profilePicPreview: null,
    },
    startingHours: "",
    endingHours: "",
  });

  // Fetch and populate formData when the component mounts

  const categories = [
    "Sports",
    "Music",
    "Art",
    "Education",
    "Technology",
    "Food",
    "Travel",
    "Other",
  ];

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        setLoading(true);
        let activitiesRef;
        if (featureActivityParam === "featureActivityParam") {
          activitiesRef = collection(db, "featuredActivities");
        } else if (featureActivityParam !== "featureActivityParam") {
          activitiesRef = collection(db, "activities");
        }
        const q = query(
          activitiesRef,
          where("activityId", "==", Number(activityIdParam)) // Ensure it’s a number if needed
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          throw new Error("Activity not found");
        }

        // Get the first matching document
        const activityDoc = querySnapshot.docs[0];
        const activityData = activityDoc.data();
        console.log("activityData", activityData);

        // Update formData with fetched data
        setFormData({
          ...formData,
          activityId: activityData.activityId,
          images: activityData.imageUrls || Array(3).fill(null),
          imagesPreviews: activityData.imageUrls || Array(3).fill(null),
          title: activityData.title || "",
          description: activityData.description || "",
          details: activityData.details?.length ? activityData.details : [""],
          location: activityData.location || "",
          price: activityData.price || "",
          hashtags: activityData.hashtags?.length
            ? activityData.hashtags
            : [""],
          category: activityData.category || "",
          showGoogleMap: activityData.showGoogleMap || false,
          host: {
            name: activityData.host?.name || "",
            phone: activityData.host?.phone || "",
            email: activityData.host?.email || "",
            about: activityData.host?.about || "",
            website: activityData.host?.website || "",
            profilePic: null,
            profilePicPreview: activityData.host?.profilePicUrl || null,
          },
          startingHours: activityData.startingHours || "",
          endingHours: activityData.endingHours || "",
          documentId: activityDoc.id, // Store the document ID for updates
        });
      } catch (error) {
        console.error("Error fetching activity:", error);
        toast.error("Failed to load activity data");
      } finally {
        setLoading(false);
      }
    };

    if (activityIdParam) {
      fetchActivityData();
    }
  }, [activityIdParam]);

  const handleImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const newImages = [...formData.images];
      const newPreviews = [...formData.imagesPreviews];
      newImages[index] = file;
      newPreviews[index] = URL.createObjectURL(file);
      setFormData({
        ...formData,
        images: newImages,
        imagesPreviews: newPreviews,
      });
    }
  };

  const handleProfilePicUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        host: {
          ...formData.host,
          profilePic: file,
          profilePicPreview: URL.createObjectURL(file),
        },
      });
    }
  };

  const addDetail = () => {
    setFormData({
      ...formData,
      details: [...formData.details, ""],
    });
  };

  const removeDetail = (index) => {
    const newDetails = formData.details.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      details: newDetails,
    });
  };

  const handleDetailChange = (index, value) => {
    const newDetails = [...formData.details];
    newDetails[index] = value;
    setFormData({
      ...formData,
      details: newDetails,
    });
  };

  const addHashtag = () => {
    setFormData({
      ...formData,
      hashtags: [...formData.hashtags, ""],
    });
  };

  const removeHashtag = (index) => {
    const newHashtags = formData.hashtags.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      hashtags: newHashtags,
    });
  };

  const handleHashtagChange = (index, value) => {
    const newHashtags = [...formData.hashtags];
    newHashtags[index] = value;
    setFormData({
      ...formData,
      hashtags: newHashtags,
    });
  };
  const uploadImages = async (images, activityId) => {
    const uploadedUrls = [];
    console.log("images", images);
    try {
      for (let i = 0; i < images.length; i++) {
        if (images[i]) {
          console.log("image", images[i]);

          // Generate a unique name for each image
          const imageRef = ref(
            storage,
            `activities/${activityId}/image-${Date.now()}-${i}`
          );

          await uploadBytes(imageRef, images[i]);
          const url = await getDownloadURL(imageRef);
          uploadedUrls.push(url);
        }
      }
      console.log("uploadedUrls", uploadedUrls);
      return uploadedUrls;
    } catch (error) {
      console.error("Error uploading images:", error);
      throw new Error("Failed to upload images");
    }
  };

  const editActivity = async (formData) => {
    try {
      // References to both collections with correct collection name
      const activityRef = doc(db, "activities", formData.documentId);

      // Get the document from featuredActivities if activity is featured
      const featuredQuery = query(
        collection(db, "featuredActivities"),
        where("activityId", "==", formData.activityId)
      );
      const featuredSnapshot = await getDocs(featuredQuery);

      // Get the featured document ID if it exists
      let featuredDocId = null;
      if (!featuredSnapshot.empty) {
        featuredDocId = featuredSnapshot.docs[0].id;
      }

      // Reference to featured activity if it exists
      const featuredActivityRef = featuredDocId
        ? doc(db, "featuredActivities", featuredDocId)
        : null;

      // Fetch current data
      const activitySnapshot = await getDoc(activityRef);
      const currentData = activitySnapshot.data();
      const currentImageUrls = currentData.imageUrls || [];

      // Create a new array for updated image URLs
      let updatedImageUrls = [];

      // Handle image uploads
      for (let i = 0; i < formData.images.length; i++) {
        if (formData.images[i] instanceof File) {
          // If there's a new image, upload it
          const newImageUrls = await uploadImages(
            [formData.images[i]],
            formData.activityId
          );
          if (newImageUrls.length > 0) {
            updatedImageUrls[i] = newImageUrls[0];
          }
        } else if (typeof formData.images[i] === "string") {
          // If it's a string (existing URL), keep it
          updatedImageUrls[i] = formData.images[i];
        }
      }

      // Remove any undefined/null values
      updatedImageUrls = updatedImageUrls.filter((url) => url);

      // Prepare the host object, excluding the File object
      const hostUpdateObject = {
        ...formData.host,
        phone: formData.host.phone,
        email: formData.host.email,
        about: formData.host.about,
        website: formData.host.website,
      };

      // Remove the profilePic File object
      delete hostUpdateObject.profilePic;

      // Handle profile picture URL
      if (formData.host.profilePic instanceof File) {
        // Upload new profile picture and get URL
        const profilePicUrl = await uploadImages(
          [formData.host.profilePic],
          formData.activityId
        );
        if (profilePicUrl.length > 0) {
          hostUpdateObject.profilePicUrl = profilePicUrl[0];
        }
      } else if (formData.host.profilePicUrl === null) {
        hostUpdateObject.profilePicUrl = deleteField();
      } else if (currentData.host?.profilePicUrl) {
        hostUpdateObject.profilePicUrl = currentData.host.profilePicUrl;
      }

      // Prepare the update object with all fields
      const updateObject = {
        activityId: formData.activityId,
        title: formData.title,
        description: formData.description,
        details: formData.details,
        location: formData.location,
        price: formData.price,
        hashtags: formData.hashtags,
        category: formData.category,
        showGoogleMap: formData.showGoogleMap,
        startingHours: formData.startingHours,
        endingHours: formData.endingHours,
        imageUrls: updatedImageUrls,
        host: hostUpdateObject,
        updatedAt: serverTimestamp(),
      };

      // Update both documents if featured activity exists
      if (featuredActivityRef) {
        await Promise.all([
          updateDoc(activityRef, updateObject),
          updateDoc(featuredActivityRef, updateObject),
        ]);
        console.log(
          "Updated both activities and featuredActivities collections"
        );
      } else {
        // If only exists in activities collection, update just that one
        await updateDoc(activityRef, updateObject);
        console.log("Updated only activities collection");
      }

      return formData.activityId;
    } catch (error) {
      console.error("Error editing activity:", error);
      throw new Error(`Failed to edit activity: ${error.message}`);
    }
  };

  // Helper function to check if an activity exists in featured collection
  const isActivityFeatured = async (activityId) => {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, "featuredActivities"),
          where("activityId", "==", activityId)
        )
      );
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Error checking featured status:", error);
      return false;
    }
  };

  const handleEditActivity = async (formData) => {
    try {
      const result = await editActivity(formData);
      const isFeatured = await isActivityFeatured(formData.activityId);

      if (isFeatured) {
        toast.success("Activity updated successfully in both collections!");
      } else {
        toast.success("Activity updated successfully!");
      }
      return result;
    } catch (error) {
      toast.error("Failed to update activity: " + error.message);
      throw error;
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updatedActivityId = await handleEditActivity(formData);
      // Toast is already handled in handleEditActivity
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(error.message || "Error submitting form");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div
          role="status"
          className="flex flex-col justify-center items-center"
        >
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
          <h1 className="bg-orange-600 text-white rounded-xl px-4 py-2.5 shadow-md font-radios text-xl mt-4 ">
            Editing You Activity Hold On For a bit...{" "}
          </h1>
        </div>
      </div>
    );
  }
  // Function to fetch a single activity
  //   const getActivity = async (activityId) => {
  //     try {
  //       const docRef = doc(db, "activities");
  //       const docSnap = await getDoc(docRef);

  //       if (docSnap.exists()) {
  //         return {
  //           id: docSnap.id,
  //           ...docSnap.data(),
  //         };
  //       } else {
  //         throw new Error("Activity not found");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching activity:", error);
  //       throw error;
  //     }
  //   };

  //   // Function to fetch activities with filters
  //   const getActivities = async (filters = {}) => {
  //     try {
  //       let q = collection(db, "activities");

  //       // Add filters
  //       if (filters.category) {
  //         q = query(q, where("category", "==", filters.category));
  //       }

  //       if (filters.status) {
  //         q = query(q, where("status", "==", filters.status));
  //       }

  //       const querySnapshot = await getDocs(q);
  //       return querySnapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));
  //     } catch (error) {
  //       console.error("Error fetching activities:", error);
  //       throw error;
  //     }
  //   };

  return (
    <div className="w-full mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-semibold mb-6">Create Activity</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            {/* Images */}
            <ActivityImages
              formData={formData}
              setFormData={setFormData}
              handleImageUpload={handleImageUpload}
            />

            {/* Title */}
            <div className="mb-6 mt-4">
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px]"
              />
            </div>

            {/* Details */}
            <div className="mb-6">
              <div className="flex justify-between w-full">
                <label className="block text-sm font-medium mb-2">
                  Details (points)
                </label>
                <button
                  onClick={addDetail}
                  className="mb-2 text-white bg-red-500 rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {formData.details.map((detail, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={detail}
                    onChange={(e) => handleDetailChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <button
                    onClick={() => removeDetail(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Location */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Location</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter location"
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1">
            {/* Price */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Price</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter price"
              />
            </div>

            {/* Hashtags */}
            <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
              <div className="mb-4">
                <div className="flex justify-between items-center w-full">
                  <label className="block text-sm font-medium mb-2">
                    Add Hashtags
                  </label>
                  <button
                    onClick={addHashtag}
                    className="mb-2 text-white bg-red-500 rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {formData.hashtags.map((hashtag, index) => (
                    <div key={index} className="flex w-[90%] gap-2 mb-2">
                      <input
                        type="text"
                        value={hashtag}
                        onChange={(e) =>
                          handleHashtagChange(index, e.target.value)
                        }
                        className="flex-1 px-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="#hashtag"
                      />
                      <button
                        onClick={() => removeHashtag(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              {/* Category */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Select Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Google Map Toggle */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Show Google Map
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={formData.showGoogleMap}
                      onChange={() =>
                        setFormData({ ...formData, showGoogleMap: true })
                      }
                      className="w-4 h-4 text-blue-500"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={!formData.showGoogleMap}
                      onChange={() =>
                        setFormData({ ...formData, showGoogleMap: false })
                      }
                      className="w-4 h-4 text-blue-500"
                    />
                    No
                  </label>
                </div>
              </div>
            </div>

            {/* Host Details */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-4 w-full">
                <label className="block text-sm font-medium w-[30%]">
                  Host Details
                </label>
              </div>

              <div className="space-y-4">
                <ProfilePicture
                  formData={formData}
                  setFormData={setFormData}
                  handleProfilePicUpload={handleProfilePicUpload}
                />
                <input
                  type="text"
                  placeholder="Host name"
                  value={formData.host.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      host: { ...formData.host, name: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.host.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      host: { ...formData.host, phone: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.host.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      host: { ...formData.host, email: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <textarea
                  placeholder="About The Host"
                  value={formData.host.about}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      host: { ...formData.host, about: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <input
                  type="url"
                  placeholder="Website Link"
                  value={formData.host.website}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      host: { ...formData.host, website: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="time"
                    value={formData.startingHours}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        startingHours: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <input
                    type="time"
                    value={formData.endingHours}
                    onChange={(e) =>
                      setFormData({ ...formData, endingHours: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          onClick={handleEditSubmit}
          className="w-fit px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-400"
        >
          {loading ? "Updating..." : "Update Activity"}
        </button>
      </div>
    </div>
  );
};

export default EditActivityComponent;
