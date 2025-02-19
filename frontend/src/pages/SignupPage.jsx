import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState ,useEffect } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { auth, db } from "../config/firebase";
import { addDoc,doc,getDoc, collection } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [SignUpData, setSignUpData] = useState({
    imageUrl: '',
    heading: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with:", { email, password, zipCode });
  };


  //signUp page function
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'SignUp', 'section');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSignUpData(docSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        message.error('Failed to fetch data.');
      }
    };
    fetchData();
  }, []);

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
        firstName: firstName,
        lastName: lastName,
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
      {SignUpData.imageUrl ? (
        <img
          // src="/signup.jpeg"
          src={SignUpData.imageUrl}
          alt="SignUp"
          // className="object-cover object-center h-[85vh] mt-5 w-full"
        />
      ):(
        <p>No image available</p>
        )}
      </div>
      <div className="flex items-center justify-center w-full md:w-1/2 lg:h-[800px] flex-col">
        <h1 className="orelega-one-regular lg:text-5xl md:text-4xl  text-3xl  ">
          {/* Signup Your Account */}
          {SignUpData.heading}
        </h1>
        <div className="w-full mt-8">
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col justify-center items-center  "
          >
            <div className="w-[80vw] md:w-[40vw] max-w-[660px] flex md:flex-row flex-col justify-center gap-x-6">
              {" "}
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="custom-light bg-[#F5F4EC] w-[100%] md:w-[50%] placeholder:text-black placeholder:custom-light placeholder:text-sm p-3 md:p-4 rounded-full text-black  my-3  outline-[#E55938]"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="custom-light bg-[#F5F4EC] w-[100%] md:w-[50%] placeholder:text-black placeholder:custom-light placeholder:text-sm p-3 md:p-4 rounded-full text-black  my-3  outline-[#E55938]"
              />
            </div>

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
