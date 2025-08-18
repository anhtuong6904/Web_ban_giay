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
      vnp_Amount: amount * 100, // ⚠️ VNPay yêu cầu nhân 100
      vnp_IpAddr: req.ip,
      vnp_ReturnUrl: `${process.env.APP_URL}/api/payments/verify`,
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
      res.json({ success: true, data: verification });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
