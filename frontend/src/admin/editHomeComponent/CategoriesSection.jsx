
import React, { useState, useEffect ,useRef} from 'react';
import { Collapse, Row, Col, Card, Button, Input, message } from 'antd';
import { CameraOutlined, EditOutlined } from '@ant-design/icons';
import { storage,db } from "../../config/firebase";
import { ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage';
import { collection,setDoc, doc, getDoc ,getDocs,addDoc } from "firebase/firestore";

const { Panel } = Collapse;

const CategoriesSection = () => {
 const [menu, setMenu] = useState([
  { name: "Team Sport", imageUrl: "" },
  { name: "Dance", imageUrl: "" },
  { name: "Martial Arts", imageUrl: "" },
  { name: "Stem", imageUrl: "" },
  { name: "Athletics", imageUrl: "" },
  { name: "Music", imageUrl: "" },
  { name: "Arts", imageUrl: "" },
  { name: "Social", imageUrl: "" },
]);

  const [editingIndex, setEditingIndex] = useState(null);
  const [categoryimage, setCategoryImage] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [textInput, setTextInput] = useState(''); 

  const renderCard = (item, index) => (
    <Card
      bordered={false}
      key={index}
      className="w-full text-center mb-4"
    >
      <div className="flex items-center justify-between p-2">
        {editingIndex === index ? (
          <Input
            value={item.name}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onBlur={() => handleBlur(index)}
            autoFocus
            className="flex-1 text-sm font-normal text-gray-700"
          />
        ) : (
          <p className="flex-1 m-0 text-sm font-normal text-gray-700 ">{item.name}</p> 
        )}
        <Button
          icon={<EditOutlined />}
          type="text"
          onClick={() => handleEditClick(index)}
        />
      </div>
  
      <div className=" flex justify-center items-center border border-gray-300 mt-2">
        {item.imageUrl ? (
          <img
            src={item.imageUrl} 
            alt="Category Image"
            className="rounded-lg object-cover"
            // style={{ maxHeight: '100%', maxWidth: '100%' }}
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
          onClick={() => fileInputRefs.current[index].current.click()} 
        >
          Upload Image
        </button>
        <input
          ref={fileInputRefs.current[index]} 
          type="file"
          accept="image/*"
          onChange={(e) => handleImageChange(e, index)} 
          className="hidden"
        />
      </div>
    </Card>
  );
  
const fetchCategoryMenuFromFirestore = async () => {
    try {
      const docRef = doc(db, "CategoryMenu", "menu");
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("Fetched category menu data:", data); 
        if (data.items) {
          const updatedMenu = data.items.map(item => ({
            name: item.name,
            imageUrl: item.imageUrl || '', 
          }));
          setMenu(updatedMenu);
        }
      } else {
        console.log("No category menu found in Firestore.");
      }
    } catch (error) {
      console.error("Error fetching category menu from Firestore:", error);
    }
  };
 
  useEffect(() => {
    fetchCategoryMenuFromFirestore();
  }, []);

const saveCategoryMenuToFirestore = async (newMenu) => {
    try {
      const docRef = doc(db, "CategoryMenu", "menu");
      const updatedMenu = newMenu.map(item => ({
        name: item.name , 
        imageUrl: item.imageUrl , 
      }));
  
      await setDoc(docRef, { items: updatedMenu }); 
      message.success("Category menu saved successfully!");
    } catch (error) {
      console.error("Error saving to Firestore:", error);
      message.error("Failed to save category menu to Firestore.");
    }
  };
  
  const handleInputChange = (index, value) => {
    const newMenu = [...menu];
    newMenu[index] = { ...newMenu[index], name: value };
    setMenu(newMenu);
  };
  

  const handleEditClick = (index) => {
    setEditingIndex(index);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      setEditingIndex(null);
      saveCategoryMenuToFirestore(menu);
      message.success("Menu item edited successfully!");
    }
  };

  const handleBlur = (index) => {
    setEditingIndex(null);
    saveCategoryMenuToFirestore(menu);
    message.success("Menu item edited successfully!");
  };
  //category menu ends hereeeeeeeeeee


  // //heading of catergory section startsss herreeee
  // const handleInputChange1 = (e) => {
  //   setTextInput(e.target.value); 
  // };

  const TextSaveToFirestore = async () => {
    if (textInput.trim() !== '') { 
      try {
        const docRef = doc(db, "CategoryMenu", "Text");
        await setDoc(docRef, {
          text: textInput,
          timestamp: new Date(),
        });
        setTextInput('');
        console.log("Text saved to Firestore");
        message.success("Text saved to Firestore");
      } catch (e) {
        console.error("Error saving text: ", e);
      }
    } else {
      console.log("Text field is empty");
      message.error("Text field is empty");
    }
  };
  
  const handleKeyDown2 = (e) => {
    if (e.key === 'Enter') {
      TextSaveToFirestore();
    }
  };

  // Fetch the text from Firestore
  const fetchTextFromFirestore = async () => {
    try {
      const docRef = doc(db, "CategoryMenu", "Text");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTextInput(data.text);
      } else {
        console.log("No such document!");
      }
    } catch (e) {
      console.error("Error fetching text:", e);
      message.error("Failed to fetch text from Firestore.");
    }
  };

  useEffect(() => {
    fetchTextFromFirestore();
  }, []);
  ////heading of catergory section  endssss herreeee

  ///upload images of category section functions startss heereeeee

  const fetchCategoryImage = async () => {
    console.log("hhhhh")
    try {
      const querySnapshot = await getDocs(collection(db, "CategoryMenu"));
      console.log("kkkkkk")
      if (!querySnapshot.empty) {
        console.log("ggggg")
        const ImageData = querySnapshot.docs.map((doc) => doc.data())
        console.log("hhhhh",ImageData)
        if (ImageData[0]?.url) {
            setCategoryImage(ImageData[0].url);
        }
      }
    } catch (error) {
      console.error("Error fetching Image:", error);
    }
  };

  useEffect(() => {
    fetchCategoryImage();
  }, []);

  const fileInputRefs = useRef(menu.map(() => React.createRef())); 

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
  
    if (file) {
      console.log(`File selected for index: ${index}`, file);
  
      const storageRef = ref(storage, `CategoryImages/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      setUploading(true);
      uploadTask.on(
        "state_changed",
        () => {},
        (error) => {
          setUploading(false);
          console.error("Upload failed:", error);
          message.error("Failed to upload image. Please try again.");
        },
        async () => {
          setUploading(false);
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("Download URL:", downloadURL);
  
            const updatedMenu = [...menu];
            updatedMenu[index] = {
              ...updatedMenu[index],
              imageUrl: downloadURL,
            };
            console.log("Updated menu:", updatedMenu);
  
            setMenu(updatedMenu);
            saveCategoryMenuToFirestore(updatedMenu);
          } catch (error) {
            console.error("Error fetching download URL:", error);
            message.error("Failed to retrieve image URL.");
          }
        }
      );
    } else {
      message.error("The selected file is not valid.");
    }
  };
  
  
  return (
    <div>
      <div className=" mt-4">
        <div className="ml-4">
          <Collapse expandIconPosition="end">
            <Panel className="font-bold text-xl" header="Category Section" key="1">
                <div className="flex items-centre">
                  <input
                    className="w-3/4 p-2 border border-gray-500 rounded-full text-sm  text-sm font-normal text-gray-700"
                    placeholder="Discover Categories"
                    value={textInput} 
                    // onChange={handleInputChange1} 
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyDown={handleKeyDown2}

                  ></input>
                    <button
                      className="ml-2 bg-red-500 text-white px-6 py-3 rounded-full text-sm"
                      onClick={TextSaveToFirestore} 
                    >
                      Save Text
                    </button>
                  
                </div>
                <div> 
                  <h4 className=" mt-5">Edit Categories</h4>
                  <div className="p-5">
                    <Row gutter={[16, 16]}>
                      {menu.map((item, index) => (
                        <Col span={6} key={index}>
                          {renderCard(item, index)}
                        </Col>
                      ))}
                    </Row>
                  </div>
                </div>
             
            </Panel>
          </Collapse>
        </div>

        
      </div>
    </div>
  );
};

export default CategoriesSection;
