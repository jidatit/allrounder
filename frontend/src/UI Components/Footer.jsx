import React from "react";
import { NavLink } from "react-router-dom";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

function Footer() {
  const menuItems = [
    { name: "About", url: "/about" },
    { name: "Contact", url: "/contact" },
    { name: "Categories", url: "/categories" },
    { name: "How to", url: "/how-to" },
    { name: "Join Now", url: "/join-now" },
  ];
  const menuItems2 = [
    { name: "F.A.Q", url: "/faq" },
    { name: "Sitemap", url: "/sitemap" },
    { name: "Conditions", url: "/conditions" },
    { name: "Licenses", url: "/licenses" },
  ];
  return (
    <footer className="lg:py-10 md:py-7 py-5 flex flex-col text-sm lg:text-lg  max-w-[1440px] mx-auto">
      <div className="flex  items-center justify-between p-10  lg:p-20 w-full lg:flex-nowrap  flex-wrap max-w-[1440px] mx-auto   ">
        <div className=" lg:p-20 py-10  md:w-1/4 w-full   md:border-black   ">
          <p className="text-[40px] custom-bold">LOGO</p>
        </div>
        <div className="md:h-[230px]    md:w-0 md:border-x-2 border-black"></div>

        <div className=" lg:px-20   md:w-1/4 w-full   md:border-black flex items-start h-[230px] ">
          <ul className="flex flex-col gap-4">
            {menuItems.map((item) => {
              return (
                <li key={item.url} className="">
                  <NavLink
                    to={item.url}
                    className={"custom-bold text-lg uppercase"}
                  >
                    {item.name}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="md:h-[230px]   border-t w-full  mb-4 md:mb-0 md:w-0 md:border-x-2 border-black"></div>

        <div className=" lg:px-20  md:w-1/4 w-full   md:border-black    flex  items-start h-[230px] ">
          <ul
            className="flex flex-col gap-4
          "
          >
            {menuItems2.map((item) => {
              return (
                <li key={item.url}>
                  <NavLink
                    to={item.url}
                    className={"custom-bold text-lg uppercase"}
                  >
                    {item.name}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="md:h-[230px]  mb-4 md:mb-0 border-t w-full md:w-0 md:border-x-2 border-black"></div>

        <div className="lg:px-10 w-full md:w-full md:p-10 flex flex-col items-start md:items-center  lg:items-start">
          <h4 className="font-bold text-[18px] uppercase">Newsletter</h4>
          <p className="text-[13px]">lorem ipsum doler sit</p>
          <div className="border-black text-sm  border-2 rounded-md mt-4 lg:max-w-[400px] ">
            <form className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="p-2 w-full rounded-l-md outline-none"
              />
              <button
                type="submit"
                className="p-1 md:p-4 bg-[#E55938] text-white"
              >
                Subscribe
              </button>
            </form>
          </div>

          <p className="mt-4">Stay in touch</p>

          {/* Social Icons */}
          <div className="flex item-center lg:gap-6  gap-3 mt-4">
            <a href="" className="bg-[#E55938] p-2 rounded-full text-white">
              <FaFacebook />
            </a>
            <a href="" className="bg-[#E55938] p-2 rounded-full text-white">
              <FaXTwitter />
            </a>
            <a href="" className="bg-[#E55938] p-2 rounded-full text-white">
              <FaLinkedinIn />
            </a>
            <a href="" className="bg-[#E55938] p-2 rounded-full text-white">
              <FaYoutube />
            </a>
            <a href="" className="bg-[#E55938] p-2 rounded-full text-white">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>
      <div className="w-[80%] mx-auto border-black border-t"></div>
      <div className="  flex custom-bold  p-2 items-center md:p-9 mx-auto flex-col md:flex-row">
        <p>{new Date().getFullYear()} &copy;</p>
        <p className="text-center">
          COMPANY NAME WEBSITE DESIGN - ALL RIGHTS RESERVED
        </p>
      </div>
    </footer>
  );
}

export default Footer;
