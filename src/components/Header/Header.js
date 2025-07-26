import React, { useState } from 'react';
import './Header.css';
import UserAuth from '../Auth/UserAuth';
import Cart from '../Cart/Cart';
import Wishlist from '../Wishlist/Wishlist';
import Account from '../Account/Account';

const Header = ({ 
  cartItems, 
  onSearch, 
  onCategoryChange, 
  activeCategory,
  user,
  onLogin,
  onLogout,
  wishlistItems,
  onAddToCart,
  onRemoveFromCart,
  onUpdateCartQuantity,
  onClearCart,
  onRemoveFromWishlist,
  orderHistory
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeSubcategory, setActiveSubcategory] = useState('all');
  
  // Модальные окна
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  const cartItemsCount = cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;
  const wishlistCount = wishlistItems?.length || 0;

  const categories = {
    girls: {
      name: 'Дівчата',
      subcategories: [
        { id: 'all', name: 'Все' },
        { id: 'dresses', name: 'Сукні' },
        { id: 'tops', name: 'Топи' },
        { id: 'pants', name: 'Штани' },
        { id: 'skirts', name: 'Спідниці' },
        { id: 'jackets', name: 'Куртки' },
        { id: 'shoes', name: 'Взуття' },
        { id: 'accessories', name: 'Аксесуари' }
      ]
    },
    boys: {
      name: 'Хлопці',
      subcategories: [
        { id: 'all', name: 'Все' },
        { id: 'shirts', name: 'Сорочки' },
        { id: 'tshirts', name: 'Футболки' },
        { id: 'pants', name: 'Штани' },
        { id: 'shorts', name: 'Шорти' },
        { id: 'jackets', name: 'Куртки' },
        { id: 'shoes', name: 'Взуття' },
        { id: 'accessories', name: 'Аксесуари' }
      ]
    },
    accessories: {
      name: 'Аксесуари',
      subcategories: [
        { id: 'all', name: 'Все' },
        { id: 'bags', name: 'Сумки' },
        { id: 'jewelry', name: 'Прикраси' },
        { id: 'watches', name: 'Годинники' },
        { id: 'belts', name: 'Ремені' },
        { id: 'hats', name: 'Головні убори' }
      ]
    }
  };

  const handleCategoryChange = (category) => {
    if (onCategoryChange) {
      onCategoryChange(category);
    }
    setActiveSubcategory('all');
  };

  const handleSubcategoryChange = (subcategory) => {
    setActiveSubcategory(subcategory);
  };

  const handleUserIconClick = () => {
    if (user) {
      setIsAccountOpen(true);
    } else {
      setIsAuthOpen(true);
    }
  };

  const handleAuthSuccess = (userData) => {
    setIsAuthOpen(false);
    if (onLogin) {
      onLogin(userData);
    }
  };

  const handleLogout = () => {
    setIsAccountOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <>
      {/* Top Sale Banner */}
      <div className="sale-banner">
        <div className="container">
          <div className="sale-content">
            <span className="sale-text">
              <i className="fas fa-fire"></i>
              SALE - Знижки до 50%
            </span>
            <span className="sale-description">
              Розпродаж літньої колекції
            </span>
          </div>
          <span className="delivery-text">
            <i className="fas fa-truck"></i>
            Безкоштовна доставка від 1000 грн
          </span>
        </div>
      </div>
      
      {/* Main Navigation */}
      <nav className="main-navigation">
        <div className="container">
          <div className="nav-content">
            {/* Mobile Menu Button */}
            <button 
              className="mobile-menu-btn"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>

            {/* Left Navigation */}
            <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
              <a 
                href="#" 
                className={`nav-link ${activeCategory === 'home' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('home')}
              >
                Головна
              </a>
              <a 
                href="#" 
                className={`nav-link ${activeCategory === 'girls' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('girls')}
              >
                Дівчата
              </a>
              <a 
                href="#" 
                className={`nav-link ${activeCategory === 'boys' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('boys')}
              >
                Хлопці
              </a>
              <a 
                href="#" 
                className={`nav-link ${activeCategory === 'accessories' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('accessories')}
              >
                Аксесуари
              </a>
              <a 
                href="#" 
                className="nav-link sale-link"
                onClick={() => handleCategoryChange('sale')}
              >
                <i className="fas fa-percent"></i>
                Розпродаж
              </a>
            </div>
            
            {/* Centered Logo */}
            <div className="nav-logo">
              <span className="logo-text">VINESENT</span>
              <span className="logo-subtitle">Premium Kids Fashion</span>
            </div>
            
            {/* Right Navigation */}
            <div className="nav-actions">
              {/* Search */}
              <div className={`search-container ${isSearchOpen ? 'active' : ''}`}>
                <input
                  type="text"
                  placeholder="Пошук товарів..."
                  value={searchValue}
                  onChange={handleSearchChange}
                  className="search-input"
                />
                <button 
                  className="search-btn"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                >
                  <i className="fas fa-search"></i>
                </button>
              </div>

              {/* User Account */}
              <button className="nav-icon" onClick={handleUserIconClick}>
                <i className={user ? 'fas fa-user-circle' : 'far fa-user'}></i>
                <span className="icon-label">
                  {user ? user.firstName || 'Акаунт' : 'Вхід'}
                </span>
                {user && <span className="user-indicator"></span>}
              </button>

              {/* Favorites */}
              <button className="nav-icon" onClick={() => setIsWishlistOpen(true)}>
                <i className={wishlistCount > 0 ? 'fas fa-heart' : 'far fa-heart'}></i>
                {wishlistCount > 0 && (
                  <span className="wishlist-badge">{wishlistCount}</span>
                )}
                <span className="icon-label">Вподобання</span>
              </button>

              {/* Cart */}
              <button className="nav-icon cart-icon" onClick={() => setIsCartOpen(true)}>
                <i className="fas fa-shopping-bag"></i>
                {cartItemsCount > 0 && (
                  <span className="cart-badge">{cartItemsCount}</span>
                )}
                <span className="icon-label">Кошик</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Subcategory Navigation */}
      {activeCategory && categories[activeCategory] && (
        <div className="subcategory-nav">
          <div className="container">
            <div className="subcategory-scroll">
              {categories[activeCategory].subcategories.map((sub) => (
                <button
                  key={sub.id}
                  className={`subcategory-btn ${activeSubcategory === sub.id ? 'active' : ''}`}
                  onClick={() => handleSubcategoryChange(sub.id)}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Модальные окна */}
      <UserAuth 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      <Cart 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={onRemoveFromCart}
        onUpdateQuantity={onUpdateCartQuantity}
        onClearCart={onClearCart}
        user={user}
        onLoginRequired={() => {
          setIsCartOpen(false);
          setIsAuthOpen(true);
        }}
      />

      <Wishlist 
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        items={wishlistItems}
        onAddToCart={onAddToCart}
        onRemoveFromWishlist={onRemoveFromWishlist}
      />

      <Account 
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        user={user}
        onLogout={handleLogout}
        wishlistItems={wishlistItems}
        orderHistory={orderHistory}
      />
    </>
  );
};

export default Header;