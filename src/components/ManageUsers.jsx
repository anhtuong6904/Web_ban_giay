import React, { useState } from "react";
import "./ManageUsers.css";

export default function ManageUsers() {
  const [users, setUsers] = useState([
    { id: 1, name: "Nguyễn Văn A", email: "a@example.com", role: "Khách hàng" },
    { id: 2, name: "Trần Thị B", email: "b@example.com", role: "Admin" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", role: "Khách hàng" });

  const openModal = (user = null) => {
    setEditingUser(user);
    setFormData(user || { name: "", email: "", role: "Khách hàng" });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({ name: "", email: "", role: "Khách hàng" });
  };

  const handleSave = () => {
    if (editingUser) {
      setUsers(users.map((u) => (u.id === editingUser.id ? { ...u, ...formData } : u)));
    } else {
      setUsers([...users, { id: Date.now(), ...formData }]);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  return (
    <div className="users-page">
      <h1>Quản lý người dùng</h1>
      <button className="btn-add" onClick={() => openModal()}>
        + Thêm người dùng
      </button>

      <table className="users-table">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <button className="btn-edit" onClick={() => openModal(u)}>Sửa</button>
                <button className="btn-delete" onClick={() => handleDelete(u.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng"}</h2>
            <input
              type="text"
              placeholder="Tên người dùng"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option>Khách hàng</option>
              <option>Admin</option>
              <option>Nhân viên</option>
            </select>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeModal}>Hủy</button>
              <button className="btn-save" onClick={handleSave}>Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
