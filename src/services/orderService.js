export async function createOrder(recipient, items, paymentMethod) {
  try {
    // Tạo order ID ngẫu nhiên
    const orderId = `ORD${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Tạo đơn hàng mới
    const order = {
      orderId,
      orderDate: new Date().toISOString(),
      status: 'pending',
      paymentMethod,
      recipient,
      items,
      total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };

    // Lưu vào localStorage (tạm thời thay vì gọi API)
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    existingOrders.push(order);
    localStorage.setItem('orders', JSON.stringify(existingOrders));

    console.log('Order created successfully:', order);
    
    // Trả về order đã tạo
    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Không thể tạo đơn hàng: ' + error.message);
  }
}


