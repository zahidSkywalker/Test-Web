const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { auth } = require('../middleware/auth');
const axios = require('axios');
const Order = require('../models/Order');
const User = require('../models/User');

// SSL Commerce configuration
const SSL_COMMERCE_CONFIG = {
  store_id: process.env.SSL_COMMERCE_STORE_ID,
  store_password: process.env.SSL_COMMERCE_STORE_PASSWORD,
  is_sandbox: process.env.SSL_COMMERCE_IS_SANDBOX === 'true',
  base_url: process.env.SSL_COMMERCE_IS_SANDBOX === 'true' 
    ? 'https://sandbox.sslcommerz.com' 
    : 'https://securepay.sslcommerz.com'
};

// @route   POST api/payment/ssl-commerce/init
// @desc    Initialize SSL Commerce payment
// @access  Private
router.post('/ssl-commerce/init', auth, async (req, res) => {
  try {
    const { orderId, paymentMethod } = req.body;

    const order = await Order.findById(orderId).populate('user');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Order already paid' });
    }

    // Generate unique transaction ID
    const tran_id = `LF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // SSL Commerce payment data
    const paymentData = {
      store_id: SSL_COMMERCE_CONFIG.store_id,
      store_passwd: SSL_COMMERCE_CONFIG.store_password,
      total_amount: order.total,
      currency: order.currency || 'BDT',
      tran_id: tran_id,
      product_category: 'cosmetics',
      cus_name: order.shippingAddress.name || req.user.name,
      cus_email: req.user.email,
      cus_add1: order.shippingAddress.street || '',
      cus_city: order.shippingAddress.city || '',
      cus_postcode: order.shippingAddress.zipCode || '',
      cus_country: order.shippingAddress.country || 'Bangladesh',
      cus_phone: order.shippingAddress.phone || req.user.phone || '',
      ship_name: order.shippingAddress.name || req.user.name,
      ship_add1: order.shippingAddress.street || '',
      ship_city: order.shippingAddress.city || '',
      ship_postcode: order.shippingAddress.zipCode || '',
      ship_country: order.shippingAddress.country || 'Bangladesh',
      ship_phone: order.shippingAddress.phone || req.user.phone || '',
      value_a: order._id.toString(), // Order ID
      value_b: req.user.id, // User ID
      value_c: order.orderNumber, // Order Number
      value_d: 'Lech-Fita Cosmetics'
    };

    // Add product details
    order.items.forEach((item, index) => {
      paymentData[`product_name_${index + 1}`] = item.name;
      paymentData[`product_amount_${index + 1}`] = item.price;
      paymentData[`product_quantity_${index + 1}`] = item.quantity;
    });

    // Update order with transaction ID
    order.sslTransactionId = tran_id;
    order.paymentMethod = paymentMethod;
    await order.save();

    // Generate SSL Commerce payment URL
    const paymentUrl = `${SSL_COMMERCE_CONFIG.base_url}/gwprocess/v4/api.php`;

    res.json({
      success: true,
      paymentUrl,
      paymentData,
      tran_id,
      orderId: order._id
    });

  } catch (error) {
    console.error('SSL Commerce init error:', error);
    res.status(500).json({ message: 'Payment initialization failed' });
  }
});

// @route   POST api/payment/ssl-commerce/success
// @desc    Handle SSL Commerce payment success
// @access  Public
router.post('/ssl-commerce/success', async (req, res) => {
  try {
    const {
      tran_id,
      status,
      val_id,
      amount,
      currency,
      card_type,
      card_no,
      bank_tran_id,
      store_amount,
      card_issuer,
      card_brand,
      card_issuer_country,
      card_issuer_country_code,
      store_id,
      verify_sign,
      verify_key,
      cus_val1,
      cus_val2,
      cus_val3,
      cus_val4
    } = req.body;

    // Server-side validate with SSLCommerz validator API
    const validatorUrl = `${SSL_COMMERCE_CONFIG.base_url}/validator/api/validationserverAPI.php`;
    const params = new URLSearchParams({
      val_id,
      store_id: SSL_COMMERCE_CONFIG.store_id,
      store_passwd: SSL_COMMERCE_CONFIG.store_password,
      v: '1',
      format: 'json'
    });

    const validationResponse = await axios.get(`${validatorUrl}?${params.toString()}`);
    const validationData = validationResponse.data || {};

    if (validationData.status !== 'VALID') {
      return res.status(400).json({ message: 'Payment validation failed' });
    }

    // Find order by transaction ID
    const order = await Order.findOne({ sslTransactionId: tran_id });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order with payment details
    if (order.paymentStatus === 'paid') {
      return res.json({ success: true, message: 'Payment already processed', orderId: order._id, orderNumber: order.orderNumber });
    }

    order.paymentStatus = 'paid';
    order.orderStatus = 'confirmed';
    order.sslBankTransactionId = bank_tran_id;
    order.sslCardIssuer = card_issuer;
    order.sslCardBrand = card_brand;
    // Do not store full card numbers in database
    order.sslCardIssuerCountry = card_issuer_country;
    order.sslCardIssuerCountryCode = card_issuer_country_code;
    order.sslVerifyKey = verify_key;
    order.sslVerifySignature = verify_sign;
    order.sslAmount = validationData.amount || amount;
    order.sslCurrency = validationData.currency || currency;
    order.sslTranDate = new Date().toISOString();
    order.sslTranId = tran_id;
    order.sslStatus = validationData.status || status;

    await order.save();

    // Update product stock
    for (const item of order.items) {
      const Product = require('../models/Product');
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    res.json({
      success: true,
      message: 'Payment successful',
      orderId: order._id,
      orderNumber: order.orderNumber
    });

  } catch (error) {
    console.error('SSL Commerce success error:', error);
    res.status(500).json({ message: 'Payment processing failed' });
  }
});

// @route   POST api/payment/ssl-commerce/fail
// @desc    Handle SSL Commerce payment failure
// @access  Public
router.post('/ssl-commerce/fail', async (req, res) => {
  try {
    const { tran_id, error, error_msg } = req.body;

    const order = await Order.findOne({ sslTransactionId: tran_id });
    
    if (order) {
      order.paymentStatus = 'failed';
      order.sslError = error;
      order.sslErrorMsg = error_msg;
      await order.save();
    }

    res.json({
      success: false,
      message: 'Payment failed',
      error,
      error_msg
    });

  } catch (error) {
    console.error('SSL Commerce fail error:', error);
    res.status(500).json({ message: 'Payment failure handling failed' });
  }
});

// @route   POST api/payment/ssl-commerce/cancel
// @desc    Handle SSL Commerce payment cancellation
// @access  Public
router.post('/ssl-commerce/cancel', async (req, res) => {
  try {
    const { tran_id } = req.body;

    const order = await Order.findOne({ sslTransactionId: tran_id });
    
    if (order) {
      order.paymentStatus = 'failed';
      order.sslError = 'CANCELLED';
      order.sslErrorMsg = 'Payment cancelled by user';
      await order.save();
    }

    res.json({
      success: false,
      message: 'Payment cancelled'
    });

  } catch (error) {
    console.error('SSL Commerce cancel error:', error);
    res.status(500).json({ message: 'Payment cancellation handling failed' });
  }
});

// @route   POST api/payment/ssl-commerce/ipn
// @desc    Handle SSL Commerce IPN (Instant Payment Notification)
// @access  Public
router.post('/ssl-commerce/ipn', async (req, res) => {
  try {
    const {
      tran_id,
      status,
      val_id,
      amount,
      currency,
      card_type,
      card_no,
      bank_tran_id,
      store_amount,
      card_issuer,
      card_brand,
      card_issuer_country,
      card_issuer_country_code,
      store_id,
      verify_sign,
      verify_key
    } = req.body;

    // Validate IPN data with validator API
    const validatorUrl = `${SSL_COMMERCE_CONFIG.base_url}/validator/api/validationserverAPI.php`;
    const params = new URLSearchParams({
      val_id,
      store_id: SSL_COMMERCE_CONFIG.store_id,
      store_passwd: SSL_COMMERCE_CONFIG.store_password,
      v: '1',
      format: 'json'
    });

    const validationResponse = await axios.get(`${validatorUrl}?${params.toString()}`);
    const validationData = validationResponse.data || {};
    if (validationData.status !== 'VALID') {
      return res.status(400).json({ message: 'Invalid IPN' });
    }

    // Find and update order
    const order = await Order.findOne({ sslTransactionId: tran_id });
    
    if (order && order.paymentStatus !== 'paid') {
      order.paymentStatus = 'paid';
      order.orderStatus = 'confirmed';
      order.sslBankTransactionId = bank_tran_id;
      order.sslCardIssuer = card_issuer;
      order.sslCardBrand = card_brand;
      // Do not store full card numbers in database
      order.sslCardIssuerCountry = card_issuer_country;
      order.sslCardIssuerCountryCode = card_issuer_country_code;
      order.sslVerifyKey = verify_key;
      order.sslVerifySignature = verify_sign;
      order.sslAmount = validationData.amount || amount;
      order.sslCurrency = validationData.currency || currency;
      order.sslTranDate = new Date().toISOString();
      order.sslTranId = tran_id;
      order.sslStatus = validationData.status || status;

      await order.save();

      // Update product stock
      for (const item of order.items) {
        const Product = require('../models/Product');
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity }
        });
      }
    }

    res.json({ success: true });

  } catch (error) {
    console.error('SSL Commerce IPN error:', error);
    res.status(500).json({ message: 'IPN processing failed' });
  }
});

// @route   POST api/payment/cod
// @desc    Process Cash on Delivery payment
// @access  Private
router.post('/cod', auth, async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // For COD, we just confirm the order
    order.paymentStatus = 'pending';
    order.orderStatus = 'confirmed';
    order.paymentMethod = 'cod';
    await order.save();

    res.json({
      success: true,
      message: 'Order confirmed for Cash on Delivery',
      orderId: order._id
    });

  } catch (error) {
    console.error('COD payment error:', error);
    res.status(500).json({ message: 'COD processing failed' });
  }
});

// @route   GET api/payment/methods
// @desc    Get available payment methods
// @access  Public
router.get('/methods', (req, res) => {
  const paymentMethods = [
    {
      id: 'ssl_commerce',
      name: 'Credit/Debit Card',
      description: 'Pay securely with your credit or debit card',
      icon: '💳',
      isAvailable: true
    },
    {
      id: 'bkash',
      name: 'bKash',
      description: 'Pay with bKash mobile banking',
      icon: '📱',
      isAvailable: true
    },
    {
      id: 'nagad',
      name: 'Nagad',
      description: 'Pay with Nagad mobile banking',
      icon: '📱',
      isAvailable: true
    },
    {
      id: 'rocket',
      name: 'Rocket',
      description: 'Pay with Rocket mobile banking',
      icon: '📱',
      isAvailable: true
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when you receive your order',
      icon: '💰',
      isAvailable: true
    }
  ];

  res.json(paymentMethods);
});

module.exports = router;