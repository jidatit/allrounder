import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { NavHashLink } from "react-router-hash-link";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { collection, getDocs, orderBy, doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import emailjs from "@emailjs/browser";
import { message } from "antd";
import { LoadingSpinner } from "../App";

function Footer() {
  const [logoUrl, setLogoUrl] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [menuItems2, setMenuItems2] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const menuURLs = {
    Home: "/",
    Activities: "/allActivities",
    // Blogs: "/blog",
    // Featured_Activities:"/activities",
    Joinnow: "/comingsoon",
    Faq: "/comingsoon",
  };
  const menuURLs1 = {
    Login: "/login",
    Signup: "/signup",
    Conditions: "/comingsoon",
    Licenses: "/comingsoon",
  };
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
          console.log("logo uploaded");
        } else {
          console.warn(
            "No 'url' field found in the most recent 'editHeader' document."
          );
        }
      } else {
        console.warn("No documents found in editHeader.");
      }
    } catch (error) {
      console.error("Error fetching logo:", error);
    } finally {
      setLoading(false);
    }
  };
  // useEffect(() => {
  //   fetchLogo();
  // }, []);

  const fetchMenus = async () => {
    try {
      console.log("No");
      const docRef = doc(db, "FooterMenuStructure", "menus");
      const docSnap = await getDoc(docRef);
      console.log("Yes");

      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("Hello", data);
        setMenuItems(data.menuMain);
        console.log("Menu Items:", menuItems);
        setMenuItems2(data.menuSecondary);
        console.log("Menu Items 2:", menuItems2);
      } else {
        console.log("No menu structure found in Firestore.");
      }
    } catch (error) {
      console.error("Error fetching menus from Firestore:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLinks = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "socialLinks"));
      const linksData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setSocialLinks(linksData);
    } catch (error) {
      console.error("Error fetching social links: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogo();
    fetchMenus();
    fetchLinks();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const templateParams = {
      to_name: "",
      from_name: "All Rounder",
      name: "subscriber",
      from_email: email,
    };

    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_QR_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_KEY
      )

      .then((response) => {
        console.log("SUCCESS!", response.status, response.text);
        message.success("Thank you for subscribing!");
      })
      .catch((err) => {
        console.log("FAILED...", err);
        message.error("Subscription failed. Please try again.");
      });

    setEmail("");
  };
  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <footer className="lg:py-10 md:py-7 py-5 flex flex-col text-sm lg:text-lg  max-w-[1440px] mx-auto">
          <div className="flex  items-center justify-between p-10  xl:p-20 w-full lg:flex-nowrap  flex-wrap max-w-[1440px] mx-auto   ">
            <div className=" xl:p-8 py-10 md:pr-4 w-full   md:border-black   ">
              <img
                src={logoUrl}
                alt="Logo"
                // style={{ maxWidth: "100%", maxHeight: 80 }}
              />
              {/* <p className="text-[40px] custom-bold">{logoUrl}</p> */}
            </div>
            <div className="md:h-[230px] md:w-0 md:border-x-2 border-black"></div>

            <div className=" lg:px-20   md:w-1/4 w-full md:border-black flex items-start h-[230px] mt-10 ">
              <ul className="flex flex-col gap-4">
                {menuItems.map((item, index) => {
                  return (
                    <li key={index} className="custom-bold text-lg uppercase">
                      {item === "Featured Activities" ? (
                        <NavHashLink
                          smooth
                          to="#featured-activities-section"
                          className={"custom-bold text-lg uppercase"}
                        >
                          {item.replace("", " ")}
                        </NavHashLink>
                      ) : item === "Home" ? (
                        <NavLink
                          to={menuURLs[item]}
                          className={"custom-bold text-lg uppercase"}
                          onClick={() => window.scrollTo(0, 0)}
                        >
                          {item}
                        </NavLink>
                      ) : (
                        <NavLink
                          to={menuURLs[item]}
                          className={"custom-bold text-lg uppercase"}
                        >
                          {item}
                        </NavLink>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="md:h-[230px]   border-t w-full  mb-4 md:mb-0 md:w-0 md:border-x-2 border-black"></div>

            <div className=" lg:px-20  md:w-1/4 w-full   md:border-black    flex  items-start h-[230px] mt-10  ">
              <ul
                className="flex flex-col gap-4
          "
              >
                {menuItems2.map((item, index) => {
                  return (
                    <li key={index} className="custom-bold text-lg uppercase">
                      <NavLink
                        to={menuURLs1[item]}
                        className={"custom-bold text-lg uppercase"}
                      >
                        {item}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="md:h-[230px]  mb-4 md:mb-0 border-t w-full md:w-0 md:border-x-2 border-black"></div>

            <div className="lg:px-10 w-full md:w-full md:p-10 flex flex-col items-start   lg:items-start">
              <h4 className="font-bold text-[18px] uppercase">Newsletter</h4>
              <p className="text-[13px]">lorem ipsum doler sit</p>

              {/* email work starts here */}
              <div className="border-black text-sm  border-2 rounded-md mt-4 lg:max-w-[400px] ">
                <form onSubmit={handleSubmit} className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="p-2 w-full rounded-l-md outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required // Ensures the input field is not empty
                  />
                  <button
                    type="submit"
                    className="p-1 md:p-4 bg-[#E55938] text-white"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
              {/* email work ends here */}

              <p className="mt-4">Stay in touch</p>

              {/* Social Icons */}
              <div className="flex item-center lg:gap-6 gap-3 mt-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8"
                  >
                    {/* If logo exists, use the logo, otherwise show the icon */}
                    {link.logoUrl ? (
                      <img
                        src={link.logoUrl}
                        alt="Social Media Logo"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : // Use a default icon if no logo is provided
                    link.url.includes("facebook") ? (
                      <FaFacebook />
                    ) : link.url.includes("twitter") ? (
                      <FaTwitter />
                    ) : link.url.includes("linkedin") ? (
                      <FaLinkedinIn />
                    ) : link.url.includes("youtube") ? (
                      <FaYoutube />
                    ) : link.url.includes("instagram") ? (
                      <FaInstagram />
                    ) : (
                      <FaFacebook /> // Default to Facebook if no match
                    )}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="w-[98%] mx-auto border-black border-t"></div>
          <div className="  flex custom-bold  p-2 items-center md:p-9 mx-auto flex-col md:flex-row">
            <p>{new Date().getFullYear()} &copy;</p>
            <p className="text-center">
              COMPANY NAME WEBSITE DESIGN - ALL RIGHTS RESERVED
            </p>
          </div>
        </footer>
      )}
    </>
  );
}

export default Footer;
