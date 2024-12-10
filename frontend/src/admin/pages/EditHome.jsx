import React from 'react'
import HeroSection from '../editHomeComponent/HeroSection';
import CategoriesSection from '../editHomeComponent/CategoriesSection';
import ExploreProgram from '../editHomeComponent/ExploreProgram';
import FeaturedActivities from '../editHomeComponent/FeaturedActivities';
import AboutUsSection from '../editHomeComponent/AboutUsSection';

const EditHome = () => {
  return (
    <div>
        <HeroSection/>
        <CategoriesSection/>
        <FeaturedActivities/>
        <ExploreProgram/>
        <AboutUsSection/>
     </div>
  
  )
}
export default EditHome;
