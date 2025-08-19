const mongoose = require('mongoose');
require('dotenv').config();

async function setAdminRole() {
  console.log('🔗 Connecting to database...');
  
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lech-fita', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Database connected!');
    
    // Import User model
    const User = require('./models/User');
    
    // Find the admin user
    const user = await User.findOne({ email: 'admin@lech-fita.com' });
    
    if (!user) {
      console.log('❌ Admin user not found');
      return;
    }
    
    console.log('👤 Found user:', user.name);
    console.log('🎭 Current role:', user.role);
    
    // Update role to admin
    user.role = 'admin';
    await user.save();
    
    console.log('✅ Role updated to admin!');
    console.log('🎭 New role:', user.role);
    
    console.log('\n🎉 Admin role set successfully!');
    console.log('📋 You can now:');
    console.log('   1. Login to your frontend with admin@lech-fita.com');
    console.log('   2. Access the admin panel');
    console.log('   3. Add categories and products');
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Database disconnected');
  }
}

setAdminRole();