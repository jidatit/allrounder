import React from "react";
import { Trash2, Edit, Plus, Camera } from "lucide-react";

const ImageManagement = ({
  formData,
  setFormData,
  handleImageUpload,
  handleProfilePicUpload,
  editActivity,
}) => {
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

  const handleDeleteProfilePic = () => {
    setFormData({
      ...formData,
      host: {
        ...formData.host,
        profilePic: null,
        profilePicPreview: null,
        profilePicUrl: null, // This will remove it from database when updated
      },
    });
  };

  const triggerImageUpload = (index) => {
    document.getElementById(`image-${index}`).click();
  };

  const triggerProfilePicUpload = () => {
    document.getElementById("profile-pic-input").click();
  };

  return (
    <div className="space-y-6">
      {/* Activity Images Section */}
      <div className="grid grid-cols-3 gap-4">
        {formData.images.map((_, index) => (
          <div key={index} className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(index, e)}
              className="hidden"
              id={`image-${index}`}
            />

            <div className="border-2 border-dashed border-gray-300 rounded-lg h-40 relative">
              {formData.imagesPreviews[index] ? (
                <div className="relative h-full">
                  <img
                    src={formData.imagesPreviews[index]}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => triggerImageUpload(index)}
                      className="p-1 bg-blue-500 rounded-full text-white hover:bg-blue-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteImage(index)}
                      className="p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => triggerImageUpload(index)}
                  className="w-full h-full flex flex-col items-center justify-center text-gray-500 hover:text-gray-700"
                >
                  <Plus className="w-8 h-8 mb-2" />
                  <span>Add Image</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Profile Picture Section */}
      <div className="relative w-32 h-32">
        <input
          type="file"
          accept="image/*"
          onChange={handleProfilePicUpload}
          className="hidden"
          id="profile-pic-input"
        />

        <div className="border-2 border-dashed border-gray-300 rounded-full h-full relative">
          {formData.host.profilePicPreview ? (
            <div className="relative h-full">
              <img
                src={formData.host.profilePicPreview}
                alt="Profile Picture"
                className="w-full h-full object-cover rounded-full"
              />
              <div className="absolute top-0 right-0 flex gap-2">
                <button
                  onClick={triggerProfilePicUpload}
                  className="p-1 bg-blue-500 rounded-full text-white hover:bg-blue-600"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDeleteProfilePic}
                  className="p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={triggerProfilePicUpload}
              className="w-full h-full flex flex-col items-center justify-center text-gray-500 hover:text-gray-700 rounded-full"
            >
              <Camera className="w-8 h-8 mb-2" />
              <span>Add Profile Pic</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageManagement;
