const express = require('express');
const router = express.Router();
const { admin, db } = require('./firebaseAdmin'); // Firebase Admin SDK

// ========================
// Middleware xác thực token Firebase
// ========================
const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Thiếu token" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded; // chứa uid, email, ...
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ success: false, message: "Token không hợp lệ" });
  }
};

// ========================
// Lấy danh sách user
// ========================
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('users').orderBy('createdAt', 'desc').get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách người dùng', error: err.message });
  }
});

// ========================
// Tạo user (Admin tạo)
// ========================
router.post('/', async (req, res) => {
  try {
    const { email, password, fullName, phoneNumber, address, avatar } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }

    // Tạo user trong Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: fullName,
      photoURL: avatar || null,
    });

    // Tạo profile trong Firestore
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email,
      fullName,
      phoneNumber: phoneNumber || '',
      address: address || '',
      avatar: avatar || '',
      role: 'user',
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({ message: 'Tạo người dùng thành công', id: userRecord.uid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi tạo người dùng', error: err.message });
  }
});

// ========================
// Update user
// ========================
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, phoneNumber, address, avatar, password } = req.body;

    // Update Firestore
    const updateData = {
      fullName,
      phoneNumber,
      address,
      avatar,
      updatedAt: new Date().toISOString(),
    };

    await db.collection('users').doc(id).update(updateData);

    // Nếu có password mới thì update Auth
    if (password && password.trim()) {
      await admin.auth().updateUser(id, { password });
    }

    res.json({ message: 'Cập nhật người dùng thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi cập nhật người dùng', error: err.message });
  }
});

// ========================
// Delete user
// ========================
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await db.collection('users').doc(id).delete();
    await admin.auth().deleteUser(id);

    res.json({ message: 'Xóa người dùng thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi xóa người dùng', error: err.message });
  }
});

// ========================
// Register - cập nhật profile cho user mới
// ========================
router.post("/register", verifyFirebaseToken, async (req, res) => {
  try {
    const uid = req.user.uid; // Lấy từ Firebase token
    const { fullName, phoneNumber, address, avatar } = req.body;

    if (!fullName) {
      return res.status(400).json({ success: false, message: "Thiếu tên đầy đủ" });
    }

    // Tạo hoặc cập nhật user trong Firestore
    await db.collection("users").doc(uid).set(
      {
        uid,
        email: req.user.email,
        fullName,
        phoneNumber: phoneNumber || "",
        address: address || "",
        avatar: avatar || "",
        role: "user",
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
      { merge: true } // để không ghi đè hết dữ liệu cũ
    );

    res.json({ success: true, message: "Đăng ký / cập nhật thông tin thành công" });
  } catch (err) {
    console.error("❌ Lỗi register:", err);
    res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
  }
});

// ========================
// Lấy thông tin user hiện tại
// ========================
router.get("/me", verifyFirebaseToken, async (req, res) => {
  try {
    const uid = req.user.uid;
    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ success: false, message: "User không tồn tại" });
    }

    res.json({ success: true, user: userDoc.data() });

  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
  }
});

module.exports = router;
