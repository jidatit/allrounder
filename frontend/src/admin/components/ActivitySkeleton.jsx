import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ActivitySkeletonLoader = () => {
  return (
    <div className="flex flex-col bg-white rounded-lg overflow-hidden w-full p-4">
      <div className="flex w-full">
        {/* Skeleton for Image */}
        <div className="w-[40%] mr-4 h-[30vh]">
          <Skeleton height="100%" width="100%" />
        </div>

        <div className="w-2/3 flex pl-3 flex-col justify-between">
          {/* Skeleton for Title */}
          <div className="flex justify-between w-full gap-2">
            <Skeleton width="50%" height="30px" />
            <Skeleton width="30%" height="30px" />
          </div>

          {/* Skeleton for Address */}
          <Skeleton width="70%" height="20px" className="mt-2" />

          {/* Skeleton for Contact */}
          <Skeleton width="50%" height="20px" className="mt-2" />

          {/* Skeleton for Buttons */}
          <div className="flex justify-between items-center mt-4">
            <Skeleton width="40%" height="40px" />
            <Skeleton width="40%" height="40px" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivitySkeletonLoader;
