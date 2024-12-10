
import React, { useState, useEffect ,useRef} from 'react';
import { Collapse, Row, Col, Card, Button, Input, message } from 'antd';
import { CameraOutlined, EditOutlined } from '@ant-design/icons';
import { storage,db } from "../../config/firebase";
import { ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage';
import { collection,setDoc, doc, getDoc ,getDocs,addDoc } from "firebase/firestore";

const { Panel } = Collapse;

const ExploreProgram = () => {
  const [menu, setMenu] = useState([
    { name: 'Discover', imageUrl: '' ,paragraph: ""},
    { name: 'Review', imageUrl: '', paragraph: "" },
    { name: 'Enroll', imageUrl: '' ,paragraph: ""},
    { name: 'Get Started', imageUrl: '' ,paragraph: ""},
  ]);

  const [editingIndex, setEditingIndex] = useState(null);
  const [Exploreimage, setExploreImage] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingParagraphIndex, setEditingParagraphIndex] = useState(null);
  const [textInput, setTextInput] = useState(''); 

//image functionss hereeeeeee
const fetchExploreMenuFromFirestore = async () => {
  try {
    const docRef = doc(db, "ExploreProgram", "menu");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("Fetched Explore menu data:", data); 
      if (data.items) {
        const updatedMenu = data.items.map(item => ({
          name: item.name,
          imageUrl: item.imageUrl || '', 
          paragraph:item.paragraph || '',
        }));
        setMenu(updatedMenu);
      }
    } else {
      console.log("No Explore menu found in Firestore.");
    }
  } catch (error) {
    console.error("Error fetching Explore menu from Firestore:", error);
  }
};

useEffect(() => {
  fetchExploreMenuFromFirestore();
}, []);

