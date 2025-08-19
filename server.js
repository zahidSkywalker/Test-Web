console.log('🚀 Starting server initialization...');

const express = require('express');
console.log('✅ Express loaded');

const mongoose = require('mongoose');
console.log('✅ Mongoose loaded');

const cors = require('cors');
console.log('✅ CORS loaded');

const helmet = require('helmet');
console.log('✅ Helmet loaded');

const compression = require('compression');
console.log('✅ Compression loaded');

const rateLimit = require('express-rate-limit');
console.log('✅ Rate limit loaded');

// Path module not needed for API-only backend
console.log('✅ Backend configured for API-only (no static files)');

require('dotenv').config();
console.log('✅ Dotenv loaded');
console.log('🌍 Environment:', process.env.NODE_ENV);
console.log('🔑 JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('🗄️ MONGODB_URI exists:', !!process.env.MONGODB_URI);

const app = express();

// Trust proxy for Render deployment
app.set('trust proxy', 1);

// Add error handling for uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parser middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://lech-fita.herokuapp.com', 'https://lech-fita.com']
    : ['http://localhost:3000'],
  credentials: true
}));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lech-fita', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Connection Error:', err));

// Health check endpoint
app.get('/health', (req, res) => {
  try {
    res.json({ 
      status: 'OK', 
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ error: 'Health check failed' });
  }
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint working' });
});

// Simple test without path module
app.get('/simple', (req, res) => {
  res.json({ 
    message: 'Simple endpoint working',
    pathModule: typeof path,
    dirname: __dirname,
    timestamp: new Date().toISOString()
  });
});

console.log('🛣️ Loading routes...');

// Routes
try {
  console.log('📁 Loading auth routes...');
  app.use('/api/auth', require('./routes/auth'));
  console.log('✅ Auth routes loaded');
} catch (error) {
  console.error('❌ Error loading auth routes:', error);
}

try {
  console.log('📁 Loading product routes...');
  app.use('/api/products', require('./routes/products'));
  console.log('✅ Product routes loaded');
} catch (error) {
  console.error('❌ Error loading product routes:', error);
}

try {
  console.log('📁 Loading category routes...');
  app.use('/api/categories', require('./routes/categories'));
  console.log('✅ Category routes loaded');
} catch (error) {
  console.error('❌ Error loading category routes:', error);
}

try {
  console.log('📁 Loading order routes...');
  app.use('/api/orders', require('./routes/orders'));
  console.log('✅ Order routes loaded');
} catch (error) {
  console.error('❌ Error loading order routes:', error);
}

try {
  console.log('📁 Loading user routes...');
  app.use('/api/users', require('./routes/users'));
  console.log('✅ User routes loaded');
} catch (error) {
  console.error('❌ Error loading user routes:', error);
}

try {
  console.log('📁 Loading payment routes...');
  app.use('/api/payment', require('./routes/payment'));
  console.log('✅ Payment routes loaded');
} catch (error) {
  console.error('❌ Error loading payment routes:', error);
}

try {
  console.log('📁 Loading review routes...');
  app.use('/api/reviews', require('./routes/reviews'));
  console.log('✅ Review routes loaded');
} catch (error) {
  console.error('❌ Error loading review routes:', error);
}

console.log('✅ All routes loaded successfully');

// Note: Frontend is deployed separately on Vercel
// Backend only handles API requests
console.log('📁 Frontend deployed separately on Vercel - no static files needed');

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 Test endpoint: http://localhost:${PORT}/test`);
});