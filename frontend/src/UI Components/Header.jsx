import { useEffect, useRef, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { PiUser } from "react-icons/pi";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/authContext";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, handleLogout } = useAuth();
  const navItemRef = useRef(null);
  const menuRef = useRef(null);
  const userRef = useRef(null);
  const menuItems = [
    { name: "Home", url: "/" },
    { name: "Artists" },
    { name: "Partners" },
    { name: "Tours" },
    { name: "Blog", url: "/blog" },
  ];

  const handleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !navItemRef.current.contains(event.target) &&
        !userRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50  bg-[#ffffff]">
      <section className=" md:flex items-center justify-between sm:px-8 py-6 lg:px-16 custom-regular hidden mx-auto max-w-[1440px]">
        {/* Logo */}
        <Link to={"/"}>
          <p className="text-[40px] custom-bold">LOGO</p>
        </Link>

        <div>
          <nav>
            <ul className="flex items-center sm:text-sm sm:gap-3 lg:gap-8 lg:text-xl 2xl:text-2xl 2xl:gap-9">
              {menuItems.map((menuItem, index) => (
                <li key={index}>
                  {menuItem?.url ? (
                    <NavLink
                      to={menuItem.url}
                      className={({ isActive }) =>
                        isActive
                          ? "text-[#E55938]"
                          : "hover:text-[#E55938] transition-all duration-300 hover:custom-semibold"
                      }
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {menuItem.name}
                    </NavLink>
                  ) : (
                    <span className="text-gray-500 cursor-not-allowed">
                      {menuItem.name}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* User Section */}
        <div className="flex lg:gap-20 sm:gap-10 items-center">
          {/* <button className="w-[181px] h-[48px] bg-[#E55938] rounded-3xl text-white custom-semibold">
            Create your event
          </button> */}
          <div className="text-3xl">
            {currentUser ? (
              <div className="flex gap-x-7 items-center">
                {currentUser.userType === "admin" && (
                  <Link to={"/AdminLayout/activityManagement"}>
                    <PiUser />
                  </Link>
                )}
                {currentUser.userType === "user" && (
                  <Link to={"/UserDashboard"}>
                    <PiUser />
                  </Link>
                )}
                <button
                  className="bg-[#E55938] hover:bg-orange-700 py-2.5 px-6 rounded-lg custom-bold text-white text-[18px]"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to={"/signup"}>
                <PiUser />
              </Link>
            )}
          </div>
        </div>
      </section>
      {/* Mobile menu */}
      <section className="md:hidden  py-6 bg-white z-40 ">
        <div className=" flex  justify-between items-center px-4">
          <Link to={"/"}>
            <p className="text-3xl custom-bold">LOGO</p>
          </Link>
          <div onClick={handleMobileMenu}>
            <GiHamburgerMenu className="text-3xl" />
          </div>
        </div>

        <div
          ref={menuRef}
          className={`absolute  px-4 py-6 top-0  bg-white z-40 h-screen w-full text-3xl flex flex-col justify-top gap-10  items-center ${
            isMobileMenuOpen ? "flex" : "hidden"
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <Link to={"/"}>
              <p className="text-3xl custom-bold">LOGO</p>
            </Link>

            <div className="flex lg:gap-20 sm:gap-10 gap-2 items-center bg-green-300 ">
              {/* <button className=" bg-[#E55938] text-[12px]   px-6 py-1 rounded-3xl text-white custom-semibold">
                Create your event
              </button> */}
              {/* <div className="text-3xl ">
                <Link to={"/signup"}>
                  <PiUser />
                </Link>
              </div> */}
            </div>
            <div className="flex gap-3">
              <div className="text-3xl ">
                {currentUser ? (
                  <div className="flex gap-x-7 items-center">
                    {currentUser.userType === "admin" && (
                      <Link to={"/AdminLayout/activityManagement"}>
                        <PiUser />
                      </Link>
                    )}
                    {currentUser.userType === "user" && (
                      <Link to={"/UserDashboard"}>
                        <PiUser />
                      </Link>
                    )}
                    <button
                      className="bg-[#E55938] hover:bg-orange-700 py-2.5 px-6 rounded-lg custom-bold text-white text-[18px]"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link to={"/signup"}>
                    <PiUser />
                  </Link>
                )}
              </div>
              <div onClick={() => setIsMobileMenuOpen(false)}>
                <IoMdClose />
              </div>
            </div>
          </div>
          {/* <nav className=" h-full w-full flex items-center justify-center">
            <ul
              ref={navItemRef}
              className=" items-center  sm:gap-3 text-center flex flex-col gap-5  w-fit"
            >
              {menuItems.map((menuItem, index) => (
                <li key={index} onClick={() => setIsMobileMenuOpen(false)}>
                  <NavLink
                    to={menuItem.url}
                    className={({ isActive }) =>
                      isActive
                        ? "text-[#E55938]"
                        : "hover:text-[#E55938] transition-all duration-300 hover:custom-semibold"
                    }
                  >
                    {menuItem.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav> */}
          <nav className="h-full w-full flex items-center justify-center">
            <ul
              ref={navItemRef}
              className="items-center sm:gap-3 text-center flex flex-col gap-5 w-fit"
            >
              {menuItems.map((menuItem, index) => (
                <li key={index} onClick={() => setIsMobileMenuOpen(false)}>
                  {menuItem?.url ? (
                    <NavLink
                      to={menuItem.url}
                      className={({ isActive }) =>
                        isActive
                          ? "text-[#E55938]"
                          : "hover:text-[#E55938] transition-all duration-300 hover:custom-semibold"
                      }
                    >
                      {menuItem.name}
                    </NavLink>
                  ) : (
                    <span className="text-gray-500 cursor-not-allowed">
                      {menuItem.name}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
    </header>
  );
};

export default Header;
