import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../services/productService";
import { formatPrice } from "../utils/formatPrice";
import Pagination from "./Pagination";
import "./ProductList.css";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const PRODUCTS_PER_PAGE = 12; // 4 x 3 layout

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await getProducts();
        if (isMounted) {
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
  }, []);

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
    <section className="products-section">
      <div className="products-container">
        <div className="products-header">
          <h2>Sản phẩm mới</h2>
          <button className="filter-sort-btn">
            <i className="fas fa-sliders-h" />
            Lọc & Sắp xếp
          </button>
        </div>

        {loading ? (
          <div className="loading">
            <div className="loading-spinner" />
            <p>Đang tải sản phẩm...</p>
          </div>
        ) : (
          <>
            <div className="products-grid">
              {pageItems.map((product) => {
                const productId = product.ProductID || product.id || `${product.Name}-${Math.random()}`;
                const imageUrl = product.MainImage || "/images/products/giay-the-thao-1.jpg";
                const currentPrice = typeof product.Price === "number" ? product.Price : 0;
                const originalPrice = typeof product.OriginalPrice === "number" ? product.OriginalPrice : null;
                const discount = typeof product.Discount === "number" ? product.Discount : 0;
                const rating = product.Rating || 4.5;
                const reviewCount = product.ReviewCount || 0;
                const isNew = product.IsNew || false;
                const isHot = product.IsHot || false;
                const isSale = discount > 0;

                return (
                  <article key={productId} className="product-card" onClick={() => handleProductClick(product)}>
                    {/* Banner khuyến mãi */}
                    {isNew && (
                      <div className="promo-banner new">
                        <span>MỚI</span>
                      </div>
                    )}
                    {isHot && (
                      <div className="promo-banner hot">
                        <span>HOT</span>
                      </div>
                    )}
                    
                    {/* Tag giảm giá */}
                    {isSale && (
                      <div className="discount-badge">
                        -{discount}%
                      </div>
                    )}

                    {/* Banner khuyến mãi chính */}
                    <div className="main-promo-banner">
                      <div className="promo-text">
                        <span className="promo-main">TẬP HẾT SỨC</span>
                        <span className="promo-sub">TỎA SÁNG</span>
                        <span className="promo-sub">HẾT MÌNH</span>
                      </div>
                    </div>

                    <div className="product-image">
                      {imageUrl ? (
                        <img src={imageUrl} alt={product.Name || "Sản phẩm"} />
                      ) : (
                        <div className="product-image-placeholder">Chưa có ảnh</div>
                      )}
                    </div>
                    
                    <div className="product-info">
                      {/* Tag độc quyền online */}
                      <div className="exclusive-tag">
                        <span>ĐỘC QUYỀN</span>
                        <span>ONLINE</span>
                      </div>

                      {/* Banner khuyến mãi dưới */}
                      <div className="bottom-promo-banner">
                        <div className="promo-dates">20.08 - 26.08</div>
                        <div className="promo-offer">MUA 2 GIẢM THÊM 20%</div>
                      </div>

                      {/* Thông tin sản phẩm */}
                      <div className="product-details">
                        {/* Màu sắc */}
                        <div className="color-options">
                          <div className="color-swatch active" style={{ backgroundColor: '#FFB6C1' }}></div>
                          <div className="color-swatch" style={{ backgroundColor: '#333' }}></div>
                        </div>

                        {/* Tên sản phẩm */}
                        <div className="product-name">{product.Name}</div>

                        {/* Đánh giá sao */}
                        <div className="product-rating">
                          <div className="stars">
                            {renderStars(rating)}
                          </div>
                          <span className="review-count">{reviewCount} đánh giá</span>
                        </div>

                        {/* Giá cả */}
                        <div className="product-price">
                          <span className="current-price">{formatPrice(currentPrice)}</span>
                          {originalPrice && (
                            <span className="original-price">{formatPrice(originalPrice)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalProducts={products?.length || 0}
              productsPerPage={PRODUCTS_PER_PAGE}
            />
          </>
        )}
      </div>
    </section>
  );
}

export default ProductList;
