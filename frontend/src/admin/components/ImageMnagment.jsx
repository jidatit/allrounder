import React from "react";
import { Trash2, Edit, Plus, Camera } from "lucide-react";

// Activity Images Component
const ActivityImages = ({ formData, setFormData, handleImageUpload }) => {
  const handleDeleteImage = (index) => {
    const newImages = [...formData.images];
    const newPreviews = [...formData.imagesPreviews];
    newImages[index] = null;
    newPreviews[index] = null;
    setFormData({
      ...formData,
      images: newImages,
      imagesPreviews: newPreviews,
    });
  };

  const triggerImageUpload = (index) => {
    document.getElementById(`image-${index}`).click();
  };

  // Handle multiple image uploads and append to the existing images
  const handleMultipleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...formData.images, ...files]; // Append new images to the existing images
    const newPreviews = [
      ...formData.imagesPreviews,
      ...files.map((file) => URL.createObjectURL(file)), // Create new previews
    ];

    setFormData({
      ...formData,
      images: newImages,
      imagesPreviews: newPreviews,
    });
  };

  return (
    <div>
      {/* Show Add Images button if there are no images */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {formData.images.map((_, index) => (
          <div key={index} className="relative w-full">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(index, e)}
              className="hidden"
              id={`image-${index}`}
            />

            <div className="border-2 border-dashed border-gray-300 rounded-lg h-40 flex flex-col items-center justify-center relative w-full">
              {formData.imagesPreviews[index] ? (
                <div className="relative w-full h-full">
                  <img
                    src={formData.imagesPreviews[index]}
                    alt={`Activity ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => triggerImageUpload(index)}
                      className="p-1 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors"
                      title="Edit image"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteImage(index)}
                      className="p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                      title="Delete image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => triggerImageUpload(index)}
                  className="w-full h-full flex flex-col items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <Plus className="w-8 h-8 mb-2" />
                  <span>Add Image</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Images button */}
      <div className="mt-4">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleMultipleImageUpload}
          className="hidden"
          id="multiple-image-upload"
        />
        <button
          onClick={() =>
            document.getElementById("multiple-image-upload").click()
          }
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Add More Images
        </button>
      </div>
    </div>
  );
};
// Profile Picture Component
const ProfilePicture = ({ formData, setFormData, handleProfilePicUpload }) => {
  const handleDeleteProfilePic = () => {
    setFormData({
      ...formData,
      host: {
        ...formData.host,
        profilePic: null,
        profilePicPreview: null,
        profilePicUrl: null, // Explicitly set to null to indicate deletion
      },
    });
  };

  const triggerProfilePicUpload = () => {
    document.getElementById("profile-pic-input").click();
  };

  // Get the image source - use preview if available, fall back to URL
  const imageSource =
    formData.host.profilePicPreview || formData.host.profilePicUrl;

  return (
    <div className="relative w-full h-[17vh]">
      <input
        type="file"
        accept="image/*"
        onChange={handleProfilePicUpload}
        className="hidden"
        id="profile-pic-input"
      />

      <div className="border-2 border-dashed border-gray-300 rounded-md h-full relative">
        {imageSource ? (
          <div className="relative h-full">
            <img
              src={imageSource}
              alt="Profile"
              className="w-full h-full object-cover rounded-md"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={triggerProfilePicUpload}
                className="p-1 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors shadow-md"
                title="Edit profile picture"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={handleDeleteProfilePic}
                className="p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors shadow-md"
                title="Delete profile picture"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={triggerProfilePicUpload}
            className="w-full h-full flex flex-col items-center justify-center text-gray-500 hover:text-gray-700 transition-colors rounded-full"
          >
            <Camera className="w-8 h-8 mb-2" />
            <span className="text-sm">Add Profile Pic</span>
          </button>
        )}
      </div>
    </div>
  );
};

// Container component for using both together (optional)
const ImageManagement = ({
  formData,
  setFormData,
  handleImageUpload,
  handleProfilePicUpload,
}) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Activity Images</h3>
        <ActivityImages
          formData={formData}
          setFormData={setFormData}
          handleImageUpload={handleImageUpload}
        />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Profile Picture</h3>
        <ProfilePicture
          formData={formData}
          setFormData={setFormData}
          handleProfilePicUpload={handleProfilePicUpload}
        />
      </div>
    </div>
  );
};

export default ImageManagement;
export { ActivityImages, ProfilePicture };
