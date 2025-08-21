import React, { useState, useEffect } from 'react';
import './ManageProducts.css';

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    Name: '',
    Description: '',
    Price: '',
    OriginalPrice: '',
    Discount: '',
    Category: '',
    Brand: '',
    Gender: '',
    Size: '',
    Color: '',
    Rating: '',
    MainImage: '',
    ImageURL: '',
    Tag: '',
    Stock: ''
  });

  const [imageFiles, setImageFiles] = useState({
    mainImage: null,
    additionalImage: null
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error('Failed to load products');
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log('🔄 Submitting product data:', formData);
      
      const url = editingProduct 
        ? `http://localhost:5000/api/products/${editingProduct.ProductID}`
        : 'http://localhost:5000/api/products';
      
      const method = editingProduct ? 'PUT' : 'POST';
      
      // Convert string values to numbers where needed
      const submitData = {
        ...formData,
        Price: parseFloat(formData.Price) || 0,
        OriginalPrice: parseFloat(formData.OriginalPrice) || 0,
        Discount: parseFloat(formData.Discount) || 0,
        Rating: parseFloat(formData.Rating) || 0,
        Stock: parseInt(formData.Stock) || 0
      };
      
      console.log('📤 Sending data to:', url);
      console.log('📦 Submit data:', submitData);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', response.headers);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Success response:', result);
        
        await loadProducts();
        setShowModal(false);
        setEditingProduct(null);
        resetForm();
        alert(editingProduct ? 'Cập nhật sản phẩm thành công!' : 'Thêm sản phẩm thành công!');
      } else {
        const errorText = await response.text();
        console.error('❌ Error response:', response.status, errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          alert(`Lỗi: ${errorData.message || 'Không xác định'}`);
        } catch {
          alert(`Lỗi ${response.status}: ${errorText || response.statusText}`);
        }
      }
    } catch (error) {
      console.error('❌ Error in handleSubmit:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        alert('Không thể kết nối đến server. Vui lòng kiểm tra backend có đang chạy không?');
      } else {
        alert(`Có lỗi xảy ra khi lưu sản phẩm: ${error.message}`);
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      Name: product.Name || '',
      Description: product.Description || '',
      Price: product.Price?.toString() || '',
      OriginalPrice: product.OriginalPrice?.toString() || '',
      Discount: product.Discount?.toString() || '',
      Category: product.Category || '',
      Brand: product.Brand || '',
      Gender: product.Gender || '',
      Size: product.Size || '',
      Color: product.Color || '',
      Rating: product.Rating?.toString() || '',
      MainImage: product.MainImage || '',
      ImageURL: product.ImageURL || '',
      Tag: product.Tag || '',
      Stock: product.Stock?.toString() || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadProducts();
        alert('Xóa sản phẩm thành công!');
      } else {
        const error = await response.json();
        alert(`Lỗi: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Có lỗi xảy ra khi xóa sản phẩm');
    }
  };

  const resetForm = () => {
    setFormData({
      Name: '',
      Description: '',
      Price: '',
      OriginalPrice: '',
      Discount: '',
      Category: '',
      Brand: '',
      Gender: '',
      Size: '',
      Color: '',
      Rating: '',
      MainImage: '',
      ImageURL: '',
      Tag: '',
      Stock: ''
    });
    setImageFiles({ mainImage: null, additionalImage: null });
  };

  const openAddModal = () => {
    setEditingProduct(null);
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    resetForm();
  };

  const formatCurrency = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh hợp lệ!');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File ảnh quá lớn! Vui lòng chọn file nhỏ hơn 5MB.');
        return;
      }

      setImageFiles(prev => ({
        ...prev,
        [type]: file
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        if (type === 'mainImage') {
          setFormData(prev => ({ ...prev, MainImage: e.target.result }));
        } else {
          setFormData(prev => ({ ...prev, ImageURL: e.target.result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (type) => {
    setImageFiles(prev => ({
      ...prev,
      [type]: null
    }));
    
    if (type === 'mainImage') {
      setFormData(prev => ({ ...prev, MainImage: '' }));
    } else {
      setFormData(prev => ({ ...prev, ImageURL: '' }));
    }
  };

  if (loading) {
    return (
      <div className="products-page">
        <div className="loading">Đang tải danh sách sản phẩm...</div>
      </div>
    );
  }

  return (
    <div className="products-page">
      {/* Products Header */}
      <div className="products-header">
        <div className="products-title">
          <div>
            <h1>Quản lý sản phẩm</h1>
            <p className="products-subtitle">Thêm, sửa, xóa thông tin sản phẩm</p>
          </div>
          <div className="products-actions">
            <button className="add-btn" onClick={openAddModal}>
              ➕ Thêm sản phẩm
            </button>
            <button className="refresh-btn" onClick={loadProducts}>
              🔄 Làm mới
            </button>
          </div>
        </div>
      </div>

      {/* Products Summary */}
      <div className="products-summary">
        <div className="summary-item">
          <div className="summary-number">{products.length}</div>
          <div className="summary-label">Tổng sản phẩm</div>
        </div>
        <div className="summary-item">
          <div className="summary-number">
            {products.filter(p => p.Category === 'Sports').length}
          </div>
          <div className="summary-label">Giày thể thao</div>
        </div>
        <div className="summary-item">
          <div className="summary-number">
            {products.filter(p => p.Price > 0).length}
          </div>
          <div className="summary-label">Có giá</div>
        </div>
        <div className="summary-item">
          <div className="summary-number">
            {products.filter(p => p.Stock > 0).length}
          </div>
          <div className="summary-label">Còn hàng</div>
        </div>
      </div>

      {/* Products Table */}
      <div className="products-table">
        <div className="table-header">
          <h3>Danh sách sản phẩm</h3>
        </div>
        <div className="table-content">
          {products.length === 0 ? (
            <div className="no-products">
              <div className="no-products-icon">🛍️</div>
              <h3>Không có sản phẩm nào</h3>
              <p>Hãy thêm sản phẩm đầu tiên</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Hình ảnh</th>
                  <th>Thông tin</th>
                  <th>Giá cả</th>
                  <th>Phân loại</th>
                  <th>Tồn kho</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.ProductID}>
                    <td>
                      <div className="product-image">
                        {product.MainImage || product.ImageURL ? (
                          <img 
                            src={product.MainImage || product.ImageURL} 
                            alt={product.Name}
                            onError={(e) => {
                              e.target.src = '/images/products/giay-the-thao-1.jpg';
                            }}
                          />
                        ) : (
                          <div className="image-placeholder">
                            🖼️
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="product-info">
                        <div className="product-name">{product.Name}</div>
                        <small>{product.Brand || 'N/A'}</small>
                        {product.Description && (
                          <div className="product-description">
                            {product.Description.length > 50 
                              ? `${product.Description.substring(0, 50)}...` 
                              : product.Description
                            }
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="price-info">
                        <div className="current-price">
                          {formatCurrency(product.Price || 0)}
                        </div>
                        {product.OriginalPrice > product.Price && (
                          <small className="original-price">
                            {formatCurrency(product.OriginalPrice)}
                          </small>
                        )}
                        {product.Discount > 0 && (
                          <div className="discount-badge">
                            -{product.Discount}%
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="category-info">
                        <div className="category">{product.Category || 'N/A'}</div>
                        <small>{product.Gender || 'N/A'}</small>
                        {product.Tag && <div className="tag">{product.Tag}</div>}
                      </div>
                    </td>
                    <td>
                      <div className="stock-info">
                        <div className={`stock-status ${product.Stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                          {product.Stock > 0 ? `${product.Stock} cái` : 'Hết hàng'}
                        </div>
                        <div className="rating">
                          ⭐ {product.Rating || 0}/5
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-edit"
                          onClick={() => handleEdit(product)}
                        >
                          ✏️ Sửa
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(product.ProductID)}
                        >
                          🗑️ Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
              </h3>
              <button className="btn-close" onClick={closeModal}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="Name">Tên sản phẩm *</label>
                  <input
                    type="text"
                    id="Name"
                    value={formData.Name}
                    onChange={(e) => setFormData({...formData, Name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="Brand">Thương hiệu</label>
                  <input
                    type="text"
                    id="Brand"
                    value={formData.Brand}
                    onChange={(e) => setFormData({...formData, Brand: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="Price">Giá hiện tại *</label>
                  <input
                    type="number"
                    id="Price"
                    value={formData.Price}
                    onChange={(e) => setFormData({...formData, Price: e.target.value})}
                    required
                    min="0"
                    step="1000"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="OriginalPrice">Giá gốc</label>
                  <input
                    type="number"
                    id="OriginalPrice"
                    value={formData.OriginalPrice}
                    onChange={(e) => setFormData({...formData, OriginalPrice: e.target.value})}
                    min="0"
                    step="1000"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="Discount">Giảm giá (%)</label>
                  <input
                    type="number"
                    id="Discount"
                    value={formData.Discount}
                    onChange={(e) => setFormData({...formData, Discount: e.target.value})}
                    min="0"
                    max="100"
                    step="1"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="Stock">Số lượng tồn kho</label>
                  <input
                    type="number"
                    id="Stock"
                    value={formData.Stock}
                    onChange={(e) => setFormData({...formData, Stock: e.target.value})}
                    min="0"
                    step="1"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="Category">Danh mục</label>
                  <select
                    id="Category"
                    value={formData.Category}
                    onChange={(e) => setFormData({...formData, Category: e.target.value})}
                  >
                    <option value="">Chọn danh mục</option>
                    <option value="Sports">Thể thao</option>
                    <option value="Casual">Giày thường</option>
                    <option value="Formal">Giày công sở</option>
                    <option value="Boots">Giày bốt</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="Gender">Giới tính</label>
                  <select
                    id="Gender"
                    value={formData.Gender}
                    onChange={(e) => setFormData({...formData, Gender: e.target.value})}
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="Men">Nam</option>
                    <option value="Women">Nữ</option>
                    <option value="Kids">Trẻ em</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="Size">Kích thước</label>
                  <input
                    type="text"
                    id="Size"
                    value={formData.Size}
                    onChange={(e) => setFormData({...formData, Size: e.target.value})}
                    placeholder="35, 36, 37, 38, 39, 40, 41, 42, 43, 44"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="Color">Màu sắc</label>
                  <input
                    type="text"
                    id="Color"
                    value={formData.Color}
                    onChange={(e) => setFormData({...formData, Color: e.target.value})}
                    placeholder="Đen, Trắng, Xanh, Đỏ..."
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="Rating">Đánh giá (0-5)</label>
                  <input
                    type="number"
                    id="Rating"
                    value={formData.Rating}
                    onChange={(e) => setFormData({...formData, Rating: e.target.value})}
                    min="0"
                    max="5"
                    step="0.1"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="Tag">Tag</label>
                  <input
                    type="text"
                    id="Tag"
                    value={formData.Tag}
                    onChange={(e) => setFormData({...formData, Tag: e.target.value})}
                    placeholder="Nike, Adidas, Running, Basketball..."
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="MainImage">Hình ảnh chính</label>
                  <div className="image-upload-container">
                    {formData.MainImage ? (
                      <div className="image-preview">
                        <img src={formData.MainImage} alt="Preview" />
                        <button 
                          type="button" 
                          className="remove-image-btn"
                          onClick={() => removeImage('mainImage')}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="upload-area">
                        <input
                          type="file"
                          id="mainImageFile"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'mainImage')}
                          style={{ display: 'none' }}
                        />
                        <label htmlFor="mainImageFile" className="upload-label">
                          <span className="upload-icon">📷</span>
                          <span>Tải ảnh lên</span>
                          <small>JPG, PNG, GIF (max 5MB)</small>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="ImageURL">Hình ảnh phụ</label>
                  <div className="image-upload-container">
                    {formData.ImageURL ? (
                      <div className="image-preview">
                        <img src={formData.ImageURL} alt="Preview" />
                        <button 
                          type="button" 
                          className="remove-image-btn"
                          onClick={() => removeImage('additionalImage')}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="upload-area">
                        <input
                          type="file"
                          id="additionalImageFile"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'additionalImage')}
                          style={{ display: 'none' }}
                        />
                        <label htmlFor="additionalImageFile" className="upload-label">
                          <span className="upload-icon">📷</span>
                          <span>Tải ảnh lên</span>
                          <small>JPG, PNG, GIF (max 5MB)</small>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <label htmlFor="Description">Mô tả sản phẩm</label>
                  <textarea
                    id="Description"
                    value={formData.Description}
                    onChange={(e) => setFormData({...formData, Description: e.target.value})}
                    rows="4"
                    placeholder="Mô tả chi tiết về sản phẩm..."
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>
                  Hủy
                </button>
                <button type="submit" className="btn-save">
                  {editingProduct ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
