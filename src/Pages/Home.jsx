import React from 'react';
import MainBanner from '../components/MainBanner';
import CategoriesGrid from '../components/CategoriesGrid';
import HotPicks from '../components/HotPicks';
import NewProducts from '../components/NewProducts';
import CollaborationBanner from '../components/CollaborationBanner';
import Slider from '../components/Slider';
import '../components/HomeGradient.css';

function Home() {
  return (
    
    <div className="home-wrapper">
      <MainBanner />
      <Slider />
      <div className="section-dark"><div className="container-narrow"><CategoriesGrid /></div></div>
      <div className="section-ink"><div className="container-narrow"><HotPicks /></div></div>
      <div className="section-carbon"><div className="container-narrow"><NewProducts /></div></div>
      <CollaborationBanner />
    </div>
  );
}

export default Home;
