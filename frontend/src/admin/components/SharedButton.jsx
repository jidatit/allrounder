// import React, { useState } from "react";
// import { IoShareOutline } from "react-icons/io5";

// const ShareButton = () => {
//   const [showTooltip, setShowTooltip] = useState(false);

//   const handleShare = () => {
//     // Get the current page URL
//     const currentUrl = window.location.href;

//     // Copy to clipboard
//     navigator.clipboard.writeText(currentUrl).then(() => {
//       // Show tooltip
//       setShowTooltip(true);

//       // Hide tooltip after 2 seconds
//       setTimeout(() => {
//         setShowTooltip(false);
//       }, 2000);
//     });
//   };

//   return (
//     <div className="relative inline-block">
//       {/* Tooltip */}
//       {showTooltip && (
//         <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm py-1 px-2 rounded whitespace-nowrap">
//           Link copied!!!
//           {/* Tooltip arrow */}
//           <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45" />
//         </div>
//       )}

//       {/* Share button */}
//       <button
//         onClick={handleShare}
//         className="Lg:text-2xl text-xl flex items-center lg:gap-2 gap-1 hover:text-gray-600 transition-colors"
//       >
//         <IoShareOutline />
//         <span>share</span>
//       </button>
//     </div>
//   );
// };

// export default ShareButton;
import React, { useState } from "react";
import { IoShareOutline } from "react-icons/io5";

const ShareButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Content to share
  const shareData = {
    title: "Check out this post!",
    text: "I found this article interesting and thought you might like it.",
    url: window.location.href,
  };

  // Function to handle sharing
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log("Shared successfully");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Open custom modal if Web Share API is not available
      setIsModalOpen(true);
    }
  };

  // Function to close the modal
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      {/* <button
        onClick={handleShare}
        className="share-button px-4 py-2 bg-[#E55938] text-white rounded hover:bg-[#f0512d]"
      >
        Share
      </button> */}
      {/* Share button */}
      <button
        onClick={handleShare}
        className="Lg:text-2xl text-xl flex items-center lg:gap-2 gap-1 hover:text-gray-600 transition-colors"
      >
        <IoShareOutline />
        <span>share</span>
      </button>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-80 shadow-lg relative">
            <h3 className="text-lg font-semibold mb-4">Share This Post</h3>
            <p className="text-sm mb-4">
              Copy the link or share on social media:
            </p>
            <input
              type="text"
              readOnly
              value={shareData.url}
              className="w-full border rounded px-3 py-2 mb-4 text-gray-700"
              onClick={(e) => e.target.select()}
            />
            <div className="flex space-x-4 mb-4">
              <a
                href={`https://twitter.com/intent/tweet?text=${shareData.text}&url=${shareData.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Twitter
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareData.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Facebook
              </a>
              <a
                href={`mailto:?subject=${shareData.title}&body=${shareData.text}%0A${shareData.url}`}
                className="bg-gray-600 text-white px-3 py-1 rounded"
              >
                Email
              </a>
            </div>
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
