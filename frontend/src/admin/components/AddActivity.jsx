import React, { useState } from "react";
import { Camera, Plus, Search, X } from "lucide-react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../config/firebase";
import {
  addDoc,
  collection,
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
import { useNavigate } from "react-router-dom";

const CreateActivity = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    images: [],
    imagesPreviews: [],
    title: "",
    description: "",
    details: [""],
    location: "",
    hashtags: [""],
    category: "",
    showGoogleMap: false,
    price: "",
    host: {
      profilePic: null,
      profilePicPreview: null,
      name: "",
      phone: "",
      email: "",
      about: "",
      website: "",
    },
    startingHours: "",
    endingHours: "",
  });

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
  const [loading, setLoading] = useState(false);
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...formData.images, ...files];
    const newPreviews = [
      ...formData.imagesPreviews,
      ...files.map((file) => URL.createObjectURL(file)),
    ];
    setFormData({
      ...formData,
      images: newImages,
      imagesPreviews: newPreviews,
    });
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
          // Use a unique name for each image
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
  const uploadProfilePic = async (profilePic, activityId) => {
    if (!profilePic) return null;

    try {
      const imageRef = ref(storage, `activities/${activityId}/profile-pic`);
      await uploadBytes(imageRef, profilePic);
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (error) {
      console.error("Error uploading profile pic:", error);
      throw new Error("Failed to upload profile picture");
    }
  };

  const generateRandomActivityId = () => {
    return Math.floor(100 + Math.random() * 900); // Generates a random number between 100 and 999
  };

  const createActivity = async (formData) => {
    try {
      // Generate a random 3-digit activity ID
      setLoading(true);
      const activityId = generateRandomActivityId();

      // Log to ensure the ID is generated correctly
      console.log("Generated Activity ID:", activityId); // Check if this shows correctly

      // Create a clean host object without the File objects
      const cleanHostData = {
        name: formData.host.name,
        phone: formData.host.phone,
        email: formData.host.email,
        about: formData.host.about,
        website: formData.host.website,
        profilePicUrl: null,
      };

      // Create the activity document with the Firestore-generated ID and activityId
      const activityRef = await addDoc(collection(db, "activities"), {
        activityId: activityId, // Ensure this is added here
        title: formData.title,
        description: formData.description,
        details: formData.details.filter((detail) => detail.trim() !== ""),
        location: formData.location,
        category: formData.category,
        hashtags: formData.hashtags.filter((tag) => tag.trim() !== ""),
        showGoogleMap: formData.showGoogleMap,
        host: cleanHostData,
        startingHours: formData.startingHours,
        endingHours: formData.endingHours,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        price: formData.price,
        status: "active",
        imageUrls: [],
      });

      // Check if activityId is in the document after creation
      const docSnapshot = await getDoc(activityRef);
      console.log("Document Data after creation:", docSnapshot.data()); // Check if activityId exists

      // Upload images and get their URLs
      const imageUrls = await uploadImages(formData.images, activityRef.id);

      // Upload profile picture for the host
      const profilePicUrl = await uploadProfilePic(
        formData.host.profilePic,
        activityRef.id
      );

      // Update the document with the image URLs and host profile picture URL
      await updateDoc(doc(db, "activities", activityRef.id), {
        imageUrls: imageUrls,
        "host.profilePicUrl": profilePicUrl || null,
      });
      setLoading(false);
      return { docId: activityRef.id, activityId: activityId }; // Return both Firestore doc ID and custom activity ID
    } catch (error) {
      console.error("Error creating activity:", error);
      throw new Error(`Failed to create activity: ${error.message}`);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { docId, activityId } = await createActivity(formData);

      toast.success(`Activity created successfully with ID: ${docId}`);
      navigate(`/AdminLayout/activityManagement`);
      // Reset form or redirect
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(error.message || "Error submitting form");
    }
  };

  // Function to fetch a single activity

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = formData.imagesPreviews.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      images: newImages,
      imagesPreviews: newPreviews,
    });
  };
  const addImages = (files) => {
    const validImages = files.filter((file) => file.type.startsWith("image/"));
    const newImagePreviews = validImages.map((image) =>
      URL.createObjectURL(image)
    );

    // Update the formData with new images
    setFormData((prevData) => ({
      ...prevData,
      images: [...prevData.images, ...validImages],
      imagesPreviews: [...prevData.imagesPreviews, ...newImagePreviews],
    }));
  };
  // Function to fetch activities with filters
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      addImages(files); // Call the function to add images
    }
  };
  return (
    <div className="w-full mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-semibold mb-6">Create Activity</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            {/* Images */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Images</label>
              <div
                className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors mb-4"
                onDragOver={(e) => e.preventDefault()} // Allow dragging over the div
                onDrop={handleDrop}
              >
                {" "}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                  multiple
                />
                <label
                  htmlFor="image-upload"
                  className="w-full h-full flex flex-col items-center justify-center"
                >
                  {formData.imagesPreviews.length > 0 ? (
                    <img
                      src={
                        formData.imagesPreviews[
                          formData.imagesPreviews.length - 1
                        ]
                      }
                      alt="Latest upload"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <>
                      <Camera className="w-12 h-12 text-gray-400 mb-2" />
                      <p className="text-gray-500">
                        Drag images here or click to upload
                      </p>
                    </>
                  )}
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.images.map((image, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 rounded-full px-3 py-1 flex items-center"
                  >
                    <span className="text-sm mr-2">{image?.name}</span>
                    <button
                      onClick={() => removeImage(index)}
                      className="text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/* Title */}
            <div className="mb-6">
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
                <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                  Search Location
                </button>
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
                <div className="relative w-[70%]">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicUpload}
                    className="hidden w-full flex flex-col gap-y-4"
                    id="profile-pic"
                  />

                  <label
                    htmlFor="profile-pic"
                    className="block w-full h-32 bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                  >
                    {formData.host.profilePicPreview ? (
                      <img
                        src={formData.host.profilePicPreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col gap-y-3 items-center justify-center text-gray-400">
                        <Camera className="w-8 h-8 text-gray-400" />
                        Add Profile Pic
                      </div>
                    )}
                  </label>
                </div>
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
          className="bg-red-500 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Creating......" : "Create Activity"}
        </button>
      </div>
    </div>
  );
};

export default CreateActivity;
