import { useState, useEffect } from "react";
import { Outlet } from "react-router";

import { GiHamburgerMenu } from "react-icons/gi";
import SideBar from "../components/SideBar";
import Navbar from "../components/Navbar";

const AdminLayout = () => {
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

  const toggleSidebar = () => {
    setSidebarExpanded(!isSidebarExpanded);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div className="flex flex-row w-[100vw] bg-white overflow-x-hidden">
        {/* Sidebar */}
        <div
          className={`${
            isSidebarExpanded
              ? "ssm:w-[43%] smd:w-[30%] w-[58%]"
              : "w-[8%] ssm:w-[6%] flex items-start justify-center"
          } md:w-[25%] xxl:w-[19%] h-[100vh] z-30 transition-all overflow-hidden duration-300 ease-in-out fixed shadow-lg shadow-gray-300 bg-red-600`}
        >
          <div className="flex items-center justify-between p-4 md:hidden">
            <button onClick={toggleSidebar} className="text-white smd:text-xl">
              <GiHamburgerMenu />
            </button>
          </div>
          {/* Only show the sidebar content when expanded or on md and larger screens */}
          {(isSidebarExpanded || !isSmallScreen) && (
            <SideBar isSidebarExpanded={isSidebarExpanded} />
          )}
        </div>

        {/* Main Content Area */}
        <div
          className={`w-full flex flex-col justify-start items-start overflow-y-auto overflow-x-hidden ${
            isSidebarExpanded
              ? " "
              : "w-full md:w-[90%] xxl:ml-[19%] lg:ml-[25%] md:ml-[26%] ml-[5%]"
          } transition-all h-auto duration-300 ease-in-out `}
        >
          <div
            className={`w-full shadow-lg shadow-gray-300 transition-all h-auto duration-300 ease-in-out`}
          >
            <Navbar />
          </div>
          <div
            className={` overflow-y-auto overflow-x-hidden w-full transition-all h-auto duration-300 ease-in-out`}
          >
            <div className="flex-grow w-full p-6">
              {/* Forms/Content */}
              <div className="w-full">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
