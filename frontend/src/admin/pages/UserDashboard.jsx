import { useAuth } from "../../context/authContext";

const UserDashboard = () => {
  const { currentUser } = useAuth();
  return (
    <div className="flex flex-col gap-y-4">
      <div>User Dashboard</div>
      <div className="flex flex-col gap-y-2 justify-center">
        <span className=" text-xl custom-medium text-orange-500">
          User Email: {currentUser.email}
        </span>
        <span className="text-xl font-regular text-gray-500">
          User Type: {currentUser.userType}
        </span>
      </div>
    </div>
  );
};

export default UserDashboard;