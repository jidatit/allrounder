import React, { useState, useEffect } from 'react';
import { Collapse, message } from 'antd';
import {  db } from '../../config/firebase';
import { doc,setDoc,getDoc,} from "firebase/firestore";

const { Panel } = Collapse;

const FeaturedActivities = () => {

    const [textInput, setTextInput] = useState('');


    // const handleInputChange = (e) => {
    //     setTextInput(e.target.value); 
    //   };

      const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          TextSaveToFirestore();
        }
      };

      const TextSaveToFirestore = async () => {
        if (textInput.trim() !== '') { 
          try {
            const docRef = doc(db, 'editFeaturedActivityHeading', 'Text');
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


      const fetchTextFromFirestore = async () => {
        try {
          const docRef = doc(db, "editFeaturedActivityHeading", "Text");
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

    return (
        <div>
          <div className=" mt-4">
            <div className="ml-4">
              <Collapse expandIconPosition="end">
                <Panel className="font-bold text-xl" header="Activities Section" key="1">
                  <div className="">
                    <h4 className="mb-4">Edit Heading Text</h4>
                    <input className="w-33 p-2 border border-gray-900 rounded-full text-sm font-normal text-gray-800"
                      placeholder="Featured Activity"
                      value={textInput} 
                      // onChange={handleInputChange} 
                      onChange={(e) => setTextInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                       ></input>
                        <button
                  className="mt-2 ml-4 bg-red-500 text-white px-2 py-2 rounded-full text-sm"
                 onClick={TextSaveToFirestore}  
                  >
                  Save Text
                 </button>
                </div>
                </Panel>
              </Collapse>
            </div>
          </div>
        </div>
      );
    };

export default FeaturedActivities