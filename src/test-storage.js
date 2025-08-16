// Test Firebase Storage functionality
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from './services/firebase';

export const testStorage = async () => {
  try {
    console.log('Testing Firebase Storage...');
    
    // Test storage initialization
    const storage = getStorage(app);
    console.log('Storage initialized successfully:', storage);
    
    // Test creating a reference
    const testRef = ref(storage, 'test/test-file.txt');
    console.log('Test reference created:', testRef);
    
    // Test with a simple text file
    const testContent = 'Hello Firebase Storage!';
    const testBlob = new Blob([testContent], { type: 'text/plain' });
    
    console.log('Test blob created:', testBlob);
    
    // Test upload
    const snapshot = await uploadBytes(testRef, testBlob);
    console.log('Test upload successful:', snapshot);
    
    // Test download URL
    const downloadURL = await getDownloadURL(testRef);
    console.log('Test download URL:', downloadURL);
    
    console.log('✅ Firebase Storage test PASSED');
    return true;
    
  } catch (error) {
    console.error('❌ Firebase Storage test FAILED:', error);
    return false;
  }
};

// Run test if this file is imported
if (typeof window !== 'undefined') {
  // Browser environment
  window.testStorage = testStorage;
}
