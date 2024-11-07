import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { TbCalendarEvent } from "react-icons/tb";
import { PiClipboardTextFill } from "react-icons/pi";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useAuth } from "../../context/authContext";

// Custom theme to match your color scheme
const theme = createTheme({
  palette: {
    primary: {
      main: "#E55938",
      dark: "#d14427",
    },
  },
});

const AdminSideBar = ({ isSidebarExpanded }) => {
  const { handleLogout } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const location = useLocation();

  // Function to determine active item based on current path
  const getActiveItemFromPath = (pathname) => {
    if (
      pathname.includes("/AdminLayout/activityManagement") ||
      (pathname.includes("/AdminLayout/editActivity") &&
        pathname.includes("/simpleActivity"))
    ) {
      return "Activity Management";
    } else if (
      pathname.includes("/AdminLayout/featuredActivity") ||
      (pathname.includes("/AdminLayout/editActivity") &&
        pathname.includes("/featureActivity"))
    ) {
      return "Featured Activities";
    } else {
      return "Activity Management"; // Default tab
    }
  };

  // Set active item based on current path
  const [activeItem, setActiveItem] = useState(
    getActiveItemFromPath(location.pathname)
  );

  // Update active item when location changes
  useEffect(() => {
    setActiveItem(getActiveItemFromPath(location.pathname));
  }, [location.pathname]);

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
    <ThemeProvider theme={theme}>
      <div
        className={`z-50 h-full w-full overflow-hidden bg-white ${
          !isSidebarExpanded ? "hidden md:flex" : "flex"
        }`}
      >
        <div className="flex flex-col items-center justify-start w-full h-full px-5 py-3 gap-y-4 smd:gap-y-10">
          <div className="flex w-full">
            <Link to={"/"}>
              <h1 className="w-full p-2 smd:p-3 text-lg smd:text-2xl font-bold text-black bg-white rounded-lg">
                Logo
              </h1>
            </Link>
          </div>

          <div className="flex flex-col w-full gap-y-4">
            <Link
              to={"/AdminLayout/activityManagement"}
              className={`w-full flex justify-center items-center transition-all duration-300 ease-in-out rounded-md px-2 py-1 group ${
                activeItem === "Activity Management"
                  ? "bg-[#E55938] rounded-md shadow-lg shadow-gray-300"
                  : "hover:bg-[#E55938] rounded-md hover:text-white"
              }`}
            >
              <TbCalendarEvent
                size={35}
                className={`text-black group-hover:text-white ${
                  activeItem === "Activity Management"
                    ? "text-white"
                    : "text-black"
                }`}
              />
              <p
                className={`w-full p-2 smd:p-3 rounded-md text-[14px] smd:text-[17px] custom-semibold group-hover:text-white ${
                  activeItem === "Activity Management"
                    ? "text-white"
                    : "text-black"
                }`}
              >
                Activity Management
              </p>
            </Link>

            <Link
              to={"/AdminLayout/featuredActivity"}
              className={`w-full flex justify-center items-center transition-all duration-300 ease-in-out rounded-md px-2 py-1 group ${
                activeItem === "Featured Activities"
                  ? "bg-[#E55938] rounded-md shadow-lg shadow-gray-300"
                  : "hover:bg-[#E55938] rounded-md hover:text-white"
              }`}
            >
              <TbCalendarEvent
                size={35}
                className={`text-black group-hover:text-white ${
                  activeItem === "Featured Activities"
                    ? "text-white"
                    : "text-black"
                }`}
              />
              <p
                className={`w-full p-2 smd:p-3 rounded-md text-[14px] smd:text-[17px] custom-semibold group-hover:text-white ${
                  activeItem === "Featured Activities"
                    ? "text-white"
                    : "text-black"
                }`}
              >
                Featured Activities
              </p>
            </Link>

            <button
              className={`w-full flex justify-center items-center transition-all duration-300 ease-in-out rounded-md px-2 py-1 hover:text-white group ${
                activeItem === "Sign Out"
                  ? "bg-[#E55938] rounded-md shadow-lg shadow-gray-300"
                  : "hover:bg-[#E55938] rounded-md hover:text-white"
              }`}
              onClick={handleLogoutClick}
            >
              <PiClipboardTextFill
                size={35}
                className={`text-black group-hover:text-white ${
                  activeItem === "Sign Out" ? "text-white" : "text-black"
                }`}
              />
              <p
                className={`w-full p-2 smd:p-3 text-start rounded-md text-[14px] smd:text-[17px] custom-semibold group-hover:text-white ${
                  activeItem === "Sign Out" ? "text-white" : "text-black"
                }`}
              >
                Logout
              </p>
            </button>
          </div>
        </div>

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
    </ThemeProvider>
  );
};

export default AdminSideBar;
