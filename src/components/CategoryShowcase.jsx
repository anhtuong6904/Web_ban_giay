import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CategoryShowcase.css';

export default function CategoryShowcase() {
  const categories = [
    {
      id: 'men',
      name: 'MEN',
      description: 'Stylish shoes for men',
      image: '/images/products/giay-the-thao-2.jpg',
      link: '/products?category=women&tag=men&gender=MEN',
      color: '#3498db',
      isLarge: true
    },
    {
      id: 'women',
      name: 'WOMEN',
      description: 'FOR WOMEN',
      image: '/images/products/giay-the-thao-1.jpg',
      link: '/products?category=women&tag=women&gender=WOMEN',
      color: '#e74c3c',
      isLarge: false
    },
    {
      id: 'sports',
      name: 'SPORTS',
      description: 'SPORTS',
      image: '/images/products/giay-the-thao-3.jpg',
      link: '/products?category=women&tag=sports&gender=SPORTS',
      color: '#27ae60',
      isLarge: false
    }
  ];

  const largeCategory = categories.find(cat => cat.isLarge);
  const smallCategories = categories.filter(cat => !cat.isLarge);

  useEffect(() => {
    // Debug: kiểm tra categories
    console.log('Large Category:', largeCategory);
    console.log('Small Categories:', smallCategories);
    console.log('Large Image URL:', largeCategory?.image);
  }, []);

  return (
    <section className="category-showcase-section">
      <div className="category-showcase-container">
        <div className="category-showcase-header">
          <h2>EXPLORE CATEGORIES</h2>
          <p>Discover Your Perfect Style in Every Category</p>
        </div>

        <div className="category-showcase-layout">
          {/* Large Banner - Left Side */}
          <div className="large-category-banner">
            <Link 
              to={largeCategory.link} 
              className="category-showcase-card large-card"
              style={{ 
                '--category-color': largeCategory.color,
                backgroundImage: `url(${largeCategory.image})`
              }}
            >
              {/* Content Overlay */}
              <h3 className="category-name large-name">{largeCategory.name}</h3>
                <p className="category-description large-description">{largeCategory.description}</p>
                
                <div className="category-action large-action">
                  <span className="explore-text">SHOP NOW</span>
                  <i className="fas fa-arrow-right"></i>
                </div>

            
            </Link>
          </div>

          {/* Small Banners - Right Side */}
          <div className="small-categories-container">
            {smallCategories.map((category) => (
              <Link 
                key={category.id} 
                to={category.link} 
                className="category-showcase-card small-card"
                style={{ 
                  '--category-color': category.color,
                  backgroundImage: `url(${category.image})`
                }}
              >
                {/* Content Overlay */}
                <h3 className="category-name small-name">{category.name}</h3>
                  <p className="category-description small-description">{category.description}</p>
                  
                  <div className="category-action small-action">
                    <span className="explore-text">SHOP NOW</span>
                    <i className="fas fa-arrow-right"></i>
                  </div>

              
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
