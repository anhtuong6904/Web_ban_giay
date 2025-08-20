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
      description: 'Tất cả giày dép',
      route: '/products'
    },
    {
      id: 'men',
      name: 'MEN',
      icon: '👨',
      description: 'Dành cho nam giới',
      route: '/products?gender=men'
    },
    {
      id: 'women',
      name: 'WOMEN',
      icon: '👩',
      description: 'Dành cho phụ nữ',
      route: '/products?gender=women'
    },
    {
      id: 'kids',
      name: 'KIDS',
      icon: '👶',
      description: 'Dành cho trẻ em',
      route: '/products?gender=kids'
    },
    {
      id: 'sports',
      name: 'SPORTS',
      icon: '⚽',
      description: 'Thể thao chuyên nghiệp',
      route: '/products?category=sports'
    },
    {
      id: 'brands',
      name: 'BRANDS',
      icon: '🏷️',
      description: 'Thương hiệu nổi tiếng',
      route: '/products?brand=all'
    }
  ];

  const handleCategoryClick = (category) => {
    navigate(category.route);
  };

  return (
    <section className="categories-section">
      <div className="categories-container">
        <div className="categories-header">
          <h2>🎯 KHÁM PHÁ THEO DANH MỤC</h2>
          <p>Chọn danh mục yêu thích của bạn</p>
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