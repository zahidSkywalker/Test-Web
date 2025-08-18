import React from 'react';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiStar, FiShoppingCart, FiHeart, FiEye } from 'react-icons/fi';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const FeaturedProducts = () => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  // Fetch featured products
  const { data: products, isLoading, error } = useQuery(
    'featured-products',
    async () => {
      const response = await axios.get('/api/products/featured');
      return response.data;
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    
    try {
      await addToCart(product, 1);
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      toast.error('Failed to add item to cart');
    }
  };

  const handleQuickView = (product) => {
    // Navigate to product detail page
    window.location.href = `/products/${product._id}`;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
            <div className="bg-gray-200 h-4 rounded mb-2"></div>
            <div className="bg-gray-200 h-4 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">Failed to load featured products</div>
        <button 
          onClick={() => window.location.reload()}
          className="btn btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-4">No featured products available</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {products.map((product, index) => (
        <motion.div
          key={product._id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
        >
          {/* Product Image */}
          <div className="relative overflow-hidden">
            <Link to={`/products/${product._id}`}>
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                src={product.mainImage}
                alt={product.name}
                className="w-full h-40 sm:h-48 md:h-56 lg:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.isNew && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  NEW
                </span>
              )}
              {product.onSale && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  SALE
                </span>
              )}
              {product.isFeatured && (
                <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  FEATURED
                </span>
              )}
            </div>

            {/* Quick Actions */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleQuickView(product)}
                className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-primary transition-colors duration-200"
                title="Quick View"
              >
                <FiEye size={16} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-red-500 transition-colors duration-200"
                title="Add to Wishlist"
              >
                <FiHeart size={16} />
              </motion.button>
            </div>

            {/* Discount Badge */}
            {product.onSale && (
              <div className="absolute bottom-3 left-3">
                <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full font-bold">
                  -{product.discountPercentage}%
                </span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4">
            {/* Category */}
            <div className="text-xs text-gray-500 mb-2">
              {product.category?.name}
            </div>

            {/* Product Name */}
            <Link to={`/products/${product._id}`}>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-200 line-clamp-2">
                {product.name}
              </h3>
            </Link>

            {/* Rating */}
            <div className="flex items-center mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-2">
                ({product.numReviews})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-primary">
                  ৳{product.price}
                </span>
                {product.onSale && (
                  <span className="text-sm text-gray-500 line-through">
                    ৳{product.originalPrice}
                  </span>
                )}
              </div>
              
              {/* Stock Status */}
              <div className={`text-xs px-2 py-1 rounded-full ${
                product.inStock 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </div>
            </div>

            {/* Add to Cart Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAddToCart(product)}
              disabled={!product.inStock}
              className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                product.inStock
                  ? 'bg-primary text-white hover:bg-primary-dark shadow-md hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <FiShoppingCart size={16} />
              <span>
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </span>
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default FeaturedProducts;