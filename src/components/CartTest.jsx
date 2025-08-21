import React, { useState, useEffect } from 'react';
import { readCart, addToCart, clearCart } from '../services/cartService';
import { useAuth } from '../contexts/AuthContext';

export default function CartTest() {
  const [cartItems, setCartItems] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const items = readCart();
    console.log('Cart items loaded:', items);
    setCartItems(items);
  };

  const handleAddTestItem = () => {
    if (!currentUser) {
      alert('Vui lòng đăng nhập trước');
      return;
    }

    const testProduct = {
      ProductID: 'test-' + Date.now(),
      Name: 'Sản phẩm test',
      Price: 100000,
      MainImage: '/images/products/giay-the-thao-1.jpg'
    };

    const result = addToCart(testProduct, { quantity: 1 });
    console.log('Add to cart result:', result);
    
    if (result && result.requiresLogin) {
      alert('Yêu cầu đăng nhập');
    } else {
      alert('Đã thêm sản phẩm test vào giỏ hàng');
      loadCart();
    }
  };

  const handleClearCart = () => {
    clearCart();
    loadCart();
    alert('Đã xóa giỏ hàng');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>🧪 Test Giỏ Hàng</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <p><strong>Trạng thái đăng nhập:</strong> {currentUser ? 'Đã đăng nhập' : 'Chưa đăng nhập'}</p>
        <p><strong>User ID:</strong> {currentUser?.uid || 'N/A'}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={handleAddTestItem}
          style={{ 
            padding: '10px 20px', 
            marginRight: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          ➕ Thêm sản phẩm test
        </button>
        
        <button 
          onClick={handleClearCart}
          style={{ 
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          🗑️ Xóa giỏ hàng
        </button>
        
        <button 
          onClick={loadCart}
          style={{ 
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          🔄 Làm mới
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>📦 Giỏ hàng hiện tại ({cartItems.length} sản phẩm):</h3>
        {cartItems.length === 0 ? (
          <p style={{ color: '#6c757d', fontStyle: 'italic' }}>Giỏ hàng trống</p>
        ) : (
          <div>
            {cartItems.map((item, index) => (
              <div 
                key={item.key || index}
                style={{ 
                  border: '1px solid #ddd',
                  padding: '10px',
                  margin: '10px 0',
                  borderRadius: '5px',
                  backgroundColor: '#f8f9fa'
                }}
              >
                <p><strong>Tên:</strong> {item.name}</p>
                <p><strong>Giá:</strong> {item.price?.toLocaleString()} VNĐ</p>
                <p><strong>Số lượng:</strong> {item.quantity}</p>
                <p><strong>Key:</strong> {item.key}</p>
                <p><strong>Product ID:</strong> {item.productId}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>🔍 Debug Info:</h3>
        <p><strong>LocalStorage keys:</strong></p>
        <ul>
          {Object.keys(localStorage).map(key => (
            <li key={key}>
              {key}: {localStorage.getItem(key)?.substring(0, 100)}...
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
