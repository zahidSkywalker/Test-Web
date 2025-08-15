const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    trim: true,
    maxlength: 100
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  images: [String],
  isVerified: {
    type: Boolean,
    default: false
  },
  isHelpful: {
    type: Number,
    default: 0
  },
  helpfulUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isReported: {
    type: Boolean,
    default: false
  },
  reportReason: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Ensure one review per user per product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Update product rating when review is saved/updated
reviewSchema.post('save', async function() {
  await this.constructor.updateProductRating(this.product);
});

reviewSchema.post('findOneAndUpdate', async function() {
  if (this.product) {
    await this.constructor.updateProductRating(this.product);
  }
});

reviewSchema.post('findOneAndDelete', async function() {
  if (this.product) {
    await this.constructor.updateProductRating(this.product);
  }
});

// Static method to update product rating
reviewSchema.statics.updateProductRating = async function(productId) {
  const stats = await this.aggregate([
    { $match: { product: productId, isActive: true } },
    {
      $group: {
        _id: '$product',
        numReviews: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    const Product = mongoose.model('Product');
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      numReviews: stats[0].numReviews
    });
  }
};

// Check if user can review (must have purchased the product)
reviewSchema.methods.canReview = async function() {
  if (!this.order) return true; // Allow if no order requirement
  
  const Order = mongoose.model('Order');
  const order = await Order.findById(this.order);
  return order && order.user.toString() === this.user.toString() && order.orderStatus === 'delivered';
};

module.exports = mongoose.model('Review', reviewSchema);