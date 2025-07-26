import React, { useState } from 'react';
import './Account.css';

const Account = ({ isOpen, onClose, user, onLogout, wishlistItems, orderHistory = [] }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  if (!isOpen) return null;

  const handleSaveProfile = () => {
    // Здесь будет логика сохранения профиля
    setIsEditing(false);
    alert('Профіль оновлено!');
  };

  const tabs = [
    { id: 'profile', name: 'Профіль', icon: 'fas fa-user' },
    { id: 'orders', name: 'Замовлення', icon: 'fas fa-box' },
    { id: 'wishlist', name: 'Бажання', icon: 'fas fa-heart' },
    { id: 'settings', name: 'Налаштування', icon: 'fas fa-cog' }
  ];

  return (
    <div className="account-overlay">
      <div className="account-modal">
        <div className="account-header">
          <h2>
            <i className="fas fa-user-circle"></i>
            Особистий кабінет
          </h2>
          <button className="account-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="account-content">
          <div className="account-sidebar">
            <div className="user-info">
              <div className="user-avatar">
                <i className="fas fa-user-circle"></i>
              </div>
              <h3>{user?.firstName} {user?.lastName}</h3>
              <p>{user?.email}</p>
            </div>
            
            <nav className="account-nav">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <i className={tab.icon}></i>
                  {tab.name}
                </button>
              ))}
            </nav>
            
            <button className="logout-btn" onClick={onLogout}>
              <i className="fas fa-sign-out-alt"></i>
              Вийти
            </button>
          </div>

          <div className="account-main">
            {activeTab === 'profile' && (
              <div className="profile-section">
                <div className="section-header">
                  <h3>Інформація профілю</h3>
                  <button 
                    className="edit-btn"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <i className={isEditing ? 'fas fa-times' : 'fas fa-edit'}></i>
                    {isEditing ? 'Скасувати' : 'Редагувати'}
                  </button>
                </div>
                
                <div className="profile-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Ім'я</label>
                      <input
                        type="text"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="form-group">
                      <label>Прізвище</label>
                      <input
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Телефон</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  {isEditing && (
                    <button className="save-btn" onClick={handleSaveProfile}>
                      <i className="fas fa-save"></i>
                      Зберегти зміни
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="orders-section">
                <h3>Історія замовлень</h3>
                {orderHistory.length === 0 ? (
                  <div className="empty-state">
                    <i className="fas fa-box-open"></i>
                    <p>У вас поки немає замовлень</p>
                  </div>
                ) : (
                  <div className="orders-list">
                    {orderHistory.map(order => (
                      <div key={order.id} className="order-item">
                        <div className="order-header">
                          <span className="order-number">Замовлення #{order.id}</span>
                          <span className="order-date">{order.date}</span>
                        </div>
                        <div className="order-status">
                          <span className={`status ${order.status}`}>{order.statusText}</span>
                        </div>
                        <div className="order-total">{order.total} ₴</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="wishlist-section">
                <h3>Список бажань ({wishlistItems.length})</h3>
                {wishlistItems.length === 0 ? (
                  <div className="empty-state">
                    <i className="far fa-heart"></i>
                    <p>Ваш список бажань порожній</p>
                  </div>
                ) : (
                  <div className="wishlist-grid">
                    {wishlistItems.map(item => (
                      <div key={item._id} className="wishlist-card">
                        <img 
                          src={item.image ? `http://localhost:5000${item.image}` : 'https://via.placeholder.com/150'} 
                          alt={item.name}
                        />
                        <h4>{item.name}</h4>
                        <p>{item.price} ₴</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="settings-section">
                <h3>Налаштування</h3>
                <div className="settings-list">
                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>Email сповіщення</h4>
                      <p>Отримувати сповіщення про замовлення</p>
                    </div>
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                  </div>
                  
                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>SMS сповіщення</h4>
                      <p>Отримувати SMS про статус замовлення</p>
                    </div>
                    <label className="switch">
                      <input type="checkbox" />
                      <span className="slider"></span>
                    </label>
                  </div>
                  
                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>Маркетингові розсилки</h4>
                      <p>Отримувати інформацію про акції та знижки</p>
                    </div>
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;