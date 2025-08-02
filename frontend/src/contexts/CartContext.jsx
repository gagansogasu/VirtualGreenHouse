import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cart from backend on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await cartAPI.getCart();
        // Backend returns { items: [...], totalAmount: ... }
        setCart(response.data.items || []);
      } catch (error) {
        // fallback: try localStorage if backend fails
        const savedCart = localStorage.getItem('cart');
        setCart(savedCart ? JSON.parse(savedCart) : []);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  // Save to localStorage for fallback only
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Add to cart (sync with backend)
  const addToCart = async (item, quantity = 1) => {
    try {
      await cartAPI.addToCart(item.id, quantity);
      const response = await cartAPI.getCart();
      setCart(response.data.items || []);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  // Remove from cart (sync with backend)
  const removeFromCart = async (itemId) => {
    try {
      await cartAPI.removeCartItem(itemId);
      const response = await cartAPI.getCart();
      setCart(response.data.items || []);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  // Update quantity (sync with backend)
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      await removeFromCart(itemId);
      return;
    }
    try {
      await cartAPI.updateCartItem(itemId, newQuantity);
      const response = await cartAPI.getCart();
      setCart(response.data.items || []);
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };

  // Clear cart (sync with backend)
  const clearCart = async () => {
    try {
      await cartAPI.clearCart();
      setCart([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const cartTotal = cart.reduce(
    (total, item) => total + (item.price * item.quantity),
    0
  );

  const cartCount = cart.reduce(
    (count, item) => count + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        loading
      }}
    >
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

export default CartContext;
