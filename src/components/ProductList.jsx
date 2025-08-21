import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { getProducts } from "../services/productService";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";
import FiltersSidebar from "./FiltersSidebar";
import "./ProductList.css";

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

  const handleSort = (newSortBy) => {
    let newSortOrder = 'asc';
    
    // If clicking the same sort field, toggle order
    if (newSortBy === sortBy) {
      newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    }
    
    // Update URL params
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('sortBy', newSortBy);
    searchParams.set('sortOrder', newSortOrder);
    
    // Navigate to update URL
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  return (
    <div className="product-list-container">
      <div className="product-list-header">
        <h1>Sản phẩm</h1>
        
        {/* Search Results Header */}
        {showSearchHeader && (
          <div className="search-results-header">
            <h2>Kết quả tìm kiếm cho "{searchTerm}"</h2>
            <p>Tìm thấy {products.length} sản phẩm</p>
            <Link to="/products" className="view-all-btn">Xem tất cả sản phẩm</Link>
          </div>
        )}

        {/* Sort Controls */}
        <div className="sort-controls">
          <select 
            value={sortBy} 
            onChange={(e) => handleSort(e.target.value)}
            className="sort-select"
          >
            <option value="default">Sắp xếp mặc định</option>
            <option value="price">Theo giá</option>
            <option value="discount">Theo giảm giá</option>
            <option value="name">Theo tên</option>
            <option value="rating">Theo đánh giá</option>
          </select>
          
          <button 
            onClick={() => handleSort(sortBy)}
            className="sort-order-btn"
            title={`Sắp xếp ${sortOrder === 'asc' ? 'tăng dần' : 'giảm dần'}`}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      <div className="product-list-content">
        <FiltersSidebar />
        
        <div className="products-section">
          {products.length === 0 ? (
            <div className="no-results">
              {searchTerm ? (
                <>
                  <h3>Không tìm thấy sản phẩm</h3>
                  <p>Không có sản phẩm nào phù hợp với từ khóa "{searchTerm}"</p>
                  <Link to="/products" className="view-all-btn">Xem tất cả sản phẩm</Link>
                </>
              ) : (
                <>
                  <h3>Không có sản phẩm</h3>
                  <p>Không có sản phẩm nào phù hợp với bộ lọc hiện tại</p>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="products-grid">
                {pageItems.map((product) => (
                  <ProductCard
                    key={product.ProductID || product.id}
                    product={product}
                    onClick={() => handleProductClick(product)}
                  />
                ))}
              </div>
              
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductList;
