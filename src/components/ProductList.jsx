import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FiltersSidebar from './FiltersSidebar';
import { getProducts } from '../services/productService';
import { formatPrice } from '../utils/formatPrice';
import Pagination from './Pagination';
import SmartImage from './SmartImage';
import './ProductList.css';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('default');
  const [sortOrder, setSortOrder] = useState('asc');
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
        // supported: tag, gender, brand, category, brandName, categoryName, sale, search, sortBy, sortOrder, priceMin, priceMax, discountMin, discountMax
        ['tag', 'gender', 'brand', 'category', 'brandName', 'categoryName', 'sale', 'search', 'sortBy', 'sortOrder', 'priceMin', 'priceMax', 'discountMin', 'discountMax'].forEach((key) => {
          const val = searchParams.get(key);
          if (val !== null && val !== '') params[key] = val;
        });

        // Update sort state from URL params
        if (params.sortBy) {
          setSortBy(params.sortBy);
          setSortOrder(params.sortOrder || 'asc');
        } else {
          setSortBy('default');
          setSortOrder('asc');
        }

        let data = await getProducts(params);
        if (isMounted) {
          // Client-side fallback filter in case backend ignores params or falls back to local JSON
          const tag = (params.tag || '').toLowerCase();
          const genderParam = (params.gender || '').toUpperCase();
          if (Array.isArray(data)) {
            if (genderParam) {
              data = data.filter(p => String(p.Gender || '').toUpperCase() === genderParam);
            } else if (['men','women','kids','sports'].includes(tag)) {
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

  // Get search term from URL for display
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get('search');

  const totalPages = Math.max(1, Math.ceil((products?.length || 0) / PRODUCTS_PER_PAGE));
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const pageItems = (products || []).slice(startIndex, endIndex);

  // Show search results header if searching
  const showSearchHeader = searchTerm && products.length > 0;

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

  const handleSort = (newSortBy, newSortOrder = 'asc') => {
    const searchParams = new URLSearchParams(location.search);
    
    if (newSortBy === 'default') {
      searchParams.delete('sortBy');
      searchParams.delete('sortOrder');
    } else {
      searchParams.set('sortBy', newSortBy);
      searchParams.set('sortOrder', newSortOrder);
    }
    
    // Reset to first page when sorting
    searchParams.delete('page');
    
    navigate(`${location.pathname}?${searchParams.toString()}`);
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

  const normalizePath = (p) => {
    if (!p) return null;
    let path = String(p).replace(/\\/g, '/');
    if (path.startsWith('images/')) path = '/' + path;
    if (!path.startsWith('/')) path = '/' + path;
    return path;
  };

  const slugify = (name) => {
    if (!name) return '';
    return String(name)
      .trim()
      .replace(/[^a-zA-Z0-9\s-]/g, '') // Loại bỏ ký tự đặc biệt
      .replace(/\s+/g, '-') // Thay khoảng trắng bằng dấu gạch ngang
      .replace(/-+/g, '-') // Thay nhiều dấu gạch ngang liên tiếp bằng một dấu
      .replace(/^-|-$/g, ''); // Loại bỏ dấu gạch ngang ở đầu và cuối
  };

  const getMainImage = (product) => {
    const direct = normalizePath(product.ImageURL || product.MainImage);
    if (direct) return direct;
    const slug = slugify(product.Name || product.ProductName || '');
    if (slug) {
      const path = `/images/products/${slug}/1.png`;
      console.log('Product:', product.Name, 'Generated slug:', slug, 'Image path:', path);
      console.log('Available folders:', [
        'Nike-Air-Zoom-Pegasus-40',
        'Adidas-Ultraboost-21',
        'Puma-Cell-King',
        'New-Balance-574'
      ]);
      return path;
    }
    return '/images/products/placeholder.jpg';
  };

  return (
    <section className="products-section" id="products">
      <div className="products-container" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '28px' }}>
        <div style={{ marginTop: 6 }}>
          <FiltersSidebar products={products} />
        </div>
        <div>
          <div className="products-header">
            {searchTerm ? (
              <div className="search-results-header">
                <h2>Kết quả tìm kiếm cho "{searchTerm}"</h2>
                <p>Tìm thấy {products.length} sản phẩm</p>
                <button 
                  className="view-all-btn"
                  onClick={() => navigate('/products')}
                >
                  <i className="fas fa-arrow-left"></i>
                  Xem tất cả sản phẩm
                </button>
              </div>
            ) : (
              <h2>TẤT CẢ SẢN PHẨM</h2>
            )}
            <div className="products-stats">
              <span>Tổng số sản phẩm: {products.length}</span>
              <span>Trang {currentPage} / {totalPages}</span>
            </div>
            <div className="sort-controls">
              <select 
                className="sort-select"
                value={sortBy}
                onChange={(e) => handleSort(e.target.value, sortOrder)}
              >
                <option value="default">Sắp xếp mặc định</option>
                <option value="price">Theo giá</option>
                <option value="discount">Theo giảm giá</option>
                <option value="name">Theo tên</option>
                <option value="rating">Theo đánh giá</option>
              </select>
              {sortBy !== 'default' && (
                <button 
                  className="sort-order-btn"
                  onClick={() => handleSort(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}
                  title={sortOrder === 'asc' ? 'Tăng dần' : 'Giảm dần'}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              )}
            </div>
          </div>
          
          {products.length === 0 ? (
            <div className="no-results">
              {searchTerm ? (
                <>
                  <div className="no-results-icon">🔍</div>
                  <h3>Không tìm thấy sản phẩm nào</h3>
                  <p>Không có sản phẩm nào khớp với từ khóa "{searchTerm}"</p>
                  <button 
                    className="view-all-btn"
                    onClick={() => navigate('/products')}
                  >
                    <i className="fas fa-arrow-left"></i>
                    Xem tất cả sản phẩm
                  </button>
                </>
              ) : (
                <>
                  <div className="no-results-icon">📦</div>
                  <h3>Không có sản phẩm nào</h3>
                  <p>Vui lòng thử lại sau hoặc liên hệ hỗ trợ</p>
                </>
              )}
            </div>
          ) : (
            <div className="products-grid">
              {pageItems.map(product => (
                <div key={product.ProductID || product.id} className="product-card" onClick={() => handleProductClick(product)}>
                  <div className="product-image">
                    <SmartImage 
                      src={getMainImage(product)} 
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
          )}

          {products.length > 0 && totalPages > 1 && (
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
