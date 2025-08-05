import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // <== bạn đã import App
import './index.css'; // nếu có

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App /> {/* <== sử dụng App ở đây */}
  </React.StrictMode>
);
