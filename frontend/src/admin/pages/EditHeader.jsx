
import React from 'react';
import UploadLogo from '../editHeaderComponent/UploadLogo';
import MenuStructure from '../editHeaderComponent/MenuStructure';

const EditHeader = () => {
  return (
    <div>
      <div className="mt-8 flex ">
      <h2 className="text-2xl font-bold mb-4">Edit Header</h2>
      {/* <button className="bg-red-500 text-white px-4 py-2 rounded-full">
        Save Menu
        </button> */}
     </div>
     <div className="flex space-x-8">
        <UploadLogo />
        <MenuStructure />
     </div>
      
    </div>
  );
};

export default EditHeader;




