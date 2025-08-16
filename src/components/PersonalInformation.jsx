import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../services/firebase';
import { updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './PersonalInformation.css';

export default function PersonalInformation() {
  const { currentUser, login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Việt Nam'
  });

  // Profile image states
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Load current user data
    setFormData({
      displayName: currentUser.displayName || '',
      email: currentUser.email || '',
      phone: currentUser.phone || '',
      address: currentUser.address || '',
      city: currentUser.city || '',
      country: currentUser.country || 'Việt Nam'
    });

    // Set image preview
    if (currentUser.photoURL) {
      setImagePreview(currentUser.photoURL);
      setImageError(false);
    } else {
      // Use default avatar SVG
      setImagePreview('');
      setImageError(false);
    }
  }, [currentUser, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Tính toán kích thước mới (tối đa 400x400px)
        const maxSize = 400;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Vẽ ảnh đã resize
        ctx.drawImage(img, 0, 0, width, height);
        
        // Chuyển đổi thành blob với chất lượng 0.8 (80%)
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg', 0.8);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage('Vui lòng chọn file ảnh hợp lệ');
        setMessageType('error');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('Kích thước ảnh không được vượt quá 5MB');
        setMessageType('error');
        return;
      }

      try {
        setMessage('Đang xử lý ảnh...');
        setMessageType('success');
        
        // Nén và resize ảnh
        const compressedBlob = await compressImage(file);
        const compressedFile = new File([compressedBlob], file.name, {
          type: 'image/jpeg',
          lastModified: Date.now()
        });
        
        setProfileImage(compressedFile);
        setImageError(false);
        
        // Create preview
        const reader = new FileReader();
        reader.onload = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(compressedFile);
        
        setMessage('');
        
      } catch (error) {
        setMessage('Lỗi khi xử lý ảnh: ' + error.message);
        setMessageType('error');
      }
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const uploadProfileImage = async (file) => {
    try {
      const storage = getStorage();
      console.log('Storage initialized:', storage);
      
      // Tạo tên file ngắn gọn hơn
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `profile_${timestamp}.${fileExtension}`;
      
      const imageRef = ref(storage, `profile-images/${currentUser.uid}/${fileName}`);
      console.log('Image reference created:', imageRef);
      
      // Upload với metadata tối ưu
      const metadata = {
        cacheControl: 'public, max-age=31536000', // Cache 1 năm
        contentType: file.type,
        customMetadata: {
          uploadedBy: currentUser.uid,
          originalName: file.name,
          size: file.size.toString()
        }
      };
      
      console.log('Starting upload with metadata:', metadata);
      const snapshot = await uploadBytes(imageRef, file, metadata);
      console.log('Upload completed:', snapshot);
      
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('Download URL:', downloadURL);
      
      return downloadURL;
    } catch (error) {
      console.error('Upload error details:', error);
      
      // Xử lý các loại lỗi cụ thể
      if (error.code === 'storage/unauthorized') {
        throw new Error('Không có quyền upload ảnh. Vui lòng đăng nhập lại.');
      } else if (error.code === 'storage/quota-exceeded') {
        throw new Error('Dung lượng lưu trữ đã hết. Vui lòng thử lại sau.');
      } else if (error.code === 'storage/network-request-failed') {
        throw new Error('Lỗi kết nối mạng. Vui lòng kiểm tra internet và thử lại.');
      } else if (error.code === 'storage/unauthorized' || error.message.includes('CORS')) {
        throw new Error('Lỗi CORS: Vui lòng kiểm tra Firebase Storage Rules hoặc thử lại sau.');
      } else {
        throw new Error('Lỗi khi tải ảnh lên: ' + error.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setUploadProgress(0);

    try {
      let newPhotoURL = currentUser.photoURL;

      // Upload new profile image if selected
      if (profileImage) {
        setUploadingImage(true);
        setMessage('Đang tải ảnh lên...');
        setMessageType('success');
        
        // Progress simulation với timing tốt hơn
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            const newProgress = prev + 10;
            console.log(`Progress: ${prev}% → ${newProgress}%`);
            if (newProgress >= 70) {
              clearInterval(progressInterval);
              console.log('Progress interval cleared at 70%');
              return 70;
            }
            return newProgress;
          });
        }, 150);
        
        try {
          newPhotoURL = await uploadProfileImage(profileImage);
          console.log('Upload completed successfully');
          setMessage('Ảnh đã tải lên thành công! 🎉');
          setMessageType('success');
        } catch (error) {
          console.error('Upload failed, but continuing with progress animation:', error);
          // Vẫn tiếp tục animation ngay cả khi upload thất bại
          // Sử dụng ảnh hiện tại nếu upload thất bại
          newPhotoURL = currentUser.photoURL;
          
          // Hiển thị thông báo lỗi upload cụ thể
          if (error.message.includes('CORS')) {
            setMessage('Lỗi CORS: Vui lòng kiểm tra Firebase Storage Rules. Vẫn cập nhật thông tin khác.');
          } else {
            setMessage(`Lỗi khi upload ảnh: ${error.message}. Vẫn cập nhật thông tin khác.`);
          }
          setMessageType('error');
        }
        
        clearInterval(progressInterval);
        console.log('Starting smooth animation to 100%');
        
        // Chạy mượt mà đến 100% sau khi upload xong (hoặc thất bại)
        const animateProgress = (start, end, duration) => {
          const startTime = performance.now();
          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentProgress = start + (end - start) * progress;
            const roundedProgress = Math.round(currentProgress);
            
            setUploadProgress(roundedProgress);
            console.log(`Animation progress: ${roundedProgress}%`);
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              console.log('Animation completed at 100%');
            }
          };
          requestAnimationFrame(animate);
        };
        
        // Animate từ 70% đến 100%
        setTimeout(() => {
          console.log('Starting animation from 70% to 100%');
          animateProgress(70, 100, 800);
        }, 100);
        
        setTimeout(() => {
          setUploadingImage(false);
        }, 1000);
        
        // Delay để hiển thị thông báo và animation
        setTimeout(() => {
          setMessage('Đang cập nhật thông tin...');
        }, 1500);
      }

      // Update Firebase profile
      setMessage('Đang cập nhật thông tin...');
      await updateProfile(auth.currentUser, {
        displayName: formData.displayName,
        photoURL: newPhotoURL
      });

      // Update local user info
      const updatedUserInfo = {
        ...currentUser,
        displayName: formData.displayName,
        photoURL: newPhotoURL,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        country: formData.country
      };

      // Update localStorage and context
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
      login(updatedUserInfo);

      setMessage('Cập nhật thông tin thành công!');
      setMessageType('success');
      
      // Clear image selection
      setProfileImage(null);
      setUploadProgress(0);
      
    } catch (error) {
      setMessage('Lỗi khi cập nhật thông tin: ' + error.message);
      setMessageType('error');
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/home');
  };

  // Default avatar SVG
  const DefaultAvatar = () => (
    <svg 
      width="120" 
      height="120" 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="default-avatar-svg"
    >
      <circle cx="60" cy="60" r="60" fill="#e9ecef"/>
      <circle cx="60" cy="45" r="20" fill="#6c757d"/>
      <path d="M20 100c0-22.091 17.909-40 40-40s40 17.909 40 40" fill="#6c757d"/>
    </svg>
  );

  if (!currentUser) {
    return null;
  }

  return (
    <div className="personal-info-container">
      <div className="personal-info-header">
        <h1>Thông Tin Cá Nhân</h1>
        <p>Cập nhật thông tin cá nhân và ảnh đại diện</p>
      </div>

      <div className="personal-info-content">
        <form onSubmit={handleSubmit} className="personal-info-form">
          {/* Profile Image Section */}
          <div className="profile-image-section">
            <div className="current-image">
              {imagePreview && !imageError ? (
                <img 
                  src={imagePreview} 
                  alt="Ảnh đại diện" 
                  className="profile-image"
                  onError={handleImageError}
                />
              ) : (
                <DefaultAvatar />
              )}
              <div className="image-overlay">
                <label htmlFor="profile-image-input" className="change-image-btn">
                  <i className="fas fa-camera"></i>
                  Thay đổi ảnh
                </label>
                <input
                  id="profile-image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
            <div className="image-info">
              <h3>Ảnh đại diện</h3>
              <p>Hỗ trợ: JPG, PNG, GIF (tối đa 5MB)</p>
              <p className="optimization-info">
                <i className="fas fa-info-circle"></i>
                Ảnh sẽ được tự động nén và resize để tối ưu tốc độ upload
              </p>
              {uploadingImage && (
                <div className="upload-progress">
                  <p className="uploading">Đang tải ảnh...</p>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{uploadProgress}%</span>
                </div>
              )}
              {imageError && <p className="image-error">Lỗi khi tải ảnh</p>}
            </div>
          </div>

          {/* Personal Information */}
          <div className="form-section">
            <h3>Thông tin cơ bản</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="displayName">Tên hiển thị *</label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  required
                  placeholder="Nhập tên hiển thị"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="disabled-input"
                />
                <small>Email không thể thay đổi</small>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Số điện thoại</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div className="form-group">
                <label htmlFor="country">Quốc gia</label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                >
                  <option value="Việt Nam">Việt Nam</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Japan">Japan</option>
                  <option value="South Korea">South Korea</option>
                  <option value="Other">Khác</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Địa chỉ</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Nhập địa chỉ"
              />
            </div>

            <div className="form-group">
              <label htmlFor="city">Thành phố</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Nhập thành phố"
              />
            </div>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`message ${messageType}`}>
              {message}
            </div>
          )}

          {/* Action Buttons */}
          <div className="form-actions">
            <button 
              type="button" 
              onClick={handleCancel}
              className="cancel-btn"
              disabled={loading}
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="save-btn"
              disabled={loading || uploadingImage}
            >
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
