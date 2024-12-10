// import React, { useState, useEffect } from 'react';
// import { Collapse, message } from 'antd';
// import { CameraOutlined } from '@ant-design/icons';
// import { storage, db } from '../../config/firebase';
// import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
// import { collection, addDoc, getDocs ,doc,setDoc} from "firebase/firestore";

// const { Panel } = Collapse;

// const HeroSection = () => {
//   const [Image, setImage] = useState(null); 
//   const [uploading, setUploading] = useState(false);
//   const [textInput, setTextInput] = useState(''); // State for input text

//   const fileInputRef = React.createRef(); 

//   const fetchImage = async () => {
//     console.log("hhhhh")
//     try {
//       const querySnapshot = await getDocs(collection(db, "editHome"));
//       console.log("kkkkkk")
//       if (!querySnapshot.empty) {
//         console.log("ggggg")
//         const ImageData = querySnapshot.docs.map((doc) => doc.data())
//         .sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());
//         console.log("hhhhh",ImageData)
//         if (ImageData[0]?.url) {
//           setImage(ImageData[0].url);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching Image:", error);
//     }
//   };

//   useEffect(() => {
//     fetchImage();
//   }, []);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];

//     if (file) {
//       const storageRef = ref(storage, `homeImage/${file.name}`);
//       const uploadTask = uploadBytesResumable(storageRef, file);

//       setUploading(true);
//       uploadTask.on(
//         "state_changed",
//         () => {},
//         (error) => {
//           setUploading(false);
//           console.error("Upload failed:", error);
//           message.error("Failed to upload Image. Please try again.");
//         },
//         () => {
//           getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//             setImage(downloadURL);
//             setUploading(false);
//             message.success("Image uploaded successfully!");
//             storeImageURLInFirestore(downloadURL);
//           });
//         }
//       );
//     } else {
//       message.error("The selected file is not valid.");
//     }
//   };

//   const storeImageURLInFirestore = async (downloadURL) => {
//     try {
//       const docRef = doc(db, "editHome","HomeDoc"); 
        
//         await setDoc(docRef,{
//         url: downloadURL,
//         timestamp: new Date(),
//       }, { merge: true });
//       console.log("Image URL stored in Firestore");
//     } catch (e) {
//       console.error("Error adding document:", e);
//       message.error("Failed to store Image URL in Firestore.");
//     }
//   };

// const handleSaveAllChanges = async () => {
//     console.log("All changes saved successfully!");
//     message.success("All changes saved successfully!");
//   };

// ///input field functions here 
// const handleInputChange = (e) => {
//     setTextInput(e.target.value); 
//   };

//   const TextSaveToFirestore = async () => {
//     if (textInput.trim() !== '') { 
//       try {
//         const docRef = doc(db, 'editText', 'Text');
//         await setDoc(docRef, {
//           text: textInput,
//           timestamp: new Date(),
//         });
//         setTextInput('');
//         console.log("Text saved to Firestore");
//         message.success("Text saved to Firestore");
//       } catch (e) {
//         console.error("Error saving text: ", e);
//       }
//     } else {
//       console.log("Text field is empty");
//       message.error("Text field is empty");
//     }
//   };
  
//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter') {
//       TextSaveToFirestore();
//     }
//   };

//   return (
//     <div>
//       {/* Header Section */}
//       <div className=" flex justify-between">
//         <h2 className="text-2xl font-bold mb-4">Edit Home Page</h2>
//         <button
//           className="bg-red-500 text-white mb-4 px-4 py-2 rounded-full"
//           onClick={handleSaveAllChanges}
//         >
//           Save All Changes
//         </button>
//       </div>
  
//       {/* Content Section */}
//       <div className="mt-4">
//         <div className="ml-4">
//           <Collapse expandIconPosition="end">
//             <Panel className="font-bold text-xl" header="Hero Section" key="1">
//               <div className="flex flex-wrap md:flex-nowrap space-y-4 md:space-y-0 md:space-x-4">
//                 {/* Left Section - Image Upload */}
//                 <div className="w-full md:w-1/2  p-4">
//                   <h3 className="text-xl mb-4">Upload Display Image</h3>
//                   <div
//                     className="flex flex-col justify-center items-center relative"
//                     style={{ height: '300px' }}
//                   >
//                     {Image ? (
//                       <img
//                         src={Image}
//                         alt="Home Page Image"
//                         className="rounded-lg object-cover"
//                         style={{ maxHeight: '100%', maxWidth: '100%' }}
//                       />
//                     ) : (
//                       <div className="flex justify-center items-center border border-gray-200 h-full w-full">
//                         <CameraOutlined style={{ fontSize: '40px', color: '#ccc' }} />
//                       </div>
//                     )}
//                   </div>
//                   <div className="flex justify-center items-center mt-4">
//                     <button
//                       className="bg-red-500 text-white mb-4 px-4 py-2 rounded-full text-sm"
//                       onClick={() => fileInputRef.current.click()}
//                     >
//                       Upload Image
//                     </button>
//                     <input
//                       ref={fileInputRef}
//                       type="file"
//                       accept="image/*"
//                       onChange={handleImageChange}
//                       className="hidden"
//                     />
//                   </div>
//                 </div>
  
