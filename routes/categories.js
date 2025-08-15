const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Category = require('../models/Category');
const { auth, admin } = require('../middleware/auth');

// @route   GET api/categories
// @desc    Get all categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate('parent', 'name slug')
      .populate('children', 'name slug')
      .sort({ sortOrder: 1, name: 1 });

    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/categories/featured
// @desc    Get featured categories
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const categories = await Category.find({ 
      isActive: true, 
      isFeatured: true 
    })
    .populate('parent', 'name slug')
    .sort({ sortOrder: 1, name: 1 });

    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/categories/:slug
// @desc    Get category by slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({ 
      slug: req.params.slug,
      isActive: true 
    })
    .populate('parent', 'name slug')
    .populate('children', 'name slug');

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST api/categories
// @desc    Create a category
// @access  Private (Admin only)
router.post('/', [auth, admin, [
  check('name', 'Name is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const category = new Category(req.body);
    await category.save();

    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/categories/:id
// @desc    Update a category
// @access  Private (Admin only)
router.put('/:id', [auth, admin], async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/categories/:id
// @desc    Delete a category
// @access  Private (Admin only)
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if category has products
    const Product = require('../models/Product');
    const productCount = await Product.countDocuments({ category: category._id });

    if (productCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete category with existing products' 
      });
    }

    // Soft delete
    category.isActive = false;
    await category.save();

    res.json({ message: 'Category removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   GET api/categories/tree
// @desc    Get category tree structure
// @access  Public
router.get('/tree', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate('parent', 'name slug')
      .populate('children', 'name slug')
      .sort({ sortOrder: 1, name: 1 });

    // Build tree structure
    const buildTree = (items, parentId = null) => {
      return items
        .filter(item => item.parent?._id?.toString() === parentId?.toString())
        .map(item => ({
          ...item.toObject(),
          children: buildTree(items, item._id)
        }));
    };

    const categoryTree = buildTree(categories);

    res.json(categoryTree);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;