const saveExploreMenuToFirestore = async (newMenu) => {
  try {
    const docRef = doc(db, "ExploreProgram", "menu");
    const updatedMenu = newMenu.map(item => ({
      name: item.name , 
      imageUrl: item.imageUrl ,
      paragraph:item.paragraph,
    }));

    await setDoc(docRef, { items: updatedMenu }); 
    message.success("Explore menu saved successfully!");
  } catch (error) {
    console.error("Error saving to Firestore:", error);
    message.error("Failed to save Explore menu to Firestore.");
  }
};



    const renderCard = (item, index) => (
        <Card
          bordered={false}
          key={index}
          className="w-full text-center "
        >
          {/* Editable title */}
          <div className="flex items-center justify-between ">
            {editingIndex === index ? (
              <Input
                value={item.name}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onBlur={() => handleBlur(index)}
                autoFocus
                className="flex-1"
              />
            ) : (
              <p className="flex-1 m-0">{item.name}</p> 
            )}
            <Button
              icon={<EditOutlined />}
              type="text"
              onClick={() => handleEditClick(index)}
            />
          </div>


          {/* Editable paragraph */}
    <div className="p-2 flex justify-content p-2">
      {editingParagraphIndex === index ? (
        <Input.TextArea
          value={item.paragraph }
          onChange={(e) => handleParagraphChange(index, e.target.value)}
          placeholder='Write a paragraph'
          onKeyDown={(e) => handleParagrahKeyDown(e, index)}
          onBlur={() => handleParagraphBlur(index)}
          rows={3}
          className="flex-1"
          autoFocus
        />
      ) : (
        <p className="flex-1 m-0">{item.paragraph }</p>
      )}
      <Button
              icon={<EditOutlined />}
              type="text"
              onClick={() => handleParagraphEditClick(index)}
            />
    </div>
      
          <div className="w-full h-36 p-4 flex justify-center items-center">
            {item.imageUrl ? (
              <img
                src={item.imageUrl} 
                alt="Explore Image"
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
              onClick={() => fileInputRefs.current[index].current.click()} // Trigger correct input
            >
              Upload Image
            </button>
            <input
              ref={fileInputRefs.current[index]}  // Use the correct ref for this index
              type="file"
              accept="image/*"
              onChange={(e) => handleExploreImageChange(e, index)} 
              className="hidden"
            />
          </div>
        </Card>
      );

      const handleInputChange = (index, value) => {
        const newMenu = [...menu];
        newMenu[index] = { ...newMenu[index], name: value };
        setMenu(newMenu);
      };


      const handleParagraphChange = (index, value) => {
        const newMenu = [...menu];
        newMenu[index] = { ...newMenu[index], paragraph: value };
        setMenu(newMenu);
      };

      const handleKeyDown = (e, index) => {
        if (e.key === "Enter") {
          setEditingIndex(null);
          saveExploreMenuToFirestore(menu);
          message.success("Menu item edited successfully!");
        }
      };


      const handleParagrahKeyDown = (e, index) => {
        if (e.key === "Enter") {
          setEditingParagraphIndex(null);
          saveExploreMenuToFirestore(menu);
          message.success("Explore Paragraph  edited successfully!");
        }
      };

      const handleBlur = (index) => {
        setEditingIndex(null);
        saveExploreMenuToFirestore(menu);
        message.success("Explore meny item edited successfully!");
      };

      const handleParagraphBlur = (index) => {
        setEditingParagraphIndex(null);
        saveExploreMenuToFirestore(menu);
        message.success("Explore Paragraph item edited successfully!");
      };

      const handleEditClick = (index) => {
        setEditingIndex(index);
      };

      const handleParagraphEditClick = (index) => {
        setEditingParagraphIndex(index);
      };


      const handleInputChange1 = (e) => {
        setTextInput(e.target.value); 
      };
    
      const TextSaveToFirestore = async () => {
        if (textInput.trim() !== '') { 
          try {
            const docRef = doc(db, "ExploreProgram", "Text");
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



      
  const fetchExploreImage = async () => {
    console.log("hhhhh")
    try {
      const querySnapshot = await getDocs(collection(db, "ExploreProgram"));
      console.log("kkkkkk")
      if (!querySnapshot.empty) {
        console.log("ggggg")
        const ImageData = querySnapshot.docs.map((doc) => doc.data())
        console.log("hhhhh",ImageData)
        if (ImageData[0]?.url) {
            setExploreImage(ImageData[0].url);
        }
      }
    } catch (error) {
      console.error("Error fetching Image:", error);
    }
  };

  useEffect(() => {
    fetchExploreImage();
  }, []);



const fileInputRefs = useRef(menu.map(() => React.createRef())); // Create a ref for each Explore Category

  const handleExploreImageChange = (e, index) => {
    const file = e.target.files[0];
  
    if (file) {
      console.log(`File selected for index: ${index}`, file);
  
      const storageRef = ref(storage, `ExploreImages/${file.name}`);
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
  
            // Update the menu with the new image URL
            const updatedMenu = [...menu];
            updatedMenu[index] = {
              ...updatedMenu[index],
              imageUrl: downloadURL,
            };
            console.log("Updated menu:", updatedMenu);
  
            setMenu(updatedMenu);
            saveExploreMenuToFirestore(updatedMenu);
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
                <Panel className="font-bold text-xl" header="Explore Program Section" key="1">
                  <div className="mt-2">
                    <div className="flex items-centre">
                      <input
                        className="w-3/4 p-2 border border-gray-500 rounded-full text-sm"
                        placeholder="Explore Program"
                        value={textInput} 
                        onChange={handleInputChange1} 
                        onKeyDown={handleKeyDown2}
    
                      ></input>
                        <button
                          className="ml-2 bg-red-500 text-white px-2 py-2 rounded-full text-sm"
                          onClick={TextSaveToFirestore} 
                        >
                          Save Text
                        </button>
                      
                    </div>
                    <div>
                      <h4 className=" mt-6">Steps for how to get started</h4>
                      <div className="">
                        <Row gutter={[16, 16]}>
                          {menu.map((item, index) => (
                            <Col span={12} key={index}>
                              {renderCard(item, index)}
                            </Col>
                          ))}
                        </Row>
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
  


export default ExploreProgram;


