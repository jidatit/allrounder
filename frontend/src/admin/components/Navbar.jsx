import { useAuth } from "../../context/authContext";

const Navbar = () => {
  const { currentUser } = useAuth();
  return (
    <nav className="bg-white w-full ">
      <div className="w-full px-4 sm:px-6 lg:px-8 ">
        <div className="flex smd:flex-row flex-col justify-between smd:items-center w-full py-3 smd:py-0 px-3 smd:px-0">
          <div className="flex-shrink-0 flex items-center w-[30%]">
            <h1 className="text-2xl font-bold text-gray-800 custom-bold">
              Dashboard
            </h1>
          </div>
          <div className="flex items-center smd:w-[60%] smd:justify-end p-2">
            <img
              className="h-16 w-16 rounded-xl"
              src={"/Rectangle 1393.png"}
              alt="User avatar"
            />
            <div className="flex flex-col gap-y-2 justify-center">
              <span className="ml-2 text-sm custom-medium text-orange-500">
                {currentUser.email}
              </span>
              <span className="ml-2 text-xs font-regular text-gray-500">
                {currentUser.userType}
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
