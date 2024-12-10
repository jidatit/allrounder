
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Modal, Button } from "antd";
import {
  DashboardOutlined,
  AppstoreOutlined,
  SettingOutlined,
  EditOutlined,
  FileTextOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../context/authContext";
import { collection, getDocs,orderBy } from "firebase/firestore"; 
import { db } from "../../config/firebase";

const AdminSideBar = ({ isSidebarExpanded }) => {
  const { handleLogout } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const location = useLocation();

  const fetchLogo = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(db, "editHeader"),
        orderBy("timestamp", "desc") 
      );
  
      if (!querySnapshot.empty) {
        // Get the most recent document
        const logoData = querySnapshot.docs[0].data(); 
        if (logoData?.url) {
          setLogoUrl(logoData.url); 
          console.log("logo uploaded")
        } else {
          console.warn("No 'url' field found in the most recent 'editHeader' document.");
        }
      } else {
        console.warn("No documents found in editHeader.");
      }
    } catch (error) {
      console.error("Error fetching logo:", error);
    }
  };
  useEffect(() => {
    fetchLogo();
  }, []);


  // Function to determine active item based on current path
  const getActiveItemFromPath = (pathname) => {
    console.log("Current Path:", pathname); // Log the current pathname to debug
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
      console.log("Matched featured activity");
      return "Featured Activities";
    }
    else if (pathname.includes("/AdminLayout/editHeader")) {
      console.log("Matched edit Header Section");
      return "Edit Header"; 
    }
    else if (pathname.includes("/AdminLayout/editHome")) {
      console.log("Matched edit Home Section");
      return "Edit Home Page";
      } else if (pathname.includes("/AdminLayout/editSignup")) {
        console.log("Matched edit Signup Section");
        return "Edit Signup Page";
        } else if (pathname.includes("/AdminLayout/editLogin")) {
          console.log("Matched edit Login Section");
          return "Edit Login Page";
          }else if (pathname.includes("/AdminLayout/editFooter")) {
            console.log("Matched edit Footer Section");
            return "Edit Footer Page";
            }
       else {
        console.log("Matched activity management");
      return "Activity Management"; // Default tab
    }
  };
  // Set active item based on current path
  const [activeItem, setActiveItem] = useState(
    getActiveItemFromPath(location.pathname)
  );
  console.log("Setting active item:", activeItem);

  // Update active item when location changes
  useEffect(() => {
    setActiveItem(getActiveItemFromPath(location.pathname));
  }, [location.pathname]);
  console.log("Setting active item:", setActiveItem);


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

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      style={{
        width: isSidebarExpanded ? 300 : 80,
        height: "100vh",
        background: "#ffffff",
      }}
      className=" relative flex flex-col transition-all duration-300 ease-in-out"
    >
      <div
    className={`flex items-center ${
      isSidebarExpanded ? "justify-between" : "justify-center"
    } p-4`}
  >
      {/* Display the logo */}
      {/* <div style={{ padding: 16, textAlign: "center" }}> */}
        {/* console.log("hello"); */}
         {logoUrl ? (
          <img
            src={logoUrl } 
            alt="Logo"
            // style={{ maxWidth: "100%", maxHeight: 80 }}
             className="max-h-12"
          />
        ) : (
          // <div style={{ padding: 16, fontWeight: "bold", fontSize: "18px" }}> 
          <h1 className="font-bold text-lg">{isSidebarExpanded ? "LOGO" : "Logo"}</h1> 
          //  </div>
        )}
          {isSidebarExpanded && (
      <Link
        to="/"
        className="ml-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full transition-all duration-200 ease-in-out"
      >
        Back to Website
      </Link>
    )}
      </div>
      
      <Menu
        mode="inline"
        theme="light"
        inlineCollapsed={!isSidebarExpanded}
        selectedKeys={[activeItem]} // This will make sure the selected item has the active styles applied
        style={{ height: "100%" }}
      >
        <Menu.Item
          key="Activity Management"
          icon={<DashboardOutlined />}
          style={{
            backgroundColor: activeItem === "Activity Management" ? "#E55938" : "transparent",
            color: activeItem === "Activity Management" ? "white" : "black",
          }}
        >
          <Link to="/AdminLayout/activityManagement">Activity Management</Link>
        </Menu.Item>
        <Menu.Item
          key="Featured Activities"
          icon={<AppstoreOutlined />}
          style={{
            backgroundColor: activeItem === "Featured Activities" ? "#E55938" : "transparent",
            color: activeItem === "Featured Activities" ? "white" : "black",
          }}
        >
          <Link to="/AdminLayout/featuredActivity">Featured Activities</Link>
        </Menu.Item>

        <Menu.SubMenu key="contentManagement" icon={<SettingOutlined />} title="Content Management">

        <Menu.Item
            key="Edit Signup Page"
            icon={<FileTextOutlined />}
            style={{
              backgroundColor: activeItem === "Edit Signup Page" ? "#E55938" : "transparent",
              color: activeItem === "Edit Signup Page" ? "white" : "black",
            }}
          >
            <Link to="/AdminLayout/editSignup">Edit SignUp Page</Link>
          </Menu.Item>

       < Menu.Item
            key="Edit Login Page"
            icon={<FileTextOutlined />}
            style={{
              backgroundColor: activeItem === "Edit Login Page" ? "#E55938" : "transparent",
              color: activeItem === "Edit Login Page" ? "white" : "black",
            }}
          >
            <Link to="/AdminLayout/editLogin">Edit Login Page</Link>
          </Menu.Item>

          <Menu.Item
            key="Edit Header"
            icon={<EditOutlined />}
            style={{
              backgroundColor: activeItem === "Edit Header" ? "#E55938" : "transparent",
              color: activeItem === "Edit Header" ? "white" : "black",
            }}
          >
            <Link to="/AdminLayout/editHeader">Edit Header</Link>
          </Menu.Item>
          <Menu.Item
            key="edit Home Page"
            icon={<HomeOutlined />}
            style={{
              backgroundColor: activeItem === "Edit Home Page" ? "#E55938" : "transparent",
              color: activeItem === "Edit Home Page" ? "white" : "black",
            }}
          >
            <Link to="/AdminLayout/editHome">Edit Home Page</Link>
            </Menu.Item>


          <Menu.Item
            key="Edit Footer Page"
            icon={<EditOutlined />}
            style={{
              backgroundColor: activeItem === "Edit Footer Page" ? "#E55938" : "transparent",
              color: activeItem === "Edit Footer Page" ? "white" : "black",
            }}
          >
            <Link to="/AdminLayout/editFooter">Edit Footer Page</Link>
          </Menu.Item>

        </Menu.SubMenu>

        <Menu.Item
          key="Sign Out"
          icon={<FileTextOutlined />}
          onClick={handleLogoutClick}
          style={{
            backgroundColor: activeItem === "Sign Out" ? "#E55938" : "transparent",
            color: activeItem === "Sign Out" ? "white" : "black",
          }}
        >
          Logout
        </Menu.Item>
      </Menu>
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: 16,
          cursor: "pointer",
        }}
        onClick={toggleCollapsed}
      >
        {/* {isSidebarExpanded ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} */}
      </div>

      <Modal
        title="Confirm Logout"
        visible={showLogoutDialog}
        onCancel={handleClose}
        footer={[
          <Button key="cancel" onClick={handleClose} style={{ textTransform: "none" }}>
            Cancel
          </Button>,
          <Button
            key="logout"
            type="primary"
            onClick={handleLogoutConfirm}
            style={{ textTransform: "none", backgroundColor: "#E55938", borderColor: "#E55938" }}
            
          >
            Logout
          </Button>,
        ]}
      >
        <p>Are you sure you want to logout? You'll need to login again to access your account.</p>
      </Modal>
    </div>
  );
};
export default AdminSideBar;



