import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { IoHeart, IoHeartOutline, IoShareSocial, IoLocation, IoTime, IoCall, IoMail, IoArrowBack, IoArrowForward } from 'react-icons/io5';
import { getProductById, getProducts } from '../services/productService';
import './ProductDetail.css';
import { addToCart, setCheckoutItems } from '../services/cartService';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const relatedProductsRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        console.log('Fetching product with ID:', id);
        const productData = await getProductById(id);
        console.log('Product data received:', productData);
        setProduct(productData);
        
        // Set default color nếu có
        if (productData.Colors && productData.Colors.length > 0) {
          setSelectedColor(productData.Colors[0]);
        }
      } catch (err) {
        console.error('Lỗi khi lấy thông tin sản phẩm:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Cuộn lên đầu trang khi product ID thay đổi
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Fetch related products
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const allProducts = await getProducts();
        // Lọc ra 5 sản phẩm khác với sản phẩm hiện tại
        const filtered = allProducts.filter(p => 
          (p.ProductID || p.id) !== (product?.ProductID || product?.id)
        );
        // Lấy 5 sản phẩm đầu tiên
        setRelatedProducts(filtered.slice(0, 5));
      } catch (error) {
        console.error('Lỗi khi tải sản phẩm liên quan:', error);
        // Fallback: tạo 5 sản phẩm mẫu
        setRelatedProducts([
          {
            id: 101,
            Name: "Giày Thể Thao UTH Shoes Runner Pro",
            MainImage: "/images/products/giay-the-thao-2.jpg",
            Price: 850000,
            OriginalPrice: 1000000,
            Discount: 15
          },
          {
            id: 102,
            Name: "Giày Thể Thao UTH Shoes Air Max",
            MainImage: "/images/products/giay-the-thao-3.jpg",
            Price: 950000,
            OriginalPrice: 1200000,
            Discount: 20
          },
          {
            id: 103,
            Name: "Giày Thể Thao UTH Shoes Ultra Boost",
            MainImage: "/images/products/giay-the-thao-1.jpg",
            Price: 750000,
            OriginalPrice: 900000,
            Discount: 16
          },
          {
            id: 104,
            Name: "Giày Thể Thao UTH Shoes Zoom",
            MainImage: "/images/products/giay-the-thao-2.jpg",
            Price: 800000,
            OriginalPrice: 1000000,
            Discount: 20
          },
          {
            id: 105,
            Name: "Giày Thể Thao UTH Shoes React",
            MainImage: "/images/products/giay-the-thao-3.jpg",
            Price: 900000,
            OriginalPrice: 1100000,
            Discount: 18
          }
        ]);
      }
    };

    if (product) {
      fetchRelatedProducts();
    }
  }, [product]);

  // Tự động scroll lên đầu trang khi component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Reset selectedImageIndex khi sản phẩm thay đổi
    setSelectedImageIndex(0);
  }, [id]); // Thêm id vào dependency array

  // Thông tin người dùng đăng nhập (lấy từ localStorage hoặc context)
  const getCurrentUser = () => {
    // Thử lấy từ localStorage trước
    const userFromStorage = localStorage.getItem('currentUser');
    if (userFromStorage) {
      try {
        const user = JSON.parse(userFromStorage);
        return {
          ...user,
          avatar: generateAvatar(user.name || user.displayName || user.email)
        };
      } catch (e) {
        console.log('Không thể parse user từ localStorage');
      }
    }
    
    // Nếu không có trong localStorage, thử lấy từ sessionStorage
    const userFromSession = sessionStorage.getItem('currentUser');
    if (userFromSession) {
      try {
        const user = JSON.parse(userFromSession);
        return {
          ...user,
          avatar: generateAvatar(user.name || user.displayName || user.email)
        };
      } catch (e) {
        console.log('Không thể parse user từ sessionStorage');
      }
    }
    
    // Fallback: trả về thông tin mặc định
    return {
      name: "Khách",
      avatar: "https://via.placeholder.com/40x40/95a5a6/ffffff?text=K"
    };
  };

  // Hàm tạo avatar tự động dựa trên tên
  const generateAvatar = (name) => {
    if (!name) return "https://via.placeholder.com/40x40/95a5a6/ffffff?text=K";
    
    // Lấy chữ cái đầu tiên của tên
    const firstLetter = name.charAt(0).toUpperCase();
    
    // Tạo màu ngẫu nhiên dựa trên tên (để avatar luôn nhất quán với cùng một tên)
    const colors = [
      '#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6',
      '#1abc9c', '#34495e', '#e67e22', '#16a085', '#8e44ad'
    ];
    
    const colorIndex = name.charCodeAt(0) % colors.length;
    const backgroundColor = colors[colorIndex];
    
    return `https://via.placeholder.com/40x40/${backgroundColor.replace('#', '')}/ffffff?text=${firstLetter}`;
  };

  const currentUser = getCurrentUser();

  // Dữ liệu bình luận mẫu
  const sampleComments = [
    {
      id: 1,
      user: "Nguyễn Văn A",
      avatar: "https://via.placeholder.com/40x40/3498db/ffffff?text=NV",
      rating: 5,
      date: "15/08/2024",
      comment: "Giày rất đẹp và thoải mái! Chất lượng tốt, đúng như mô tả. Giao hàng nhanh, đóng gói cẩn thận. Sẽ mua thêm sản phẩm khác của UTH Shoes.",
      likes: 12,
      verified: true
    },
    {
      id: 2,
      user: "Trần Thị B",
      avatar: "https://via.placeholder.com/40x40/e74c3c/ffffff?text=TT",
      rating: 4,
      date: "12/08/2024",
      comment: "Giày đẹp, form ôm chân tốt. Size vừa vặn, đi rất thoải mái. Chỉ hơi tiếc là màu sắc hơi khác so với ảnh một chút, nhưng nhìn chung rất hài lòng!",
      likes: 8,
      verified: true
    },
    {
      id: 3,
      user: "Lê Văn C",
      avatar: "https://via.placeholder.com/40x40/2ecc71/ffffff?text=LV",
      rating: 5,
      date: "10/08/2024",
      comment: "Sản phẩm chất lượng cao, giá cả hợp lý. Nhân viên tư vấn nhiệt tình, giao hàng đúng hẹn. Đây là lần thứ 3 tôi mua giày của UTH Shoes.",
      likes: 15,
      verified: true
    },
    {
      id: 4,
      user: "Phạm Thị D",
      avatar: "https://via.placeholder.com/40x40/f39c12/ffffff?text=PT",
      rating: 4,
      date: "08/08/2024",
      comment: "Giày đẹp, đi thoải mái. Tuy nhiên size hơi nhỏ so với bình thường, nên mua size lớn hơn 1 size. Chất lượng tốt, đáng mua!",
      likes: 6,
      verified: false
    },
    {
      id: 5,
      user: "Hoàng Văn E",
      avatar: "https://via.placeholder.com/40x40/9b59b6/ffffff?text=HV",
      rating: 5,
      date: "05/08/2024",
      comment: "Sản phẩm tuyệt vời! Thiết kế đẹp, chất liệu tốt, đi rất êm chân. Giao hàng nhanh, đóng gói đẹp. Chắc chắn sẽ giới thiệu cho bạn bè.",
      likes: 20,
      verified: true
    }
  ];

  const [comments, setComments] = useState(sampleComments);

  // Xử lý khi không tìm thấy sản phẩm
  if (error) {
    return (
      <div className="product-detail">
        <div className="product-detail-container">
          <div className="error-message">
            <h2>Không tìm thấy sản phẩm</h2>
            <p>{error}</p>
            <button onClick={() => navigate('/')} className="btn-back">
              Quay về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading || !product) {
    return (
      <div className="product-detail">
        <div className="product-detail-container">
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Đang tải thông tin sản phẩm...</p>
          </div>
        </div>
      </div>
    );
  }

  // Tạo danh sách ảnh từ dữ liệu sản phẩm (ưu tiên MainImage, ThumbnailImages, DetailImages)
  const buildProductImages = (p) => {
    const images = [];

    if (p.MainImage) {
      images.push(p.MainImage);
    }

    const addFromField = (fieldValue) => {
      if (!fieldValue) return;
      let arr = [];
      if (Array.isArray(fieldValue)) {
        arr = fieldValue;
      } else if (typeof fieldValue === 'string') {
        try {
          arr = JSON.parse(fieldValue);
          if (!Array.isArray(arr)) arr = [];
        } catch (e) {
          // Hỗ trợ định dạng phân tách bằng dấu phẩy
          arr = fieldValue.split(',').map(s => s.trim()).filter(Boolean);
        }
      }
      arr.forEach((uri) => {
        if (uri && !images.includes(uri)) {
          images.push(uri);
        }
      });
    };

    addFromField(p.ThumbnailImages);
    addFromField(p.DetailImages);

    // Fallback: nếu chỉ có 1 ảnh và đúng chuẩn thư mục /images/products/<slug>/1.png
    if (images.length <= 1 && p.MainImage) {
      const match = p.MainImage.match(/\/images\/products\/([^/]+)\/\d+\.png$/);
      if (match && match[1]) {
        const slug = match[1];
        const candidates = [
          `/images/products/${slug}/2.png`,
          `/images/products/${slug}/3.png`
        ];
        candidates.forEach((uri) => {
          if (!images.includes(uri)) images.push(uri);
        });
      }
    }

    if (images.length === 0) {
      images.push('/images/products/giay-the-thao-1.jpg');
    }

    return images;
  };

  const productImages = buildProductImages(product);

  // Tạo danh sách màu sắc - xử lý cả array và string
  const productColors = (() => {
    if (!product.Colors) return ['Đen'];
    
    if (Array.isArray(product.Colors)) {
      return product.Colors;
    }
    
    if (typeof product.Colors === 'string') {
      return product.Colors.split(',').map(c => c.trim());
    }
    
    return ['Đen'];
  })();
  
  // Tạo danh sách size
  const productSizes = ['38', '39', '40', '41', '42', '43'];

  // Tính discount
  const discount = product.OriginalPrice && product.Price ? 
    Math.round(((product.OriginalPrice - product.Price) / product.OriginalPrice) * 100) : 0;

  // Tạo số liệu lượt xem / lượt mua ổn định nếu dữ liệu trống hoặc = 0
  const getStableNumber = (seed, min, max) => {
    try {
      const s = String(seed || 'seed');
      let hash = 0;
      for (let i = 0; i < s.length; i++) {
        hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
      }
      const range = Math.max(1, (max - min + 1));
      return min + (hash % range);
    } catch {
      return min;
    }
  };

  const computedViewCount = (product.ViewCount && product.ViewCount > 0)
    ? product.ViewCount
    : getStableNumber(product.ProductID || product.id || product.Name, 45, 680);

  const computedSalesCount = (product.SalesCount && product.SalesCount > 0)
    ? product.SalesCount
    : Math.max(1, Math.floor(computedViewCount * 0.06) + (getStableNumber('sales-' + (product.ProductID || product.id || product.Name), 0, 12)));

  // Navigation tabs
  const tabs = [
    { id: 'description', label: 'Mô tả sản phẩm' },
    { id: 'return-policy', label: 'Quy định đổi trả' },
    { id: 'care-guide', label: 'Hướng dẫn chăm sóc' },
    { id: 'maintenance', label: 'Hướng dẫn bảo quản' }
  ];

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <div className="tab-content">
            <h3>Mô tả chi tiết</h3>
            <p>{product.ShortDescription || product.Description || 'Chưa có mô tả chi tiết cho sản phẩm này.'}</p>
            
            {product.Features && (
              <>
                <h4>Đặc điểm nổi bật:</h4>
                <ul>
                  {(() => {
                    if (Array.isArray(product.Features)) {
                      return product.Features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ));
                    }
                    
                    if (typeof product.Features === 'string') {
                      return product.Features.split(',').map((feature, index) => (
                        <li key={index}>{feature.trim()}</li>
                      ));
                    }
                    
                    return null;
                  })()}
                </ul>
              </>
            )}

            {product.Benefits && (
              <>
                <h4>Lợi ích:</h4>
                <ul>
                  {(() => {
                    if (Array.isArray(product.Benefits)) {
                      return product.Benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ));
                    }
                    
                    if (typeof product.Benefits === 'string') {
                      return product.Benefits.split(',').map((benefit, index) => (
                        <li key={index}>{benefit.trim()}</li>
                      ));
                    }
                    
                    return null;
                  })()}
                </ul>
              </>
            )}
          </div>
        );
      
      case 'return-policy':
        return (
          <div className="tab-content">
            <h3>Quy định đổi trả</h3>
            <ul>
              <li>Đổi size trong vòng 7 ngày kể từ ngày mua</li>
              <li>Đổi trả hàng trong vòng 7 ngày nếu có lỗi từ nhà sản xuất</li>
              <li>Sản phẩm phải còn nguyên vẹn, chưa sử dụng</li>
              <li>Giữ nguyên tem mác và bao bì gốc</li>
              <li>Không áp dụng cho sản phẩm đã giảm giá</li>
            </ul>
          </div>
        );
      
      case 'care-guide':
        return (
          <div className="tab-content">
            <h3>Hướng dẫn chăm sóc</h3>
            <ul>
              <li>Lau sạch bụi bẩn bằng khăn ẩm sau mỗi lần sử dụng</li>
              <li>Để khô tự nhiên, tránh ánh nắng trực tiếp</li>
              <li>Không sử dụng hóa chất tẩy rửa mạnh</li>
              <li>Bảo quản nơi khô ráo, thoáng mát</li>
              <li>Định kỳ vệ sinh đế giày để duy trì độ bám</li>
            </ul>
          </div>
        );
      
      case 'maintenance':
        return (
          <div className="tab-content">
            <h3>Hướng dẫn bảo quản</h3>
            <ul>
              <li>Đặt giày ở nơi khô ráo, tránh ẩm ướt</li>
              <li>Không để giày gần nguồn nhiệt cao</li>
              <li>Sử dụng hộp đựng giày hoặc túi bảo vệ</li>
              <li>Định kỳ kiểm tra và vệ sinh giày</li>
              <li>Không để giày dưới ánh nắng mặt trời trực tiếp</li>
            </ul>
          </div>
        );
      
      default:
        return null;
    }
  };

  const formatPrice = (price) => {
    if (!price) return '0 ₫';
    return price.toLocaleString('vi-VN') + ' ₫';
  };

  const handleAddToCart = () => {
    const quantityToAdd = Math.max(1, quantity || 1);
    addToCart(product, { size: selectedSize || null, color: selectedColor || null, quantity: quantityToAdd });
    
    alert(`Đã thêm ${product.Name}${selectedSize ? ` - Size ${selectedSize}` : ''} vào giỏ hàng!`);
  };

  const handleBuyNow = () => {
    // Kiểm tra xem user đã chọn size và color chưa
    if (!selectedSize) {
      alert('⚠️ Vui lòng chọn kích thước trước khi mua!');
      return;
    }
    
    if (!selectedColor) {
      alert('⚠️ Vui lòng chọn màu sắc trước khi mua!');
      return;
    }

    const quantityToAdd = Math.max(1, quantity || 1);
    const item = {
      key: `${product.ProductID || product.id}|${selectedSize}|${selectedColor}`,
      productId: product.ProductID || product.id,
      name: product.Name,
      price: product.Price || 0,
      image: product.MainImage,
      quantity: quantityToAdd,
      size: selectedSize,
      color: selectedColor
    };
    
    // Lưu item vào checkout và chuyển đến trang thanh toán
    setCheckoutItems([item]);
    
    // Thông báo thành công
    alert(`✅ Đã thêm ${product.Name} vào đơn hàng!\n\n📋 Thông tin đơn hàng:\n• Size: ${selectedSize}\n• Màu: ${selectedColor}\n• Số lượng: ${quantityToAdd}\n• Giá: ${(product.Price * quantityToAdd).toLocaleString('vi-VN')} ₫\n\n🔄 Đang chuyển đến trang thanh toán...`);
    
    navigate('/payment');
  };


  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
  };

  const handlePrevImage = () => {
    setSelectedImageIndex(prev => 
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex(prev => 
      prev === productImages.length - 1 ? 0 : prev + 1
    );
  };

  // Handle related products navigation
  const handleRelatedScroll = (direction) => {
    if (!relatedProductsRef.current) return;
    
    const container = relatedProductsRef.current;
    const scrollAmount = 300; // Scroll 300px mỗi lần
    
    if (direction === 'prev') {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
    }
  };

  // Handle related product click
  const handleRelatedProductClick = (relatedProduct) => {
    const relatedProductId = relatedProduct.ProductID || relatedProduct.id;
    if (relatedProductId) {
      // Cuộn lên đầu trang trước khi chuyển
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Reset các state về giá trị mặc định
      setSelectedSize('');
      setSelectedColor('');
      setQuantity(1);
      setSelectedImageIndex(0);
      setActiveTab('description');
      
      // Chuyển đến trang sản phẩm mới
      navigate(`/product/${relatedProductId}`);
    }
  };

  return (
    <div className="product-detail">
      <div className="product-detail-container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <a href="/home">Trang chủ</a>
          <span>/</span>
          <a href={`/shoes?category=${product.Category || 'Giày'}`}>{product.Category || 'Giày'}</a>
          <span>/</span>
          <span>{product.Name}</span>
        </div>

        {/* Product Title */}
        <div className="product-title-section">
          <h1 className="main-product-title">{product.Name}</h1>
        </div>

        {/* Navigation Tabs */}
        <div className="product-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Main Section - 2 cột */}
        <div className="product-main">
          {/* Left Column - Product Images */}
          <div className="product-images">
            <div className="main-image">
              <img
                src={productImages[selectedImageIndex] || productImages[0]}
                alt={`${product.Name} - Ảnh ${selectedImageIndex + 1}`}
                className="main-product-image"
              />
              {product.IsNew && <div className="image-badge">Mới</div>}
              {discount > 0 && (
                <div className="discount-badge">-{discount}%</div>
              )}
            </div>
            
            {/* Thumbnail Navigation */}
            <div className="thumbnail-navigation">
              <button className="nav-arrow prev" onClick={handlePrevImage}>
                <IoArrowBack />
              </button>
              
              <div className="thumbnail-images">
                {productImages.map((image, index) => (
                  <div
                    key={index}
                    className={`thumbnail ${selectedImageIndex === index ? 'active' : ''}`}
                    onClick={() => handleThumbnailClick(index)}
                  >
                    <img
                      src={image}
                      alt={`${product.Name} ${index + 1}`}
                      className="thumbnail-image"
                    />
                  </div>
                ))}
              </div>
              
              <button className="nav-arrow next" onClick={handleNextImage}>
                <IoArrowForward />
              </button>
            </div>
          </div>

          {/* Right Column - Product Info & Specifications */}
          <div className="product-info">
            {/* Basic Product Info */}
            <div className="product-header">
              <h2 className="product-title">{product.Name}</h2>
              <div className="product-code">Mã sản phẩm: <strong>{product.ProductCode || `UTH${product.ProductID}`}</strong></div>
            </div>

            <div className="product-price-section">
              <div className="current-price">{formatPrice(product.Price)}</div>
              {product.OriginalPrice && (
                <div className="original-price">{formatPrice(product.OriginalPrice)}</div>
              )}
            </div>

            <div className="product-stats">
              <span><strong>{computedViewCount}</strong> lượt xem</span>
              <span><strong>{computedSalesCount}</strong> lượt mua Online</span>
            </div>

            <div className="product-status">
              Tình trạng: <strong style={{color: '#27ae60'}}>
                {product.StockQuantity > 0 ? 'Còn hàng' : 'Hết hàng'}
              </strong>
            </div>

            {/* Color Selection */}
            <div className="product-option">
              <label>Màu sắc:</label>
              <div className="color-options">
                {productColors.map((color) => (
                  <button
                    key={color}
                    className={`color-option ${selectedColor === color ? 'active' : ''}`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="product-option">
              <label>Kích thước:</label>
              <div className="size-options">
                {productSizes.map((size) => (
                  <button
                    key={size}
                    className={`size-option ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="product-option">
              <label>Số lượng:</label>
              <div className="quantity-selector">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max={product.StockQuantity || 99}
                />
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="product-actions">
              <button className="btn-buy-now" onClick={handleBuyNow}>
                Mua ngay
              </button>
              <button className="btn-add-to-cart" onClick={handleAddToCart}>
                Thêm vào giỏ
              </button>
            </div>

            {/* Favorite & Share */}
            <div className="product-utilities">
              <button
                className={`btn-favorite ${isFavorite ? 'active' : ''}`}
                onClick={() => setIsFavorite(!isFavorite)}
              >
                {isFavorite ? <IoHeart size={20} /> : <IoHeartOutline size={20} />}
                {isFavorite ? 'Bỏ yêu thích' : 'Yêu thích'}
              </button>
              <button className="btn-share">
                <IoShareSocial size={20} />
                Chia sẻ
              </button>
            </div>

            {/* Product Benefits */}
            <div className="product-benefits">
              <h3>Ưu đãi đi kèm</h3>
              <ul>
                <li>Cam kết chính hãng UTH Shoes 100%</li>
                <li>Bảo hành 03 tháng</li>
                <li>Đổi size trong vòng 7 ngày</li>
                <li>Đổi trả hàng trong vòng 7 ngày</li>
                <li>Free ship đơn hàng 1.5 Triệu</li>
                <li>Hỗ trợ giao hàng 2h khi chọn Grab</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tab Content Section */}
        <div className="tab-content-section">
          {renderTabContent()}
        </div>

        {/* Description & Specifications Section - 2 cột */}
        <div className="description-specs-section">
          <div className="description-specs-container">
            {/* Cột trái - Mô tả sản phẩm */}
            <div className="product-description-column">
              <h2>Mô tả sản phẩm</h2>
              <div className="description-content">
                <p>
                  Chinh phục mọi cung đường và phá vỡ kỷ lục cá nhân với đôi giày chạy địa hình 
                  Columbia Konos Trillium ATR™. Được thiết kế đặc biệt cho phụ nữ, đôi giày này 
                  kết hợp công nghệ tiên tiến với thiết kế thời trang để mang lại trải nghiệm 
                  chạy bộ tối ưu trên mọi địa hình.
                </p>
                
                {product.Features && (
                  <>
                    <h3>Đặc điểm nổi bật:</h3>
                    <ul>
                      {(() => {
                        if (Array.isArray(product.Features)) {
                          return product.Features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ));
                        }
                        
                        if (typeof product.Features === 'string') {
                          return product.Features.split(',').map((feature, index) => (
                            <li key={index}>{feature.trim()}</li>
                          ));
                        }
                        
                        return null;
                      })()}
                    </ul>
                  </>
                )}

                {product.Benefits && (
                  <>
                    <h3>Lợi ích:</h3>
                    <ul>
                      {(() => {
                        if (Array.isArray(product.Benefits)) {
                          return product.Benefits.map((benefit, index) => (
                            <li key={index}>{benefit}</li>
                          ));
                        }
                        
                        if (typeof product.Benefits === 'string') {
                          return product.Benefits.split(',').map((benefit, index) => (
                            <li key={index}>{benefit.trim()}</li>
                          ));
                        }
                        
                        return null;
                      })()}
                    </ul>
                  </>
                )}
              </div>
            </div>

            {/* Cột phải - Thông số kỹ thuật */}
            <div className="product-specifications-column">
              <h2>Thông số</h2>
              <div className="specs-list">
                <div className="spec-item">
                  <span className="spec-label">Trọng lượng:</span>
                  <span className="spec-value">{product.Weight || '276g'}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Chiều cao gót:</span>
                  <span className="spec-value">{product.SoleHeight || '35mm'}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Độ chênh lệch gót - mũi:</span>
                  <span className="spec-value">{product.HeelToeDrop || '8mm'}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Độ cao gai đế/vấu giày:</span>
                  <span className="spec-value">{product.LugHeight || '4mm'}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Công nghệ đế:</span>
                  <span className="spec-value">{product.Technology || 'Omni-MAX™, TechLite+™'}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Chất liệu thân giày:</span>
                  <span className="spec-value">{product.UpperMaterial || 'Da tổng hợp + Lưới mesh'}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Bề mặt sử dụng:</span>
                  <span className="spec-value">{product.Surface || 'Đường phố, Sân thể thao'}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Dịp sử dụng:</span>
                  <span className="spec-value">{product.Occasion || 'Thể thao, Dạo phố'}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Môn thể thao:</span>
                  <span className="spec-value">{product.Sport || 'Chạy bộ, Thể dục'}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Tính năng nổi bật:</span>
                  <span className="spec-value">{product.Features || 'Chống trượt, Thoáng khí'}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Loại dây giày:</span>
                  <span className="spec-value">{product.LaceType || 'Dây thường'}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Cổ giày:</span>
                  <span className="spec-value">{product.CollarType || 'Cổ thấp'}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Kiểu dáng:</span>
                  <span className="spec-value">{product.Style || 'Thể thao hiện đại'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Store Information */}
        <div className="store-info">
          <h2>Tìm sản phẩm tại hệ thống cửa hàng</h2>
          <div className="store-grid">
            <div className="store-item">
              <IoLocation size={24} />
              <div>
                <h4>22 Lý Chiêu Hoàng, P.10, Q.6, TP.HCM</h4>
                <p>Trụ sở chính</p>
              </div>
            </div>
            <div className="store-item">
              <IoTime size={24} />
              <div>
                <h4>8h - 21h30 (Trừ ngày Lễ, Tết)</h4>
                <p>Giờ làm việc</p>
              </div>
            </div>
            <div className="store-item">
              <IoCall size={24} />
              <div>
                <h4>0966 158 666</h4>
                <p>Hotline hỗ trợ</p>
              </div>
            </div>
            <div className="store-item">
              <IoMail size={24} />
              <div>
                <h4>chamsockhachhang@uthshoes.com</h4>
                <p>Email hỗ trợ</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="related-products">
          <h2>Sản phẩm liên quan</h2>
          <div className="related-products-container">
            <button className="nav-arrow prev" onClick={() => handleRelatedScroll('prev')}>
              <IoArrowBack />
            </button>
            
            <div className="related-products-grid" ref={relatedProductsRef}>
              {relatedProducts.map((relatedProduct) => {
                const relatedProductId = relatedProduct.ProductID || relatedProduct.id;
                const imageUrl = relatedProduct.MainImage || "/images/products/giay-the-thao-1.jpg";
                const currentPrice = relatedProduct.Price || 0;
                const originalPrice = relatedProduct.OriginalPrice || null;
                const discount = relatedProduct.Discount || 0;

                return (
                  <div
                    key={relatedProductId}
                    className="related-product-card"
                    onClick={() => handleRelatedProductClick(relatedProduct)}
                  >
                    <div className="related-product-image">
                      <img src={imageUrl} alt={relatedProduct.Name} />
                      {discount > 0 && (
                        <div className="related-discount-badge">-{discount}%</div>
                      )}
                    </div>
                    
                    <div className="related-product-info">
                      <div className="related-product-brand">
                        <span className="brand-logo">UTH SHOES</span>
                      </div>
                      
                      <h4 className="related-product-name">{relatedProduct.Name}</h4>
                      
                      <div className="related-product-price">
                        <span className="related-current-price">
                          {currentPrice.toLocaleString('vi-VN')} ₫
                        </span>
                        {originalPrice && (
                          <span className="related-original-price">
                            {originalPrice.toLocaleString('vi-VN')} ₫
                          </span>
                        )}
                      </div>
                      
                      {/* Promotional Banner */}
                      <div className="related-promo-banner">
                        <div className="promo-dates">07.08 - 21.09</div>
                        <div className="promo-offer">NHẬN BA LÔ</div>
                        <div className="promo-tiers">
                          <span className="promo-tier">890K</span>
                          <span className="promo-condition">từ 2.5 triệu</span>
                          <span className="promo-tier">1690K</span>
                          <span className="promo-condition">từ 5 triệu</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <button className="nav-arrow next" onClick={() => handleRelatedScroll('next')}>
              <IoArrowForward />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}