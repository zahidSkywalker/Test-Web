import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Category from './pages/Category';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import OurStory from './pages/OurStory';
import Careers from './pages/Careers';
import Press from './pages/Press';
import Help from './pages/Help';
import Contact from './pages/Contact';
import Shipping from './pages/Shipping';
import Returns from './pages/Returns';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Profile from './pages/Profile/Profile';
import Orders from './pages/Profile/Orders';
import Wishlist from './pages/Profile/Wishlist';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminProducts from './pages/Admin/Products';
import AdminOrders from './pages/Admin/Orders';
import AdminUsers from './pages/Admin/Users';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="products" element={<Products />} />
              <Route path="products/:id" element={<ProductDetail />} />
              <Route path="category/:slug" element={<Category />} />
              <Route path="about" element={<About />} />
              <Route path="story" element={<OurStory />} />
              <Route path="careers" element={<Careers />} />
              <Route path="press" element={<Press />} />
              <Route path="help" element={<Help />} />
              <Route path="contact" element={<Contact />} />
              <Route path="shipping" element={<Shipping />} />
              <Route path="returns" element={<Returns />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="profile" element={<Profile />} />
              <Route path="orders" element={<Orders />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="admin/products" element={<AdminProducts />} />
              <Route path="admin/orders" element={<AdminOrders />} />
              <Route path="admin/users" element={<AdminUsers />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;