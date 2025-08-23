import React from "react";
import { useLocation, Link } from "react-router-dom";
import "./PaymentStatus.css";

const PaymentStatus = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const success = queryParams.get("success") === "true";
  const orderId = queryParams.get("orderId");
  const amount = queryParams.get("amount");
  const bank = queryParams.get("bank");
  const transactionNo = queryParams.get("transactionNo");

  return (
    <div className="status-container">
      <div className="status-card">
        {success ? (
          <>
            <div className="icon success">&#10003;</div>
            <h1 className="title success">Thanh toán thành công</h1>

            <div className="order-info">
              <p><span>Mã đơn hàng:</span> {orderId}</p>
              <p><span>Số tiền:</span> {Number(amount).toLocaleString()} VND</p>
              <p><span>Ngân hàng:</span> {bank}</p>
              <p><span>Mã giao dịch:</span> {transactionNo}</p>
            </div>

            <Link to="/" className="btn success">Về trang chủ</Link>
          </>
        ) : (
          <>
            <div className="icon fail">&#10007;</div>
            <h1 className="title fail">Thanh toán thất bại</h1>

            <p className="desc">
              Có lỗi xảy ra trong quá trình xử lý giao dịch. Vui lòng thử lại sau.
            </p>

            <Link to="/" className="btn fail">Về trang chủ</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentStatus;
