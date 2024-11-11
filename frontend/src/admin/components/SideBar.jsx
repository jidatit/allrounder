import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CiUser } from "react-icons/ci";
import { IoHeartCircleSharp } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";
import { useAuth } from "../../context/authContext";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
const SideBar = ({ isSidebarExpanded }) => {
  const { handleLogout } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  // const [activeItem, setActiveItem] = useState("My Profile");
  const location = useLocation();

  const getActiveItemFromPath = (pathname) => {
    if (pathname.includes("/UserLayout/my-interests")) {
      console.log("my interests");
      return "My Interests";
    } else if (pathname.includes("/UserLayout")) {
      console.log("my profile");
      return "My Profile";
    } else {
      return "My Profile";
    }
  };

  // Set active item based on current path
  const [activeItem, setActiveItem] = useState(
    getActiveItemFromPath(location.pathname)
  );
  console.log(location.pathname);

  // Update active item when location changes
  useEffect(() => {
    setActiveItem(getActiveItemFromPath(location.pathname));
  }, [location.pathname]);

  const handleItemClick = (item) => {
    setActiveItem(item);
  };
  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = () => {
    handleLogout();
    setActiveItem("Sign Out");
    setShowLogoutDialog(false);
  };

  const handleClose = () => {
    setShowLogoutDialog(false);
  };
  return (
    <div
      className={` z-50 h-full w-full overflow-hidden bg-white  ${
        !isSidebarExpanded ? "hidden md:flex" : "flex"
      }`}
    >
      <div className="flex flex-col items-center justify-start w-full h-full px-5 py-3 gap-y-4 smd:gap-y-10">
        <div className="flex w-full">
          <h1 className="w-full p-2 smd:p-3 text-lg smd:text-2xl font-bold text-black bg-white rounded-lg">
            <Link to="/">Logo</Link>
          </h1>
        </div>

        <div className="flex flex-col w-full gap-y-4">
          <Link
            to="/UserLayout"
            className={`w-full flex justify-center items-center transition-all duration-300 ease-in-out rounded-md px-2 py-1 group ${
              activeItem === "My Profile"
                ? "bg-[#E55938] rounded-md shadow-lg shadow-gray-300"
                : "hover:bg-[#E55938] rounded-md hover:text-white"
            }`}
            onClick={() => handleItemClick("My Profile")}
          >
            <CiUser
              size={35}
              className={`text-black group-hover:text-white ${
                activeItem === "My Profile" ? "text-white" : "text-black"
              }`}
            />
            <p
              className={`w-full p-2 smd:p-3 rounded-md text-[14px] smd:text-[17px] custom-semibold group-hover:text-white ${
                activeItem === "My Profile" ? "text-white" : "text-black"
              }`}
            >
              My Profile
            </p>
          </Link>
          <Link
            to="my-interests"
            className={`w-full flex justify-center items-center transition-all duration-300 ease-in-out rounded-md px-2 py-1 group  ${
              activeItem === "My Interests"
                ? "bg-[#E55938] rounded-md shadow-lg shadow-gray-300"
                : "hover:bg-[#E55938] rounded-md hover:text-white"
            }`}
            onClick={() => handleItemClick("My Interests")}
          >
            <IoHeartCircleSharp
              size={35}
              className={`text-black group-hover:text-white ${
                activeItem === "My Interests" ? "text-white" : "text-black"
              }`}
            />
            <p
              className={`w-full p-2 smd:p-3 rounded-md text-[14px] smd:text-[17px] custom-semibold group-hover:text-white ${
                activeItem === "My Interests" ? "text-white" : "text-black"
              }`}
            >
              My Interests
            </p>
          </Link>
          <Link
            to=""
            className={`w-full flex justify-center items-center transition-all duration-300 ease-in-out rounded-md px-2 py-1 hover:text-white group ${
              activeItem === "Sign Out"
                ? "bg-[#E55938] rounded-md shadow-lg shadow-gray-300"
                : "hover:bg-[#E55938] rounded-md hover:text-white"
            }`}
            onClick={() => {
              handleLogoutClick();
              handleItemClick("Sign Out");
            }}
          >
            <IoLogOutOutline
              size={35}
              className={`text-black group-hover:text-white ${
                activeItem === "Sign Out" ? "text-white" : "text-black"
              }`}
            />
            <p
              className={`w-full p-2 smd:p-3 rounded-md text-[14px] smd:text-[17px] custom-semibold group-hover:text-white ${
                activeItem === "Sign Out" ? "text-white" : "text-black"
              }`}
            >
              Sign Out
            </p>
          </Link>
          <Dialog
            open={showLogoutDialog}
            onClose={handleClose}
            PaperProps={{
              style: {
                borderRadius: "12px",
                padding: "8px",
                maxWidth: "500px",
              },
            }}
          >
            <DialogTitle
              sx={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#1a1a1a",
                pt: 2,
                pb: 1,
              }}
            >
              Confirm Logout
            </DialogTitle>
            <DialogContent>
              <DialogContentText
                sx={{
                  color: "#4a4a4a",
                  fontSize: "1rem",
                  mb: 1,
                }}
              >
                Are you sure you want to logout? You'll need to login again to
                access your account.
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ p: 2, gap: 1 }}>
              <Button
                onClick={handleClose}
                sx={{
                  textTransform: "none",
                  color: "#4a4a4a",
                  backgroundColor: "#f5f5f5",
                  "&:hover": {
                    backgroundColor: "#e0e0e0",
                  },
                  px: 3,
                  py: 1,
                  borderRadius: "8px",
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleLogoutConfirm}
                variant="contained"
                sx={{
                  textTransform: "none",
                  backgroundColor: "#E55938",
                  "&:hover": {
                    backgroundColor: "#d14427",
                  },
                  px: 3,
                  py: 1,
                  borderRadius: "8px",
                }}
              >
                Logout
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
