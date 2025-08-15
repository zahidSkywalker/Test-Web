import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { 
  FiX, FiHome, FiPackage, FiHeart, FiUser, FiShoppingCart, 
  FiSettings, FiLogOut, FiShield, FiSearch, FiMenu 
} from 'react-icons/fi';

const MobileMenu = ({ onClose }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();

  const handleLogout = () => {
    logout();
    onClose();
  };

  const mainMenuItems = [
    { icon: FiHome, label: 'Home', href: '/', description: 'Back to homepage' },
    { icon: FiPackage, label: 'Products', href: '/products', description: 'Browse all products' },
    { icon: FiHeart, label: 'Categories', href: '/categories', description: 'Shop by category' },
  ];

  const userMenuItems = isAuthenticated ? [
    { icon: FiUser, label: 'Profile', href: '/profile', description: 'Manage your account' },
    { icon: FiPackage, label: 'Orders', href: '/orders', description: 'View your orders' },
    { icon: FiHeart, label: 'Wishlist', href: '/wishlist', description: 'Your saved items' },
    { icon: FiSettings, label: 'Settings', href: '/settings', description: 'Account preferences' },
  ] : [];

  // Add admin link if user is admin
  if (user?.role === 'admin') {
    userMenuItems.push({
      icon: FiShield,
      label: 'Admin Panel',
      href: '/admin',
      description: 'Manage the store'
    });
  }

  const categoryItems = [
    { name: 'Skincare', href: '/category/skincare', icon: '🧴' },
    { name: 'Makeup', href: '/category/makeup', icon: '💄' },
    { name: 'Fragrances', href: '/category/fragrances', icon: '🌸' },
    { name: 'Hair Care', href: '/category/haircare', icon: '💇‍♀️' },
    { name: 'Body Care', href: '/category/bodycare', icon: '🛁' },
    { name: 'Tools & Brushes', href: '/category/tools', icon: '🖌️' },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween', duration: 0.3 }}
          className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-primary">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* User Info */}
          {isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 border-b border-gray-100 bg-gray-50"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{user?.name}</div>
                  <div className="text-sm text-gray-500">{user?.email}</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Quick Actions */}
          <div className="p-4 border-b border-gray-100">
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/cart"
                onClick={onClose}
                className="flex items-center justify-center space-x-2 p-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200"
              >
                <FiShoppingCart size={20} />
                <span>Cart ({itemCount})</span>
              </Link>
              <Link
                to="/search"
                onClick={onClose}
                className="flex items-center justify-center space-x-2 p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                <FiSearch size={20} />
                <span>Search</span>
              </Link>
            </div>
          </div>

          {/* Main Menu */}
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Main Menu
            </h3>
            <div className="space-y-1">
              {mainMenuItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Link
                    to={item.href}
                    onClick={onClose}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <item.icon className="w-5 h-5 text-gray-500" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{item.label}</div>
                      <div className="text-sm text-gray-500">{item.description}</div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
              Categories
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {categoryItems.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  <Link
                    to={category.href}
                    onClick={onClose}
                    className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <div className="text-sm font-medium text-gray-900 text-center">
                      {category.name}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* User Menu */}
          {isAuthenticated && (
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Account
              </h3>
              <div className="space-y-1">
                {userMenuItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                  >
                    <Link
                      to={item.href}
                      onClick={onClose}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <item.icon className="w-5 h-5 text-gray-500" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{item.label}</div>
                        <div className="text-sm text-gray-500">{item.description}</div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Auth Buttons */}
          {!isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-4 border-b border-gray-100"
            >
              <div className="space-y-3">
                <Link
                  to="/login"
                  onClick={onClose}
                  className="block w-full text-center py-3 px-4 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={onClose}
                  className="block w-full text-center py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200"
                >
                  Create Account
                </Link>
              </div>
            </motion.div>
          )}

          {/* Logout Button */}
          {isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-4"
            >
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                <FiLogOut size={20} />
                <span>Sign Out</span>
              </button>
            </motion.div>
          )}

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-center text-sm text-gray-500">
              <div className="font-semibold text-primary mb-1">Lech-Fita</div>
              <div>Premium Cosmetics from Bangladesh</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MobileMenu;