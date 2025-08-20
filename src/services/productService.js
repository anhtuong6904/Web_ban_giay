import productsData from '../data/products.json';

// Service để lấy dữ liệu sản phẩm từ local JSON (fallback khi backend không hoạt động)
export const getProducts = async (params = {}) => {
  try {
    // Thử gọi API backend trước
    const qs = new URLSearchParams(params).toString();
    const url = qs ? `http://localhost:5000/api/products?${qs}` : 'http://localhost:5000/api/products';
    const response = await fetch(url);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.log('Backend không khả dụng, sử dụng dữ liệu local');
  }
  
  // Fallback: sử dụng dữ liệu local
  return productsData;
};

export const getProductById = async (id) => {
  console.log('getProductById called with ID:', id, 'Type:', typeof id);
  
  try {
    // Thử gọi API backend trước
    console.log('Trying backend API...');
    const response = await fetch(`http://localhost:5000/api/products/${id}`);
    if (response.ok) {
      const data = await response.json();
      console.log('Backend API response:', data);
      return data;
    } else {
      console.log('Backend API failed with status:', response.status);
    }
  } catch (error) {
    console.log('Backend không khả dụng, sử dụng dữ liệu local:', error.message);
  }
  
  // Fallback: tìm trong dữ liệu local
  console.log('Using local data fallback...');
  console.log('Local data:', productsData);
  
  // Tìm kiếm theo cả id và ProductID để tương thích với cả 2 format
  const product = productsData.find(p => {
    console.log('Checking product:', p.id, p.ProductID, 'against search ID:', id);
    return p.id === parseInt(id) || 
           p.ProductID === parseInt(id) ||
           p.id === id || 
           p.ProductID === id;
  });
  
  if (!product) {
    console.log('Không tìm thấy sản phẩm với ID:', id);
    console.log('Dữ liệu local có:', productsData.map(p => ({ id: p.id, ProductID: p.ProductID, Name: p.Name })));
    throw new Error('Sản phẩm không tồn tại');
  }
  
  console.log('Found product:', product);
  return product;
};
