import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiSettings, FiLogOut, FiHeart, FiPackage, FiShield } from 'react-icons/fi';

const UserMenu = ({ onClose }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose();
  };

  const menuItems = [
    {
      icon: FiUser,
      label: 'Profile',
      href: '/profile',
      description: 'Manage your account'
    },
    {
      icon: FiPackage,
      label: 'Orders',
      href: '/orders',
      description: 'View your orders'
    },
    {
      icon: FiHeart,
      label: 'Wishlist',
      href: '/wishlist',
      description: 'Your saved items'
    },
    {
      icon: FiSettings,
      label: 'Settings',
      href: '/settings',
      description: 'Account preferences'
    }
  ];

  // Add admin link if user is admin
  if (user?.role === 'admin') {
    menuItems.push({
      icon: FiShield,
      label: 'Admin Panel',
      href: '/admin',
      description: 'Manage the store'
    });
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50"
      >
        {/* User Info Header */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-semibold text-gray-900">{user?.name}</div>
              <div className="text-sm text-gray-500">{user?.email}</div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-2">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Link
                to={item.href}
                onClick={onClose}
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                <item.icon className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-sm text-gray-500">{item.description}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Logout Button */}
        <div className="border-t border-gray-100 pt-2">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: 0.3 }}
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200"
          >
            <FiLogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UserMenu;