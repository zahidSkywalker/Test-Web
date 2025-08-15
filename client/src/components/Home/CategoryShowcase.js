import React from 'react';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import axios from 'axios';

const CategoryShowcase = () => {
  // Fetch featured categories
  const { data: categories, isLoading, error } = useQuery(
    'featured-categories',
    async () => {
      const response = await axios.get('/api/categories/featured');
      return response.data;
    },
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  // Default categories if API fails
  const defaultCategories = [
    {
      name: 'Skincare',
      description: 'Nourish and protect your skin',
      image: '🧴',
      href: '/category/skincare',
      color: 'from-pink-400 to-rose-500',
      productCount: '150+'
    },
    {
      name: 'Makeup',
      description: 'Enhance your natural beauty',
      image: '💄',
      href: '/category/makeup',
      color: 'from-purple-400 to-pink-500',
      productCount: '200+'
    },
    {
      name: 'Fragrances',
      description: 'Discover your signature scent',
      image: '🌸',
      href: '/category/fragrances',
      color: 'from-blue-400 to-purple-500',
      productCount: '80+'
    },
    {
      name: 'Hair Care',
      description: 'Beautiful, healthy hair',
      image: '💇‍♀️',
      href: '/category/haircare',
      color: 'from-green-400 to-blue-500',
      productCount: '120+'
    }
  ];

  const displayCategories = categories && categories.length > 0 ? categories : defaultCategories;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-xl mb-4"></div>
            <div className="bg-gray-200 h-4 rounded mb-2"></div>
            <div className="bg-gray-200 h-4 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    console.warn('Failed to load categories, using defaults:', error);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {displayCategories.map((category, index) => (
        <motion.div
          key={category.name || index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="group"
        >
          <Link to={category.href}>
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-xl transition-all duration-300">
              {/* Category Image/Icon */}
              <div className={`h-48 bg-gradient-to-br ${category.color || 'from-gray-400 to-gray-600'} flex items-center justify-center relative overflow-hidden`}>
                <motion.div
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="text-6xl"
                >
                  {category.image}
                </motion.div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Arrow Icon */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center text-primary shadow-lg"
                >
                  <FiArrowRight size={16} />
                </motion.div>
              </div>

              {/* Category Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-200">
                    {category.name}
                  </h3>
                  {category.productCount && (
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {category.productCount}
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {category.description}
                </p>

                {/* Explore Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center text-primary font-medium group-hover:text-primary-dark transition-colors duration-200"
                >
                  Explore
                  <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </motion.div>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary rounded-xl transition-colors duration-300 pointer-events-none"></div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default CategoryShowcase;