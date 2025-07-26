import React, { useState } from 'react';
import './UserAuth.css';
import ApiService from '../../services/api';

const UserAuth = ({ isOpen, onClose, onLogin }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!isLoginMode && formData.password !== formData.confirmPassword) {
        setError('Паролі не співпадають');
        setLoading(false);
        return;
      }

      const payload = isLoginMode 
        ? { username: formData.username, password: formData.password }
        : formData;

      const data = isLoginMode 
        ? await ApiService.login(payload)
        : await ApiService.register(payload);

      localStorage.setItem('userToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));
      
      // Проверяем роль администратора
      if (data.user.role === 'admin' || data.user.isAdmin) {
        localStorage.setItem('isAdmin', 'true');
      }
      
      onLogin(data.user, data.token);
      onClose();
    } catch (error) {
      setError(error.message || 'Помилка зєднання з сервером');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        <button className="auth-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        
        <div className="auth-header">
          <h2>{isLoginMode ? 'Вхід' : 'Реєстрація'}</h2>
          <p>{isLoginMode ? 'Увійдіть до свого акаунту' : 'Створіть новий акаунт'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}
          
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Ім'я користувача"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>

          {!isLoginMode && (
            <>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-row">
                <input
                  type="text"
                  name="firstName"
                  placeholder="Ім'я"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Прізвище"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Телефон"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </>
          )}

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Пароль"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          {!isLoginMode && (
            <div className="form-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Підтвердіть пароль"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Завантаження...' : (isLoginMode ? 'Увійти' : 'Зареєструватися')}
          </button>
        </form>

        <div className="auth-switch">
          <p>
            {isLoginMode ? 'Немає акаунту?' : 'Вже є акаунт?'}
            <button 
              type="button" 
              onClick={() => setIsLoginMode(!isLoginMode)}
              className="auth-switch-btn"
            >
              {isLoginMode ? 'Зареєструватися' : 'Увійти'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserAuth;