import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiTrendingUp } from 'react-icons/fi';
import { useQuery } from 'react-query';
import axios from 'axios';

const SearchBar = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Fetch search suggestions
  const { data: suggestions, isLoading } = useQuery(
    ['search-suggestions', query],
    async () => {
      if (query.length < 2) return [];
      const response = await axios.get(`/api/products?search=${query}&limit=5`);
      return response.data.products;
    },
    {
      enabled: query.length >= 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save recent searches to localStorage
  const saveSearch = (searchTerm) => {
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Handle search submission
  const handleSearch = (searchTerm = query) => {
    if (searchTerm.trim()) {
      saveSearch(searchTerm.trim());
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      onClose();
    }
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Trending searches (you can customize these)
  const trendingSearches = [
    'Skincare', 'Makeup', 'Lipstick', 'Foundation', 'Moisturizer',
    'Anti-aging', 'Natural', 'Organic', 'Sunscreen', 'Serum'
  ];

  return (
    <div className="relative" ref={searchRef}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="relative"
      >
        {/* Search Input */}
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search for products, brands, or categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setIsOpen(true)}
            className="w-full pl-12 pr-12 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors duration-200"
            autoFocus
          />
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <FiX size={20} />
            </motion.button>
          )}
        </div>

        {/* Search Suggestions Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50"
            >
              {/* Search Results */}
              {query.length >= 2 && (
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Search Results</h3>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="spinner"></div>
                    </div>
                  ) : suggestions && suggestions.length > 0 ? (
                    <div className="space-y-2">
                      {suggestions.map((product) => (
                        <motion.div
                          key={product._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          whileHover={{ backgroundColor: '#f9fafb' }}
                          className="flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors duration-200"
                          onClick={() => handleSearch(product.name)}
                        >
                          <img
                            src={product.mainImage}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.category?.name}</div>
                          </div>
                          <div className="text-primary font-semibold">৳{product.price}</div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No products found for "{query}"
                    </div>
                  )}
                </div>
              )}

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="p-4 border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Searches</h3>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleSearch(search)}
                        className="px-3 py-1 bg-gray-100 hover:bg-primary hover:text-white rounded-full text-sm transition-colors duration-200"
                      >
                        {search}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Searches */}
              <div className="p-4 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <FiTrendingUp className="mr-2" />
                  Trending Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((search, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleSearch(search)}
                      className="px-3 py-1 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-full text-sm transition-colors duration-200"
                    >
                      {search}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-4 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => navigate('/products?sort=newest')}
                    className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <div className="font-medium text-gray-900">New Arrivals</div>
                    <div className="text-sm text-gray-500">Latest products</div>
                  </button>
                  <button
                    onClick={() => navigate('/products?sort=popular')}
                    className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <div className="font-medium text-gray-900">Popular</div>
                    <div className="text-sm text-gray-500">Trending items</div>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SearchBar;