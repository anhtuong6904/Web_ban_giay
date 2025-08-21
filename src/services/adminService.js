// Service để quản lý dữ liệu admin từ localStorage
export class AdminService {
  // Lấy tất cả đơn hàng từ tất cả users
  static getAllOrders() {
    try {
      const allOrders = [];
      const keys = Object.keys(localStorage);
      
      // Tìm tất cả keys bắt đầu với 'userOrders:'
      const orderKeys = keys.filter(key => key.startsWith('userOrders:'));
      
      orderKeys.forEach(key => {
        try {
          const orders = JSON.parse(localStorage.getItem(key));
          if (Array.isArray(orders)) {
            // Thêm userId vào mỗi order để biết order của ai
            const userId = key.replace('userOrders:', '');
            orders.forEach(order => {
              order.userId = userId;
              order.orderDate = new Date(order.orderDate);
            });
            allOrders.push(...orders);
          }
        } catch (error) {
          console.error('Error parsing orders from key:', key, error);
        }
      });
      
      // Sắp xếp theo ngày mới nhất
      return allOrders.sort((a, b) => b.orderDate - a.orderDate);
    } catch (error) {
      console.error('Error getting all orders:', error);
      return [];
    }
  }

  // Lấy thống kê tổng quan
  static getDashboardStats() {
    try {
      const allOrders = this.getAllOrders();
      const allUsers = this.getAllUsers();
      const allProducts = this.getAllProducts();
      
      // Tính doanh thu
      const totalRevenue = allOrders
        .filter(order => order.status === 'completed' || order.status === 'delivered')
        .reduce((sum, order) => sum + (order.total || 0), 0);
      
      // Tính đơn hàng theo trạng thái
      const orderStats = {
        total: allOrders.length,
        pending: allOrders.filter(o => o.status === 'pending').length,
        processing: allOrders.filter(o => o.status === 'processing').length,
        delivered: allOrders.filter(o => o.status === 'delivered').length,
        cancelled: allOrders.filter(o => o.status === 'cancelled').length,
        completed: allOrders.filter(o => o.status === 'completed').length
      };
      
      // Tính doanh thu theo tháng (6 tháng gần nhất)
      const monthlyRevenue = this.getMonthlyRevenue(allOrders);
      
      // Top sản phẩm bán chạy
      const topProducts = this.getTopSellingProducts(allOrders);
      
      return {
        totalRevenue,
        orderStats,
        totalUsers: allUsers.length,
        totalProducts: allProducts.length,
        monthlyRevenue,
        topProducts
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      return {
        totalRevenue: 0,
        orderStats: { total: 0, pending: 0, processing: 0, delivered: 0, cancelled: 0, completed: 0 },
        totalUsers: 0,
        totalProducts: 0,
        monthlyRevenue: [],
        topProducts: []
      };
    }
  }

  // Lấy doanh thu theo tháng
  static getMonthlyRevenue(orders) {
    try {
      const months = [];
      const now = new Date();
      
      // Tạo 6 tháng gần nhất
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('vi-VN', { month: 'short' });
        months.push({
          month: monthName,
          revenue: 0,
          year: date.getFullYear(),
          monthNum: date.getMonth()
        });
      }
      
      // Tính doanh thu cho mỗi tháng
      orders.forEach(order => {
        if (order.status === 'completed' || order.status === 'delivered') {
          const orderDate = new Date(order.orderDate);
          const monthIndex = months.findIndex(m => 
            m.year === orderDate.getFullYear() && m.monthNum === orderDate.getMonth()
          );
          
          if (monthIndex !== -1) {
            months[monthIndex].revenue += order.total || 0;
          }
        }
      });
      
      return months;
    } catch (error) {
      console.error('Error calculating monthly revenue:', error);
      return [];
    }
  }

