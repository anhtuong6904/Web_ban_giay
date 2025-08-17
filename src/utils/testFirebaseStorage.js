// Utility để test Firebase Storage và debug CORS issues
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const testFirebaseStorage = async () => {
  try {
    console.log('🧪 Testing Firebase Storage...');
    
    const storage = getStorage();
    console.log('✅ Storage initialized:', storage);
    
    // Test tạo reference
    const testRef = ref(storage, 'test/test-file.txt');
    console.log('✅ Test reference created:', testRef);
    
    // Test upload simple text
    const testBlob = new Blob(['Hello Firebase Storage!'], { type: 'text/plain' });
    console.log('✅ Test blob created:', testBlob);
    
    // Test upload
    console.log('📤 Attempting upload...');
    const snapshot = await uploadBytes(testRef, testBlob);
    console.log('✅ Upload successful:', snapshot);
    
    // Test download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('✅ Download URL:', downloadURL);
    
    console.log('🎉 Firebase Storage test completed successfully!');
    return { success: true, downloadURL };
    
  } catch (error) {
    console.error('❌ Firebase Storage test failed:', error);
    
    if (error.code === 'storage/unauthorized') {
      console.error('🔒 Unauthorized: Check Firebase Storage Rules');
    } else if (error.message.includes('CORS')) {
      console.error('🌐 CORS Error: Check Firebase Console Storage Rules');
    } else if (error.code === 'storage/network-request-failed') {
      console.error('🌍 Network Error: Check internet connection');
    }
    
    return { success: false, error: error.message };
  }
};

// Expose globally for console testing
if (typeof window !== 'undefined') {
  window.testFirebaseStorage = testFirebaseStorage;
  console.log('🔧 testFirebaseStorage() available in console');
}
