import { useState, useEffect } from "react";
import { Outlet } from "react-router";
import { GiHamburgerMenu } from "react-icons/gi";
import Navbar from "../components/Navbar";
import AdminSideBar from "../components/AdminSideBar";

const AdminLayout = () => {
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

  const toggleSidebar = () => {
    setSidebarExpanded(!isSidebarExpanded);

  };

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarExpanded(false); 
      } else {
        setSidebarExpanded(true); 
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex flex-row w-full h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarExpanded
            ? "w-[250px] md:w-[300px]"
            : "w-[70px] md:w-[80px]"
        } transition-all duration-300 ease-in-out fixed left-0 top-0 h-full bg-red-600 shadow-lg`}
      >
        <div className="flex items-center justify-between p-4 ">
          <button 
          onClick={toggleSidebar} 
          className="text-white text-xl"
         
          >
            <GiHamburgerMenu />
          </button>
        </div>
        <AdminSideBar isSidebarExpanded={isSidebarExpanded} />
      </div>

      {/* Main Content Area */}
      <div
        className={`flex flex-col flex-grow transition-all duration-300 ease-in-out ${
          isSidebarExpanded ? "ml-[250px] md:ml-[300px]" : "ml-[70px] md:ml-[80px]"
        }`}
      >
        <Navbar />
        <div className="overflow-auto flex-grow">
          <div className="p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
