import React from "react";
import { Link } from "react-router-dom";


const CategoryCard = ({ name, url }) => {
  return (
    <Link
      to={`/allActivities/${name}`}
      className=" h-36 w-[48%] sm:h-40  md:h-32  lg:h-40 lg:w-[24%] md:w-[23%] overflow-hidden  lg:my-3 rounded-lg bg-cover bg-center bg-[#000] bg-opacity-30"
    >
      <article
        className="w-full h-full"
        style={{
          backgroundImage: `url(${url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-[#000] bg-opacity-50 h-full w-full flex items-center justify-center">
          <p className="text-white custom-semibold font-normal text-lg  md:text-xl lg:text-3xl">
            {name}
          </p>
        </div>
      </article>
    </Link>
  );
};

export default CategoryCard;
