// firebaseAdmin.js
const admin = require('firebase-admin');
const path = require('path');

// Đảm bảo đường dẫn đúng với file JSON tải từ Firebase
const serviceAccount = require(path.resolve(__dirname, 'serviceAccountKey.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Nếu chưa dùng Storage thì có thể bỏ dòng bucket
  storageBucket: 'your-project-id.appspot.com', // thay bằng bucket của bạn
});

// Firestore instance
const db = admin.firestore();

// Storage instance
const bucket = admin.storage().bucket();

// Export các instance
module.exports = { admin, db, bucket };
