const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Review = require('../models/Review');
const Product = require('../models/Product');
const { auth, admin } = require('../middleware/auth');

// @route   GET api/reviews/product/:productId
// @desc    Get reviews for a product
// @access  Public
router.get('/product/:productId', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ 
      product: req.params.productId,
      isActive: true 
    })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    const total = await Review.countDocuments({ 
      product: req.params.productId,
      isActive: true 
    });
    const totalPages = Math.ceil(total / limit);

    res.json({
      reviews,
      pagination: {
        currentPage: page,
        totalPages,
        totalReviews: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/reviews
// @desc    Create a review
// @access  Private
router.post('/', [auth, [
  check('product', 'Product is required').not().isEmpty(),
  check('rating', 'Rating must be between 1 and 5').isInt({ min: 1, max: 5 }),
  check('comment', 'Comment is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { product, rating, title, comment, images } = req.body;

    // Check if product exists
    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ 
      user: req.user.id, 
      product 
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const review = new Review({
      user: req.user.id,
      product,
      rating,
      title,
      comment,
      images: images || []
    });

    await review.save();

    // Populate user info for response
    await review.populate('user', 'name avatar');

    res.json(review);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/reviews/:id
// @desc    Update a review
// @access  Private
router.put('/:id', [auth, [
  check('rating', 'Rating must be between 1 and 5').isInt({ min: 1, max: 5 }),
  check('comment', 'Comment is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { rating, title, comment, images } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    review.rating = rating;
    review.title = title;
    review.comment = comment;
    if (images) review.images = images;

    await review.save();

    // Populate user info for response
    await review.populate('user', 'name avatar');

    res.json(review);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/reviews/:id
// @desc    Delete a review
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns the review or is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Soft delete
    review.isActive = false;
    await review.save();

    res.json({ message: 'Review removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST api/reviews/:id/helpful
// @desc    Mark review as helpful
// @access  Private
router.post('/:id/helpful', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const userId = req.user.id;
    const isHelpful = review.helpfulUsers.includes(userId);

    if (isHelpful) {
      // Remove from helpful
      review.helpfulUsers = review.helpfulUsers.filter(id => id.toString() !== userId);
      review.isHelpful = Math.max(0, review.isHelpful - 1);
    } else {
      // Add to helpful
      review.helpfulUsers.push(userId);
      review.isHelpful += 1;
    }

    await review.save();

    res.json({ 
      isHelpful: !isHelpful, 
      helpfulCount: review.isHelpful 
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST api/reviews/:id/report
// @desc    Report a review
// @access  Private
router.post('/:id/report', [auth, [
  check('reason', 'Report reason is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { reason } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user already reported this review
    if (review.isReported) {
      return res.status(400).json({ message: 'Review already reported' });
    }

    review.isReported = true;
    review.reportReason = reason;
    await review.save();

    res.json({ message: 'Review reported successfully' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   GET api/reviews/admin
// @desc    Get all reviews (admin only)
// @access  Private (Admin)
router.get('/admin', [auth, admin], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let query = {};

    // Filter by reported reviews
    if (req.query.reported === 'true') {
      query.isReported = true;
    }

    // Filter by active status
    if (req.query.active !== undefined) {
      query.isActive = req.query.active === 'true';
    }

    // Search by comment or title
    if (req.query.search) {
      query.$or = [
        { comment: { $regex: req.query.search, $options: 'i' } },
        { title: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const reviews = await Review.find(query)
      .populate('user', 'name email')
      .populate('product', 'name mainImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      reviews,
      pagination: {
        currentPage: page,
        totalPages,
        totalReviews: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/reviews/:id/admin
// @desc    Update review (admin only)
// @access  Private (Admin)
router.put('/:id/admin', [auth, admin], async (req, res) => {
  try {
    const { isActive, isReported, reportReason } = req.body;

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isActive, isReported, reportReason },
      { new: true }
    )
    .populate('user', 'name email')
    .populate('product', 'name mainImage');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json(review);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;