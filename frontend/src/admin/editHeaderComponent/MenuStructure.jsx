import React, { useState, useEffect } from "react";
import { Input, Button, message } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { db } from "../../config/firebase";
import { setDoc, doc, getDoc } from "firebase/firestore";

const MenuStructure = () => {
  const [menu, setMenu] = useState([
    "Home",
    "Artists",
    "Partners",
    "Tours",
    // "Blog",
  ]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [showLoginIcon, setShowLoginIcon] = useState(
    JSON.parse(localStorage.getItem("showLoginIcon")) || false
  );

  const fetchMenuFromFirestore = async () => {
    try {
      const docRef = doc(db, "menuStructure", "menu");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.items) {
          setMenu(data.items); 
        }
      } else {
        console.log("No menu structure found in Firestore.");
      }
    } catch (error) {
      console.error("Error fetching menu from Firestore:", error);
    }
  };

  useEffect(() => {
    fetchMenuFromFirestore();
  }, []);

  const saveMenuToFirestore = async (newMenu) => {
    try {
      const docRef = doc(db, "menuStructure", "menu");
      await setDoc(docRef, { items: newMenu });
    } catch (error) {
      console.error("Error saving to Firestore:", error);
      message.error("Failed to save menu to Firestore.");
    }
  };

  const handleSaveMenu = async () => {
    await saveMenuToFirestore(menu);
    message.success("Menu saved successfully!");
  };

  const handleInputChange = (index, value) => {
    const newMenu = [...menu];
    newMenu[index] = value;
    setMenu(newMenu);
    saveMenuToFirestore(newMenu);
  };

  const handleEditClick = (index) => {
    if (editingIndex === index) {
      setEditingIndex(null);
      saveMenuToFirestore(menu);
      message.success("Menu item edited successfully!");
    } else {
      setEditingIndex(index);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      setEditingIndex(null);
      saveMenuToFirestore(menu);
      message.success("Menu item edited successfully!");
    }
  };


  const handleCheckboxChange = (e) => {
    setShowLoginIcon(e.target.checked);
    localStorage.setItem("showLoginIcon", JSON.stringify(e.target.checked));
  };

  return (
    <div className="p-4 w-2/3 ">
      <div className="flex justify-between">
        <h3 className="text-lg font-bold">Menu Structure</h3>
        <button
          className="bg-red-500 mb-4 text-white px-4 py-2 rounded-full"
          onClick={handleSaveMenu}
        >
          Save Menu
        </button>
      </div>
      {menu.map((item, index) => (
        <div key={index} className="flex items-center space-x-4 mb-2">
          <div className="flex-1">
            {editingIndex === index ? (
              <Input
                value={item}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onBlur={() => {
                  setEditingIndex(null);
                  saveMenuToFirestore(menu);
                  message.success("Menu item edited successfully!");
                }}
                autoFocus
                className="w-full"
              />
            ) : (
              <span>{item}</span>
            )}
          </div>

          <Button
            onClick={() => handleEditClick(index)}
            icon={<EditOutlined />}
            type="text"
          />
        </div>
      ))}
      <div className="flex items-center space-x-4 mt-12">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input type="checkbox"
           id="showLoginIcon" 
           className="mr-2" 
           checked={showLoginIcon}
            onChange={handleCheckboxChange}
           />
          <span className="text-gray-900">Show Login Icon</span>
        </label>
      </div>
    </div>
  );
};

export default MenuStructure;
  