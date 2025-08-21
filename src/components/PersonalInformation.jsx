import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../services/firebase';
import { updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
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

  // Dùng lưu ảnh local (base64) để tránh giới hạn Firebase Storage trên gói miễn phí
  const USE_LOCAL_IMAGE_STORAGE = true;

  const getUserIdentity = (user) => {
    return (
      user?.uid ||
      user?.email ||
      user?.Username ||
      user?.username ||
      user?.id ||
      'guest'
    );
  };
  const getLocalPhotoKey = (identity) => `userPhotoBase64:${identity}`;
  const loadLocalPhoto = (identity) => {
    try {
      return localStorage.getItem(getLocalPhotoKey(identity));
    } catch {
      return null;
    }
  };
  const saveLocalPhoto = (identity, dataUrl) => {
    try {
      localStorage.setItem(getLocalPhotoKey(identity), dataUrl);
      // Emit event để header cập nhật ảnh
      window.dispatchEvent(new CustomEvent('profileImageChanged'));
    } catch {}
  };

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    console.log('👤 Current user loaded:', {
      uid: currentUser.uid,
      email: currentUser.email,
      displayName: currentUser.displayName,
      photoURL: currentUser.photoURL
    });

    // Load current user data
    setFormData({
      displayName: currentUser.displayName || '',
      email: currentUser.email || '',
      phone: currentUser.phone || '',
      address: currentUser.address || '',
      city: currentUser.city || '',
      country: currentUser.country || 'Việt Nam'
    });

    // Ưu tiên ảnh base64 lưu cục bộ nếu có
    const identity = getUserIdentity(currentUser);
    const localPhoto = loadLocalPhoto(identity);
    if (localPhoto) {
      setImagePreview(localPhoto);
      setImageError(false);
      console.log('🖼️ Using local profile image (base64)');
    } else if (currentUser.photoURL) {
      setImagePreview(currentUser.photoURL);
      setImageError(false);
      console.log('🖼️ User has profile image:', currentUser.photoURL);
    } else {
      // Use default avatar SVG
      setImagePreview('');
      setImageError(false);
      console.log('🖼️ No profile image, using default avatar');
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
      console.log('🚀 Bắt đầu upload ảnh...');
      // Nếu dùng chế độ miễn phí, bỏ qua Firebase và lưu base64 ngay
      if (true) {
        return await new Promise((resolve, reject) => {
          try {
            setUploadProgress(1);
            const reader = new FileReader();
            reader.onload = () => {
              setUploadProgress(100);
              const base64Image = reader.result;
              console.log('✅ Đã tạo base64 thành công');
              // Lưu cục bộ để tái sử dụng
              const identity = getUserIdentity(currentUser);
              saveLocalPhoto(identity, base64Image);
              resolve(base64Image);
            };
            reader.onerror = () => reject(new Error('Không đọc được file ảnh'));
            reader.readAsDataURL(file);
          } catch (e) {
            reject(e);
          }
        });
      }

      const storage = getStorage();
      
      // Kiểm tra kết nối Firebase
      if (!storage) {
        throw new Error('Không thể kết nối Firebase Storage');
      }
      
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `profile_${timestamp}.${fileExtension}`;
      const imageRef = ref(storage, `profile-images/${currentUser.uid}/${fileName}`);
      
      console.log('📁 Đường dẫn ảnh:', `profile-images/${currentUser.uid}/${fileName}`);

      const metadata = {
        cacheControl: 'public, max-age=31536000',
        contentType: file.type,
        customMetadata: {
          uploadedBy: currentUser.uid,
          originalName: file.name,
          size: file.size.toString()
        }
      };

      return await new Promise((resolve, reject) => {
        console.log('📤 Bắt đầu upload task...');
        const uploadTask = uploadBytesResumable(imageRef, file, metadata);

        // Auto-timeout sau 30s để tránh kẹt
        const timeoutId = setTimeout(() => {
          try { 
            console.log('⏰ Timeout - hủy upload');
            uploadTask.cancel(); 
          } catch {}
          reject(new Error('Quá thời gian tải ảnh (30s). Vui lòng thử lại.'));
        }, 30000);

        uploadTask.on('state_changed', 
          (snapshot) => {
            const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            console.log(`📊 Upload progress: ${percent}%`);
            setUploadProgress(Math.min(99, Math.max(1, percent)));
          }, 
          (error) => {
            clearTimeout(timeoutId);
            console.error('❌ Upload error:', error);
            
            // Xử lý các lỗi cụ thể
            switch (error.code) {
              case 'storage/unauthorized':
                reject(new Error('Không có quyền upload ảnh. Vui lòng đăng nhập lại.'));
                break;
              case 'storage/quota-exceeded':
                reject(new Error('Dung lượng lưu trữ đã hết. Vui lòng thử lại sau.'));
                break;
              case 'storage/network-request-failed':
                reject(new Error('Lỗi kết nối mạng. Vui lòng kiểm tra internet và thử lại.'));
                break;
              case 'storage/canceled':
                reject(new Error('Upload đã bị hủy.'));
                break;
              case 'storage/unauthenticated':
                reject(new Error('Chưa đăng nhập. Vui lòng đăng nhập lại.'));
                break;
              default:
                reject(new Error(`Lỗi upload: ${error.message || 'Không xác định'}`));
            }
          }, 
          async () => {
            try {
              clearTimeout(timeoutId);
              console.log('✅ Upload hoàn thành, đang lấy download URL...');
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log('🔗 Download URL:', downloadURL);
              setUploadProgress(100);
              resolve(downloadURL);
            } catch (downloadError) {
              console.error('❌ Download URL error:', downloadError);
              reject(new Error('Lỗi khi lấy URL ảnh: ' + downloadError.message));
            }
          }
        );
      });
    } catch (error) {
      console.error('❌ Upload function error:', error);
      throw error;
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
        
        try {
          // Thử upload lên Firebase Storage
          newPhotoURL = await uploadProfileImage(profileImage);
          setMessage('Ảnh đã tải lên thành công! 🎉');
          setMessageType('success');
          
          // Cập nhật preview ngay lập tức
          setImagePreview(newPhotoURL);
          setImageError(false);
          
        } catch (error) {
          console.error('Image upload failed:', error);
          
          // Fallback: Lưu ảnh dưới dạng base64 vào localStorage
          if (error.message.includes('CORS') || error.message.includes('network')) {
            try {
              const reader = new FileReader();
              reader.onload = () => {
                const base64Image = reader.result;
                newPhotoURL = base64Image;
                setImagePreview(base64Image);
                setMessage('Ảnh đã lưu tạm thời (offline mode). Vẫn cập nhật thông tin khác.');
                setMessageType('warning');
              };
              reader.readAsDataURL(profileImage);
            } catch (fallbackError) {
              console.error('Fallback failed:', fallbackError);
              newPhotoURL = currentUser.photoURL;
              setMessage(`Lỗi khi upload ảnh: ${error.message}. Vẫn cập nhật thông tin khác.`);
              setMessageType('error');
            }
          } else {
            newPhotoURL = currentUser.photoURL;
            setMessage(`Lỗi khi upload ảnh: ${error.message}. Vẫn cập nhật thông tin khác.`);
            setMessageType('error');
          }
        } finally {
          setUploadingImage(false);
        }
      }

      // Update Firebase profile (chỉ cập nhật displayName để tránh lỗi photoURL quá dài)
      try {
        setMessage('Đang cập nhật thông tin Firebase...');
        await updateProfile(auth.currentUser, {
          displayName: formData.displayName
          // Không set photoURL vì base64 quá dài sẽ gây auth/invalid-profile-attribute
        });
        console.log('Firebase profile updated successfully (displayName only)');
      } catch (firebaseError) {
        console.error('Firebase profile update failed:', firebaseError);
        // Không throw để không chặn luồng khi ảnh lưu local
      }

      // Update local user info
      const updatedUserInfo = {
        ...currentUser,
        displayName: formData.displayName,
        // Lưu photoURL vào local profile (không push lên Firebase nếu là base64)
        photoURL: newPhotoURL,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        country: formData.country
      };

      // Update localStorage and context
      try {
        localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
        login(updatedUserInfo);
        console.log('Local user info updated successfully');
      } catch (localError) {
        console.error('Local update failed:', localError);
        // Không throw error vì Firebase đã update thành công
      }

      setMessage('Cập nhật thông tin thành công! 🎉');
      setMessageType('success');
      
      // Clear image selection
      setProfileImage(null);
      setUploadProgress(0);
      
    } catch (error) {
      console.error('Profile update failed:', error);
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

      <div className="personal-info-body">
        {/* Sidebar */}
        <aside className="sidebar-card">
          <div className="sidebar-avatar">
            {imagePreview && !imageError ? (
              <img src={imagePreview} alt="Avatar" />
            ) : (
              <DefaultAvatar />
            )}
          </div>
          <div className="sidebar-info">
            <h3 className="sidebar-name">{formData.displayName || 'User'}</h3>
            <p className="sidebar-email">{formData.email}</p>
          </div>
          <ul className="sidebar-menu">
            <li className="active">Profile</li>
            <li>Recent Activity</li>
            <li>Edit profile</li>
          </ul>
        </aside>

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
    </div>
  );
}
