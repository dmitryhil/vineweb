import React, { useState, useEffect } from 'react';
import Header from '../components/Header/Header';
import Hero from '../components/Hero/Hero';
import Products from '../components/Products/Products';
import Footer from '../components/Footer/Footer';

const HomePage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('home');
  const [wishlistItems, setWishlistItems] = useState([]);
  const [user, setUser] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);

  // Инициализация пользователя из localStorage
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Ошибка парсинга данных пользователя:', error);
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
      }
    }
  }, []);

  const addToCart = async (product, size) => {
    if (!user) {
      // Показать модальное окно авторизации
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        },
        body: JSON.stringify({
          productId: product._id,
          size: size,
          quantity: 1
        })
      });
      
      if (response.ok) {
        const cartData = await response.json();
        setCartItems(cartData);
      }
    } catch (error) {
      console.error('Ошибка добавления в корзину:', error);
    }
  };

  const addToWishlist = async (product) => {
    if (!user) {
      // Показать модальное окно авторизации
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        },
        body: JSON.stringify({
          productId: product._id
        })
      });
      
      if (response.ok) {
        const wishlistData = await response.json();
        setWishlistItems(wishlistData);
      }
    } catch (error) {
      console.error('Ошибка добавления в избранное:', error);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/wishlist/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        }
      });
      
      if (response.ok) {
        const wishlistData = await response.json();
        setWishlistItems(wishlistData);
      }
    } catch (error) {
      console.error('Ошибка удаления из избранного:', error);
    }
  };

  const removeFromCart = (productId, size) => {
    setCartItems(prev => prev.filter(item => !(item.id === productId && item.size === size)));
  };

  const updateCartQuantity = (productId, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCartItems(prev => 
      prev.map(item =>
        item.id === productId && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const handleLogin = (userData, token) => {
    setUser(userData);
    // Load user's wishlist and order history from server if needed
  };

  const handleLogout = () => {
    setUser(null);
    setWishlistItems([]);
    setOrderHistory([]);
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  return (
    <div className="App">
      <Header 
        cartItems={cartItems}
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
        activeCategory={activeCategory}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        wishlistItems={wishlistItems}
        onAddToCart={addToCart}
        onRemoveFromCart={removeFromCart}
        onUpdateCartQuantity={updateCartQuantity}
        onClearCart={clearCart}
        onRemoveFromWishlist={removeFromWishlist}
        orderHistory={orderHistory}
      />
      <main className="main">
        {activeCategory === 'home' && <Hero />}
        
        {/* Category-specific content */}
        {activeCategory !== 'home' && (
          <div className="category-page">
            <div className="container py-8">
              <div className="category-header mb-8">
                <h1 className="text-3xl font-bold text-center mb-4">
                  {activeCategory === 'girls' && 'Колекція для дівчат'}
                  {activeCategory === 'boys' && 'Колекція для хлопців'}
                  {activeCategory === 'accessories' && 'Аксесуари'}
                  {activeCategory === 'sale' && 'Розпродаж'}
                </h1>
                <p className="text-center text-gray max-w-2xl mx-auto">
                  {activeCategory === 'girls' && 'Стильний та якісний одяг для дівчат від 2 до 14 років. Розміри до 164 см.'}
                  {activeCategory === 'boys' && 'Сучасний та комфортний одяг для хлопців від 2 до 14 років. Розміри до 164 см.'}
                  {activeCategory === 'accessories' && 'Модні аксесуари для завершення образу вашої дитини.'}
                  {activeCategory === 'sale' && 'Найкращі знижки на якісний дитячий одяг. Встигніть придбати!'}
                </p>
              </div>
            </div>
          </div>
        )}

        <Products 
          searchQuery={searchQuery}
          activeCategory={activeCategory}
          addToCart={addToCart}
          addToWishlist={addToWishlist}
          wishlistItems={wishlistItems}
          user={user}
        />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;