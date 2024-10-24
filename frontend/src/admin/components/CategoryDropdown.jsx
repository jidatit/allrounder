import React, { useState } from "react";
import { CgMenuLeft } from "react-icons/cg";
import { Check } from "lucide-react";

const CategoryFilterDropdown = ({ activities, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const categories = [
    "Sports",
    "Music",
    "Art",
    "Education",
    "Technology",
    "Food",
    "Travel",
    "Other",
  ];

  const toggleCategory = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        const newCategories = prev.filter((c) => c !== category);
        onFilterChange(newCategories);
        return newCategories;
      } else {
        const newCategories = [...prev, category];
        onFilterChange(newCategories);
        return newCategories;
      }
    });
  };

  const filteredActivities = activities.filter((activity) => {
    if (selectedCategories.length === 0) return true;
    return selectedCategories.includes(activity.category);
  });

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#EBEBEB] flex items-center justify-center p-2 px-4 rounded-full text-xl gap-1"
      >
        <CgMenuLeft />
        <p className="text-sm">Categories</p>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          {categories.map((category) => (
            <div
              key={category}
              className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => toggleCategory(category)}
            >
              <div className="w-5 h-5 border rounded mr-3 flex items-center justify-center">
                {selectedCategories.includes(category) && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </div>
              <span className="text-sm">{category}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryFilterDropdown;