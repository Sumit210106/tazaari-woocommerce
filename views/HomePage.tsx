"use client";

import React from 'react';
import HeroSlider from '../components/HeroSlider';
import FeaturedCollection from '../components/FeaturedCollection';
import FabricStory from '../components/FabricStory';
import NewArrivals from '../components/NewArrivals';
import LookbookGrid from '../components/LookbookGrid';
import Newsletter from '../components/Newsletter';
import Testimonials from '../components/Testimonials';

export const HomePage: React.FC = () => {
  return (
    <div style={{ backgroundColor: '#FFFFFF' }}>
      <HeroSlider />
      <FeaturedCollection />
      <FabricStory />
      <NewArrivals />
      <LookbookGrid />
      <Newsletter />
      <Testimonials />
    </div>
  );
};

export default HomePage;
