# Lech-Fita - Premium Women's Cosmetics E-Commerce

A full-stack, production-ready E-Commerce website for women's cosmetics, built with the MERN stack and focused on the Bangladeshi market with SSL Commerce payment integration.

## 🌟 Features

### Frontend Features
- **Modern UI/UX** with Framer Motion animations
- **Responsive Design** for all devices
- **Product Catalog** with advanced filtering and search
- **Shopping Cart** with real-time updates
- **User Authentication** (Login/Register)
- **User Profile Management**
- **Wishlist** functionality
- **Order Management** and tracking
- **Product Reviews** and ratings
- **Admin Dashboard** for product and order management

### Backend Features
- **RESTful API** with Express.js
- **MongoDB** database with Mongoose ODM
- **JWT Authentication** and authorization
- **File Upload** with Cloudinary integration
- **Payment Processing** with SSL Commerce (Bangladesh)
- **Email Notifications** with Nodemailer
- **Rate Limiting** and security middleware
- **Input Validation** and sanitization

### Payment Integration
- **SSL Commerce** (Credit/Debit Cards)
- **bKash** mobile banking
- **Nagad** mobile banking
- **Rocket** mobile banking
- **Cash on Delivery (COD)**

## 🚀 Tech Stack

### Frontend
- **React 18** with Hooks
- **React Router** for navigation
- **Framer Motion** for animations
- **Tailwind CSS** for styling
- **React Query** for state management
- **Axios** for HTTP requests
- **React Hook Form** for forms

### Backend
- **Node.js** with Express.js
- **MongoDB** database
- **Mongoose** ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Multer** for file uploads
- **Cloudinary** for image storage
- **Nodemailer** for emails

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn package manager

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd lech-fita-ecommerce
```

### 2. Install backend dependencies
```bash
npm install
```

### 3. Install frontend dependencies
```bash
cd client
npm install
cd ..
```

### 4. Environment Configuration
Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/lech-fita

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# SSL Commerce Configuration (Bangladesh)
SSL_COMMERCE_STORE_ID=your_ssl_commerce_store_id
SSL_COMMERCE_STORE_PASSWORD=your_ssl_commerce_store_password
SSL_COMMERCE_IS_SANDBOX=true

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

### 5. Database Setup
```bash
# Start MongoDB (if running locally)
mongod

# Or use MongoDB Atlas cloud database
```

### 6. Run the application

#### Development Mode
```bash
# Run both frontend and backend
npm run dev

# Or run separately:
# Backend
npm run server

# Frontend
npm run client
```

#### Production Mode
```bash
# Build frontend
npm run build

# Start production server
npm start
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/user` - Get user data
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/featured` - Get featured products
- `GET /api/products/new` - Get new products
- `GET /api/products/on-sale` - Get products on sale
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category by slug
- `GET /api/categories/tree` - Get category tree

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Cart
- `GET /api/orders/cart` - Get user cart
- `POST /api/orders/cart/add` - Add item to cart
- `PUT /api/orders/cart/update` - Update cart item
- `DELETE /api/orders/cart/remove/:id` - Remove item from cart

### Payment
- `POST /api/payment/ssl-commerce/init` - Initialize SSL Commerce payment
- `POST /api/payment/ssl-commerce/success` - Handle payment success
- `POST /api/payment/ssl-commerce/fail` - Handle payment failure
- `GET /api/payment/methods` - Get payment methods

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Change password
- `GET /api/users/wishlist` - Get user wishlist

## 🎨 Customization

### Colors and Theme
The application uses CSS custom properties for easy theming. Main colors are defined in `client/src/index.css`:

```css
:root {
  --primary-color: #ff6b9d;
  --secondary-color: #8b5cf6;
  /* ... other variables */
}
```

### Animations
Framer Motion animations are used throughout the application. Customize animations in individual components.

## 🚀 Deployment

### Heroku Deployment
1. Create a Heroku account
2. Install Heroku CLI
3. Create a new Heroku app
4. Set environment variables in Heroku dashboard
5. Deploy using Git:

```bash
heroku git:remote -a your-app-name
git push heroku main
```

### Vercel Deployment (Frontend)
1. Install Vercel CLI
2. Deploy frontend:

```bash
cd client
vercel
```

### Environment Variables for Production
Ensure all environment variables are set in your production environment:
- `MONGODB_URI`
- `JWT_SECRET`
- `SSL_COMMERCE_STORE_ID`
- `SSL_COMMERCE_STORE_PASSWORD`
- `CLOUDINARY_*` variables
- `EMAIL_*` variables

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Helmet security headers
- XSS protection

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🧪 Testing

```bash
# Run frontend tests
cd client
npm test

# Run backend tests (if implemented)
npm test
```

## 📊 Performance

- Lazy loading of components
- Image optimization
- Code splitting
- Efficient state management
- Optimized database queries

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact: support@lech-fita.com

## 🙏 Acknowledgments

- Framer Motion for animations
- Tailwind CSS for styling
- React community for excellent documentation
- SSL Commerce for payment integration

---

**Lech-Fita** - Premium Women's Cosmetics from Bangladesh 🇧🇩