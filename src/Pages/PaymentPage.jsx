import React from 'react';
import Recipient from '../components/Recipient';
import './PaymentPage.css';

function PaymentPage() {
  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-header">
          <h1>Thanh Toán Đơn Hàng</h1>
          <p>Vui lòng điền thông tin nhận hàng và chọn phương thức thanh toán</p>
        </div>
        <Recipient />
      </div>
    </div>
  );
}

export default PaymentPage;
