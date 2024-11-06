import React, { useState } from "react";
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

const UserDashboard = () => {
  const { currentUser } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: currentUser.firstName || "",
    lastName: currentUser.lastName || "",
    email: currentUser.email || "",
    phoneNumber: currentUser.phoneNumber || "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
      });

      setSuccess("Profile updated successfully!");
      setIsEditMode(false);
    } catch (err) {
      setError(err.message || "Failed to update profile. Please try again.");
      console.error(err);
    }
  };

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

  return (
    <div className="p-6 max-w-full mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold custom-bold">My Profile</h1>
      </div>

      <div className="bg-white rounded-lg custom-shadow p-6 custom-regular">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl custom-bold">Basic Information</h2>
          <button
            onClick={() => setIsChangingPassword(true)}
            className="bg-[#E55938] hover:bg-[#f0512d] text-white px-7 py-4 rounded-full custom-bold"
          >
            Change Password
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Existing form fields remain the same */}
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
                className="w-full border-b border-gray-700 focus:border-gray-900 outline-none   pt-4 px-2"
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

        {/* Updated Password Change Modal */}
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

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        {/* {success && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
            {success}
          </div>
        )} */}
      </div>
    </div>
  );
};

export default UserDashboard;
