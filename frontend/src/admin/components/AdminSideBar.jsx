import { useState } from "react";
import { Link } from "react-router-dom";
import { TbCalendarEvent } from "react-icons/tb";
import { TiDocumentText } from "react-icons/ti";
import { PiClipboardTextFill } from "react-icons/pi";
import { useAuth } from "../../context/authContext";
const AdminSideBar = ({ isSidebarExpanded }) => {
  const { handleLogout } = useAuth();
  const [activeItem, setActiveItem] = useState("My Profile");
  const handleItemClick = (item) => {
    setActiveItem(item);
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
            Logo
          </h1>
        </div>

        <div className="flex flex-col w-full gap-y-4">
          <Link
            to="/AdminLayout"
            className={`w-full flex justify-center items-center transition-all duration-300 ease-in-out rounded-md px-2 py-1 group ${
              activeItem === "My Profile"
                ? "bg-[#E55938] rounded-md shadow-lg shadow-gray-300"
                : "hover:bg-[#E55938] rounded-md hover:text-white"
            }`}
            onClick={() => handleItemClick("My Profile")}
          >
            <TbCalendarEvent
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
              Activity Management
            </p>
          </Link>
          {/* <Link
            to=""
            className={`w-full flex justify-center items-center transition-all duration-300 ease-in-out rounded-md px-2 py-1 group  ${
              activeItem === "My Interests"
                ? "bg-[#E55938] rounded-md shadow-lg shadow-gray-300"
                : "hover:bg-[#E55938] rounded-md hover:text-white"
            }`}
            onClick={() => handleItemClick("My Interests")}
          >
            <TiDocumentText
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
              Blogs Management
            </p>
          </Link> */}
          <Link
            to=""
            className={`w-full flex justify-center items-center transition-all duration-300 ease-in-out rounded-md px-2 py-1 hover:text-white group ${
              activeItem === "Sign Out"
                ? "bg-[#E55938] rounded-md shadow-lg shadow-gray-300"
                : "hover:bg-[#E55938] rounded-md hover:text-white"
            }`}
            onClick={() => {
              handleLogout();
              handleItemClick("Sign Out");
            }}
          >
            <PiClipboardTextFill
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
              Logout
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminSideBar;
