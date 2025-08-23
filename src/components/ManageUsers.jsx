import React, { useState, useEffect } from 'react';
import './ManageUsers.css';
import { set } from 'date-fns';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    phoneNumber: '',
    email: '',
    address: '',
    image: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading users...');
      
      const response = await fetch('http://localhost:5000/api/users');
      console.log('📡 Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Users loaded:', data);
        setUsers(data);
      } else {
        const errorText = await response.text();
        console.error('❌ Failed to load users:', response.status, errorText);
        
        // Try to parse error as JSON
        try {
          const errorData = JSON.parse(errorText);
          alert(`Lỗi khi tải danh sách người dùng: ${errorData.message || 'Không xác định'}`);
        } catch {
          alert(`Lỗi khi tải danh sách người dùng: ${response.status} ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error('❌ Error loading users:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        alert('Không thể kết nối đến server. Vui lòng kiểm tra backend có đang chạy không?');
      } else {
        alert(`Có lỗi xảy ra khi tải danh sách người dùng: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh hợp lệ (JPG, PNG, GIF)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước ảnh không được vượt quá 5MB');
        return;
      }

      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setFormData({...formData, image: e.target.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData({...formData, image: ''});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.username.trim()) {
      alert('Vui lòng nhập tên người dùng!');
      return;
    }
    
    if (!editingUser && !formData.password.trim()) {
      alert('Vui lòng nhập mật khẩu!');
      return;
    }
    
    if (!formData.fullName.trim()) {
      alert('Vui lòng nhập họ và tên!');
      return;
    }
    
    if (!formData.email.trim()) {
      alert('Vui lòng nhập email!');
      return;
    }
    
    try {
      const url = editingUser 
        ? `http://localhost:5000/api/users/${editingUser.id}`
        : 'http://localhost:5000/api/users';
      
      const method = editingUser ? 'PUT' : 'POST';
      
      // Prepare data for submission
      const submitData = { ...formData };
      
      // If editing and no new password, remove password field
      if (editingUser && !submitData.password.trim()) {
        delete submitData.password;
      }
      
      console.log('📤 Submitting user data:', submitData);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        await loadUsers();
        setShowModal(false);
        setEditingUser(null);
        resetForm();
        alert(editingUser ? 'Cập nhật người dùng thành công!' : 'Thêm người dùng thành công!');
      } else {
        let errorMessage = 'Không xác định';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || 'Không xác định';
        } catch (parseError) {
          errorMessage = `${response.status} ${response.statusText}`;
        }
        alert(`Lỗi: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Có lỗi xảy ra khi lưu người dùng');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      password: '',
      fullName: user.fullName || '',
      phoneNumber: user.phoneNumber || '',
      email: user.email || '',
      address: user.address || '',
      image: user.image || ''
    });
    setImagePreview(user.image || '');
    setImageFile(null);
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadUsers();
        alert('Xóa người dùng thành công!');
      } else {
        let errorMessage = 'Không xác định';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || 'Không xác định';
        } catch (parseError) {
          errorMessage = `${response.status} ${response.statusText}`;
        }
        alert(`Lỗi: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Có lỗi xảy ra khi xóa người dùng');
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      fullName: '',
      phoneNumber: '',
      email: '',
      address: '',
      image: ''
    });
    setImageFile(null);
    setImagePreview('');
  };

  const openAddModal = () => {
    setEditingUser(null);
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    resetForm();
  };

  if (loading) {
    return (
      <div className="users-page">
        <div className="loading">Đang tải danh sách người dùng...</div>
      </div>
    );
  }

  return (
    <div className="users-page">
      {/* Users Header */}
      <div className="users-header">
        <div className="users-title">
          <div>
            <h1>Quản lý người dùng</h1>
            <p className="users-subtitle">Thêm, sửa, xóa thông tin người dùng</p>
          </div>
          <div className="users-actions">
            <button className="add-btn" onClick={openAddModal}>
              ➕ Thêm người dùng
            </button>
            <button className="refresh-btn" onClick={loadUsers}>
              🔄 Làm mới
            </button>
          </div>
        </div>
      </div>

      {/* Users Summary */}
      <div className="users-summary">
        <div className="summary-item">
          <div className="summary-number">{users.length}</div>
          <div className="summary-label">Tổng người dùng</div>
        </div>
        <div className="summary-item">
          <div className="summary-number">
            {users.filter(u => u.email).length}
          </div>
          <div className="summary-label">Có email</div>
        </div>
        <div className="summary-item">
          <div className="summary-number">
            {users.filter(u => u.phoneNumber).length}
          </div>
          <div className="summary-label">Có số điện thoại</div>
        </div>
        <div className="summary-item">
          <div className="summary-number">
            {users.filter(u => u.image).length}
          </div>
          <div className="summary-label">Có ảnh đại diện</div>
        </div>
      </div>

      {/* Users Table */}
      <div className="users-table">
        <div className="table-header">
          <h3>Danh sách người dùng</h3>
        </div>
        <div className="table-content">
          {users.length === 0 ? (
            <div className="no-users">
              <div className="no-users-icon">👥</div>
              <h3>Không có người dùng nào</h3>
              <p>Hãy thêm người dùng đầu tiên</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>Thông tin</th>
                  <th>Liên hệ</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-avatar">
                        {user.image ? (
                          <img src={user.image} alt={user.fullName || user.username} />
                        ) : (
                          <div className="avatar-placeholder">
                            {(user.fullName || user.username || 'U').charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="user-info">
                        <div className="user-name">
                          {user.fullName || user.username}
                        </div>
                        <small>@{user.username}</small>
                      </div>
                    </td>
                    <td>
                      <div className="contact-info">
                        <div>{user.email || 'N/A'}</div>
                        <small>{user.phoneNumber || 'N/A'}</small>
                      </div>
                    </td>
                    <td>
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-edit"
                          onClick={() => handleEdit(user)}
                        >
                          ✏️ Sửa
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(user.id)}
                        >
                          🗑️ Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {showModal && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingUser ? 'Sửa người dùng' : 'Thêm người dùng mới'}
              </h3>
              <button className="btn-close" onClick={closeModal}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="user-form">
              <div className="form-row">
                {!editingUser && (<div className="form-group">
                  <label htmlFor="username">Tên đăng nhập *</label>
                  <input
                    type="text"
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    required
                    disabled={editingUser}
                  />
                </div>)}
                <div className="form-group">
                  <label htmlFor="password">
                    {editingUser ? 'Mật khẩu mới (để trống nếu không đổi)' : 'Mật khẩu *'}
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required={!editingUser}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullName">Họ và tên *</label>
                  <input
                    type="text"
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phoneNumber">Số điện thoại</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <label htmlFor="address">Địa chỉ</label>
                  <textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    rows="3"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <label>Ảnh đại diện</label>
                  <div className="image-upload-container">
                    <div className="upload-area">
                      <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="image-upload" className="upload-label">
                        <div className="upload-icon">📷</div>
                        <div>Chọn ảnh từ máy</div>
                        <small>JPG, PNG, GIF (tối đa 5MB)</small>
                      </label>
                    </div>
                    
                    {imagePreview && (
                      <div className="image-preview">
                        <img src={imagePreview} alt="Preview" />
                        <button 
                          type="button" 
                          className="remove-image-btn"
                          onClick={removeImage}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>
                  Hủy
                </button>
                <button type="submit" className="btn-save">
                  {editingUser ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
