const axios = require('axios');

const API_BASE_URL = 'https://test-web-qtok.onrender.com';

async function updateUserRole() {
  console.log('🔐 Logging in as admin...');
  
  const loginData = {
    email: 'admin@lech-fita.com',
    password: 'admin123456'
  };
  
  try {
    // First, login to get token
    const loginResponse = await axios.post(`${API_BASE_URL}/api/auth/login`, loginData);
    const token = loginResponse.data.token;
    const userId = loginResponse.data.user.id;
    
    console.log('✅ Login successful!');
    console.log('👤 User ID:', userId);
    console.log('🎭 Current role:', loginResponse.data.user.role);
    
    // Update user role to admin using the correct route
    const updateData = {
      role: 'admin'
    };
    
    const updateResponse = await axios.put(`${API_BASE_URL}/api/users/${userId}/role`, updateData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ User role updated to admin!');
    console.log('🎭 New role:', updateResponse.data.role);
    
    return token;
  } catch (error) {
    console.log('❌ Error:', error.response?.data?.message || error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Updating user role to admin...');
  
  const token = await updateUserRole();
  
  if (token) {
    console.log('\n🎉 Admin role updated successfully!');
    console.log('📋 You can now:');
    console.log('   1. Login to your frontend with admin@lech-fita.com');
    console.log('   2. Access the admin panel');
    console.log('   3. Add categories and products');
  } else {
    console.log('❌ Failed to update admin role');
  }
}

main().catch(console.error);