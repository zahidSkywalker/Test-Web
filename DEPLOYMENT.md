# 🚀 **Lech-Fita E-Commerce Deployment Guide**

This guide will walk you through deploying your Lech-Fita e-commerce website to **Render** (for backend) and **Vercel** (for frontend).

## 📋 **Prerequisites**

Before deploying, ensure you have:

- ✅ **GitHub Account** - Your code should be in a GitHub repository
- ✅ **MongoDB Atlas Account** - For cloud database (free tier available)
- ✅ **Cloudinary Account** - For image storage (free tier available)
- ✅ **SSL Commerce Account** - For payment processing in Bangladesh
- ✅ **Environment Variables** - All necessary API keys and configuration

## 🌐 **Platform Overview**

- **Backend (Node.js + Express)**: Deploy to **Render**
- **Frontend (React)**: Deploy to **Vercel**
- **Database**: MongoDB Atlas (cloud)
- **File Storage**: Cloudinary
- **Payment**: SSL Commerce

---

## 🎯 **Option 1: Render (Backend) + Vercel (Frontend)**

### **Step 1: Deploy Backend to Render**

#### 1.1 **Prepare Your Repository**
```bash
# Ensure your repository structure is correct
lech-fita-ecommerce/
├── server.js
├── package.json
├── .env.example
├── models/
├── routes/
├── middleware/
├── scripts/
└── client/          # React frontend
```

#### 1.2 **Create Render Account**
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"

#### 1.3 **Connect Repository**
1. **Connect your GitHub repository**
2. **Select the repository**: `your-username/lech-fita-ecommerce`
3. **Branch**: `main` (or your default branch)

#### 1.4 **Configure Web Service**
```
Name: lech-fita-backend
Environment: Node
Build Command: npm install
Start Command: npm start
```

#### 1.5 **Environment Variables**
Add these environment variables in Render:

```env
# Server Configuration
NODE_ENV=production
PORT=10000

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lech-fita?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your_super_secure_jwt_secret_key_here

# SSL Commerce Configuration
SSL_COMMERCE_STORE_ID=your_ssl_commerce_store_id
SSL_COMMERCE_STORE_PASSWORD=your_ssl_commerce_store_password
SSL_COMMERCE_IS_SANDBOX=false

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# Admin Configuration
ADMIN_EMAIL=admin@lech-fita.com
ADMIN_PASSWORD=admin123

# Currency
CURRENCY=BDT
CURRENCY_SYMBOL=৳
```

#### 1.6 **Deploy**
1. Click "Create Web Service"
2. Wait for build to complete
3. Note your backend URL: `https://lech-fita-backend.onrender.com`

### **Step 2: Deploy Frontend to Vercel**

#### 2.1 **Update Frontend Configuration**
Update `client/src/context/AuthContext.js` and other API calls to use your Render backend URL:

```javascript
// Replace localhost:5000 with your Render URL
const API_BASE_URL = 'https://lech-fita-backend.onrender.com';
```

#### 2.2 **Create Vercel Account**
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"

#### 2.3 **Import Repository**
1. **Import your GitHub repository**
2. **Framework Preset**: Next.js (or React)
3. **Root Directory**: `client`
4. **Build Command**: `npm run build`
5. **Output Directory**: `build`

#### 2.4 **Environment Variables**
Add these in Vercel:

```env
REACT_APP_API_URL=https://lech-fita-backend.onrender.com
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

#### 2.5 **Deploy**
1. Click "Deploy"
2. Wait for build to complete
3. Your site will be live at: `https://lech-fita.vercel.app`

---

## 🎯 **Option 2: Render (Full Stack)**

### **Step 1: Prepare for Full-Stack Deployment**

#### 1.1 **Update package.json Scripts**
```json
{
  "scripts": {
    "start": "node server.js",
    "build": "cd client && npm install && npm run build",
    "postinstall": "npm run build"
  }
}
```

#### 1.2 **Update server.js**
Ensure your server serves the React build:

```javascript
// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
```

### **Step 2: Deploy to Render**

#### 2.1 **Create Web Service**
1. **Repository**: Your GitHub repo
2. **Environment**: Node
3. **Build Command**: `npm install && npm run build`
4. **Start Command**: `npm start`

#### 2.2 **Environment Variables**
Same as above, plus:

```env
NODE_ENV=production
```

---

## 🎯 **Option 3: Vercel (Full Stack)**

### **Step 1: Prepare for Vercel Deployment**

