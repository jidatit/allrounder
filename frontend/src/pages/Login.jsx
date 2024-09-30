import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with:", { email, password, zipCode });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <main className="flex max-w-[1440px] mx-auto">
      <div className="w-1/2 lg:h-full overflow-hidden hidden md:flex">
        <img
          src="/login.jpeg"
          alt=""
          className="object-cover object-center h-full w-full"
        />
      </div>
      <div className="flex items-center justify-center w-full md:w-1/2 lg:h-[800px] flex flex-col">
        <h1 className="orelega-one-regular lg:text-5xl md:text-4xl  text-3xl  ">
          Login to your account
        </h1>
        <div className="w-full mt-8">
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col  justify-center items-center  "
          >
            <div>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="custom-light bg-[#F5F4EC]  placeholder:text-black placeholder:custom-light placeholder:text-sm p-3 md:p-4 rounded-full text-black  my-3  w-[80vw]  md:w-[40vw] max-w-[660px] outline-[#E55938]"
              />
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="custom-light bg-[#F5F4EC]  placeholder:text-black placeholder:custom-light placeholder:text-sm p-3 md:p-4 rounded-full text-black   my-3 w-[80vw]  md:w-[40vw] max-w-[660px] outline-[#E55938]"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute lg:right-8 md:right-6 right-6 md:top-8 top-7 "
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <div>
              <button
                type="submit"
                className=" w-[110px] h-[33px]  my-6 md:w-[137px]  lg:w-[181px] lg:h-[48px] bg-[#E55938] rounded-3xl text-xs md:text-sm  lg:text-lg text-white custom-semibold flex items-center justify-center"
              >
                Login
              </button>
            </div>
            <div>
              <p className="custom-regular text-lg">
                Don't have any account?{" "}
                <a href="/signup" className="text-[#E55938] underline">
                  Signup
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
