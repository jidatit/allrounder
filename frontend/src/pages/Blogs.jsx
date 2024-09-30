import React from "react";
import BlogCard from "../UI Components/BlogCard";
import { Link } from "react-router-dom";

const Blogs = () => {
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
    {
      id: 1,
      image: "/blog-5.jpeg",
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
    {
      id: 1,
      image: "/blog-4.jpeg",
      title: "Lorem ipsum dolor sit amet consectetur.",
      author: "By Ammywards",
      date: "3 April, 2022",
    },
  ];
  return (
    <main className="h-full w-full ">
      <section className="h-full w-full px-4 sm:px-8 pt-10 lg:px-16 mx-auto max-w-[1440px] flex flex-col gap-2 md:gap-3 lg:gap-5">
        <div className="flex flex-col items-center gap-6 ">
          <h2 className="custom-bold text-2xl md:text-4xl lg:text-5xl text-center">
            Our Blogs
          </h2>
          <p className="text-center lg:px-40  md:px-20 px-10 lg:text-xl md:text-lg text-sm">
            Lorem ipsum dolor sit amet consectetur. Sed non morbi senectus at.
            Morbi eu penatibus hendrerit nullam diam quisque odio. Non habitant
            consectetur non nisi tristique quis quis.
          </p>
        </div>
        <div className="w-full  ">
          <p className="md:text-xl  text-lg lg:text-2xl custom-semibold my-6 uppercase">
            Recommended
          </p>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Link
              to={"/blog/1"}
              class="w-full lg:h-[558px] h-full max-h-[558px] custom-shadow rounded-2xl overflow-hidden  "
            >
              <img
                src="/blog-banner.jpeg"
                alt=""
                className="lg:h-full lg:w-full max-h-[400px] "
              />
              <div className="p-5">
                <h5 className="custom-bold  md:text-xl text-lg lg:text-2xl mb-2">
                  Lorem ipsum dolor sit amet consectetur.
                </h5>
                <p className="text-lg custom-regular">
                  Lorem ipsum dolor sit amet consectetur. Sed non morbi senectus
                  at. Morbi eu penatibus hendrerit nullam diam quisque odio. Non
                  habitant consectetur non nisi tristique quis quis.
                </p>
              </div>
            </Link>

            <div class="flex flex-col gap-4 justify-between">
              <Link
                to={"/blog/1"}
                class="w-full md:h-[266px] h-full max-h-[558px] shadow-custom rounded-2xl overflow-hidden flex  md:flex-row flex-col"
              >
                <div className="md:w-[37%]  w-full h-full ">
                  <img
                    src="/blog-2.jpeg"
                    alt=""
                    className="w-full h-full object-center object-cover"
                  />
                </div>
                <div className="md:w-[63%] w-full p-5">
                  <h5 className="text-2xl custom-bold">
                    Lorem ipsum dolor sit amet consectetur.
                  </h5>
                  <p className="text-lg custom-regular">
                    Lorem ipsum dolor sit amet consectetur. Sed non morbi
                    senectus at. Morbi eu penatibus hendrerit nullam diam
                    quisque odio. Non habitant consectetur non nisi tristique
                    quis quis.
                  </p>
                </div>
              </Link>

              <Link
                to={"/blog/1"}
                class="w-full md:h-[266px]  h-full max-h-[558px] shadow-custom rounded-2xl overflow-hidden flex  md:flex-row flex-col"
              >
                <div className="md:w-[37%]  w-full h-full ">
                  <img
                    src="/blog-3.jpeg"
                    alt=""
                    className="w-full h-full object-center object-cover"
                  />
                </div>
                <div className="md:w-[63%] w-full p-5">
                  <h5 className="text-2xl custom-bold">
                    Lorem ipsum dolor sit amet consectetur.
                  </h5>
                  <p className="text-lg custom-regular">
                    Lorem ipsum dolor sit amet consectetur. Sed non morbi
                    senectus at. Morbi eu penatibus hendrerit nullam diam
                    quisque odio. Non habitant consectetur non nisi tristique
                    quis quis.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
        <div className="w-full  ">
          <p className="md:text-xl  text-lg lg:text-2xl custom-semibold my-6 uppercase">
            Recent
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

export default Blogs;
