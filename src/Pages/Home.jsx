import React from 'react';
import MainBanner from '../components/MainBanner';
import CategoriesGrid from '../components/CategoriesGrid';
import ProductList from '../components/ProductList';
import CollaborationBanner from '../components/CollaborationBanner';

function Home() {
  return (
    
    <div style={{ minHeight: '100vh' }}>
      <MainBanner />
      <CategoriesGrid />
      <ProductList />
      <CollaborationBanner />
    </div>
  );
}

export default Home;
