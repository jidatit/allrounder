import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { auth, db } from "../config/firebase";
import { addDoc, collection } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with:", { email, password, zipCode });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const RegisterUser = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      let collectionName = "users";

      await addDoc(collection(db, collectionName), {
        uid: user.uid,
        email: email,
        zipCode: zipCode,
        userType: "user",
        dateCreated: new Date(),
      });
      setEmail("");
      setPassword("");
      setZipCode("");

      toast.success("You registered successfully!");
      if (collectionName === "admins") {
        setTimeout(() => {
          navigate("/AdminLayout");
        }, 3000);
      } else {
        setTimeout(() => {
          navigate("/UserLayout");
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      toast.error(`Registration failed: ${err.message}`);
    }
  };

  return (
    <main className="flex max-w-[1440px] mx-auto">
      <div className="w-1/2 lg:h-full overflow-hidden hidden md:flex">
        <img
          src="/signup.jpeg"
          alt=""
          className="object-cover object-center h-full w-full"
        />
      </div>
      <div className="flex items-center justify-center w-full md:w-1/2 lg:h-[800px] flex-col">
        <h1 className="orelega-one-regular lg:text-5xl md:text-4xl  text-3xl  ">
          Signup Your Account
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
              <input
                type="text"
                placeholder="Enter ZIP Code"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                required
                className="custom-light bg-[#F5F4EC]  placeholder:text-black placeholder:custom-light placeholder:text-sm p-3 md:p-4 rounded-full text-black  my-3 w-[80vw]  md:w-[40vw] max-w-[660px] outline-[#E55938]"
              />
            </div>
            <div>
              <button
                type="submit"
                onClick={RegisterUser}
                className=" w-[110px] h-[33px]  my-6 md:w-[137px]  lg:w-[181px] lg:h-[48px] bg-[#E55938] rounded-3xl text-xs md:text-sm  lg:text-lg text-white custom-semibold flex items-center justify-center"
              >
                Sign Up
              </button>
            </div>
            <div>
              <p className="custom-regular text-lg">
                Already signed up?{" "}
                <a href="/login" className="text-[#E55938] underline">
                  Login
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default SignupPage;
