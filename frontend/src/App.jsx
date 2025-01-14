import { Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Layout from "./UI Components/Layout";
import Blogs from "./pages/Blogs";
import TeamSportsCategory from "./pages/TeamSportsCategory";
import PostPage from "./pages/PostPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/Login";
import BlogPost from "./pages/BlogPost";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, useAuth } from "./context/authContext";
import ForgotPassword from "./pages/ForgotPassword";
import UserLayout from "./admin/layout/UserLayout";
import UserDashboard from "./admin/pages/UserDashboard";
import AdminLayout from "./admin/layout/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import "./index.css";
import ResetPasswordFrom from "./pages/ResetPasswordFrom";
import ActivityManagement from "./admin/pages/ActivityManagement";
import CreateActivity from "./admin/components/AddActivity";
import EditActivityComponent from "./admin/components/EditActivity";
import FeaturedActivities from "./admin/pages/FeaturedActivities";
import MyInterests from "./admin/pages/MyInterests";
import EditHeader from "./admin/pages/EditHeader";
import EditHome from "./admin/pages/EditHome";
import EditSignUp from "./admin/pages/EditSignUp";
import EditLogin from "./admin/pages/EditLogin";
import EditFooter from "./admin/pages/EditFooter";
import ComingSoon from "./admin/pages/ComingSoon";

export const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen loading-spinner">
    {/* Spinner */}
    <div className="w-16 h-16 border-4 rounded-full border-t-transparent border-gray-900/50 animate-spin"></div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles, currentUser }) => {
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(currentUser.userType)) {
    return <Navigate to={getDashboardPath(currentUser.userType)} />;
  }

  return children;
};

const getDashboardPath = (userType) => {
  switch (userType) {
    case "user":
      return "/UserLayout";
    case "admin":
      return "/AdminLayout";
    default:
      return "/";
  }
};

function App() {
  const { currentUser, loading } = useAuth();

  return (
    <>
      <div className="h-auto overflow-hidden">
        <AuthProvider>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <Routes>
              <Route path="/forgotPassword" element={<ForgotPassword />} />
              <Route path="/resetPassword" element={<ResetPasswordFrom />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Homepage />} />
                {/* <Route path="/blog" element={<Blogs />} /> */}
                <Route
                  path="/allActivities/:name"
                  element={<TeamSportsCategory />}
                />
                <Route
                  path="/allActivitiesSearch/:activityName"
                  element={<TeamSportsCategory />}
                />
                <Route path="/allActivities" element={<TeamSportsCategory />} />
                <Route
                  path="/post/:activityIdParam/:featureActivityParam"
                  element={<PostPage />}
                />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/blog/:id" element={<BlogPost />} />
                <Route path="/comingSoon" element={<ComingSoon />} />
              </Route>

              {/* Protected User Dashboard Route */}
              <Route
                path="/UserLayout"
                element={
                  <ProtectedRoute
                    allowedRoles={["user"]}
                    currentUser={currentUser}
                  >
                    <UserLayout />
                  </ProtectedRoute>
                }
              >
                <Route
                  index
                  element={
                    currentUser ? <UserDashboard /> : <Navigate to="/login" />
                  }
                />

                <Route
                  path="my-interests"
                  element={
                    currentUser ? <MyInterests /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="comingSoon"
                  element={
                    currentUser ? <ComingSoon /> : <Navigate to="/login" />
                  }
                />
              </Route>

              {/* Protected Admin Dashboard Route */}
              <Route
                path="/AdminLayout"
                element={
                  <ProtectedRoute
                    allowedRoles={["admin"]}
                    currentUser={currentUser}
                  >
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route
                  index
                  element={
                    currentUser ? <AdminDashboard /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="activityManagement"
                  element={
                    currentUser ? (
                      <ActivityManagement />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="addActivity"
                  element={
                    currentUser ? <CreateActivity /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="featuredActivity"
                  element={
                    currentUser ? (
                      <FeaturedActivities />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route
                  path="editHeader"
                  element={
                    currentUser ? <EditHeader /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="editHome"
                  element={
                    currentUser ? <EditHome /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="editSignUp"
                  element={
                    currentUser ? <EditSignUp /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="editLogin"
                  element={
                    currentUser ? <EditLogin /> : <Navigate to="/login" />
                  }
                />
                <Route
                  path="editFooter"
                  element={
                    currentUser ? <EditFooter /> : <Navigate to="/login" />
                  }
                />
                \{" "}
                <Route
                  path="editActivity/:activityIdParam/:featureActivityParam"
                  element={
                    currentUser ? (
                      <EditActivityComponent />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
              </Route>

              {/* Redirect to dashboard if user/admin directly visits another's dashboard */}
              <Route
                path="*"
                element={
                  currentUser ? (
                    <Navigate to={getDashboardPath(currentUser.userType)} />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
            </Routes>
          )}
        </AuthProvider>
      </div>

      <ToastContainer />
    </>
  );
}

export default App;
