import productsData from '../data/products.json';

// Service để lấy dữ liệu sản phẩm từ local JSON (fallback khi backend không hoạt động)
export const getProducts = async () => {
  try {
    // Thử gọi API backend trước
    const response = await fetch('http://localhost:5000/api/products');
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
  try {
    // Thử gọi API backend trước
    const response = await fetch(`http://localhost:5000/api/products/${id}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.log('Backend không khả dụng, sử dụng dữ liệu local');
  }
  
  // Fallback: tìm trong dữ liệu local
  const product = productsData.find(p => p.ProductID === parseInt(id));
  if (!product) {
    throw new Error('Sản phẩm không tồn tại');
  }
  
  return product;
};
