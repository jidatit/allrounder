import React, { useState,useEffect } from 'react';
import { Input, Upload, message } from 'antd';
import { CameraOutlined } from '@ant-design/icons';
import {  ref, uploadBytes ,getDownloadURL } from 'firebase/storage';
import { doc,setDoc,getDoc } from 'firebase/firestore';
import { storage,db } from '../../../config/firebase';

const EditLogin = () => {
  const [Login, setLogin] = useState({
    imageUrl: '',
    heading: '',  
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'Login', 'section');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setLogin(docSnap.data());
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
    if (!Login.heading) {
      message.error('Heading cannot be empty.');
      return;
    }
  
    try {
      setLoading(true);
      const docRef = doc(db, 'Login', 'section');
      await setDoc(docRef, { heading: Login.heading}, { merge: true });
      message.success('heading saved successfully!');
      setLogin((prev) => ({ ...prev, heading: '' }));
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
      const storageRef = ref(storage, `login/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      setLogin((prev) => ({ ...prev, imageUrl: downloadURL }));

      // Save URL to Firestore
      const docRef = doc(db, 'Login', 'section');
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
    <div>
      <div className="h-[80vh] flex ">
          {/* Upload Image */}
          <div className="w-1/2 p-8  flex flex-col items-center" >
            <h4 className="mb-6 font-bold text-2xl">Upload Image</h4>
            <div className="flex flex-col items-center gap-6 w-full">
              {/* Image Container */}
              <div
             className="border border-gray-200 rounded-lg overflow-hidden"
             style={{ width: "50%", height: "400px" }} // Fixed size for the image container
             >
              
                {Login.imageUrl ? (
                  <img
                    src={Login.imageUrl}
                    alt="Uploaded content"
                    className="object-cover w-full h-full"
                    
                  />
                ) : (
                  <div className="flex justify-center items-center h-full w-full">
                    <CameraOutlined style={{ fontSize: '60px', color: '#ccc' }} />
                  </div>
                )}
               
              </div>

              {/* Upload Button Below Image */}
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
          {/* Edit Heading */}
          <div className="w-1/2 p-8 flex flex-col items-center">
            <h1 className="mb-6 font-bold text-2xl">Edit Heading of Login</h1>
            <Input
              className="w-full border rounded text-sm border-gray-800"
              placeholder="Write Here....."
              value={Login.heading}
              onChange={(e) =>
                setLogin((prev) => ({ ...prev, heading: e.target.value }))
              }
              onKeyDown={(e) => handleKeyDown(e, saveHeading)}
            />
           
              <button
                onClick={saveHeading}
                disabled={loading}
                className="mt-6 bg-red-500 text-white px-4 py-2 rounded-full text-sm"
              >
                Save Heading
              </button>
          </div>
          
        
      </div>
    </div>
  );
};

export default EditLogin;
