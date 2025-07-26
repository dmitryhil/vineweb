import React, { useState } from 'react';
import './Cart.css';

const Cart = ({ isOpen, onClose, cartItems = [], onUpdateQuantity, onRemoveFromCart, onClearCart, user, onAuthRequired }) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (!isOpen) return null;

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    if (!user) {
      onAuthRequired();
      return;
    }
    setIsCheckingOut(true);
    // Здесь будет логика оформления заказа
    setTimeout(() => {
      alert('Замовлення оформлено! Дякуємо за покупку!');
      onClearCart();
      setIsCheckingOut(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="cart-overlay">
      <div className="cart-modal">
        <div className="cart-header">
          <h2>
            <i className="fas fa-shopping-cart"></i>
            Кошик ({itemsCount})
          </h2>
          <button className="cart-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <i className="fas fa-shopping-cart"></i>
              <h3>Ваш кошик порожній</h3>
              <p>Додайте товари для покупки</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map(item => (
                  <div key={`${item._id}-${item.selectedSize}`} className="cart-item">
                    <div className="item-image">
                      <img 
                        src={item.image ? `http://localhost:5000${item.image}` : 'https://via.placeholder.com/100'} 
                        alt={item.name}
                      />
                    </div>
                    
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p className="item-category">{item.category}</p>
                      <p className="item-size">Розмір: {item.selectedSize}</p>
                      <div className="item-price">
                        <span className="price">{item.price} ₴</span>
                        {item.originalPrice && (
                          <span className="original-price">{item.originalPrice} ₴</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="item-controls">
                      <div className="quantity-controls">
                        <button 
                          onClick={() => onUpdateQuantity(item._id, item.selectedSize, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <i className="fas fa-minus"></i>
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item._id, item.selectedSize, item.quantity + 1)}
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>
                      
                      <div className="item-total">
                        {(item.price * item.quantity)} ₴
                      </div>
                      
                      <button 
                        className="remove-item"
                        onClick={() => onRemoveFromCart(item._id, item.selectedSize)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="cart-footer">
                <div className="cart-summary">
                  <div className="summary-row">
                    <span>Товарів: {itemsCount}</span>
                    <span>{total} ₴</span>
                  </div>
                  <div className="summary-row">
                    <span>Доставка:</span>
                    <span>Безкоштовно</span>
                  </div>
                  <div className="summary-total">
                    <span>Загалом:</span>
                    <span>{total} ₴</span>
                  </div>
                </div>
                
                <div className="cart-actions">
                  <button className="clear-cart" onClick={onClearCart}>
                    Очистити кошик
                  </button>
                  <button 
                    className="checkout-btn" 
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                  >
                    {isCheckingOut ? 'Оформлення...' : 'Оформити замовлення'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;