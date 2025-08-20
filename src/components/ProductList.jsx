import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Pagination from './Pagination';
import './ProductList.css';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Server error: " + res.status);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setError("API did not return an array");
        }
        console.log("Products fetched:", data);
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div style={{color: "red"}}>Error: {error}</div>;

  // Tính toán phân trang
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Xử lý thay đổi trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Không scroll to top để giữ nguyên vị trí của người dùng
  };

  // Reset về trang 1 khi products thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [products]);

  return (
    <section className="products-section" id="products">
      <div className="products-container">
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
          {currentProducts.map(product => (
            <div key={product.ProductID} className="product-card">
              <Link to={`/product/${product.ProductID}`}>
                <img 
                  src={product.ImageURL || '/images/products/placeholder.jpg'} 
                  alt={product.Name}
                  className="product-image"
                />
                <div className="product-info">
                  <h3 className="product-name">{product.Name}</h3>
                  <p className="product-price">{product.Price?.toLocaleString('vi-VN')} VNĐ</p>
                </div>
              </Link>
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
    </section>
  );
}

export default ProductList;
