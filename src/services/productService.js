import productsData from '../data/products.json';

// Chuẩn hoá giá: đảm bảo Price, OriginalPrice, Discount luôn hợp lệ
function normalizePricing(product) {
  const result = { ...product };
  let price = Number(result.Price) || 0;
  let original = Number(result.OriginalPrice) || 0;
  let discount = Number(result.Discount) || 0;

  if (original <= 0 && discount > 0 && price > 0) {
    original = Math.round(price / (1 - discount / 100));
  }
  if (price <= 0 && original > 0 && discount > 0) {
    price = Math.round(original * (1 - discount / 100));
  }
  if ((discount <= 0 || Number.isNaN(discount)) && original > price && price > 0) {
    discount = Math.round(((original - price) / original) * 100);
  }
  // Fallback hợp lý nếu vẫn thiếu
  if (original <= 0 && price > 0) {
    original = Math.round(price * 1.12); // +12%
  }
  if (price <= 0 && original > 0) {
    price = Math.round(original * 0.88); // -12%
  }
  if (original < price) {
    original = Math.round(price * 1.12);
  }

  result.Price = price;
  result.OriginalPrice = original;
  result.Discount = discount > 0 ? discount : Math.max(0, Math.round(((original - price) / original) * 100) || 0);
  return result;
}

// Service để lấy dữ liệu sản phẩm từ local JSON (fallback khi backend không hoạt động)
export const getProducts = async (params = {}) => {
  try {
    // Thử gọi API backend trước
    const qs = new URLSearchParams(params).toString();
    const url = qs ? `http://localhost:5000/api/products?${qs}` : 'http://localhost:5000/api/products';
    console.log('🔍 Calling backend API:', url);
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend API success, found:', data.length, 'products');
      return Array.isArray(data) ? data.map(normalizePricing) : [];
    } else {
      console.log('❌ Backend API failed with status:', response.status);
    }
  } catch (error) {
    console.log('❌ Backend không khả dụng, sử dụng dữ liệu local:', error.message);
  }
  
  // Fallback: sử dụng dữ liệu local với filter
  let filteredData = productsData;
  console.log('🔄 Using local data fallback with', productsData.length, 'total products');
  
  // Áp dụng filter search nếu có
  if (params.search) {
    const searchTerm = params.search.toLowerCase().trim();
    console.log('🔍 Applying search filter for:', searchTerm);
    filteredData = productsData.filter(product => {
      const name = (product.Name || product.ProductName || '').toLowerCase();
      const description = (product.Description || '').toLowerCase();
      const matches = name.includes(searchTerm) || description.includes(searchTerm);
      if (matches) {
        console.log('✅ Product matches search:', product.Name);
      }
      return matches;
    });
    console.log('🔍 Search filter result:', filteredData.length, 'products');
  }
  
  // Áp dụng filter gender nếu có
  if (params.gender) {
    const gender = params.gender.toUpperCase();
    filteredData = filteredData.filter(product => 
      String(product.Gender || '').toUpperCase() === gender
    );
  }
  
  // Áp dụng filter tag nếu có
  if (params.tag) {
    const tag = params.tag.toLowerCase();
    if (['men', 'women', 'kids', 'sports'].includes(tag)) {
      const gender = tag.toUpperCase();
      filteredData = filteredData.filter(product => 
        String(product.Gender || '').toUpperCase() === gender
      );
    }
  }
  
  // Áp dụng sắp xếp nếu có
  if (params.sortBy && params.sortBy !== 'default') {
    const sortBy = params.sortBy.toLowerCase();
    const sortOrder = params.sortOrder || 'asc';
    
    filteredData.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'price':
          aValue = Number(a.Price) || 0;
          bValue = Number(b.Price) || 0;
          break;
        case 'discount':
          aValue = Number(a.Discount) || 0;
          bValue = Number(b.Discount) || 0;
          break;
        case 'name':
          aValue = (a.Name || '').toLowerCase();
          bValue = (b.Name || '').toLowerCase();
          break;
        case 'rating':
          aValue = Number(a.Rating) || 0;
          bValue = Number(b.Rating) || 0;
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'desc') {
        return bValue > aValue ? 1 : bValue < aValue ? -1 : 0;
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      }
    });
    
    console.log(`🔄 Local sorting applied: ${sortBy} ${sortOrder}`);
  }
  
  const result = filteredData.map(normalizePricing);
  console.log('🎯 Final result:', result.length, 'products');
  return result;
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
      return normalizePricing(data);
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
  return normalizePricing(product);
};
