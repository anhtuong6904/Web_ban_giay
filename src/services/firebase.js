// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
const analytics = getAnalytics(app);
const auth = getAuth(app);
export { app, analytics, auth };