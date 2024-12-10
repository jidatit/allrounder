
import React, { useEffect, useState } from 'react';
import { Collapse, Input, message, Upload, Button } from 'antd';
import { CameraOutlined } from '@ant-design/icons';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { storage, db } from '../../config/firebase';

const { Panel } = Collapse;

const AboutUsSection = () => {
  const [aboutUs, setAboutUs] = useState({
    imageUrl: '',
    paragraph: '',
    buttonName: '',
    heading: '',  
  });

  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'aboutUs', 'section');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAboutUs(docSnap.data());
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

  // Handle paragraph save
  const saveParagraph = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, 'aboutUs', 'section');
      await setDoc(docRef, { paragraph: aboutUs.paragraph }, { merge: true });
      message.success('Paragraph saved successfully!');
      setAboutUs((prev) => ({ ...prev, paragraph: '' }));
    } catch (error) {
      console.error('Error saving paragraph:', error);
      message.error('Failed to save paragraph.');
    } finally {
      setLoading(false);
    }
  };

  // Handle button text save
  const saveButtonText = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, 'aboutUs', 'section');
      await setDoc(docRef, { buttonName: aboutUs.buttonName }, { merge: true });
      message.success('Button text saved successfully!');
      setAboutUs((prev) => ({ ...prev, buttonName: '' }));
    } catch (error) {
      console.error('Error saving button text:', error);
      message.error('Failed to save button text.');
    } finally {
      setLoading(false);
    }
  };

  // Handle heading save
  const saveHeading = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, 'aboutUs', 'section');
      await setDoc(docRef, { heading: aboutUs.heading }, { merge: true });
      message.success('Heading saved successfully!');
      setAboutUs((prev) => ({ ...prev, heading: '' }));
    } catch (error) {
      console.error('Error saving heading:', error);
      message.error('Failed to save heading.');
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload
  const uploadImage = async (file) => {
    try {
      setLoading(true);
      const storageRef = ref(storage, `aboutUs/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      setAboutUs((prev) => ({ ...prev, imageUrl: downloadURL }));

      // Save URL to Firestore
      const docRef = doc(db, 'aboutUs', 'section');
      await setDoc(docRef, { imageUrl: downloadURL }, { merge: true });

      message.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      message.error('Failed to upload image.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event, saveFunction) => {
    if (event.key === 'Enter') {
      saveFunction();
    }
  };

  return (
    <div>
      <div className=" mt-4">
        <div className="ml-4">
          <Collapse expandIconPosition="end">
            <Panel className="font-bold text-xl" header="About Us Section" key="1">
                {/* Edit Heading */}
              <div className="mt-4 ml-8">
                <h4 className="mb-4">Edit Heading</h4>
                <div className='flex items-center'>
                <Input
                  className="w-3/4 p-2 border rounded-full text-sm border-gray-800"
                  placeholder="Write Here....."
                  value={aboutUs.heading}
                  onChange={(e) =>
                    setAboutUs((prev) => ({ ...prev, heading: e.target.value }))
                  }
                  onKeyDown={(e) => handleKeyDown(e, saveHeading)}
                />
                  <button
                    onClick={saveHeading}
                    className=" bg-red-500 text-white px-4 py-2 ml-4 rounded-full text-sm"
                    disabled={loading}
                  >
                    Save Heading
                  </button>
                </div>
              </div>
              {/* Edit Paragraph */}
              <div className="mt-6 ml-8">
                <h4 className="mb-4">Edit Paragraph</h4>
                <div className="flex items-center">
                <Input.TextArea
                  className="w-3/4 p-2 border  text-sm border-gray-800"
                  placeholder="Write here..."
                  value={aboutUs.paragraph}
                  onChange={(e) =>
                    setAboutUs((prev) => ({ ...prev, paragraph: e.target.value }))
                  }
                  onKeyDown={(e) => handleKeyDown(e, saveParagraph)}
                />
                  <button
                    onClick={saveParagraph}
                    className="ml-2 bg-red-500 text-white px-4 py-2 rounded-full text-sm"
                    disabled={loading}
                  >
                    Save Paragraph
                  </button>
               
                </div>
              </div>

              {/* Upload Image */}
              <div className=' flex mt-6'>
              <div className="w-1/2 p-8  flex flex-col items-center">
                <h4 className="mb-6 font-bold text-2xl">Upload Image</h4>
                <div className="flex flex-col items-center gap-6 w-full">
                  {/* Image Container */}
                  <div
                   className="border border-gray-200 rounded-lg overflow-hidden"
                   style={{ width: "50%", height: "350px" }}
                  >
                    {aboutUs.imageUrl ? (
                      <img
                        src={aboutUs.imageUrl}
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
                    <button
                      className="mt-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm"
                    >
                      Upload Photo
                    </button>
                  </Upload>
                </div>
              </div>

              {/* Edit Button Text */}
              <div className="w-1/2 p-8 flex flex-col items-center">
                <h4 className="mb-6 font-bold text-2xl">Edit Button Text</h4>
                <Input
                  className="w-full border rounded text-sm border-gray-800"
                  placeholder="Write Here....."
                  value={aboutUs.buttonName}
                  onChange={(e) =>
                    setAboutUs((prev) => ({ ...prev, buttonName: e.target.value }))
                  }
                  onKeyDown={(e) => handleKeyDown(e, saveButtonText)}
                />
                  <button
                    onClick={saveButtonText}
                    className="mt-6 bg-red-500 text-white px-4 py-2 rounded-full text-sm"
                    disabled={loading}
                  >
                    Save Text
                  </button>
                
              </div>
              </div>
            </Panel>
          </Collapse>
        </div>
      </div>
    </div>
  );
};

export default AboutUsSection;

