import React from 'react';
import './CategoriesGrid.css';

export default function CategoriesGrid() {
  const categories = [
    {
      id: 1,
      title: "BACK TO SCHOOL SALE",
      image: "/images/categories/back-to-school.jpg",
      overlay: null
    },
    {
      id: 2,
      title: "BEST SELLER TOP PICKS",
      image: "/images/categories/best-sellers.jpg",
      overlay: "BEST SELLERS"
    },
    {
      id: 3,
      title: "GOLF ON SALE",
      image: "/images/categories/golf.jpg",
      overlay: null
    },
    {
      id: 4,
      title: "SHOP FOR MEN",
      image: "/images/categories/men.jpg",
      overlay: null
    },
    {
      id: 5,
      title: "SHOP FOR WOMEN",
      image: "/images/categories/women.jpg",
      overlay: null
    },
    {
      id: 6,
      title: "ALMOST GONE",
      image: "/images/categories/last-sizes.jpg",
      overlay: "LAST SIZES"
    }
  ];

  return (
    <div className="categories-section">
      <div className="categories-container">
        <div className="categories-grid">
          {categories.map(category => (
            <div key={category.id} className="category-card">
              <div className="category-image">
                <img src={category.image} alt={category.title} />
                {category.overlay && (
                  <div className="category-overlay">
                    <span>{category.overlay}</span>
                  </div>
                )}
              </div>
              <h3 className="category-title">{category.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 