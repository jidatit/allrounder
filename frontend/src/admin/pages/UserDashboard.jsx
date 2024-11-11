import React, { useRef, useState } from "react";
import { useAuth } from "../../context/authContext";
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { auth, db } from "../../config/firebase";
import { X, Upload, Edit2, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

const ShareButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Content to share
  const shareData = {
    title: "Check out this post!",
    text: "I found this article interesting and thought you might like it.",
    url: window.location.href,
  };

  // Function to handle sharing
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log("Shared successfully");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Open custom modal if Web Share API is not available
      setIsModalOpen(true);
    }
  };

  // Function to close the modal
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <button
        onClick={handleShare}
        className="share-button px-4 py-2 bg-[#E55938] text-white rounded hover:bg-[#f0512d]"
      >
        Share
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-80 shadow-lg relative">
            <h3 className="text-lg font-semibold mb-4">Share This Post</h3>
            <p className="text-sm mb-4">
              Copy the link or share on social media:
            </p>
            <input
              type="text"
              readOnly
              value={shareData.url}
              className="w-full border rounded px-3 py-2 mb-4 text-gray-700"
              onClick={(e) => e.target.select()}
            />
            <div className="flex space-x-4 mb-4">
              <a
                href={`https://twitter.com/intent/tweet?text=${shareData.text}&url=${shareData.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Twitter
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareData.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Facebook
              </a>
              <a
                href={`mailto:?subject=${shareData.title}&body=${shareData.text}%0A${shareData.url}`}
                className="bg-gray-600 text-white px-3 py-1 rounded"
              >
                Email
              </a>
            </div>
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const UserDashboard = () => {
  const { currentUser } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isEditingDp, setIsEditingDp] = useState(false);
  const editRef = useRef(null);

  const defaultAvatars = [
    "/Avatars/Avatar-1.jpg",
    "/Avatars/Avatar-2.jpg",
    "/Avatars/Avatar-3.jpg",
    "/Avatars/Avatar-4.jpg",
    "/Avatars/Avatar-5.jpg",
    "/Avatars/Avatar-6.jpg",
  ];

  const [formData, setFormData] = useState({
    firstName: currentUser.firstName || "",
    lastName: currentUser.lastName || "",
    email: currentUser.email || "",
    phoneNumber: currentUser.phoneNumber || "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    profilePicture: currentUser.profilePicture || null,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation checks
    if (!formData.oldPassword) {
      setError("Please enter your current password");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match!");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      return;
    }

    try {
      // Create credentials with current email and old password
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        formData.oldPassword
      );

      // Reauthenticate user with old password
      await reauthenticateWithCredential(auth.currentUser, credential);

      // If reauthentication successful, update to new password
      await updatePassword(auth.currentUser, formData.newPassword);

      setSuccess("Password updated successfully!");
      setIsChangingPassword(false);
      setFormData((prev) => ({
        ...prev,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (err) {
      // Handle specific error cases
      if (err.code === "auth/wrong-password") {
        setError("Current password is incorrect");
      } else if (err.code === "auth/requires-recent-login") {
        setError(
          "Please log out and log back in before changing your password"
        );
      } else {
        setError("Failed to update password. Please try again.");
      }
      console.error(err);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setIsEditingDp(true);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        setFormData((prev) => ({
          ...prev,
          profilePicture: reader.result,
        }));
        // Clear selected avatar when uploading custom image
        setSelectedAvatar(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarSelect = (avatarPath) => {
    setIsEditingDp(true);

    setSelectedAvatar(avatarPath);
    setFormData((prev) => ({
      ...prev,
      profilePicture: avatarPath,
    }));
    // Clear uploaded image when selecting avatar
    setUploadedImage(null);
  };
  const handleDeleteImage = () => {
    setIsEditingDp(true);

    setUploadedImage(null);
    setFormData((prev) => ({
      ...prev,
      profilePicture: null,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const collectionName =
        currentUser.userType?.toLowerCase() === "admin" ? "admins" : "users";
      const userCollectionRef = collection(db, collectionName);
      const q = query(userCollectionRef, where("uid", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error("User document not found");
      }

      const userDoc = querySnapshot.docs[0];
      const userRef = doc(db, collectionName, userDoc.id);

      await updateDoc(userRef, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        profilePicture: formData.profilePicture,
      });

      setSuccess("Profile updated successfully!");
      setIsEditMode(false);
    } catch (err) {
      setError(err.message || "Failed to update profile. Please try again.");
      console.error(err);
    }
    setIsEditingDp(false);
  };
  const handleEditImage = () => {
    setIsEditingDp(true);
    if (editRef.current) {
      editRef.current.click();
      console.log("Clicked");
    }
  };

  const ShareButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Content to share
    const shareData = {
      title: "Check out this post!",
      text: "I found this article interesting and thought you might like it.",
      url: window.location.href,
    };

    // Function to handle sharing
    const handleShare = async () => {
      if (navigator.share) {
        try {
          await navigator.share(shareData);
          console.log("Shared successfully");
        } catch (error) {
          console.error("Error sharing:", error);
        }
      } else {
        // Open custom modal if Web Share API is not available
        setIsModalOpen(true);
      }
    };

    // Function to close the modal
    const closeModal = () => setIsModalOpen(false);

    return (
      <div>
        <button
          onClick={handleShare}
          className="share-button px-4 py-2 bg-[#E55938] text-white rounded hover:bg-[#f0512d]"
        >
          Share
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-80 shadow-lg relative">
              <h3 className="text-lg font-semibold mb-4">Share This Post</h3>
              <p className="text-sm mb-4">
                Copy the link or share on social media:
              </p>
              <input
                type="text"
                readOnly
                value={shareData.url}
                className="w-full border rounded px-3 py-2 mb-4 text-gray-700"
                onClick={(e) => e.target.select()}
              />
              <div className="flex space-x-4 mb-4">
                <a
                  href={`https://twitter.com/intent/tweet?text=${shareData.text}&url=${shareData.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Twitter
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${shareData.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Facebook
                </a>
                <a
                  href={`mailto:?subject=${shareData.title}&body=${shareData.text}%0A${shareData.url}`}
                  className="bg-gray-600 text-white px-3 py-1 rounded"
                >
                  Email
                </a>
              </div>
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-full mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold custom-bold">My Profile</h1>
        <ShareButton />
      </div>

      <div className="bg-white rounded-lg custom-shadow p-6 custom-regular">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl custom-bold">Basic Information</h2>
          <button
            onClick={() => setIsChangingPassword(true)}
            className="bg-[#E55938] hover:bg-[#f0512d] text-white md:px-7 md:py-4 py-2 text-sm md:text-base rounded-full custom-bold"
          >
            Change Password
          </button>
        </div>

        {/* Profile Picture Section */}
        <div className="mb-8">
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setActiveTab("upload")}
              className={`px-4 py-2 ${
                activeTab === "upload"
                  ? "border-b-2 border-[#E55938] text-[#E55938]"
                  : ""
              }`}
            >
              Upload Profile pic
            </button>
            <button
              onClick={() => setActiveTab("avatar")}
              className={`px-4 py-2 ${
                activeTab === "avatar"
                  ? "border-b-2 border-[#E55938] text-[#E55938]"
                  : ""
              }`}
            >
              Select Avatar
            </button>
          </div>

          {activeTab === "upload" && (
            <div className="flex items-center justify-center w-40 h-40 rounded-full border-2 border-dashed border-gray-300 cursor-pointer relative overflow-hidden">
              {uploadedImage || (formData.profilePicture && !selectedAvatar) ? (
                <>
                  <img
                    src={uploadedImage || formData.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1  flex space-x-1 p-2 z-20">
                    <button
                      onClick={handleEditImage}
                      className="bg-white rounded-full p-1 hover:bg-gray-100"
                    >
                      <Edit2 size={16} className="text-gray-600" />
                    </button>
                    <button
                      onClick={handleDeleteImage}
                      className="bg-white rounded-full p-1 hover:bg-gray-100"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                </>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                  <Upload size={24} className="text-gray-400" />
                  <input
                    ref={editRef}
                    id="imageUploadInput"
                    type="file"
                    className="hidden imageUploadInput"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
          )}

          {activeTab === "avatar" && (
            <div className="grid grid-cols-3 gap-4 max-w-md">
              {defaultAvatars.map((avatar, index) => (
                <div
                  key={index}
                  onClick={() => handleAvatarSelect(avatar)}
                  className={`w-20 h-20 rounded-full overflow-hidden cursor-pointer ${
                    selectedAvatar === avatar ? "ring-2 ring-[#E55938]" : ""
                  }`}
                >
                  <img
                    src={avatar}
                    alt={`Avatar ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
          {isEditingDp ? (
            <div>
              <button
                onClick={(e) => {
                  handleSubmit(e);
                  toast.success("Profile Image Updated");
                }}
                className="px-4 py-2 text-[#E55938] custom-semibold mt-4"
                disabled={isEditingDp}
              >
                save changes
              </button>
              <button
                onClick={() => {
                  setIsEditingDp(false);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rest of the form fields remain the same */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm custom-semibold mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={!isEditMode}
                className="w-full border-b border-gray-700 focus:border-gray-900 outline-none pt-4 px-2"
              />
            </div>
            <div>
              <label className="block text-sm custom-semibold mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={!isEditMode}
                className="w-full border-b border-gray-700 focus:border-gray-500 outline-none    pt-4 px-2"
              />
            </div>

            <div>
              <label className="block text-sm custom-semibold mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full border-b border-gray-700 focus:border-gray-500 outline-none    pt-4 px-2"
              />
            </div>

            <div>
              <label className="block text-sm custom-semibold mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                disabled={!isEditMode}
                className="w-full border-b border-gray-700 focus:border-gray-500 outline-none   pt-4 px-2"
              />
            </div>
          </div>

          {isEditMode && (
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsEditMode(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#E55938] text-white rounded hover:bg-[#f0512d]"
              >
                Save Changes
              </button>
            </div>
          )}

          {!isEditMode && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsEditMode(true)}
                className="px-4 py-2 text-[#E55938] custom-semibold"
              >
                Edit Profile
              </button>
            </div>
          )}
        </form>

        {/* Password Change Modal remains the same */}
        {isChangingPassword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-1/3 custom-regular">
              <h3 className="text-xl font-semibold mb-4">Change Password</h3>
              <form
                onSubmit={handlePasswordChange}
                className="space-y-4 w-[80%] mx-auto"
              >
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="oldPassword"
                    value={formData.oldPassword}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsChangingPassword(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#E55938] text-white rounded hover:bg-[#f0512d]"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
