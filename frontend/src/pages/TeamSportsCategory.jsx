import React from "react";
import { CgMenuLeft } from "react-icons/cg";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { LuPhone } from "react-icons/lu";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Link } from "react-router-dom";

const createCustomIcon = (number) => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div class="marker-icon bg-white flex items-center justify-center shadow-lg font-bold rounded-full px-3  text-xl  ">${number}</div>`,
    iconSize: [30, 30],
    iconAnchor: [30, 30],
  });
};

const TeamSportsCategory = () => {
  const locations = [
    { id: 1, name: "Location 1", lat: 33.672326, lng: 73.001917 },
    { id: 2, name: "Location 2", lat: 33.655181, lng: 3.033181 },
    { id: 3, name: "Location 3", lat: 33.672326, lng: 73.001918 },
  ];
  return (
    <main className="h-full w-full ">
      <section className="h-full w-full px-4 sm:px-8 pt-10 lg:px-16 mx-auto max-w-[1440px] flex flex-col gap-2 md:gap-3 lg:gap-5">
        <div>
          <h2 className="custom-bold text-2xl md:text-4xl lg:text-5xl ">
            Team Sports
          </h2>
          {/* filter buttons */}
          <div className="flex gap-3 custom-medium mt-3 lg:mt-8">
            <button className="bg-[#EBEBEB] flex items-center justify-center p-2 px-4  rounded-full text-xl gap-1">
              <CgMenuLeft />
              <p className="text-sm">Categories</p>
            </button>
            <button className="bg-[#EBEBEB] flex items-center justify-center lg:p-2 p-1 px-6 lg:px-8  rounded-full text-sm lg:text-xl gap-1">
              <HiOutlineAdjustmentsHorizontal />
              <p className="text-sm">Filters</p>
            </button>
          </div>
          <div className=" flex mt-3 lg:pt-8 pt-4 flex-col lg:flex-row ">
            {/* Card Container */}

            <div className="  lg:w-[60%] h-[860px]  p-4 overflow-auto scrollbar-custom">
              <BlogCard
                name={"Toy shop - Grand launch, PWD Islamabad"}
                address={"1234 Main Street New York, NY 10024"}
                contact={"(917) 888-1234"}
                url={
                  "/Sports-banners/sports-teacher-with-her-students_23-2149070768.png"
                }
              />
              <BlogCard
                name={"Toy shop - Grand launch, PWD Islamabad"}
                address={"1234 Main Street New York, NY 10024"}
                contact={"(917) 888-1234"}
                url={
                  "/Sports-banners/sports-teacher-with-her-students_23-2149070768.png"
                }
              />
              <BlogCard
                name={"Toy shop - Grand launch, PWD Islamabad"}
                address={"1234 Main Street New York, NY 10024"}
                contact={"(917) 888-1234"}
                url={
                  "/Sports-banners/sports-teacher-with-her-students_23-2149070768.png"
                }
              />
              <BlogCard
                name={"Toy shop - Grand launch, PWD Islamabad"}
                address={"1234 Main Street New York, NY 10024"}
                contact={"(917) 888-1234"}
                url={
                  "/Sports-banners/sports-teacher-with-her-students_23-2149070768.png"
                }
              />
              <BlogCard
                name={"Toy shop - Grand launch, PWD Islamabad"}
                address={"1234 Main Street New York, NY 10024"}
                contact={"(917) 888-1234"}
                url={
                  "/Sports-banners/sports-teacher-with-her-students_23-2149070768.png"
                }
              />
            </div>
            <div className=" lg:w-[40%] md:h-[600px] h-[500px] lg:h-[800px] p-4">
              <MapContainer
                center={[33.684422, 73.047882]}
                zoom={12}
                style={{ height: "100%", width: "100%" }}
                className="z-10  "
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {locations.map((location) => (
                  <Marker
                    key={location.id}
                    position={[location.lat, location.lng]}
                    icon={createCustomIcon(2)}
                  >
                    <Popup>{location.name}</Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

const BlogCard = ({ name, address, contact, url }) => {
  return (
    <Link
      to={"/post/1"}
      className=" flex custom-shadow md:flex-row flex-col rounded-xl overflow-hidden mb-6 p-4 min-h-68 "
    >
      <div className="md:w-[50%]  w-full">
        <img
          src={url}
          alt="img here"
          className="w-full object-cover object-center"
        />
      </div>
      <div className=" flex flex-col items-start gap-5 justify-start p-3 lg:p-4">
        <h3 className="custom-semibold text-lg   lg:text-2xl">{name}</h3>
        <address className="custom-regular not-italic text-lg lg:text-xl ">
          {address}
        </address>
        <p className="flex items-center  gap-2 text-lg lg:text-xl custom-regular">
          <LuPhone />
          {contact}
        </p>
      </div>
    </Link>
  );
};

export default TeamSportsCategory;
