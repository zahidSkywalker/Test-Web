import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiHeart } from 'react-icons/fi';
import SearchBar from '../Search/SearchBar';
import UserMenu from './UserMenu';
import MobileMenu from './MobileMenu';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const { isAuthenticated, user } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setShowMobileMenu(false);
  }, [location.pathname]);

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
  };

  const handleUserMenuToggle = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleMobileMenuToggle = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-lg backdrop-blur-md bg-opacity-95' 
          : 'bg-white'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-2xl font-bold text-primary"
              >
                Lech-Fita
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-primary transition-colors duration-200"
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className="text-gray-700 hover:text-primary transition-colors duration-200"
              >
                Products
              </Link>
              <Link 
                to="/category/skincare" 
                className="text-gray-700 hover:text-primary transition-colors duration-200"
              >
                Skincare
              </Link>
              <Link 
                to="/category/makeup" 
                className="text-gray-700 hover:text-primary transition-colors duration-200"
              >
                Makeup
              </Link>
              <Link 
                to="/category/fragrances" 
                className="text-gray-700 hover:text-primary transition-colors duration-200"
              >
                Fragrances
              </Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSearchToggle}
                className="p-2 text-gray-600 hover:text-primary transition-colors duration-200"
              >
                <FiSearch size={20} />
              </motion.button>

              {/* Wishlist */}
              {isAuthenticated && (
                <Link to="/wishlist" className="p-2 text-gray-600 hover:text-primary transition-colors duration-200">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FiHeart size={20} />
                  </motion.div>
                </Link>
              )}

              {/* Cart */}
              <Link to="/cart" className="relative p-2 text-gray-600 hover:text-primary transition-colors duration-200">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiShoppingCart size={20} />
                  {itemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
                    >
                      {itemCount > 99 ? '99+' : itemCount}
                    </motion.span>
                  )}
                </motion.div>
              </Link>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleUserMenuToggle}
                    className="flex items-center space-x-2 p-2 text-gray-600 hover:text-primary transition-colors duration-200"
                  >
                    <FiUser size={20} />
                    <span className="hidden sm:block text-sm font-medium">
                      {user?.name?.split(' ')[0]}
                    </span>
                  </motion.button>
                  
                  <AnimatePresence>
                    {showUserMenu && (
                      <UserMenu onClose={() => setShowUserMenu(false)} />
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden sm:flex items-center space-x-3">
                  <Link 
                    to="/login"
                    className="text-gray-700 hover:text-primary transition-colors duration-200 font-medium"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register"
                    className="btn btn-primary"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={handleMobileMenuToggle}
                className="md:hidden p-2 text-gray-600 hover:text-primary transition-colors duration-200"
              >
                {showMobileMenu ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-gray-200 bg-white"
            >
              <div className="container mx-auto px-4 py-4">
                <SearchBar onClose={() => setShowSearch(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <MobileMenu onClose={() => setShowMobileMenu(false)} />
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="h-16"></div>
    </>
  );
};

export default Header;