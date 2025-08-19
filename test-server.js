const express = require('express');
require('dotenv').config();

const app = express();

console.log('🚀 Test server starting...');
console.log('🌍 Environment:', process.env.NODE_ENV);
console.log('🔑 JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('🗄️ MONGODB_URI exists:', !!process.env.MONGODB_URI);

// Basic middleware
app.use(express.json());

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Test server is working!' });
});

// Health endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Test server is healthy',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Test server root endpoint' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Test server running on port ${PORT}`);
  console.log(`🔗 Test: http://localhost:${PORT}/test`);
  console.log(`🔗 Health: http://localhost:${PORT}/health`);
  console.log(`🔗 Root: http://localhost:${PORT}/`);
});