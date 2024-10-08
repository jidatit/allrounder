import react from "react";
import { Link } from "react-router-dom";

const BlogCard = ({ image, title, author, date }) => {
  return (
    <Link
      to={"/blog/1"}
      className="bg-white shadow-md rounded-lg overflow-hidden"
    >
      {/* Image */}
      <img src={image} alt="blog" className="w-full h-72 object-cover" />

      {/* Card Content */}
      <div className="p-4">
        <h3 className="lg:text-2xl sm:text-xl text-lg custom-semibold">
          {title}
        </h3>
        <button className="w-[110px] h-[33px]  md:w-[137px] my-4  bg-[#E55938] rounded-3xl text-xs md:text-sm  text-white custom-semibold flex items-center justify-center">
          Read More
        </button>

        <div className="flex items-center  justify-between mt-4">
          <div className="flex items-center">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="author"
              className="w-10 h-10 rounded-full mr-2"
            />
            <p className="custom-medium text-sm">{author}</p>
          </div>

          <div className="text-sm">
            <p className="text-gray-500">{date}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
