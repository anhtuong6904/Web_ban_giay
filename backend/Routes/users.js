const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { admin, db } = require('./firebaseAdmin'); // Nếu dùng Firebase

// GET all users
router.get('/', async (req, res) => {
  try {
    // Nếu dùng SQL Server
    // const pool = await sql.connect(config);
    // const result = await pool.request().query('SELECT * FROM Users ORDER BY createdAt DESC');
    // res.json(result.recordset);

    // Nếu dùng Firebase Firestore
    const snapshot = await db.collection('users').orderBy('createdAt', 'desc').get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách người dùng', error: err.message });
  }
});

// POST create user
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

// PUT update user
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, phoneNumber, address, avatar, password } = req.body;

    // Cập nhật Firestore
    const updateData = {
      fullName,
      phoneNumber,
      address,
      avatar,
      updatedAt: new Date().toISOString(),
    };

    await db.collection('users').doc(id).update(updateData);

    // Nếu có password mới, update Firebase Auth
    if (password && password.trim()) {
      await admin.auth().updateUser(id, { password });
    }

    res.json({ message: 'Cập nhật người dùng thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi cập nhật người dùng', error: err.message });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Xóa Firestore
    await db.collection('users').doc(id).delete();

    // Xóa Firebase Auth
    await admin.auth().deleteUser(id);

    res.json({ message: 'Xóa người dùng thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi xóa người dùng', error: err.message });
  }
});

module.exports = router;
