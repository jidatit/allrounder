import { confirmPasswordReset } from "firebase/auth";
import { useState } from "react";
import { toast } from "react-toastify";
import { auth } from "../config/firebase";
import { useNavigate, useSearchParams } from "react-router-dom";

const ResetPasswordFrom = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const oobCodeParam = searchParams.get("oobCode");

  // Handle the password reset form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!oobCodeParam) {
      toast.error("Invalid or expired reset link.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Reset the password using Firebase's confirmPasswordReset function
      await confirmPasswordReset(auth, oobCodeParam, password);
      toast.success("Password has been reset successfully.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Failed to reset password. Try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <main
      id="content"
      role="main"
      className="flex items-center w-screen h-[93vh] ssm:h-[100vh] p-6 mx-auto bg-white"
    >
      <div className=" bg-white w-[40%] mx-auto border shadow-lg mt-7 rounded-xl">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <div className="flex items-end justify-center mb-8 text-2xl font-bold">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-6 h-6 text-[#E55938] fill-current"
              >
                <path d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2ZM12 20C16.4267 20 20 16.4267 20 12C20 7.57333 16.4267 4 12 4C7.57333 4 4 7.57333 4 12C4 16.4267 7.57333 20 12 20ZM12 18C8.68 18 6 15.32 6 12C6 8.68 8.68 6 12 6C15.32 6 18 8.68 18 12C18 15.32 15.32 18 12 18ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z"></path>
              </svg>
              All Rounder<span className="text-[#E55938]">.co</span>
            </div>
            <h1 className="block text-lg font-bold text-gray-800">
              Reset Password
            </h1>
          </div>
          <div className="mt-5">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-y-4">
                <div>
                  <label
                    htmlFor="new_password"
                    className="block mb-2 ml-1 text-xs font-semibold "
                  >
                    New password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="new_password"
                      name="new_password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-md shadow-sm focus:border-[#E55938] focus:ring-[#E55938]"
                      required
                      aria-describedby="new-password-error"
                      placeholder="Enter a new password"
                    />
                  </div>
                  <p
                    className="hidden mt-2 text-xs text-red-600"
                    id="new-password-error"
                  >
                    Please include a password that complies with the rules to
                    ensure security
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="confirmn_new_password"
                    className="block mb-2 ml-1 text-xs font-semibold "
                  >
                    Confirm new password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="confirmn_new_password"
                      name="confirmn_new_password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-md shadow-sm focus:border-[#E55938] focus:ring-[#E55938]"
                      required
                      aria-describedby="confirmn_new-password-error"
                      placeholder="Enter a new password"
                    />
                  </div>
                  <p
                    className="hidden mt-2 text-xs text-red-600"
                    id="confirmn_new-password-error"
                  >
                    Please include a password that complies with the rules to
                    ensure security
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white transition-all bg-[#E55938] border border-transparent rounded-md hover:bg-[#ff4d25] focus:outline-none focus:ring-2 focus:ring-[#E55938] focus:ring-offset-2"
                >
                  {isSubmitting ? "Submitting..." : "Reset Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ResetPasswordFrom;
