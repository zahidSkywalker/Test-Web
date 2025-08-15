const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth, admin } = require('../middleware/auth');

// @route   GET api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [auth, [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail()
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, phone, address } = req.body;

    // Check if email is already taken by another user
    const existingUser = await User.findOne({ email, _id: { $ne: req.user.id } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, phone, address },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/users/password
// @desc    Change user password
// @access  Private
router.put('/password', [auth, [
  check('currentPassword', 'Current password is required').exists(),
  check('newPassword', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/users/wishlist/add
// @desc    Add product to wishlist
// @access  Private
router.post('/wishlist/add', auth, async (req, res) => {
  try {
    const { productId } = req.body;

    const user = await User.findById(req.user.id);
    
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    user.wishlist.push(productId);
    await user.save();

    res.json(user.wishlist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/users/wishlist/remove/:productId
// @desc    Remove product from wishlist
// @access  Private
router.delete('/wishlist/remove/:productId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    user.wishlist = user.wishlist.filter(
      id => id.toString() !== req.params.productId
    );
    
    await user.save();

    res.json(user.wishlist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/users/wishlist
// @desc    Get user wishlist
// @access  Private
router.get('/wishlist', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('wishlist', 'name price mainImage rating numReviews');

    res.json(user.wishlist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/users/admin
// @desc    Get all users (admin only)
// @access  Private (Admin)
router.get('/admin', [auth, admin], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let query = {};

    // Filter by role
    if (req.query.role) {
      query.role = req.query.role;
    }

    // Filter by verification status
    if (req.query.verified !== undefined) {
      query.isVerified = req.query.verified === 'true';
    }

    // Search by name or email
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/users/:id/verify
// @desc    Verify user account (admin only)
// @access  Private (Admin)
router.put('/:id/verify', [auth, admin], async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   PUT api/users/:id/role
// @desc    Update user role (admin only)
// @access  Private (Admin)
router.put('/:id/role', [auth, admin, [
  check('role', 'Role must be user or admin').isIn(['user', 'admin'])
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { role } = req.body;

    // Prevent admin from changing their own role
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: 'Cannot change your own role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/users/:id
// @desc    Delete user (admin only)
// @access  Private (Admin)
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has orders
    const Order = require('../models/Order');
    const orderCount = await Order.countDocuments({ user: user._id });

    if (orderCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete user with existing orders' 
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;