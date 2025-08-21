import React, { useState } from "react";
import "./ManageProducts.css";

export default function ManageProducts() {
  const [products, setProducts] = useState([
    { id: 1, name: "Nike Air Max", price: 2500000, stock: 10, description: "Giày chạy bộ nhẹ, thoải mái." },
    { id: 2, name: "Adidas Ultraboost", price: 3200000, stock: 5, description: "Giày thể thao cao cấp, hỗ trợ tốt." },
  ]);

  const [formData, setFormData] = useState({ name: "", price: "", stock: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Mở popup (thêm hoặc sửa)
  const openModal = (product = null) => {
    if (product) {
      setFormData(product);
      setEditingId(product.id);
    } else {
      setFormData({ name: "", price: "", stock: "", description: "" });
      setEditingId(null);
    }
    setShowModal(true);
  };

  // Đóng popup
  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  // Lưu dữ liệu
  const handleSave = () => {
    if (!formData.name || !formData.price || !formData.stock || !formData.description) {
      return alert("Vui lòng nhập đầy đủ thông tin!");
    }

    if (editingId) {
      // cập nhật
      setProducts(products.map((p) => (p.id === editingId ? { ...formData, id: editingId } : p)));
    } else {
      // thêm mới
      setProducts([...products, { id: Date.now(), ...formData, price: Number(formData.price), stock: Number(formData.stock) }]);
    }

    closeModal();
  };

  // Xóa
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="products-page">
      <h1>Quản lý hàng hóa</h1>
      <button className="btn-add" onClick={() => openModal()}>➕ Thêm sản phẩm</button>

      {/* Bảng sản phẩm */}
      <table className="products-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Giá</th>
            <th>Tồn kho</th>
            <th>Mô tả</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.price.toLocaleString()} đ</td>
              <td>{p.stock}</td>
              <td>{p.description}</td>
              <td>
                <button className="btn-edit" onClick={() => openModal(p)}>✏️ Sửa</button>
                <button className="btn-delete" onClick={() => handleDelete(p.id)}>🗑️ Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Popup modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingId ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</h2>
            <input
              type="text"
              placeholder="Tên sản phẩm"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              type="number"
              placeholder="Giá"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
            <input
              type="number"
              placeholder="Số lượng"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            />
            <textarea
              placeholder="Mô tả sản phẩm"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <div className="modal-actions">
              <button className="btn-save" onClick={handleSave}>💾 Lưu</button>
              <button className="btn-cancel" onClick={closeModal}>❌ Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
