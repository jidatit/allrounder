
import { useEffect, useRef, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { PiUser } from "react-icons/pi";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { db } from "../config/firebase";
import { getDocs, doc,getDoc ,collection,orderBy} from "firebase/firestore";
import { message } from "antd";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, handleLogout } = useAuth();
   const [MenuItems, setMenuItems] = useState([]);
   const [logoUrl, setLogoUrl] = useState("");
   const [loading, setLoading] = useState(true);
  const navItemRef = useRef(null);
  const menuRef = useRef(null);
  const userRef = useRef(null);

  const fetchMenuItems = async () => {
    try {
      console.log("hhhhh");
      setLoading(true);
      console.log("ggggg");
      const docRef = doc(db, "menuStructure", "menu");
      console.log("iii")
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setMenuItems(data.items);
        console.log(data);
        console.log("kkk");
      } else {
        console.error("No menu data found in Firestore.");
      }
    } catch (error) {
      console.error("Error fetching menu data:", error);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  fetchMenuItems();
}, []);

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

  // const menuItems = [
  //   { name: "Home", url: "/" },
  //   { name: "Artists" },
  //   { name: "Partners" },
  //   { name: "Tours" },
  //   { name: "Blog", url: "/blog" },
  // ];

     
       const menuURLs = {
             Home: "/",
            Activities:"/allActivities",
            //  Blogs: "/blog",
            //  Artists: "/artists",
             Partners: "/partners",
             Tours: "/tours",
               };

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

  const showLoginIcon = JSON.parse(localStorage.getItem("showLoginIcon"));

  return (
    <header className="sticky top-0 z-50 bg-[#ffffff]">
      <section className="md:flex items-center justify-between sm:px-2 lg:px-12 custom-regular hidden mx-auto max-w-[1440px]">
        <Link to={"/"}>
          {/* <p className="text-[40px] custom-bold">LOGO</p> */}
          <div >
      {logoUrl && (
      <img
        src={logoUrl} 
          alt="Logo"
        style={{ maxWidth: "5rem", maxHeight: "5rem" }}
    />
  )}
</div>
        </Link>
        <div>
          <nav>
            <ul className="flex items-center sm:text-sm sm:gap-3 lg:gap-8 lg:text-xl 2xl:text-2xl 2xl:gap-9">
              {MenuItems.map((Items, index) => (
                <li key={index}>
                  {Items? (
                    <NavLink
                    to={menuURLs[Items]}
                      className={({ isActive }) =>
                        isActive
                          ? "text-[#E55938]"
                          : "hover:text-[#E55938] transition-all duration-300 hover:custom-semibold"
                      }
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {Items}
                    </NavLink>
                  ) : (
                    <span className="text-gray-500 cursor-not-allowed">
                      {Items}
                    </span>
                  )}
                </li>
              ))}
            </ul>  
          </nav>
        </div>
        <div className="flex lg:gap-20 sm:gap-10 items-center">
          <div className=" flex items-center gap-4">
          {currentUser &&  (
            <>
            {showLoginIcon && (
            
              <div className="flex gap-4 items-center">
                {currentUser.userType === "admin" && (
                  <Link to={"/AdminLayout/activityManagement"}>
                    <PiUser className="text-3xl"/>
                  </Link>
                )}
                {currentUser.userType === "user" && (
                  <Link to={"/UserDashboard"}>
                    <PiUser />
                  </Link>
                )}
                 </div>
                )}
                <button
                  className="bg-[#E55938] hover:bg-orange-700 py-2.5 px-6 rounded-lg custom-bold text-white text-[18px]"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              
            
              </>
          )}
  
  {!currentUser && showLoginIcon && (
              <Link
                to={"/signup"}
                onClick={() => setIsMobileMenuOpen(false)} // Close mobile menu on click
              >
                <PiUser />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Mobile menu */}
      <section className="md:hidden  bg-white z-40">
        <div className="flex justify-between items-center px-4">
          <Link to={"/"}>
            {/* <p className="text-3xl custom-bold">LOGO</p> */}
            <div >
      {logoUrl && (
      <img
        src={logoUrl} 
          alt="Logo"
        style={{ maxWidth: "5rem", maxHeight: "5rem" }}
    />
  )}
</div>
          </Link>
          <div onClick={handleMobileMenu}>
            <GiHamburgerMenu className="text-3xl" />
          </div>
        </div>

        <div
          ref={menuRef}
          className={`absolute px-4 py-6 top-0 bg-white z-40 h-screen w-full text-3xl flex flex-col justify-top gap-10 items-center ${
            isMobileMenuOpen ? "flex" : "hidden"
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <Link to={"/"}>
              {/* <p className="text-3xl custom-bold">LOGO</p> */}
              <div >
      {logoUrl && (
      <img
        src={logoUrl} 
          alt="Logo"
        style={{ maxWidth: "5rem", maxHeight: "5rem" }}
    />
  )}
</div>

            </Link>

            <div className="flex lg:gap-20 sm:gap-10 gap-2 items-center gap-x-4 ">
              <div className="flex items-center gap-4">
                {currentUser && (
                  <>
                  {showLoginIcon && (

                  <div className="flex gap-4 items-center ">
                    {currentUser.userType === "admin" && (
                      <Link to={"/AdminLayout/activityManagement"}>
                        <PiUser className="text-3xl "/>
                      </Link>
                    )}
                    {currentUser.userType === "user" && (
                      <Link to={"/UserDashboard"}>
                        <PiUser />
                      </Link>
                    )}
                    </div>                    
                  )}
                    <button
                      className="bg-[#E55938] hover:bg-orange-700 py-2.5 px-6 rounded-lg custom-bold text-white text-[18px]"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                    </>
                )}
                {!currentUser && showLoginIcon && (
                  <Link
                    to={"/signup"}
                    onClick={() => setIsMobileMenuOpen(false)} // Close mobile menu on click
                  >
                    <PiUser />
                  </Link>
                )}
              </div>
              <div onClick={() => setIsMobileMenuOpen(false)}>
                <IoMdClose />
              </div>
            </div>
          </div>

          <nav className="h-full w-full flex items-center justify-center">
            <ul
              ref={navItemRef}
              className="items-center sm:gap-3 text-center flex flex-col gap-5 w-fit"
            >
              {MenuItems.map((Items, index) => (
                <li key={index} onClick={() => setIsMobileMenuOpen(false)}>
                  {Items?.url ? (
                    <NavLink
                    to={menuURLs[Items]}
                      className={({ isActive }) =>
                        isActive
                          ? "text-[#E55938]"
                          : "hover:text-[#E55938] transition-all duration-300 hover:custom-semibold"
                      }
                    >
                      {Items}
                    </NavLink>
                  ) : (
                    <span className="text-gray-500 cursor-not-allowed">
                      {Items}
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






















