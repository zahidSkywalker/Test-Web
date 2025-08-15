import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const CartContext = createContext();

const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
  loading: false,
  error: null
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        items: action.payload,
        total: calculateTotal(action.payload),
        itemCount: calculateItemCount(action.payload),
        loading: false
      };
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => 
        item.product._id === action.payload.product._id
      );
      
      let newItems;
      if (existingItem) {
        newItems = state.items.map(item =>
          item.product._id === action.payload.product._id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        newItems = [...state.items, action.payload];
      }
      
      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: calculateItemCount(newItems)
      };
    case 'UPDATE_QUANTITY':
      const updatedItems = state.items.map(item =>
        item.product._id === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
        itemCount: calculateItemCount(updatedItems)
      };
    case 'REMOVE_ITEM':
      const filteredItems = state.items.filter(
        item => item.product._id !== action.payload
      );
      
      return {
        ...state,
        items: filteredItems,
        total: calculateTotal(filteredItems),
        itemCount: calculateItemCount(filteredItems)
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0,
        itemCount: 0
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    default:
      return state;
  }
};

const calculateTotal = (items) => {
  return items.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);
};

const calculateItemCount = (items) => {
  return items.reduce((count, item) => count + item.quantity, 0);
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated, user } = useAuth();

  // Load cart from server if user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadCart();
    }
  }, [isAuthenticated, user]);

  const loadCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await axios.get('/api/orders/cart');
      dispatch({ type: 'SET_CART', payload: res.data });
    } catch (error) {
      console.error('Error loading cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load cart' });
    }
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      if (isAuthenticated) {
        // Add to server cart
        await axios.post('/api/orders/cart/add', {
          productId: product._id,
          quantity
        });
        await loadCart(); // Reload cart from server
      } else {
        // Add to local cart
        dispatch({
          type: 'ADD_ITEM',
          payload: { product, quantity }
        });
      }
      
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add item to cart';
      toast.error(message);
      dispatch({ type: 'SET_ERROR', payload: message });
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      if (isAuthenticated) {
        // Update server cart
        await axios.put('/api/orders/cart/update', {
          productId,
          quantity
        });
        await loadCart(); // Reload cart from server
      } else {
        // Update local cart
        dispatch({
          type: 'UPDATE_QUANTITY',
          payload: { productId, quantity }
        });
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update quantity';
      toast.error(message);
      dispatch({ type: 'SET_ERROR', payload: message });
    }
  };

  const removeFromCart = async (productId) => {
    try {
      if (isAuthenticated) {
        // Remove from server cart
        await axios.delete(`/api/orders/cart/remove/${productId}`);
        await loadCart(); // Reload cart from server
      } else {
        // Remove from local cart
        dispatch({
          type: 'REMOVE_ITEM',
          payload: productId
        });
      }
      
      toast.success('Item removed from cart');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove item';
      toast.error(message);
      dispatch({ type: 'SET_ERROR', payload: message });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast.success('Cart cleared');
  };

  const isInCart = (productId) => {
    return state.items.some(item => item.product._id === productId);
  };

  const getItemQuantity = (productId) => {
    const item = state.items.find(item => item.product._id === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    items: state.items,
    total: state.total,
    itemCount: state.itemCount,
    loading: state.loading,
    error: state.error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isInCart,
    getItemQuantity,
    loadCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};