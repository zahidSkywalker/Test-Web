const axios = require('axios');

const API_BASE_URL = 'https://test-web-qtok.onrender.com';

async function createNewAdmin() {
  console.log('👤 Creating new admin user...');
  
  const adminData = {
    name: 'Admin User',
    email: 'admin2@lech-fita.com',
    password: 'admin123456',
    role: 'admin'
  };
  
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/register`, adminData);
    console.log('✅ New admin user created successfully!');
    console.log('📧 Email:', adminData.email);
    console.log('🔑 Password:', adminData.password);
    console.log('🎭 Role:', response.data.user.role);
    console.log('🎫 Token:', response.data.token);
    
    return response.data.token;
  } catch (error) {
    console.log('❌ Error creating admin:', error.response?.data?.message || error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Creating new admin user...');
  
  const token = await createNewAdmin();
  
  if (token) {
    console.log('\n🎉 New admin user created!');
    console.log('📋 You can now:');
    console.log('   1. Login to your frontend with admin2@lech-fita.com');
    console.log('   2. Access the admin panel');
    console.log('   3. Add categories and products');
  } else {
    console.log('❌ Failed to create admin user');
  }
}

main().catch(console.error);