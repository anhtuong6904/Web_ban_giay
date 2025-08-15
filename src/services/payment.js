// backend/routes/payment.ts
import { VNPay } from 'vnpay'; // ✅ Import đầy đủ trên backend
import defaultconfig from '../data/vnpay.json' 
const vnpay = new VNPay({
  tmnCode: defaultconfig.tmnCode,
  secureSecret: defaultconfig.secureSecret,
  testMode: true
});

// Tạo URL thanh toán
app.post('/api/payments/create', async (req, res) => {
  try {
    const { amount, orderInfo } = req.body;
    
    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: amount,
      vnp_IpAddr: req.ip,
      vnp_ReturnUrl: `${process.env.APP_URL}/payment/callback`,
      vnp_TxnRef: `ORDER_${Date.now()}`,
      vnp_OrderInfo: orderInfo,
    });
    
    res.json({ success: true, paymentUrl });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Xác thực kết quả thanh toán
app.get('/api/payments/verify', (req, res) => {
  const verification = vnpay.verifyReturnUrl(req.query);
  res.json(verification);
});