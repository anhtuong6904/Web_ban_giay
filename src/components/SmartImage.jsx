import React, { useState, useEffect } from 'react';

const SmartImage = ({ src, alt, className, fallbackSrc = '/images/products/placeholder.jpg' }) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      // Nếu ảnh gốc bị lỗi, thử đổi đuôi file
      if (src && src.includes('/images/products/')) {
        if (src.endsWith('.png')) {
          // Thử .jpg
          setCurrentSrc(src.replace('.png', '.jpg'));
        } else if (src.endsWith('.jpg')) {
          // Thử .png
          setCurrentSrc(src.replace('.jpg', '.png'));
        } else {
          // Nếu không có đuôi, thử .png trước
          setCurrentSrc(src + '.png');
        }
      } else {
        // Nếu không phải ảnh sản phẩm, dùng fallback
        setCurrentSrc(fallbackSrc);
      }
    } else {
      // Nếu đã thử cả hai đuôi mà vẫn lỗi, dùng fallback
      setCurrentSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
};

export default SmartImage;
