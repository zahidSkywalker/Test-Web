console.log('🔍 Checking dependencies...');

const deps = [
  'express',
  'mongoose', 
  'cors',
  'helmet',
  'compression',
  'express-rate-limit',
  'bcryptjs',
  'jsonwebtoken',
  'express-validator',
  'multer',
  'cloudinary',
  'nodemailer',
  'path'
];

deps.forEach(dep => {
  try {
    require(dep);
    console.log(`✅ ${dep} - OK`);
  } catch (error) {
    console.log(`❌ ${dep} - FAILED: ${error.message}`);
  }
});

console.log('🔍 Dependency check complete');