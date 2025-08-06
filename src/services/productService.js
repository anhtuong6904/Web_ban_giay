import productsData from '../data/products.json';

class ProductService {
  // Lấy tất cả sản phẩm
  getAllProducts() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(productsData.products);
      }, 100);
    });
  }

  // Lấy sản phẩm theo ID
  getProductById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const product = productsData.products.find(p => p.id === parseInt(id));
        if (product) {
          resolve(product);
        } else {
          reject(new Error('Không tìm thấy sản phẩm'));
        }
      }, 100);
    });
  }

  // Lấy sản phẩm theo danh mục
  getProductsByCategory(category) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const products = productsData.products.filter(p => p.category === category);
        resolve(products);
      }, 100);
    });
  }

  // Lấy sản phẩm theo thương hiệu
  getProductsByBrand(brand) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const products = productsData.products.filter(p => p.brand === brand);
        resolve(products);
      }, 100);
    });
  }

  // Tìm kiếm sản phẩm
  searchProducts(query) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const searchTerm = query.toLowerCase();
        const products = productsData.products.filter(product => 
          product.name.toLowerCase().includes(searchTerm) ||
          product.brand.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
        resolve(products);
      }, 100);
    });
  }

  // Lọc sản phẩm theo giá
  filterProductsByPrice(minPrice, maxPrice) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const products = productsData.products.filter(product => 
          product.price >= minPrice && product.price <= maxPrice
        );
        resolve(products);
      }, 100);
    });
  }

  // Lấy sản phẩm có giảm giá
  getDiscountedProducts() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const products = productsData.products.filter(product => product.discount > 0);
        resolve(products);
      }, 100);
    });
  }

  // Lấy sản phẩm mới nhất
  getLatestProducts(limit = 6) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const products = [...productsData.products]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, limit);
        resolve(products);
      }, 100);
    });
  }

  // Lấy sản phẩm bán chạy (dựa trên rating)
  getBestSellingProducts(limit = 6) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const products = [...productsData.products]
          .sort((a, b) => b.rating - a.rating)
          .slice(0, limit);
        resolve(products);
      }, 100);
    });
  }

  // Lấy tất cả danh mục
  getAllCategories() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(productsData.categories);
      }, 100);
    });
  }

  // Lấy tất cả thương hiệu
  getAllBrands() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(productsData.brands);
      }, 100);
    });
  }

  // Lấy thương hiệu theo ID
  getBrandById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const brand = productsData.brands.find(b => b.id === parseInt(id));
        if (brand) {
          resolve(brand);
        } else {
          reject(new Error('Không tìm thấy thương hiệu'));
        }
      }, 100);
    });
  }

  // Lấy danh mục theo ID
  getCategoryById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const category = productsData.categories.find(c => c.id === parseInt(id));
        if (category) {
          resolve(category);
        } else {
          reject(new Error('Không tìm thấy danh mục'));
        }
      }, 100);
    });
  }

  // Lọc sản phẩm nâng cao
  advancedFilter(filters) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let products = [...productsData.products];

        // Lọc theo danh mục
        if (filters.category) {
          products = products.filter(p => p.category === filters.category);
        }

        // Lọc theo thương hiệu
        if (filters.brand) {
          products = products.filter(p => p.brand === filters.brand);
        }

        // Lọc theo giá
        if (filters.minPrice !== undefined) {
          products = products.filter(p => p.price >= filters.minPrice);
        }
        if (filters.maxPrice !== undefined) {
          products = products.filter(p => p.price <= filters.maxPrice);
        }

        // Lọc theo kích thước
        if (filters.size) {
          products = products.filter(p => p.sizes.includes(filters.size));
        }

        // Lọc theo màu sắc
        if (filters.color) {
          products = products.filter(p => 
            p.colors.some(color => color.name.toLowerCase().includes(filters.color.toLowerCase()))
          );
        }

        // Lọc theo tình trạng kho
        if (filters.inStock !== undefined) {
          products = products.filter(p => p.inStock === filters.inStock);
        }

        // Sắp xếp
        if (filters.sortBy) {
          switch (filters.sortBy) {
            case 'price-asc':
              products.sort((a, b) => a.price - b.price);
              break;
            case 'price-desc':
              products.sort((a, b) => b.price - a.price);
              break;
            case 'rating':
              products.sort((a, b) => b.rating - a.rating);
              break;
            case 'newest':
              products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
              break;
            case 'name':
              products.sort((a, b) => a.name.localeCompare(b.name));
              break;
            default:
              break;
          }
        }

        resolve(products);
      }, 100);
    });
  }
}

export default new ProductService();
