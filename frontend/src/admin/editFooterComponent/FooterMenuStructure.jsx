
import React, { useState, useEffect } from "react";
import { Input, Button, message } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { db } from "../../config/firebase";
import { setDoc, doc, getDoc } from "firebase/firestore";

const FooterMenuStructure = () => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [menuMain, setMenuMain] = useState([
    "Home",
    "Activities",
    "Featured Activities",
    // "Blog",
    "Join Now",
  ]);
  const [menuSecondary, setMenuSecondary] = useState(["Login", "Signup"]);

  const fetchMenusFromFirestore = async () => {
    try {
      const docRef = doc(db, "FooterMenuStructure", "menus");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.menuMain) {
          setMenuMain(data.menuMain);
        }
        if (data.menuSecondary) {
          setMenuSecondary(data.menuSecondary);
        }
      } else {
        console.log("No menu structure found in Firestore.");
      }
    } catch (error) {
      console.error("Error fetching menus from Firestore:", error);
    }
  };

  useEffect(() => {
    fetchMenusFromFirestore();
  }, []);

  const saveMenusToFirestore = async () => {
    try {
      const docRef = doc(db, "FooterMenuStructure", "menus");
      await setDoc(docRef, { menuMain, menuSecondary });
      message.success("Menus saved successfully!");
    } catch (error) {
      console.error("Error saving menus to Firestore:", error);
      message.error("Failed to save menus to Firestore.");
    }
  };

  const handleInputChange = (type, index, value) => {
    if (type === "main") {
      const newMenuMain = [...menuMain];
      newMenuMain[index] = value;
      setMenuMain(newMenuMain);
    } else if (type === "secondary") {
      const newMenuSecondary = [...menuSecondary];
      newMenuSecondary[index] = value;
      setMenuSecondary(newMenuSecondary);
    }
  };

  const handleEditClick = (type, index) => {
    if (editingIndex === `${type}-${index}`) {
      setEditingIndex(null);
      saveMenusToFirestore();
      message.success("Menu item edited successfully!");
    } else {
      setEditingIndex(`${type}-${index}`);
    }
  };

  const handleKeyDown = (type, index, e) => {
    if (e.key === "Enter") {
      setEditingIndex(null);
      saveMenusToFirestore();
      message.success("Menu item edited successfully!");
    }
  };

  return (
    <div className="flex space-x-8">
      {/* Menu Structure */}
      <div className=" p-4 w-full">
        <div className=" flex justify-between mb-4">
          <h3 className="text-lg font-bold">Menu Structure</h3>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-full"
            onClick={saveMenusToFirestore}
          >
            Save Menu
          </button>
        </div>

        <div className="flex space-x-8">
          {/* Main Menu */}
          <div className=" w-1/2">
            <h4 className="font-bold mb-2">Main Menu</h4>
            {menuMain.map((item, index) => (
              <div key={index} className="flex items-center space-x-4 mb-2">
                <div className="flex-1">
                  {editingIndex === `main-${index}` ? (
                    <Input
                      value={item}
                      onChange={(e) => handleInputChange("main", index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown("main", index, e)}
                      onBlur={() => {
                        setEditingIndex(null);
                        saveMenusToFirestore();
                      }}
                      autoFocus
                      className="w-full"
                    />
                  ) : (
                    <span>{item}</span>
                  )}
                </div>
                <Button
                  onClick={() => handleEditClick("main", index)}
                  icon={<EditOutlined />}
                  type="text"
                />
              </div>
            ))}
          </div>

          {/* Secondary Menu */}
          <div className=" w-1/2">
            <h4 className="font-bold mb-2">Secondary Menu</h4>
            {menuSecondary.map((item, index) => (
              <div key={index} className="flex items-center space-x-4 mb-2">
                <div className="flex-1">
                  {editingIndex === `secondary-${index}` ? (
                    <Input
                      value={item}
                      onChange={(e) => handleInputChange("secondary", index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown("secondary", index, e)}
                      onBlur={() => {
                        setEditingIndex(null);
                        saveMenusToFirestore();
                      }}
                      autoFocus
                      className="w-full"
                    />
                  ) : (
                    <span>{item}</span>
                  )}
                </div>
                <Button
                  onClick={() => handleEditClick("secondary", index)}
                  icon={<EditOutlined />}
                  type="text"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterMenuStructure;