#### 1.1 **Create vercel.json**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server.js"
    },
    {
      "src": "/(.*)",
      "dest": "client/build/$1"
    }
  ]
}
```

#### 1.2 **Update package.json**
```json
{
  "scripts": {
    "build": "cd client && npm install && npm run build",
    "vercel-build": "npm run build"
  }
}
```

### **Step 2: Deploy to Vercel**

1. **Import repository**
2. **Framework Preset**: Other
3. **Build Command**: `npm run vercel-build`
4. **Output Directory**: `client/build`

---

## 🔧 **Database Setup (MongoDB Atlas)**

### **Step 1: Create MongoDB Atlas Cluster**
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free account
3. Create new cluster (free tier)
4. Choose cloud provider and region

### **Step 2: Configure Database Access**
1. **Database Access** → **Add New Database User**
2. Username: `lech-fita-user`
3. Password: Generate secure password
4. Role: `Read and write to any database`

### **Step 3: Configure Network Access**
1. **Network Access** → **Add IP Address**
2. **Allow Access from Anywhere**: `0.0.0.0/0`

### **Step 4: Get Connection String**
1. **Clusters** → **Connect**
2. **Connect your application**
3. Copy connection string
4. Replace `<password>` with your user password

---

## ☁️ **Cloudinary Setup**

### **Step 1: Create Account**
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for free account
3. Get your credentials from dashboard

### **Step 2: Configure Environment Variables**
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 💳 **SSL Commerce Setup**

### **Step 1: Create Account**
1. Go to [sslcommerz.com](https://sslcommerz.com)
2. Sign up for merchant account
3. Complete verification process

### **Step 2: Get Credentials**
1. **Store ID**: Your unique store identifier
2. **Store Password**: Your store password
3. **Sandbox Mode**: Use for testing

### **Step 3: Configure Environment Variables**
```env
SSL_COMMERCE_STORE_ID=your_store_id
SSL_COMMERCE_STORE_PASSWORD=your_store_password
SSL_COMMERCE_IS_SANDBOX=true  # Set to false for production
```

---

## 🚀 **Post-Deployment Steps**

### **Step 1: Seed Database**
```bash
# Run the seeding script
node scripts/seedDatabase.js
```

### **Step 2: Test Your Application**
1. **Frontend**: Visit your Vercel/Render URL
2. **Backend API**: Test endpoints with Postman
3. **Database**: Verify data in MongoDB Atlas
4. **Payment**: Test SSL Commerce integration

### **Step 3: Monitor Performance**
1. **Render**: Check logs and performance metrics
2. **Vercel**: Monitor analytics and performance
3. **MongoDB**: Check database performance
4. **Cloudinary**: Monitor image uploads

---

## 🔒 **Security Considerations**

### **Environment Variables**
- ✅ Never commit `.env` files to Git
- ✅ Use strong, unique passwords
- ✅ Rotate secrets regularly
- ✅ Use different secrets for dev/staging/prod

### **CORS Configuration**
```javascript
// In your server.js
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://yourdomain.com', 'https://www.yourdomain.com']
    : ['http://localhost:3000'],
  credentials: true
}));
```

### **Rate Limiting**
```javascript
// Already configured in your server.js
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
```

---

## 🐛 **Troubleshooting**

### **Common Issues**

#### **Build Failures**
```bash
# Check build logs
npm run build

# Verify dependencies
npm install

# Check Node.js version
node --version  # Should be >= 16.0.0
```

#### **Database Connection Issues**
```bash
# Test MongoDB connection
mongosh "your_connection_string"

# Check network access in Atlas
# Verify username/password
```

#### **API Errors**
```bash
# Check backend logs
# Verify environment variables
# Test endpoints with Postman
```

#### **Frontend Issues**
```bash
# Check browser console
# Verify API URL configuration
# Check CORS settings
```

---

## 📱 **Mobile Optimization**

### **PWA Features**
1. **Service Worker**: Already configured
2. **Manifest**: Already configured
3. **Offline Support**: Implement caching strategies

### **Performance**
1. **Image Optimization**: Use Cloudinary transformations
2. **Lazy Loading**: Implement for images
3. **Code Splitting**: React.lazy for route-based splitting

---

## 🔄 **Continuous Deployment**

### **Automatic Deployments**
1. **Render**: Automatically deploys on Git push
2. **Vercel**: Automatically deploys on Git push
3. **Database**: Manual seeding required

### **Deployment Pipeline**
```bash
# Development workflow
git add .
git commit -m "Update feature"
git push origin main

# Automatic deployment to Render + Vercel
# Manual database updates if needed
```

---

## 📊 **Monitoring & Analytics**

### **Performance Monitoring**
1. **Render**: Built-in monitoring
2. **Vercel**: Analytics dashboard
3. **MongoDB**: Atlas monitoring
4. **Custom**: Implement logging

### **Error Tracking**
1. **Sentry**: For error monitoring
2. **Logs**: Check platform logs
3. **Alerts**: Set up notifications

---

## 🎉 **Congratulations!**

Your Lech-Fita e-commerce website is now deployed and ready for customers!

### **Next Steps**
1. **Custom Domain**: Configure custom domain
2. **SSL Certificate**: Automatic with platforms
3. **SEO**: Optimize for search engines
4. **Marketing**: Start promoting your store
5. **Analytics**: Track customer behavior

### **Support**
- **Render**: [docs.render.com](https://docs.render.com)
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **MongoDB**: [docs.mongodb.com](https://docs.mongodb.com)
- **Cloudinary**: [cloudinary.com/documentation](https://cloudinary.com/documentation)

---

**Happy Selling! 🛍️✨**