  // Lấy top sản phẩm bán chạy
  static getTopSellingProducts(orders) {
    try {
      const productSales = {};
      
      orders.forEach(order => {
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach(item => {
            const productName = item.name || 'Unknown Product';
            if (!productSales[productName]) {
              productSales[productName] = { name: productName, sold: 0, revenue: 0 };
            }
            productSales[productName].sold += item.quantity || 1;
            productSales[productName].revenue += (item.price || 0) * (item.quantity || 1);
          });
        }
      });
      
      // Sắp xếp theo số lượng bán
      return Object.values(productSales)
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 10);
    } catch (error) {
      console.error('Error calculating top products:', error);
      return [];
    }
  }

  // Lấy tất cả users
  static getAllUsers() {
    try {
      const users = [];
      const keys = Object.keys(localStorage);
      
      // Tìm tất cả keys bắt đầu với 'userInfo'
      const userKeys = keys.filter(key => key === 'userInfo');
      
      userKeys.forEach(key => {
        try {
          const userInfo = JSON.parse(localStorage.getItem(key));
          if (userInfo && userInfo.uid) {
            users.push(userInfo);
          }
        } catch (error) {
          console.error('Error parsing user info:', error);
        }
      });
      
      return users;
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }

  // Lấy tất cả products
  static getAllProducts() {
    try {
      // Lấy từ localStorage hoặc từ data local
      const products = localStorage.getItem('products');
      if (products) {
        return JSON.parse(products);
      }
      
      // Fallback: import từ data local
      const { productsData } = require('../data/allProducts');
      return productsData || [];
    } catch (error) {
      console.error('Error getting all products:', error);
      return [];
    }
  }

  // Cập nhật trạng thái đơn hàng
  static updateOrderStatus(orderId, newStatus, adminNote = '') {
    try {
      const allOrders = this.getAllOrders();
      let updated = false;
      let targetUserId = null;
      
      // Tìm và cập nhật order
      allOrders.forEach(order => {
        if (order.orderId === orderId) {
          order.status = newStatus;
          order.adminNote = adminNote;
          order.updatedAt = new Date().toISOString();
          targetUserId = order.userId; // Lưu userId để cập nhật đúng localStorage
          updated = true;
        }
      });
      
      if (updated && targetUserId) {
        // Cập nhật vào localStorage của khách hàng cụ thể
        const userOrderKey = `userOrders:${targetUserId}`;
        try {
          const userOrders = JSON.parse(localStorage.getItem(userOrderKey) || '[]');
          if (Array.isArray(userOrders)) {
            const updatedUserOrders = userOrders.map(order => {
              if (order.orderId === orderId) {
                return { 
                  ...order, 
                  status: newStatus, 
                  adminNote, 
                  updatedAt: new Date().toISOString() 
                };
              }
              return order;
            });
            localStorage.setItem(userOrderKey, JSON.stringify(updatedUserOrders));
            console.log(`✅ Updated order ${orderId} status to ${newStatus} for user ${targetUserId}`);
          }
        } catch (error) {
          console.error('Error updating user orders:', error);
        }
        
        // Cập nhật vào localStorage tổng hợp của admin (nếu cần)
        const keys = Object.keys(localStorage);
        const orderKeys = keys.filter(key => key.startsWith('userOrders:'));
        
        orderKeys.forEach(key => {
          try {
            const orders = JSON.parse(localStorage.getItem(key));
            if (Array.isArray(orders)) {
              const updatedOrders = orders.map(order => {
                if (order.orderId === orderId) {
                  return { ...order, status: newStatus, adminNote, updatedAt: new Date().toISOString() };
                }
                return order;
              });
              localStorage.setItem(key, JSON.stringify(updatedOrders));
            }
          } catch (error) {
            console.error('Error updating order in localStorage:', error);
          }
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  }

  // Lấy chi tiết đơn hàng
  static getOrderDetails(orderId) {
    try {
      const allOrders = this.getAllOrders();
      return allOrders.find(order => order.orderId === orderId);
    } catch (error) {
      console.error('Error getting order details:', error);
      return null;
    }
  }

  // Lấy đơn hàng theo trạng thái
  static getOrdersByStatus(status) {
    try {
      const allOrders = this.getAllOrders();
      if (status === 'all') return allOrders;
      return allOrders.filter(order => order.status === status);
    } catch (error) {
      console.error('Error getting orders by status:', error);
      return [];
    }
  }
}
