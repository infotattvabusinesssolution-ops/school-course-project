import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const { user } = useAuth();

  // Build a unique storage key per user so carts are isolated per account
  const getStorageKey = (u) => u ? `crmisa_cart_${u._id || u.id || u.email}` : null;

  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage whenever user changes (login/logout)
  useEffect(() => {
    const key = getStorageKey(user);
    if (!key) {
      // Not logged in — ensure cart is empty and clear any leftover anonymous cart
      setCartItems([]);
      localStorage.removeItem('skillwell_cart'); // clean old key
      return;
    }
    try {
      const saved = localStorage.getItem(key);
      setCartItems(saved ? JSON.parse(saved) : []);
    } catch {
      setCartItems([]);
    }
  }, [user]);

  // Persist cart to localStorage (only when user is logged in)
  useEffect(() => {
    const key = getStorageKey(user);
    if (!key) return;
    localStorage.setItem(key, JSON.stringify(cartItems));
  }, [cartItems, user]);

  const addToCart = (item) => {
    if (!user) return; // Do nothing silently — caller must check auth first
    setCartItems(prev => {
      const itemId = item._id || item.id;
      const exists = prev.find(i => (i._id || i.id) === itemId);
      if (exists) return prev;
      return [...prev, item];
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(i => (i._id || i.id) !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    const key = getStorageKey(user);
    if (key) localStorage.removeItem(key);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = typeof item.price === 'number'
        ? item.price
        : parseInt(String(item.price).replace(/[^0-9]/g, '')) || 0;
      return total + price;
    }, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      getCartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
}
