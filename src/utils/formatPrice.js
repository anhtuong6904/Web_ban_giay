// Format giá tiền theo định dạng Việt Nam
export const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// Format giá tiền với đơn vị VND
export const formatPriceVND = (price) => {
  return `${price.toLocaleString('vi-VN')} ₫`;
};

// Format giá tiền ngắn gọn (VD: 1.5M thay vì 1,500,000)
export const formatPriceShort = (price) => {
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(1)}M ₫`;
  } else if (price >= 1000) {
    return `${(price / 1000).toFixed(0)}K ₫`;
  }
  return `${price} ₫`;
};

// Tính giá sau giảm giá
export const calculateDiscountedPrice = (originalPrice, discountPercent) => {
  return originalPrice - (originalPrice * discountPercent / 100);
};

// Format phần trăm giảm giá
export const formatDiscount = (discount) => {
  return `-${discount}%`;
};
