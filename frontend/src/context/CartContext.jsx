import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const item = window.localStorage.getItem('bookstore_cart');
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.warn('Error reading localStorage', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('bookstore_cart', JSON.stringify(cartItems));
    } catch (error) {
      console.warn('Error setting localStorage', error);
    }
  }, [cartItems]);

  const addToCart = (book) => {
    const existing = cartItems.find(item => item.id === book.id);
    if (existing) {
      toast.success(`Increased ${book.title || 'book'} quantity`);
    } else {
      toast.success(`${book.title || 'Book'} added to cart!`, { icon: '🛒' });
    }
    
    setCartItems(prev => {
      if (existing) {
        return prev.map(item =>
          item.id === book.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...book, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setCartItems(prev => prev.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => setCartItems([]);

  // FIX: quickBuyItem holds a single book for immediate checkout WITHOUT touching the real cart.
  // Previously, quickBuy called setCartItems([...]) which wiped all other cart items.
  const [quickBuyItem, setQuickBuyItem] = useState(null);

  const quickBuy = (book) => {
    // Only store this book for checkout — the real cart is fully preserved
    setQuickBuyItem({ ...book, quantity: 1 });
    toast.success(`Ready to buy: ${book.title || 'Book'}!`, { icon: '⚡' });
  };

  const clearQuickBuy = () => setQuickBuyItem(null);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      quickBuy,
      quickBuyItem,
      clearQuickBuy,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);
