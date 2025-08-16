// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAiTR4a40Mqypi3T0G04TLcrIzMPR3EINg",
  authDomain: "webshoesuth.firebaseapp.com",
  projectId: "webshoesuth",
  storageBucket: "webshoesuth.firebasestorage.app",
  messagingSenderId: "1043926060695",
  appId: "1:1043926060695:web:3540788be2faca8227e3d2",
  measurementId: "G-SNKVJDK2QB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

// Cấu hình Storage để tránh lỗi CORS
if (process.env.NODE_ENV === 'development') {
  console.log('Development mode: Using Firebase Storage with CORS fix');
  
  // Thêm headers để tránh CORS issues
  const originalFetch = window.fetch;
  window.fetch = function(url, options = {}) {
    if (url.includes('firebasestorage.googleapis.com')) {
      options.mode = 'cors';
      options.credentials = 'omit';
      if (!options.headers) options.headers = {};
      options.headers['Access-Control-Allow-Origin'] = '*';
    }
    return originalFetch(url, options);
  };
}

// Log để debug
console.log('Firebase initialized with config:', {
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  environment: process.env.NODE_ENV
});

export { app, auth, storage };