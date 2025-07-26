import React, { useState, useEffect } from 'react';
import './ProductModal.css';

const ProductModal = ({ product, isOpen, onClose, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [favorites, setFavorites] = useState(new Set());
  const [quantity, setQuantity] = useState(1);

  const colorMapping = {
    'black': { hex: '#000000', label: 'Чорний' },
    'white': { hex: '#ffffff', label: 'Білий' },
    'blue': { hex: '#1e3a8a', label: 'Синій' },
    'red': { hex: '#dc2626', label: 'Червоний' },
    'green': { hex: '#16a34a', label: 'Зелений' },
    'gray': { hex: '#6b7280', label: 'Сірий' },
    'brown': { hex: '#92400e', label: 'Коричневий' },
    'pink': { hex: '#ec4899', label: 'Рожевий' }
  };

  // Use colors from product data or fallback to empty array
  const availableColors = product?.colors || [];

  // Set initial color when product changes
  useEffect(() => {
    if (product && availableColors.length > 0) {
      setSelectedColor(availableColors[0]);
    }
  }, [product]);

  const handleToggleFavorite = (productId, e) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      alert('Будь ласка, оберіть розмір');
      return;
    }
    
    if (onAddToCart) {
      onAddToCart(product, selectedSize, quantity);
    }
    
    alert('Товар додано до кошика!');
  };

  if (!isOpen || !product) return null;

  return (
    <div className="product-modal-overlay" onClick={onClose}>
      <div className="product-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="product-modal-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        
        <div className="product-modal-content">
          {/* Product Images */}
          <div className="product-modal-images">
            <div className="product-modal-main-image">
              <img 
                src={product.image ? `http://localhost:5000${product.image}` : '/api/placeholder/400/500'} 
                alt={product.name} 
                className="main-product-image"
                onError={(e) => {
                  e.target.src = '/api/placeholder/400/500';
                }}
              />
            </div>
            
            {/* Image Thumbnails */}
            <div className="product-modal-thumbnails">
              {[1, 2, 3, 4].map((_, index) => (
                <div 
                  key={index}
                  className={`thumbnail ${currentImageIndex === index ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img 
                    src={product.image ? `http://localhost:5000${product.image}` : '/api/placeholder/60/60'} 
                    alt="Thumbnail"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/60/60';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Product Details */}
          <div className="product-modal-details">
            <div className="product-modal-header">
              <div>
                <h2 className="product-modal-title">{product.name}</h2>
                <p className="product-modal-category">{product.category}</p>
              </div>
              <button 
                className={`favorite-button ${favorites.has(product.id || product._id) ? 'active' : ''}`}
                onClick={(e) => handleToggleFavorite(product.id || product._id, e)}
              >
                <i className={favorites.has(product.id || product._id) ? 'fas fa-heart' : 'far fa-heart'}></i>
              </button>
            </div>
            
            {/* Views and Reviews */}
            <div className="product-modal-stats">
              <span className="views-count">
                <i className="fas fa-eye"></i>
                {Math.floor(Math.random() * 500) + 100} переглядів
              </span>
              <button className="review-button">
                Написати відгук
              </button>
            </div>
            
            {/* Price */}
            <div className="product-modal-price">
              <div className="price-container">
                <span className="current-price">{product.price} грн</span>
                {product.originalPrice && (
                  <span className="original-price">{product.originalPrice} грн</span>
                )}
                {product.originalPrice && (
                  <span className="discount-badge">
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </span>
                )}
              </div>
              <p className="stock-info">
                В наявності ({product.stockQuantity || 5} шт.)
              </p>
            </div>
            
            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="product-modal-sizes">
                <h3>Розмір</h3>
                <div className="size-options">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <button className="size-guide">
                  Таблиця розмірів
                </button>
              </div>
            )}
            
            {/* Color Selection */}
            {availableColors.length > 0 && (
              <div className="product-modal-colors">
                <h3>Колір</h3>
                <div className="color-options">
                  {availableColors.map(color => (
                    <button
                      key={color}
                      className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                      style={{ 
                        backgroundColor: colorMapping[color]?.hex || '#6b7280'
                      }}
                      onClick={() => setSelectedColor(color)}
                      title={colorMapping[color]?.label || color}
                    ></button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quantity Selection */}
            <div className="product-modal-quantity">
              <h3>Кількість</h3>
              <div className="quantity-controls">
                <button 
                  className="quantity-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="quantity-value">{quantity}</span>
                <button 
                  className="quantity-btn"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="product-modal-actions">
              <button 
                className="add-to-cart-btn"
                onClick={handleAddToCart}
              >
                <i className="fas fa-shopping-cart"></i>
                Додати в кошик
              </button>
              <button className="buy-now-btn">
                Купити зараз
              </button>
            </div>
            
            {/* Description */}
            <div className="product-modal-description">
              <h3>Опис</h3>
              <p>
                {product.description || 'Стильний та якісний товар, який ідеально підходить для повсякденного носіння. Виготовлений з високоякісних матеріалів для максимального комфорту та довговічності.'}
              </p>
            </div>
            
            {/* Specifications */}
            <div className="product-modal-specs">
              <h3>Характеристики</h3>
              <ul>
                <li><i className="fas fa-check"></i>Матеріал: 100% бавовна</li>
                <li><i className="fas fa-check"></i>Догляд: машинне прання при 30°C</li>
                <li><i className="fas fa-check"></i>Країна виробництва: Україна</li>
                <li><i className="fas fa-check"></i>Гарантія: 6 місяців</li>
              </ul>
            </div>
            
            {/* Additional Actions */}
            <div className="product-modal-additional">
              <button className="share-btn">
                <i className="fas fa-share-alt"></i>
                <span>Поділитися</span>
              </button>
              <button className="compare-btn">
                <i className="fas fa-exchange-alt"></i>
                <span>Порівняти</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;