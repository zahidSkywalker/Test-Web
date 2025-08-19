const axios = require('axios');

const API_BASE_URL = 'https://test-web-qtok.onrender.com';

async function createAdminUser() {
  console.log('👤 Creating admin user...');
  
  const adminData = {
    name: 'Admin User',
    email: 'admin@lech-fita.com',
    password: 'admin123456',
    role: 'admin'
  };
  
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/register`, adminData);
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', adminData.email);
    console.log('🔑 Password:', adminData.password);
    console.log('🎫 Token:', response.data.token);
    
    return response.data.token;
  } catch (error) {
    console.log('❌ Error creating admin:', error.response?.data?.message || error.message);
    return null;
  }
}

async function loginAdmin() {
  console.log('🔐 Logging in as admin...');
  
  const loginData = {
    email: 'admin@lech-fita.com',
    password: 'admin123456'
  };
  
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, loginData);
    console.log('✅ Admin login successful!');
    console.log('🎫 Token:', response.data.token);
    
    return response.data.token;
  } catch (error) {
    console.log('❌ Error logging in:', error.response?.data?.message || error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Setting up admin access...');
  
  // Try to create admin user first
  let token = await createAdminUser();
  
  // If creation fails, try to login
  if (!token) {
    token = await loginAdmin();
  }
  
  if (token) {
    console.log('\n🎉 Admin setup completed!');
    console.log('📋 You can now:');
    console.log('   1. Login to your frontend with admin@lech-fita.com');
    console.log('   2. Access the admin panel');
    console.log('   3. Add categories and products');
    console.log('   4. Manage orders and users');
  } else {
    console.log('❌ Failed to setup admin access');
  }
}

main().catch(console.error);