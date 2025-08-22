import React, { useEffect } from 'react';
import MainBanner from '../components/MainBanner';
import CategoriesGrid from '../components/CategoriesGrid';
import CategoryShowcase from '../components/CategoryShowcase';
import HotPicks from '../components/HotPicks';
import NewProducts from '../components/NewProducts';
import CollaborationBanner from '../components/CollaborationBanner';
import Slider from '../components/Slider';
import '../components/HomeGradient.css';

function Home() {
  useEffect(() => {
    // Set CSS variable cho ảnh nền
    const bgImageUrl = 'url("/images/collaboration-banner.png")';
    document.documentElement.style.setProperty('--home-bg-image', bgImageUrl);
    
    // Debug: kiểm tra xem CSS variable có được set không
    console.log('CSS Variable set:', bgImageUrl);
    console.log('CSS Variable value:', getComputedStyle(document.documentElement).getPropertyValue('--home-bg-image'));
    
    // Kiểm tra xem ảnh có load được không
    const img = new Image();
    img.onload = () => console.log('✅ Ảnh nền đã load thành công!');
    img.onerror = () => console.log('❌ Không thể load ảnh nền:', bgImageUrl);
    img.src = '/images/collaboration-banner.png';
  }, []);

  return (
    <div className="home-wrapper">
      {/* Background Image for entire home wrapper */}
      <div className="home-background-image"></div>
      
      {/* Overlay for better content readability */}
      <div className="home-overlay"></div>
      
      <MainBanner />
      <Slider />
      {/* Category section removed; chips moved into MainBanner */}
      
      {/* Category Showcase - NEW! */}
      <CategoryShowcase />
      
      <div className="section-ink"><div className="container-narrow"><HotPicks /></div></div>
      <div className="section-carbon"><div className="container-narrow"><NewProducts /></div></div>
      <CollaborationBanner />
    </div>
  );
}

export default Home;
