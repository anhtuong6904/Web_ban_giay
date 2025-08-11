import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Home from './Pages/Home';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User đang đăng nhập:", user.email);
      } else {
        console.log("Chưa đăng nhập");
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/Home" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path='/Cart' element={<div>Cart Page</div>} />
      </Routes>
    </Router>
  );
}

export default App;
