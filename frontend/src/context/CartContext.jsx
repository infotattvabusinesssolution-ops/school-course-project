import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('skillwell_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (err) {
      console.error("Error loading cart from local storage:", err);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('skillwell_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
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
