import React from 'react';
import './Wishlist.css';

const Wishlist = ({ isOpen, onClose, wishlistItems = [], onRemoveFromWishlist, onAddToCart, user }) => {
  if (!isOpen) return null;

  const handleAddToCart = (product) => {
    if (!user) {
      alert('Для додавання в кошик потрібно авторизуватися');
      return;
    }
    onAddToCart(product, product.sizes[0]); // Добавляем первый доступный размер
    onRemoveFromWishlist(product._id);
  };

  return (
    <div className="wishlist-overlay">
      <div className="wishlist-modal">
        <div className="wishlist-header">
          <h2>
            <i className="fas fa-heart"></i>
            Список бажань
          </h2>
          <button className="wishlist-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="wishlist-content">
          {wishlistItems.length === 0 ? (
            <div className="wishlist-empty">
              <i className="far fa-heart"></i>
              <h3>Ваш список бажань порожній</h3>
              <p>Додайте товари, які вам сподобались</p>
            </div>
          ) : (
            <div className="wishlist-items">
              {wishlistItems.map(item => (
                <div key={item._id} className="wishlist-item">
                  <div className="item-image">
                    <img 
                      src={item.image ? `${item.image}` : 'https://via.placeholder.com/150'}
                      alt={item.name}
                    />
                  </div>
                  
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p className="item-category">{item.category}</p>
                    <div className="item-price">
                      <span className="current-price">{item.price} ₴</span>
                      {item.originalPrice && (
                        <span className="original-price">{item.originalPrice} ₴</span>
                      )}
                    </div>
                    <div className="item-sizes">
                      {item.sizes.map(size => (
                        <span key={size} className="size-tag">{size}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="item-actions">
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(item)}
                    >
                      <i className="fas fa-shopping-cart"></i>
                      В кошик
                    </button>
                    <button 
                      className="remove-btn"
                      onClick={() => onRemoveFromWishlist(item._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;