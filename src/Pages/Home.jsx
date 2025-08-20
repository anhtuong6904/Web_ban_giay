import React from 'react';
import MainBanner from '../components/MainBanner';
import CategoriesGrid from '../components/CategoriesGrid';
import HotPicks from '../components/HotPicks';
import NewProducts from '../components/NewProducts';
import ProductList from '../components/ProductList';
import CollaborationBanner from '../components/CollaborationBanner';

function Home() {
  return (
    
    <div style={{ minHeight: '100vh' }}>
      <MainBanner />
      <CategoriesGrid />
      <HotPicks />
      <NewProducts />
      <ProductList />
      <CollaborationBanner />
    </div>
  );
}

export default Home;
