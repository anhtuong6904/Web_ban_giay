import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Pagination from './Pagination';
import './ProductList.css';

export default function ProductList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12); // 4 hàng × 3 sản phẩm = 12

  const products = [
    {
      id: 1,
      Name: "Giày Thể Thao UTH Shoes Helio Teen Nam",
      MainImage: "/images/products/giay-the-thao-helio-teen-nam-den-main.jpg",
      Price: 595000,
      OriginalPrice: 750000,
      Discount: 21,
      Category: "Giày thể thao",
      Brand: "UTH Shoes",
      Colors: ["Đen", "Trắng", "Xanh"]
    },
    {
      id: 2,
      Name: "Giày Chạy Bộ UTH Shoes Runner Pro",
      MainImage: "/images/products/giay-chay-bo-runner-pro-main.jpg",
      Price: 850000,
      OriginalPrice: 1000000,
      Discount: 15,
      Category: "Giày chạy bộ",
      Brand: "UTH Shoes",
      Colors: ["Xanh dương", "Đỏ", "Đen"]
    },
    {
      id: 3,
      Name: "Giày Đá Banh UTH Shoes Football Elite",
      MainImage: "/images/products/giay-da-banh-football-elite-main.jpg",
      Price: 1200000,
      OriginalPrice: 1500000,
      Discount: 20,
      Category: "Giày đá banh",
      Brand: "UTH Shoes",
      Colors: ["Trắng", "Đen", "Vàng"]
    },
    {
      id: 4,
      Name: "Giày Tây UTH Shoes Business Classic",
      MainImage: "/images/products/giay-tay-business-classic-main.jpg",
      Price: 950000,
      OriginalPrice: 1200000,
      Discount: 21,
      Category: "Giày tây",
      Brand: "UTH Shoes",
      Colors: ["Đen", "Nâu", "Xanh đen"]
    },
    {
      id: 5,
      Name: "Dép UTH Shoes Comfort Slide",
      MainImage: "/images/products/dep-comfort-slide-main.jpg",
      Price: 250000,
      OriginalPrice: 350000,
      Discount: 29,
      Category: "Dép",
      Brand: "UTH Shoes",
      Colors: ["Đen", "Trắng", "Xanh"]
    },
    {
      id: 6,
      Name: "Giày Búp Bê UTH Shoes Princess",
      MainImage: "/images/products/giay-bup-be-princess-main.jpg",
      Price: 450000,
      OriginalPrice: 600000,
      Discount: 25,
      Category: "Giày búp bê",
      Brand: "UTH Shoes",
      Colors: ["Hồng", "Trắng", "Đỏ"]
    },
    // Thêm nhiều sản phẩm hơn để demo phân trang
    {
      id: 7,
      Name: "Giày Thể Thao UTH Shoes Helio Teen Nam",
      MainImage: "/images/products/giay-the-thao-helio-teen-nam-den-main.jpg",
      Price: 595000,
      OriginalPrice: 750000,
      Discount: 21,
      Category: "Giày thể thao",
      Brand: "UTH Shoes",
      Colors: ["Đen", "Trắng", "Xanh"]
    },
    {
      id: 8,
      Name: "Giày Chạy Bộ UTH Shoes Runner Pro",
      MainImage: "/images/products/giay-chay-bo-runner-pro-main.jpg",
      Price: 850000,
      OriginalPrice: 1000000,
      Discount: 15,
      Category: "Giày chạy bộ",
      Brand: "UTH Shoes",
      Colors: ["Xanh dương", "Đỏ", "Đen"]
    },
    {
      id: 9,
      Name: "Giày Đá Banh UTH Shoes Football Elite",
      MainImage: "/images/products/giay-da-banh-football-elite-main.jpg",
      Price: 1200000,
      OriginalPrice: 1500000,
      Discount: 20,
      Category: "Giày đá banh",
      Brand: "UTH Shoes",
      Colors: ["Trắng", "Đen", "Vàng"]
    },
    {
      id: 10,
      Name: "Giày Tây UTH Shoes Business Classic",
      MainImage: "/images/products/giay-tay-business-classic-main.jpg",
      Price: 950000,
      OriginalPrice: 1200000,
      Discount: 21,
      Category: "Giày tây",
      Brand: "UTH Shoes",
      Colors: ["Đen", "Nâu", "Xanh đen"]
    },
    {
      id: 11,
      Name: "Dép UTH Shoes Comfort Slide",
      MainImage: "/images/products/dep-comfort-slide-main.jpg",
      Price: 250000,
      OriginalPrice: 350000,
      Discount: 29,
      Category: "Dép",
      Brand: "UTH Shoes",
      Colors: ["Đen", "Trắng", "Xanh"]
    },
    {
      id: 12,
      Name: "Giày Búp Bê UTH Shoes Princess",
      MainImage: "/images/products/giay-bup-be-princess-main.jpg",
      Price: 450000,
      OriginalPrice: 600000,
      Discount: 25,
      Category: "Giày búp bê",
      Brand: "UTH Shoes",
      Colors: ["Hồng", "Trắng", "Đỏ"]
    },
    // Thêm sản phẩm để có ít nhất 2 trang
    {
      id: 13,
      Name: "Giày Thể Thao UTH Shoes Helio Teen Nam",
      MainImage: "/images/products/giay-the-thao-helio-teen-nam-den-main.jpg",
      Price: 595000,
      OriginalPrice: 750000,
      Discount: 21,
      Category: "Giày thể thao",
      Brand: "UTH Shoes",
      Colors: ["Đen", "Trắng", "Xanh"]
    },
    {
      id: 14,
      Name: "Giày Chạy Bộ UTH Shoes Runner Pro",
      MainImage: "/images/products/giay-chay-bo-runner-pro-main.jpg",
      Price: 850000,
      OriginalPrice: 1000000,
      Discount: 15,
      Category: "Giày chạy bộ",
      Brand: "UTH Shoes",
      Colors: ["Xanh dương", "Đỏ", "Đen"]
    },
    {
      id: 15,
      Name: "Giày Đá Banh UTH Shoes Football Elite",
      MainImage: "/images/products/giay-da-banh-football-elite-main.jpg",
      Price: 1200000,
      OriginalPrice: 1500000,
      Discount: 20,
      Category: "Giày đá banh",
      Brand: "UTH Shoes",
      Colors: ["Trắng", "Đen", "Vàng"]
    },
    {
      id: 16,
      Name: "Giày Tây UTH Shoes Business Classic",
      MainImage: "/images/products/giay-tay-business-classic-main.jpg",
      Price: 950000,
      OriginalPrice: 1200000,
      Discount: 21,
      Category: "Giày tây",
      Brand: "UTH Shoes",
      Colors: ["Đen", "Nâu", "Xanh đen"]
    },
    {
      id: 17,
      Name: "Dép UTH Shoes Comfort Slide",
      MainImage: "/images/products/dep-comfort-slide-main.jpg",
      Price: 250000,
      OriginalPrice: 350000,
      Discount: 29,
      Category: "Dép",
      Brand: "UTH Shoes",
      Colors: ["Đen", "Trắng", "Xanh"]
    },
    {
      id: 18,
      Name: "Giày Búp Bê UTH Shoes Princess",
      MainImage: "/images/products/giay-bup-be-princess-main.jpg",
      Price: 450000,
      OriginalPrice: 600000,
      Discount: 25,
      Category: "Giày búp bê",
      Brand: "UTH Shoes",
      Colors: ["Hồng", "Trắng", "Đỏ"]
    }
  ];

  // Tính toán phân trang
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Xử lý thay đổi trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top khi chuyển trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset về trang 1 khi products thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [products]);

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + ' ₫';
  };

  return (
    <section className="products-section" id="products">
      <div className="products-container">
        <div className="products-header">
          <h2>Sản phẩm nổi bật</h2>
          <button className="filter-sort-btn">
            <i className="fas fa-filter"></i>
            Lọc & Sắp xếp
          </button>
        </div>

        <div className="products-grid">
          {currentProducts.map((product) => (
            <div key={product.id} className="product-card">
              <Link to={`/product/${product.id}`} className="product-card-link">
                <div className="product-image-container">
                  <img
                    src={product.MainImage}
                    alt={product.Name}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div
                    className="product-image-placeholder"
                    style={{
                      display: 'none',
                      width: '100%',
                      height: '200px',
                      backgroundColor: '#f8f9fa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#6c757d',
                      fontSize: '14px'
                    }}
                  >
                    <i className="fas fa-image" style={{ fontSize: '24px', marginRight: '8px' }}></i>
                    {product.Name}
                  </div>
                  
                  {product.Discount > 0 && (
                    <div className="discount-badge">
                      -{product.Discount}%
                    </div>
                  )}
                </div>

                <div className="product-info">
                  <div className="product-category">{product.Category}</div>
                  <h3 className="product-name">{product.Name}</h3>
                  <div className="product-brand">{product.Brand}</div>
                  
                  <div className="product-price">
                    <span className="current-price">{formatPrice(product.Price)}</span>
                    {product.OriginalPrice > product.Price && (
                      <span className="original-price">{formatPrice(product.OriginalPrice)}</span>
                    )}
                  </div>
                  
                  <div className="product-colors">
                    {product.Colors.slice(0, 3).join(', ')}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Component phân trang */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalProducts={products.length}
          productsPerPage={productsPerPage}
        />
      </div>
    </section>
  );
}
