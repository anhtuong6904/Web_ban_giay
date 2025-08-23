// script để đồng bộ user từ Firebase Authentication sang Firestore
const { admin, db } = require('../backend/Routes/firebaseAdmin'); // Import Firebase Admin SDK

(async function syncUsersToFirestore() {
  try {
    console.log('🔄 Bắt đầu đồng bộ user từ Firebase Auth sang Firestore...');

    let nextPageToken;

    let totalSynced = 0;
    let totalSkipped = 0;

    do {
      // Lấy tối đa 1000 user/lần
      const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);

      for (const userRecord of listUsersResult.users) {
        const userDocRef = db.collection('users').doc(userRecord.uid);
        const userDoc = await userDocRef.get();

        if (!userDoc.exists) {
          const userData = {
            uid: userRecord.uid,
            email: userRecord.email || '',
            fullName: userRecord.displayName || '',
            phoneNumber: userRecord.phoneNumber || '',
            address: '',
            avatar: userRecord.photoURL || '',
            role: 'user',
            createdAt: new Date().toISOString(),
          };

          await userDocRef.set(userData);
          console.log('✅ Synced user:', userRecord.email);
          totalSynced++;
        } else {
          console.log('⏭️ Đã tồn tại, bỏ qua:', userRecord.email);
          totalSkipped++;
        }
      }

      nextPageToken = listUsersResult.pageToken; // Lấy trang tiếp theo
    } while (nextPageToken);

    console.log(`\n✅ Đồng bộ hoàn tất!`);
    console.log(`Tổng số user được sync: ${totalSynced}`);
    console.log(`Tổng số user đã tồn tại: ${totalSkipped}`);
  } catch (error) {
    console.error('❌ Lỗi khi đồng bộ user:', error);
  }
})();