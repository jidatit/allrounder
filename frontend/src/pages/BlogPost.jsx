import React, { useState } from "react";
import { IoShareOutline, IoStarOutline, IoStarSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import FeaturedCard from "../UI Components/FeaturedCard";
import { PiCopy } from "react-icons/pi";
import BlogCard from "../UI Components/BlogCard";

const BlogPost = () => {
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

  const blogPosts = [
    {
      id: 1,
      image: "/blog.jpeg",
      title: "Lorem ipsum dolor sit amet consectetur.",
      author: "By Ammywards",
      date: "3 April, 2022",
    },
    {
      id: 1,
      image: "/blog-4.jpeg",
      title: "Lorem ipsum dolor sit amet consectetur.",
      author: "By Ammywards",
      date: "3 April, 2022",
    },
    {
      id: 1,
      image: "/blog.jpeg",
      title: "Lorem ipsum dolor sit amet consectetur.",
      author: "By Ammywards",
      date: "3 April, 2022",
    },
  ];

  const rating = 3;
  return (
    <main className="h-full w-full ">
      <section className="h-full w-full px-4 sm:px-8  pt-5  md:pt-8 lg:pt-10 lg:px-16 mx-auto max-w-[1440px] flex flex-col gap-2 md:gap-3 lg:gap-5 ">
        {/* head */}
        <header className="flex flex-col md:flex-row ">
          <div className="mt-2 md:mt-0 flex justify-center items-start flex-col">
            <h2 className="custom-bold text-[20px] md:text-[28px] lg:text-[35px] ">
              Toy shop - Grand launch, PWD Islamabad
            </h2>
            <div className="flex md:items-center  items-center md:gap-7    flex-col md:flex-row md:w-[500px] lg:w-[650px]  mt-2 md:mt-6">
              <div className=" text-lg flex items-center lg:gap-2 gap-1">
                Posted By : <p>{"Admin"}</p>
              </div>
              <div className=" text-lg flex items-center lg:gap-2 gap-1">
                Date : <p>{"9/20/2024"}</p>
              </div>
            </div>
          </div>
        </header>
        {/* body */}
        <div className=" flex flex-col lg:flex-row lg:gap-4 mt-4 lg:mt-8">
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
          </div>
          <div className="lg:w-[39%] custom-shadow h-full  rounded-xl   lg:mt-0 mt-5 ">
            <div className="py-7 px-9 ">
              <h2 className="text-xl custom-semibold mb-5">Recommended</h2>
              {blogPosts.map(({ image, title, author, date }) => {
                return (
                  <Link to={"/blog/1"}>
                    <div className="flex  py-2">
                      <img
                        src={image}
                        alt=""
                        className="h-28 w-28 object-cover object-center rounded-md"
                      />
                      <div className="ml-3">
                        <h4 className="text-lg custom-medium">{title}</h4>

                        <div className="flex justify-center flex-col">
                          <p className="custom-medium text-sm">{author}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="w-full  ">
          <p className="md:text-xl  text-lg lg:text-2xl custom-semibold my-6 uppercase">
            Latest Blogs
          </p>
          <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <BlogCard
                  key={post.id}
                  image={post.image}
                  title={post.title}
                  author={post.author}
                  date={post.date}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BlogPost;
