import React, { useState, useEffect } from "react";
import { CgMenuLeft } from "react-icons/cg";
import { Check } from "lucide-react";

const CategoryFilterDropdown = ({
  activities,
  onFilterChange,
  initialCategory,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const categories = [
    "Team Sports",
    "Dance",
    "Martial Arts",
    "Stem",
    "Athletics",
    "Music",
    "Arts",
    "Social",
  ];

  // Initialize with URL param category
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategories([]); // Reset when URL changes
    }
  }, [initialCategory]);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) => {
      let newCategories;
      if (prev.includes(category)) {
        newCategories = prev.filter((c) => c !== category);
      } else {
        newCategories = [...prev, category];
      }
      onFilterChange(newCategories); // Pass only dropdown selections
      return newCategories;
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#EBEBEB] flex items-center justify-center p-2 px-4 rounded-full text-xl gap-1"
      >
        <CgMenuLeft />
        <p className="text-sm">
          {selectedCategories.length === 0
            ? initialCategory || "Categories"
            : selectedCategories.length === 1
            ? selectedCategories[0]
            : `${
                selectedCategories.length + (initialCategory ? 1 : 0)
              } Selected`}
        </p>
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
                {(selectedCategories.includes(category) ||
                  category === initialCategory) && (
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
