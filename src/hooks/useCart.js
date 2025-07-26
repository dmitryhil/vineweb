import { useState } from 'react';

export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, selectedSize) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => 
        item.id === product.id && item.selectedSize === selectedSize
      );
      
      if (existingItem) {
        return prev.map(item => 
          item.id === product.id && item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prev, { ...product, selectedSize, quantity: 1 }];
    });
  };

  const removeFromCart = (productId, selectedSize) => {
    setCartItems(prev => 
      prev.filter(item => !(item.id === productId && item.selectedSize === selectedSize))
    );
  };

  const updateQuantity = (productId, selectedSize, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize);
      return;
    }

    setCartItems(prev => 
      prev.map(item => 
        item.id === productId && item.selectedSize === selectedSize
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount
  };
};