import React from 'react';
import Header from '../components/Header';
import MainBanner from '../components/MainBanner';
import CategoriesGrid from '../components/CategoriesGrid';
import ProductList from '../components/ProductList';
import Footer from '../components/Footer';

function Home() {
  return (
    
    <div style={{ minHeight: '100vh' }}>
      <Header />
      <MainBanner />
      <CategoriesGrid />
      <ProductList />
      <Footer />
    </div>
  );
}

export default Home;
