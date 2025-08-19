import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../services/productService';
import './CategoriesGrid.css';

function CategoriesGrid() {
  const [products, setProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();

  // Định nghĩa các mục phân loại chính
  const mainCategories = [
    {
      id: 'shoes',
      name: 'SHOES',
      icon: '👟',
      description: 'Tất cả giày dép',
      subCategories: ['Giày thể thao', 'Giày chạy bộ', 'Giày đá banh', 'Giày tây', 'Dép', 'Giày búp bê']
    },
    {
      id: 'men',
      name: 'MEN',
      icon: '👨',
      description: 'Dành cho nam giới',
      subCategories: ['Giày thể thao nam', 'Giày tây nam', 'Giày chạy bộ nam']
    },
    {
      id: 'women',
      name: 'WOMEN',
      icon: '👩',
      description: 'Dành cho phụ nữ',
      subCategories: ['Giày thể thao nữ', 'Giày búp bê', 'Giày cao gót']
    },
    {
      id: 'kids',
      name: 'KIDS',
      icon: '👶',
      description: 'Dành cho trẻ em',
      subCategories: ['Giày trẻ em', 'Giày học sinh', 'Giày thể thao trẻ em']
    },
    {
      id: 'sports',
      name: 'SPORTS',
      icon: '⚽',
      description: 'Thể thao chuyên nghiệp',
      subCategories: ['Giày đá banh', 'Giày chạy bộ', 'Giày tennis', 'Giày bóng rổ']
    },
    {
      id: 'brands',
      name: 'BRANDS',
      icon: '🏷️',
      description: 'Thương hiệu nổi tiếng',
      subCategories: ['UTH Shoes', 'Nike', 'Adidas', 'Puma', 'New Balance']
    }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Lỗi khi tải sản phẩm:', error);
      }
    };

    fetchProducts();
  }, []);

  // Hàm kiểm tra sản phẩm có thuộc mục được chọn không
  const isProductInCategory = (product, categoryId) => {
    const category = mainCategories.find(cat => cat.id === categoryId);
    if (!category) return false;

    // Kiểm tra theo tên sản phẩm
    const productName = product.Name?.toLowerCase() || '';
    const productCategory = product.Category?.toLowerCase() || '';
    const productBrand = product.Brand?.toLowerCase() || '';
    const productGender = product.Gender?.toLowerCase() || '';

    switch (categoryId) {
      case 'shoes':
        return true; // Tất cả sản phẩm đều là giày dép
      
      case 'men':
        return productName.includes('nam') || 
               productGender.includes('nam') ||
               productName.includes('male') ||
               productGender.includes('male');
      
      case 'women':
        return productName.includes('nữ') || 
               productGender.includes('nữ') ||
               productName.includes('female') ||
               productGender.includes('female') ||
               productName.includes('búp bê') ||
               productName.includes('princess');
      
      case 'kids':
        return productName.includes('teen') || 
               productName.includes('trẻ') ||
               productName.includes('học sinh') ||
               productName.includes('kid') ||
               productName.includes('teen');
      
      case 'sports':
        return productCategory.includes('thể thao') ||
               productCategory.includes('chạy bộ') ||
               productCategory.includes('đá banh') ||
               productCategory.includes('sport') ||
               productName.includes('runner') ||
               productName.includes('football') ||
               productName.includes('tennis') ||
               productName.includes('basketball');
      
      case 'brands':
        return productBrand.includes('uth') ||
               productBrand.includes('nike') ||
               productBrand.includes('adidas') ||
               productBrand.includes('puma') ||
               productBrand.includes('new balance');
      
      default:
        return false;
    }
  };

  // Hàm lọc sản phẩm theo mục được chọn
  const filterProductsByCategories = (selectedCats) => {
    if (selectedCats.length === 0) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(product => {
      // Sản phẩm phải thuộc ít nhất một mục được chọn
      return selectedCats.some(categoryId => isProductInCategory(product, categoryId));
    });

    setFilteredProducts(filtered);
  };

  // Hàm xử lý click vào mục
  const handleCategoryClick = (categoryId) => {
    let newSelectedCategories;
    
    if (selectedCategories.includes(categoryId)) {
      // Bỏ chọn mục này
      newSelectedCategories = selectedCategories.filter(id => id !== categoryId);
    } else {
      // Thêm mục này vào danh sách được chọn
      newSelectedCategories = [...selectedCategories, categoryId];
    }
    
    setSelectedCategories(newSelectedCategories);
    filterProductsByCategories(newSelectedCategories);
  };

  // Hàm xử lý click vào sản phẩm
  const handleProductClick = (product) => {
    const productId = product.ProductID || product.id;
    if (productId) {
      navigate(`/product/${productId}`);
    }
  };

  // Hàm xóa tất cả bộ lọc
  const clearAllFilters = () => {
    setSelectedCategories([]);
    setFilteredProducts(products);
  };

  return (
    <div className="categories-section">
      <div className="categories-container">
        {/* Header */}
        <div className="categories-header">
          <h2>Phân loại sản phẩm</h2>
          <p>Chọn một hoặc nhiều mục để lọc sản phẩm</p>
        </div>

        {/* Categories Grid */}
        <div className="categories-grid">
          {mainCategories.map((category) => (
            <div
              key={category.id}
              className={`category-card ${selectedCategories.includes(category.id) ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="category-icon">{category.icon}</div>
              <div className="category-content">
                <h3 className="category-name">{category.name}</h3>
                <p className="category-description">{category.description}</p>
                <div className="category-subcategories">
                  {category.subCategories.map((subCat, index) => (
                    <span key={index} className="subcategory-tag">
                      {subCat}
                    </span>
                  ))}
                </div>
                  </div>
              <div className="category-status">
                {selectedCategories.includes(category.id) ? '✓' : '+'}
              </div>
            </div>
          ))}
        </div>

        {/* Filter Controls */}
        <div className="filter-controls">
          <button 
            className="clear-filters-btn"
            onClick={clearAllFilters}
            disabled={selectedCategories.length === 0}
          >
            Xóa tất cả bộ lọc
          </button>
          <div className="active-filters">
            {selectedCategories.length > 0 && (
              <span className="filter-info">
                Đang hiển thị {filteredProducts.length} sản phẩm từ {selectedCategories.length} mục
              </span>
            )}
          </div>
        </div>

        {/* Products Display */}
        {filteredProducts.length > 0 && (
          <div className="filtered-products">
            <h3>Sản phẩm phù hợp ({filteredProducts.length})</h3>
            <div className="products-grid">
              {filteredProducts.slice(0, 12).map((product) => {
                const productId = product.ProductID || product.id;
                const imageUrl = product.MainImage || "/images/products/giay-the-thao-1.jpg";
                const currentPrice = product.Price || 0;
                const originalPrice = product.OriginalPrice || null;
                const discount = product.Discount || 0;

                return (
                  <div
                    key={productId}
                    className="product-card"
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="product-image">
                      <img src={imageUrl} alt={product.Name} />
                      {discount > 0 && (
                        <div className="discount-badge">-{discount}%</div>
                      )}
                    </div>
                    <div className="product-info">
                      <h4 className="product-name">{product.Name}</h4>
                      <div className="product-price">
                        <span className="current-price">
                          {currentPrice.toLocaleString('vi-VN')} ₫
                        </span>
                        {originalPrice && (
                          <span className="original-price">
                            {originalPrice.toLocaleString('vi-VN')} ₫
                          </span>
                        )}
                      </div>
                      <div className="product-categories">
                        {selectedCategories.map(catId => {
                          const cat = mainCategories.find(c => c.id === catId);
                          return cat && isProductInCategory(product, catId) ? (
                            <span key={catId} className="category-tag">
                              {cat.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* No Products Message */}
        {selectedCategories.length > 0 && filteredProducts.length === 0 && (
          <div className="no-products">
            <h3>Không tìm thấy sản phẩm</h3>
            <p>Không có sản phẩm nào phù hợp với các mục đã chọn.</p>
            <button onClick={clearAllFilters} className="clear-filters-btn">
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 

export default CategoriesGrid; 