//                 {/* Right Section - Text Input */}
//                 <div className="w-full md:w-1/2 p-4">
//                   <h4 className="text-xl mb-4">Edit Display Text</h4>
//                   <input
//                     className="w-full p-2 border border-gray-800 rounded-full text-sm"
//                     placeholder="Write here"
//                     value={textInput}
//                     onChange={handleInputChange}
//                     onKeyDown={handleKeyDown}
//                   />
//                   <div className="flex justify-center items-center mt-4">
//                     <button
//                       className="mt-2 bg-red-500 text-white px-4 py-2 rounded-full text-sm"
//                       onClick={TextSaveToFirestore}
//                     >
//                       Save Text
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </Panel>
//           </Collapse>
//         </div>
//       </div>
//     </div>
//   );
  
// };

// export default HeroSection;






import React, { useState, useEffect } from 'react';
import { Collapse, message } from 'antd';
import { CameraOutlined } from '@ant-design/icons';
import { storage, db } from '../../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, getDocs, doc, setDoc, getDoc } from "firebase/firestore";

const { Panel } = Collapse;

const HeroSection = () => {
  const [Image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [textInput, setTextInput] = useState(''); // State for input text
  const fileInputRef = React.createRef();

  // Fetch Image and Text from Firestore
  const fetchData = async () => {
    try {
      // Fetch Image
      const imageDoc = await getDoc(doc(db, "editHome", "HomeDoc"));
      if (imageDoc.exists()) {
        setImage(imageDoc.data().url);
      }

      // Fetch Text
      const textDoc = await getDoc(doc(db, "editText", "Text"));
      if (textDoc.exists()) {
        setTextInput(textDoc.data().text || '');
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to fetch data.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const storageRef = ref(storage, `homeImage/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      setUploading(true);
      uploadTask.on(
        "state_changed",
        () => {},
        (error) => {
          setUploading(false);
          console.error("Upload failed:", error);
          message.error("Failed to upload Image. Please try again.");
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImage(downloadURL); // Update state immediately
            setUploading(false);
            message.success("Image uploaded successfully!");
            storeImageURLInFirestore(downloadURL);
          });
        }
      );
    } else {
      message.error("The selected file is not valid.");
    }
  };

  const storeImageURLInFirestore = async (downloadURL) => {
    try {
      const docRef = doc(db, "editHome", "HomeDoc");
      await setDoc(docRef, {
        url: downloadURL,
        timestamp: new Date(),
      }, { merge: true });
    } catch (e) {
      console.error("Error adding document:", e);
      message.error("Failed to store Image URL in Firestore.");
    }
  };

  const handleInputChange = (e) => {
    setTextInput(e.target.value);
  };

  const TextSaveToFirestore = async () => {
    if (textInput.trim() !== '') {
      try {
        const docRef = doc(db, 'editText', 'Text');
        await setDoc(docRef, {
          text: textInput,
          timestamp: new Date(),
        });
        message.success("Text saved to Firestore");
      } catch (e) {
        console.error("Error saving text: ", e);
        message.error("Failed to save text.");
      }
    } else {
      message.error("Text field is empty.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      TextSaveToFirestore();
    }
  };

  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-4">Edit Home Page</h2>
      </div>

      {/* Content Section */}
      <div className="mt-2">
      <div className="ml-4">
        <Collapse expandIconPosition="end">
          <Panel className="font-bold text-xl" header="Hero Section" key="1">
            <div className="flex flex-wrap md:flex-nowrap space-y-4 md:space-y-0 md:space-x-4">
              {/* Left Section - Image Upload */}
              <div className="w-full md:w-1/2 p-4">
                <h3 className="text-xl mb-4">Upload Display Image</h3>
                <div
                  className="flex flex-col justify-center items-center relative"
                  style={{ height: '300px' }}
                >
                  {Image ? (
                    <img
                      src={Image}
                      alt="Home Page Image"
                      className="rounded-lg object-cover"
                      style={{ maxHeight: '100%', maxWidth: '100%' }}
                    />
                  ) : (
                    <div className="flex justify-center items-center border border-gray-200 h-full w-full">
                      <CameraOutlined style={{ fontSize: '40px', color: '#ccc' }} />
                    </div>
                  )}
                </div>
                <div className="flex justify-center items-center mt-4">
                  <button
                    className="bg-red-500 text-white mb-4 px-4 py-2 rounded-full text-sm"
                    onClick={() => fileInputRef.current.click()}
                  >
                    Upload Image
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Right Section - Text Input */}
              <div className="w-full md:w-1/2 p-4">
                <h4 className="text-xl mb-4">Edit Display Text</h4>
                <input
                  className="w-full p-2 border border-gray-800 rounded-full text-sm font-normal text-gray-700"
                  placeholder="Write here"
                  value={textInput}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                />
                <div className="flex justify-center items-center mt-4">
                  <button
                    className="mt-2 bg-red-500 text-white px-4 py-2 rounded-full text-sm"
                    onClick={TextSaveToFirestore}
                  >
                    Save Text
                  </button>
                </div>
              </div>
            </div>
          </Panel>
        </Collapse>
      </div>
      </div>
    </div>
  );
};

export default HeroSection;

