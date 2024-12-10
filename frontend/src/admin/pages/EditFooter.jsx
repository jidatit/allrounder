import React from 'react';
import FooterMenuStructure from '../editFooterComponent/FooterMenuStructure';
import SocialLinks from '../editFooterComponent/SocialLinks';

const Editfooter = () => {
  //  const handleSaveAllChanges = () =>{
  //   message.success("Changes Saved")
  //  }
  return (
    <div>
       <div className=" flex justify-between ">
    <h2 className="text-2xl font-bold mb-4">Edit  Footer</h2>
    {/* <button className="bg-red-500 text-white mb-4 px-4 py-2 rounded-full"
    onClick={handleSaveAllChanges}
      >
      Save Menu
      </button> */}
   </div>
      <FooterMenuStructure/>
      <SocialLinks/>
    </div>
  );
};

export default Editfooter;
