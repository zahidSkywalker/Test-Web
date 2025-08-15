const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth, admin } = require('../middleware/auth');

// @route   POST api/orders
// @desc    Create a new order
// @access  Private
router.post('/', [auth, [
  check('items', 'Items are required').isArray({ min: 1 }),
  check('shippingAddress', 'Shipping address is required').not().isEmpty(),
  check('paymentMethod', 'Payment method is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { items, shippingAddress, billingAddress, paymentMethod, notes } = req.body;

    // Validate items and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ message: `Product ${item.product} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.mainImage
      });

      subtotal += product.price * item.quantity;
    }

    // Calculate shipping cost (you can implement your own logic)
    const shippingCost = subtotal > 1000 ? 0 : 100; // Free shipping over 1000 BDT
    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal + shippingCost + tax;

    const order = new Order({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      subtotal,
      shippingCost,
      tax,
      total,
      notes,
      currency: 'BDT',
      currencySymbol: '৳'
    });

    await order.save();

    // Clear user's cart
    const User = require('../models/User');
    await User.findByIdAndUpdate(req.user.id, { cart: [] });

    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/orders
// @desc    Get user orders
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: req.user.id })
      .populate('items.product', 'name mainImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments({ user: req.user.id });
    const totalPages = Math.ceil(total / limit);

    res.json({
      orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/orders/admin
// @desc    Get all orders (admin only)
// @access  Private (Admin)
router.get('/admin', [auth, admin], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let query = {};

    // Filter by status
    if (req.query.status) {
      query.orderStatus = req.query.status;
    }

    // Filter by payment status
    if (req.query.paymentStatus) {
      query.paymentStatus = req.query.paymentStatus;
    }

    // Filter by date range
    if (req.query.startDate && req.query.endDate) {
      query.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('items.product', 'name mainImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('items.product', 'name mainImage description');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns the order or is admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   PUT api/orders/:id/status
// @desc    Update order status (admin only)
// @access  Private (Admin)
router.put('/:id/status', [auth, admin], async (req, res) => {
  try {
    const { orderStatus, trackingNumber, estimatedDelivery } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.orderStatus = orderStatus;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (estimatedDelivery) order.estimatedDelivery = estimatedDelivery;

    // Set delivered date if status is delivered
    if (orderStatus === 'delivered') {
      order.deliveredAt = new Date();
    }

    await order.save();

    res.json(order);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST api/orders/:id/cancel
// @desc    Cancel order
// @access  Private
router.post('/:id/cancel', auth, async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!order.canCancel()) {
      return res.status(400).json({ message: 'Order cannot be cancelled' });
    }

    order.orderStatus = 'cancelled';
    order.cancelledAt = new Date();
    order.cancelReason = reason;

    await order.save();

    res.json(order);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST api/orders/cart/add
// @desc    Add item to cart
// @access  Private
router.post('/cart/add', auth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    const User = require('../models/User');
    const user = await User.findById(req.user.id);

    // Check if product already in cart
    const existingItem = user.cart.find(item => 
      item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save();

    res.json(user.cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/orders/cart/update
// @desc    Update cart item quantity
// @access  Private
router.put('/cart/update', auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be greater than 0' });
    }

    const User = require('../models/User');
    const user = await User.findById(req.user.id);

    const cartItem = user.cart.find(item => 
      item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cartItem.quantity = quantity;
    await user.save();

    res.json(user.cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/orders/cart/remove/:productId
// @desc    Remove item from cart
// @access  Private
router.delete('/cart/remove/:productId', auth, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.id);

    user.cart = user.cart.filter(item => 
      item.product.toString() !== req.params.productId
    );

    await user.save();

    res.json(user.cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/orders/cart
// @desc    Get user cart
// @access  Private
router.get('/cart', auth, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.id).populate('cart.product');

    res.json(user.cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;