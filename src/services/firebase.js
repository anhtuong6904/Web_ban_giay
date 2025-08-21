// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAiTR4a40Mqypi3T0G04TLcrIzMPR3EINg",
  authDomain: "webshoesuth.firebaseapp.com",
  projectId: "webshoesuth",
  // Firebase expects the bucket in the form: <bucket>.appspot.com
  storageBucket: "webshoesuth.appspot.com",
  messagingSenderId: "1043926060695",
  appId: "1:1043926060695:web:3540788be2faca8227e3d2",
  measurementId: "G-SNKVJDK2QB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

// Log để debug
console.log('Firebase initialized with config:', {
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  environment: process.env.NODE_ENV
});

export { app, auth, storage };