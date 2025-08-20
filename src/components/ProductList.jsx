import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FiltersSidebar from './FiltersSidebar';
import { getProducts } from '../services/productService';
import { formatPrice } from '../utils/formatPrice';
import Pagination from './Pagination';
import './ProductList.css';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();

  const PRODUCTS_PER_PAGE = 12; // 4 x 3 layout

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        // Parse query params from URL and pass through to backend
        const searchParams = new URLSearchParams(location.search);
        const params = {};
        // supported: tag, gender, brand, category, brandName, categoryName, sale
        ['tag', 'gender', 'brand', 'category', 'brandName', 'categoryName', 'sale'].forEach((key) => {
          const val = searchParams.get(key);
          if (val !== null && val !== '') params[key] = val;
        });

        let data = await getProducts(params);
        if (isMounted) {
          // Client-side fallback filter in case backend ignores params or falls back to local JSON
          const tag = (params.tag || '').toLowerCase();
          const genderParam = (params.gender || '').toUpperCase();
          if (Array.isArray(data)) {
            if (genderParam) {
              data = data.filter(p => String(p.Gender || '').toUpperCase() === genderParam);
            } else if (['men','women','kids'].includes(tag)) {
              data = data.filter(p => String(p.Gender || '').toUpperCase() === tag.toUpperCase());
            }
          }
          setProducts(Array.isArray(data) ? data : []);
          setCurrentPage(1);
        }
      } catch (err) {
        if (isMounted) setError(err.message || "Không thể tải sản phẩm");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [location.search]);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Đang tải sản phẩm...</p>
      </div>
    );
  }

  if (error) {
    return <div style={{ color: "red", textAlign: "center", padding: "20px" }}>Lỗi: {error}</div>;
  }

  const totalPages = Math.max(1, Math.ceil((products?.length || 0) / PRODUCTS_PER_PAGE));
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const pageItems = (products || []).slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleProductClick = (product) => {
    const productId = product.ProductID || product.id;
    if (productId) {
      navigate(`/product/${productId}`);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<i key={i} className="fas fa-star filled"></i>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<i key={i} className="fas fa-star-half-alt half-filled"></i>);
      } else {
        stars.push(<i key={i} className="fas fa-star empty"></i>);
      }
    }
    return stars;
  };

  return (
    <section className="products-section" id="products">
      <div className="products-container" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '20px' }}>
        <div>
          <FiltersSidebar products={products} />
        </div>
        <div>
        <div className="products-header">
          <h2>TẤT CẢ SẢN PHẨM</h2>
          <div className="products-stats">
            <span>Tổng số sản phẩm: {products.length}</span>
            <span>Trang {currentPage} / {totalPages}</span>
          </div>
          <button className="filter-sort-btn">
            <i className="fas fa-filter"></i>
            Lọc & Sắp xếp
          </button>
        </div>
        
        <div className="products-grid">
          {pageItems.map(product => (
            <div key={product.ProductID || product.id} className="product-card" onClick={() => handleProductClick(product)}>
              <div className="product-image">
                <img 
                  src={product.ImageURL || product.MainImage || '/images/products/placeholder.jpg'} 
                  alt={product.Name}
                  className="product-image"
                />
                {product.Discount > 0 && (
                  <div className="discount-badge">
                    -{product.Discount}%
                  </div>
                )}
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.Name}</h3>
                <div className="product-rating">
                  {renderStars(product.Rating || 4.5)}
                  <span className="rating-text">({product.Rating || 4.5})</span>
                </div>
                <div className="product-price">
                  <span className="current-price">{formatPrice(product.Price)}</span>
                  {product.OriginalPrice > product.Price && (
                    <span className="original-price">{formatPrice(product.OriginalPrice)}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
        </div>
      </div>
    </section>
  );
}

export default ProductList;
