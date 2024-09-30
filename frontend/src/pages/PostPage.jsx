import React, { useState } from "react";
import { IoShareOutline, IoStarOutline, IoStarSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import FeaturedCard from "../UI Components/FeaturedCard";
import { PiCopy } from "react-icons/pi";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
const createCustomIcon = (number) => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div class="marker-icon bg-white flex items-center justify-center shadow-lg font-bold rounded-full px-3  text-xl  ">${number}</div>`,
    iconSize: [30, 30],
    iconAnchor: [30, 30],
  });
};

const PostPage = () => {
  const locations = [
    { id: 1, name: "Location 1", lat: 33.672326, lng: 73.001917 },
    { id: 2, name: "Location 2", lat: 33.655181, lng: 3.033181 },
    { id: 3, name: "Location 3", lat: 33.672326, lng: 73.001918 },
  ];
  const currentUrl = window.location.href;
  const [copied, setCopied] = useState(false);
  const tags = ["Dance", "Ballet", "Soccer", "Team Sports"];
  const activityDetails = [
    "Vivamus elementum semper nisi. Aenean vulputate eleifend tellus.",
    "Vivamus elementum semper nisi.",
    "Vivamus elementum semper nisi. Aenean vulputate eleifend tellus.",
    "Vivamus elementum semper nisi. Aenean tellus.",
    "Vivamus elementum semper nisi. Aenean vulputate eleifend tellus.",
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const activityCards = [
    {
      title: "Vivamus elementum semper nisi. Aenean dolor",
      duration: "Duration 2 hours",
      date: "2nd July – 2nd August",
      ageRange: "6 – 12 Years",
      reviews: 584,
      rating: 4.5,
      price: 35.0,
      imageUrl: "/Featured/card.png",
      sponsored: true,
    },
    {
      title: "Vivamus elementum semper nisi. Aenean dolor",
      duration: "Duration 2 hours",
      date: "2nd July – 2nd August",
      ageRange: "6 – 12 Years",
      reviews: 584,
      rating: 4.5,
      price: 35.0,
      imageUrl: "/Featured/card-2.png",
      sponsored: true,
    },
    {
      title: "Vivamus elementum semper nisi. Aenean dolor",
      duration: "Duration 2 hours",
      date: "2nd July – 2nd August",
      ageRange: "6 – 12 Years",
      reviews: 584,
      rating: 4.5,
      price: 35.0,
      imageUrl: "/Featured/card-3.png",
      sponsored: true,
    },
    {
      title: "Vivamus elementum semper nisi. Aenean dolor",
      duration: "Duration 2 hours",
      date: "2nd July – 2nd August",
      ageRange: "6 – 12 Years",
      reviews: 584,
      rating: 4.5,
      price: 35.0,
      imageUrl: "/Featured/card-4.png",
      sponsored: true,
    },
    {
      title: "Vivamus elementum semper nisi. Aenean dolor",
      duration: "Duration 2 hours",
      date: "2nd July – 2nd August",
      ageRange: "6 – 12 Years",
      reviews: 584,
      rating: 4.5,
      price: 35.0,
      imageUrl: "/Featured/card-5.png",
      sponsored: true,
    },
  ];

  const CustomerReviews = [
    {
      name: "Alex Allan",
      avatarUrl: "/avatar.jpeg",

      rating: 4, // Rating out of 5
      title: "Lorem Ipsum Dolor Sit Amet, Consectetuer Adipiscing Elit.",
      description: `Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. 
        Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. 
        Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. 
        Lorem ipsum dolor sit ametnin.`,
      date: "28 August 2024",
    },
    {
      name: "Alex Allan",
      avatarUrl: "/avatar.jpeg",
      rating: 4,
      title: "Aenean Commodo Ligula Eget Dolor.",
      description: `Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. 
        Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. 
        Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. 
        Lorem ipsum dolor sit ametnin.`,
      date: "28 August 2024",
    },
    {
      name: "Alex Allan",
      avatarUrl: "/avatar.jpeg",

      rating: 4, // Rating out of 5
      title: "Cum Sociis Natoque Penatibus Et Magnis Dis Parturient Montese.",
      description: `Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. 
        Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. 
        Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. 
        Lorem ipsum dolor sit ametnin.`,
      date: "28 August 2024",
    },
  ];

  const rating = 3;
  return (
    <main className="h-full w-full ">
      <section className="h-full w-full px-4 sm:px-8  pt-5  md:pt-8 lg:pt-10 lg:px-16 mx-auto max-w-[1440px] flex flex-col gap-2 md:gap-3 lg:gap-5 ">
        {/* head */}
        <header className="flex flex-col md:flex-row ">
          <div className="lg:w-44 lg:h-44 md:w-32 md:h-32 w-24 h-24  bg-orange-100 rounded-xl overflow-hidden ">
            <img
              src="/Sports-banners/sports-teacher-with-her-students_23-2149070768.png"
              alt=""
              className="object-cover object-center w-full h-full"
            />
          </div>
          <div className="md:ml-7 mt-2 md:mt-0 flex justify-center items-start flex-col">
            <h2 className="custom-bold text-[20px] md:text-[28px] lg:text-[35px] ">
              Toy shop - Grand launch, PWD Islamabad
            </h2>
            <div className="flex md:items-center justify-between    flex-col md:flex-row md:w-[500px] lg:w-[650px]  mt-2 md:mt-6">
              <div className="lg:text-2xl text-xl flex items-center lg:gap-2 gap-1">
                <IoStarOutline /> <p>im Interested</p>
              </div>
              <div className="Lg:text-2xl text-xl flex items-center lg:gap-2 gap-1">
                <IoShareOutline />
                share
              </div>
              <div className="lg:text-2xl text-xl flex items-center lg:gap-2 gap-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, index) => (
                    <IoStarSharp
                      key={index}
                      className={`text-[#FFA432] ${
                        index < rating ? "" : "text-[#CFD9DE]"
                      }`}
                    />
                  ))}
                </div>
                (584 reviews)
              </div>
            </div>
          </div>
        </header>
        {/* body */}
        <div className=" flex flex-col lg:flex-row lg:gap-4 mt-6 lg:mt-12">
          <div className="lg:w-[59%] ">
            {/* blog body */}
            <article className="mb-16">
              {/* main image */}
              <img
                src="/event.jpeg"
                alt=""
                className="w-full h-full max-h-[500px] object-cover object-center  rounded-2xl overflow-hidden custom-shadow rounded-2xl"
              />
              {/* tags */}
              <div className="w-full flex flex-wrap gap-2  pt-9">
                {tags.map((tag, index) => {
                  return (
                    <p
                      key={index}
                      className="bg-[#E559381A] border-2 border-[#E55938] px-2 py-0.5 text-xl rounded-xl"
                    >
                      #{tag}
                    </p>
                  );
                })}
              </div>
              <p className="md:text-xl  text-lg lg:text-2xl custom-semibold my-4">
                DESCRIPTION
              </p>
              <div className="gilroy-regular text-xl mb-6 lg:mb-10">
                <p>
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
                  Aenean commodo ligula eget dolor. Aenean massa. Cum sociis
                  natoque penatibus et magnis dis parturient montes, nascetur
                  ridiculus mus. Donec quam felis, ultricies nec, pellentesque
                  eu, pretium quis, sem. Nulla consequat massa quis enim. Donec
                  pede justo, fringilla vel, aliquet nec, vulputate eget, arcu.
                  In enim justo, rhoncus ut, imperdiet a, venenatis vitae,
                  justo. Nullam dictum felis eu pede mollis pretium. Integer
                  tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean
                  vulputate eleifend tellus. Aenean leo ligula, porttitor eu,
                  consequat vitae, eleifend ac, enim. Aliquam lorem ante,
                  dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra
                  nulla ut metus varius laoreet. Quisque rutrum. Aenean
                  imperdiet. Etiam ultricies nisi vel augue. Curabitur
                  ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus.
                  Maecenas tempus, tellus eget condimentum rhoncus, sem quam
                  semper libero, sit amet adipiscing sem neque sed ipsum. Nam
                  quam nunc, blandit vel, luctus pulvinar
                </p>
              </div>

              <p className="md:text-xl  text-lg lg:text-2xl custom-semibold my-4">
                ACTIVITY DETAILS
              </p>
              <ul className="">
                {activityDetails.map((acitivity, index) => {
                  return (
                    <li
                      key={index}
                      className="text-xl custom-regular m-2 before:content-['•'] before:text-2xl before:mr-4"
                    >
                      {acitivity}
                    </li>
                  );
                })}
              </ul>
            </article>
            <p className="md:text-xl  text-lg lg:text-2xl custom-semibold my-4">
              Open In Google map
            </p>
            <div className="100% md:h-[400px] h-[500px]  ">
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
          <div className="lg:w-[39%] custom-shadow h-full  rounded-xl   lg:mt-0 mt-5 ">
            <div className="py-7 px-9 border-b border-[#8D8D8D]">
              <h2 className="text-xl custom-semibold mb-5">Host Details</h2>
              <div className="flex">
                <img
                  src="/kids-dance-school-ballet-hiphop-street-funky-modern-dancers_155003-2610.png"
                  alt=""
                  className="h-28 w-28 object-cover object-center rounded-md"
                />
                <div className="ml-3">
                  <h4 className="text-lg custom-medium">The Entertainer</h4>
                  <p className="text-sm custom-light">
                    Lorem ipsum dolor sit amet consectetur. Amet nisl congue.
                  </p>
                </div>
              </div>
              <div>
                <h5 className="my-4 custom-medium text-lg">About The Host:</h5>
                <p className="text-sm custom-light">
                  Lorem ipsum dolor sit amet consectetur. Sed nulla nascetur
                  volutpat enim eget tincidunt sed enim. Lacus cursus proin ut
                  luctus risus nisl. Suspendisse tellus egestas dictum accumsan.
                </p>
                <p className="text-sm custom-light my-3">
                  <span className="custom-medium text-lg mr-2">
                    Operational Hours:
                  </span>
                  9AM-5PM
                </p>

                <p className="text-sm custom-light my-3">
                  <span className="custom-medium text-lg mr-2">
                    Website Link:
                  </span>
                  http://www.thetoyshop.pk
                </p>
                <h5 className="my-4 custom-medium text-lg">Location</h5>
                <p className="text-sm custom-light">
                  Lorem ipsum dolor sit amet consectetur. In quisque
                  sollicitudin blandit sed velit elit augue eget.
                </p>
              </div>
            </div>
            <div className="pb-7 pt-2 px-9 w-full ">
              <h5 className="mb-4  text-xl custom-semibold">
                Activity Location
              </h5>
              <p className="text-sm custom-light">
                The Entertainer Toy Shop - PWD Islamabad (Plot 1, Block-A,
                Street No. 5, Sector D, PWD Society), Islamabad, Pakistan
              </p>
              <button className="w-[110px] h-[33px]  md:w-[137px] my-4  bg-[#E55938] rounded-3xl text-xs md:text-sm   text-white custom-semibold flex items-center justify-center">
                View on map
              </button>
              <h5 className="my-4  mt-7 text-xl custom-semibold">
                Spread the word
              </h5>
              <div className="">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-full max-w-md">
                  <input
                    type="text"
                    readOnly
                    value={currentUrl}
                    className="flex-grow px-4 py-2  text-gray-800 border-none outline-none"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-4 bg-[#E55938]   text-[11px] md:text-sm  text-white custom-semibold hover:bg-[hsl(11,87%,56%)] focus:outline-none flex items-center"
                  >
                    {copied ? "Copied!" : "Copy link"}

                    <PiCopy className="text-xl ml-1 md:block hidden" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Activities */}

        <section className="h-full w-full  mb-16 ">
          <div className="h-full w-full mx-auto max-w-[1440px] flex flex-col gap-2 md:gap-3 lg:gap-5">
            <h2 className="custom-bold text-2xl md:text-4xl lg:text-5xl mb-10">
              Featured Activities
            </h2>
            <div className="flex gap-6 overflow-auto pb-5 scrollbar-hide">
              {activityCards.map((activity) => {
                return (
                  <FeaturedCard
                    title={activity.title}
                    duration={activity.duration}
                    date={activity.date}
                    ageRange={activity.ageRange}
                    reviews={activity.reviews}
                    rating={activity.rating}
                    price={activity.price}
                    imageUrl={activity.imageUrl}
                    sponsored={activity.sponsored}
                  />
                );
              })}
            </div>
          </div>
        </section>
        {/* Related Activities */}

        <section className="h-full w-full mb-16  ">
          <div className="h-full w-full mx-auto max-w-[1440px] flex flex-col gap-2 md:gap-3 lg:gap-5">
            <h2 className="custom-bold text-2xl md:text-4xl lg:text-5xl mb-10">
              Related Activities
            </h2>
            <div className="flex gap-6 overflow-auto pb-5 scrollbar-hide">
              {activityCards.map((activity) => {
                return (
                  <FeaturedCard
                    title={activity.title}
                    duration={activity.duration}
                    date={activity.date}
                    ageRange={activity.ageRange}
                    reviews={activity.reviews}
                    rating={activity.rating}
                    price={activity.price}
                    imageUrl={activity.imageUrl}
                    sponsored={activity.sponsored}
                  />
                );
              })}
            </div>
          </div>
        </section>
        {/* Reviews */}

        <section className="h-full w-full  ">
          <div className="h-full w-full mx-auto max-w-[1440px] flex flex-col gap-2 md:gap-3 lg:gap-5">
            <h2 className="custom-bold text-2xl md:text-4xl lg:text-5xl mb-5">
              Customer Reviews
            </h2>
            <div className="flex flex-col md:flex-row  lg:items-center justify-between h-full">
              <div className="flex flex-col ">
                <div className="flex items-center gap-2">
                  <div>
                    <p className="custom-bold text-2xl md:text-4xl lg:text-5xl mb-5">
                      4.3
                    </p>
                  </div>
                  <div>
                    <p className="text-[#778088] custom-light">
                      {"584 reviews"}
                    </p>{" "}
                  </div>
                </div>
                <div className="flex">
                  <div className="flex items-center text-5xl">
                    {[...Array(5)].map((_, index) => (
                      <IoStarSharp
                        key={index}
                        className={`text-[#FFA432] ${
                          index < rating ? "" : "text-[#CFD9DE]"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="md:mt-0 mt-3">
                <button className="w-[110px] h-[33px]  md:w-[137px]  lg:w-[181px] lg:h-[48px] bg-[#E55938] rounded-3xl text-xs md:text-sm  lg:text-lg text-white custom-semibold flex items-center justify-center">
                  Write a Review
                </button>
              </div>
            </div>
            {/* Customer reviews */}
            <div className="">
              {CustomerReviews.map((review, index) => {
                return (
                  <div key={index} className="">
                    <div
                      className={`flex  flex-col lg:flex-row justify-between items-start gap-2 lg:gap-0 h-full py-6 ${
                        index === 0 ? "" : "border-t  "
                      }`}
                    >
                      <div className=" lg:w-[20%] flex items-start  h-full gap-2">
                        <div className="w-16 h-16 rounded-full overflow-hidden shadow-xl p-1">
                          <img
                            src={review.avatarUrl}
                            alt=""
                            className=" object-cover object-center w-full h-full rounded-full"
                          />
                        </div>
                        <div>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, index) => (
                              <IoStarSharp
                                key={index}
                                className={`text-[#FFA432] ${
                                  index < review.rating ? "" : "text-[#CFD9DE]"
                                }`}
                              />
                            ))}
                          </div>
                          <p>{review.name}</p>
                        </div>
                      </div>
                      <div className="lg:w-[60%]">
                        <p className="custom-bold font-bold mb-2">
                          {review.title}
                        </p>
                        <p>{review.description}</p>
                      </div>
                      <div className=" lg:w-[20%] flex  h-full  lg:items-start lg:justify-end ">
                        <p className="  lg:text-xl custom-semibold">
                          {review.date}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
};

export default PostPage;
