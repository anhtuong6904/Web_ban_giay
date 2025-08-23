const express = require('express');
const { VNPay } = require('vnpay');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

// Khởi tạo VNPay client
const vnpay = new VNPay({
  tmnCode: process.env.VNP_TMNCODE,
  secureSecret: process.env.VNP_HASHSECRET,
  testMode: true
});

// Tạo URL thanh toán
router.post('/create', (req, res) => {
  try {
    const { amount, orderInfo } = req.body;

    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: amount, // nhớ nhân 100
      vnp_IpAddr: req.ip,
      vnp_ReturnUrl: process.env.VNP_RETURNURL,
      vnp_TxnRef: `ORDER_${Date.now()}`,
      vnp_OrderInfo: orderInfo,
    });


    res.json({ success: true, paymentUrl });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Xác thực kết quả thanh toán
router.get('/verify', (req, res) => {
  try {
    const verification = vnpay.verifyReturnUrl(req.query);

    if (verification.isVerified) {
      const success = verification.isSuccess;
      const orderId = verification.vnp_TxnRef;
      const amount = verification.vnp_Amount; // vì nhân 100 lúc tạo
      const bank = verification.vnp_BankCode;
      const transactionNo = verification.vnp_TransactionNo;

      // Redirect frontend kèm query string
      return res.redirect(
        `${process.env.FRONTEND_URL}/payment-status?success=${success}&orderId=${orderId}&amount=${amount}&bank=${bank}&transactionNo=${transactionNo}`
      );
    } else {
      return res.redirect(`${process.env.FRONTEND_URL}/payment-status?success=false`);
    }
  } catch (error) {
    return res.redirect(`${process.env.FRONTEND_URL}/payment-status?success=false`);
  }
});

module.exports = router; 