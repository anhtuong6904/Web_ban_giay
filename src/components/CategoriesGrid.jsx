import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CategoriesGrid.css';

function CategoriesGrid() {
  const navigate = useNavigate();

  // Định nghĩa các mục phân loại chính
  const mainCategories = [
    {
      id: 'shoes',
      name: 'SHOES',
      icon: '👟',
      description: 'All footwear',
      route: '/products?tag=shoes'
    },
    {
      id: 'men',
      name: 'MEN',
      icon: '👨',
      description: 'For men',
      route: '/products?tag=men'
    },
    {
      id: 'women',
      name: 'WOMEN',
      icon: '👩',
      description: 'For women',
      route: '/products?tag=women'
    },
    {
      id: 'kids',
      name: 'KIDS',
      icon: '👶',
      description: 'For kids',
      route: '/products?tag=kids'
    },
    {
      id: 'sports',
      name: 'SPORTS',
      icon: '⚽',
      description: 'Professional sports',
      route: '/products?tag=sports'
    },
    {
      id: 'brands',
      name: 'BRANDS',
      icon: '🏷️',
      description: 'Top brands',
      route: '/brands'
    }
  ];

  const handleCategoryClick = (category) => {
    navigate(category.route);
  };

  return (
    <section className="categories-section">
      <div className="categories-container">
        <div className="categories-header">
          <h2>🎯 EXPLORE BY CATEGORY</h2>
          <p>Choose your favorite category</p>
        </div>

        <div className="categories-grid">
          {mainCategories.map((category) => (
            <div
              key={category.id}
              className="category-card"
              onClick={() => handleCategoryClick(category)}
            >
              <div className="category-icon">{category.icon}</div>
              <div className="category-content">
                <h3 className="category-name">{category.name}</h3>
                <p className="category-description">{category.description}</p>
              </div>
              <div className="category-arrow">
                <i className="fas fa-arrow-right"></i>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoriesGrid; 