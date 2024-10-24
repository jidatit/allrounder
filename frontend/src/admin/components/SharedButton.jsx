import React, { useState } from "react";
import { IoShareOutline } from "react-icons/io5";

const ShareButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleShare = () => {
    // Get the current page URL
    const currentUrl = window.location.href;

    // Copy to clipboard
    navigator.clipboard.writeText(currentUrl).then(() => {
      // Show tooltip
      setShowTooltip(true);

      // Hide tooltip after 2 seconds
      setTimeout(() => {
        setShowTooltip(false);
      }, 2000);
    });
  };

  return (
    <div className="relative inline-block">
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm py-1 px-2 rounded whitespace-nowrap">
          Link copied!
          {/* Tooltip arrow */}
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45" />
        </div>
      )}

      {/* Share button */}
      <button
        onClick={handleShare}
        className="Lg:text-2xl text-xl flex items-center lg:gap-2 gap-1 hover:text-gray-600 transition-colors"
      >
        <IoShareOutline />
        <span>share</span>
      </button>
    </div>
  );
};

export default ShareButton;
