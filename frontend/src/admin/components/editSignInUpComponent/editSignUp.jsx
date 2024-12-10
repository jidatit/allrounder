import React, { useState,useEffect } from 'react'
import { Input ,Upload,message} from 'antd';
import { CameraOutlined } from '@ant-design/icons';
import {  ref, uploadBytes ,getDownloadURL } from 'firebase/storage';
import { doc,setDoc,getDoc } from 'firebase/firestore';
import { storage,db } from '../../../config/firebase';

const editSignUp = () => {

  const [SignUp, setSignUp] = useState({
    imageUrl: '',
    heading: '',  
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'SignUp', 'section');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSignUp(docSnap.data());
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

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      await saveHeading();
    }
  };

  const saveHeading = async () => {
    if (!SignUp.heading) {
      message.error('Heading cannot be empty.');
      return;
    }
  
    try {
      setLoading(true);
      const docRef = doc(db, 'SignUp', 'section');
      await setDoc(docRef, { heading: SignUp.heading}, { merge: true });
      message.success('heading saved successfully!');
      setSignUp((prev) => ({ ...prev, heading: '' }));
    } catch (error) {
      console.error('Error saving heading:', error);
      message.error('Failed to save heading.');
    } finally {
      setLoading(false);
    }
  };
  
  const uploadImage = async (file) => {
    try {
      setLoading(true);
      const storageRef = ref(storage, `signUp/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      setSignUp((prev) => ({ ...prev, imageUrl: downloadURL }));

      // Save URL to Firestore
      const docRef = doc(db, 'SignUp', 'section');
      await setDoc(docRef, { imageUrl: downloadURL }, { merge: true });

      message.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      message.error('Failed to upload image.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="h-[80vh] flex">
      {/* Upload Image Section */}
      <div className="w-1/2 p-8  flex flex-col items-center">
        <h4 className="mb-6 font-bold text-2xl">Upload Image</h4>
        <div className="flex flex-col items-center gap-6 w-full">
          {/* Image Container */}
          <div
            className="border border-gray-200 rounded-lg overflow-hidden"
            style={{ width: "50%", height: "300px" }} // Fixed size for the image container
          >
            {SignUp.imageUrl ? (
              <img
                src={SignUp.imageUrl}
                alt="Uploaded content"
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex justify-center items-center h-full w-full">
                <CameraOutlined style={{ fontSize: "60px", color: "#ccc" }} />
              </div>
            )}
          </div>
  
          {/* Upload Button */}
          <Upload
            beforeUpload={(file) => {
              uploadImage(file);
              return false; // Prevent auto-upload
            }}
            showUploadList={false}
          >
            <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm">
              Upload Photo
            </button>
          </Upload>
        </div>
      </div>
  
      {/* Edit Heading Section */}
      <div className="w-1/2 p-8 flex flex-col items-center">
        <h1 className="mb-6 font-bold text-2xl">Edit Heading of SignUp</h1>
        <Input
          className="w-full border rounded text-sm border-gray-800"
          placeholder="Write Here....."
          value={SignUp.heading}
          onChange={(e) =>
            setSignUp((prev) => ({ ...prev, heading: e.target.value }))
          }
          onKeyDown={(e) => handleKeyDown(e, saveHeading)}
        />
        <button
          onClick={saveHeading}
          className="mt-6 bg-red-500 text-white px-4 py-2 rounded-full text-sm"
          disabled={loading}
        >
          Save Heading
        </button>
      </div>
    </div>
  );
  
}

export default editSignUp