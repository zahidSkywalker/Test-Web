const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String,
    price: Number,
    quantity: Number,
    image: String,
    variant: {
      name: String,
      value: String
    }
  }],
  shippingAddress: {
    name: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: {
      type: String,
      default: 'Bangladesh'
    }
  },
  billingAddress: {
    name: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: {
      type: String,
      default: 'Bangladesh'
    }
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['ssl_commerce', 'cod', 'bkash', 'nagad', 'rocket']
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  subtotal: {
    type: Number,
    required: true
  },
  shippingCost: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'BDT'
  },
  currencySymbol: {
    type: String,
    default: '৳'
  },
  notes: String,
  trackingNumber: String,
  estimatedDelivery: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  cancelReason: String,
  // SSL Commerce specific fields
  sslTransactionId: String,
  sslBankTransactionId: String,
  sslCardIssuer: String,
  sslCardBrand: String,
  sslCardNumber: String,
  sslCardIssuerCountry: String,
  sslCardIssuerCountryCode: String,
  sslVerifyKey: String,
  sslVerifySignature: String,
  sslAmount: String,
  sslCurrency: String,
  sslDescription: String,
  sslTranDate: String,
  sslTranId: String,
  sslStatus: String,
  sslGatewayPage: String,
  sslError: String,
  sslErrorMsg: String
}, {
  timestamps: true
});

// Generate order number
orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.orderNumber = `LF-${year}${month}${day}-${random}`;
  }
  next();
});

// Calculate totals
orderSchema.methods.calculateTotals = function() {
  this.subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  this.total = this.subtotal + this.shippingCost + this.tax - this.discount;
  return this.total;
};

// Check if order can be cancelled
orderSchema.methods.canCancel = function() {
  return ['pending', 'confirmed', 'processing'].includes(this.orderStatus);
};

// Get order status text
orderSchema.virtual('statusText').get(function() {
  const statusMap = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
  };
  return statusMap[this.orderStatus] || this.orderStatus;
});

// Get payment status text
orderSchema.virtual('paymentStatusText').get(function() {
  const statusMap = {
    pending: 'Pending',
    paid: 'Paid',
    failed: 'Failed',
    refunded: 'Refunded'
  };
  return statusMap[this.paymentStatus] || this.paymentStatus;
});

orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Order', orderSchema);