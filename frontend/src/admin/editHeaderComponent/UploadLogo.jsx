import React, { useState, useEffect } from "react";
import { CameraOutlined } from "@ant-design/icons";
import { message } from "antd";
import { storage, db } from "../../config/firebase"; 
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, getDocs,doc ,setDoc} from "firebase/firestore"; 

const UploadLogo = () => {
  const [logo, setLogo] = useState(null); 
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.createRef(); 

  
  const fetchLogo = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "editHeader"));
      if (!querySnapshot.empty) {
        const logoData = querySnapshot.docs.map((doc) => doc.data());
        if (logoData[0]?.url) {  
          setLogo(logoData[0].url);
        }
      }
    } catch (error) {
      console.error("Error fetching logo:", error);
    }
  };

  useEffect(() => {
    fetchLogo();
  }, []);


  const handleLogoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const storageRef = ref(storage, `logos/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      setUploading(true);
      console.log("gggggggggggggggggg")
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          
        },
        (error) => {
          setUploading(false);
          console.error("Upload failed:", error);
          message.error("Failed to upload logo. Please try again.");
          console.log("hhhh")
        },
        () => {
       
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setLogo(downloadURL); 
            setUploading(false);
            message.success("Logo uploaded successfully!");

           
            storeLogoURLInFirestore(downloadURL);
          });
        }
      );
    } else {
      message.error("The selected file is not valid.");
    }
  };
  const storeLogoURLInFirestore1 = async (downloadURL) => {
    try {
      const docRef = await addDoc(collection(db, "editHeader"), {
        url: downloadURL,
        timestamp: new Date(),
      });
      console.log("Logo URL stored in Firestore with ID:", docRef.id);
    } catch (e) {
      console.error("Error adding document:", e);
      message.error("Failed to store logo URL in Firestore.");
    }
  };


  const storeLogoURLInFirestore = async (downloadURL) => {
    try {
      // Reference to the document you want to update
      const docRef = doc(db, "editHeader", "logoDoc"); // 'logoDoc' is a single document that will store the logo URL
  
      // Set (overwrite) the document with the new URL
      await setDoc(docRef, {
        url: downloadURL,
        timestamp: new Date(),
      }, { merge: true }); // 'merge: true' ensures other fields in the document are not overwritten
  
      console.log("Logo URL updated in Firestore.");
    } catch (e) {
      console.error("Error updating document:", e);
      message.error("Failed to update logo URL in Firestore.");
    }
  };

  return (
    <div className=" p-4 w-1/3">
      <h3 className="text-lg font-bold mb-2">Upload Logo</h3>
      {logo ? (
        <div className="mt-4">
          <img src={logo} alt="Logo" className="w-full h-auto mb-4" />
        </div>
      ) : (
        <div className="border border-2 border-gray-200 h-64 w-full flex items-center justify-center relative">
          <CameraOutlined className="text-gray-500 text-4xl" />
        </div>
      )}

      {uploading && <p>Uploading...</p>}

      <div className="px-24 mt-4">
        
        <button
          className="bg-red-500 mb-4 text-white px-4 py-2 rounded-full"
          onClick={() => fileInputRef.current.click()} 
        >
          Upload Logo
        </button>

 
        <input
          ref={fileInputRef} 
          type="file"
          onChange={handleLogoChange}
          accept="image/*"
          className="hidden"
        />
      </div>
    </div>
  );
};

export default UploadLogo;
