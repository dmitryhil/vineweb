import React, { useState } from 'react';
import './Login.css';

const Login = ({ onLogin, onSwitchToRegister }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting login with:', credentials.username); // Для отладки

      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      console.log('Login response status:', response.status); // Для отладки

      const data = await response.json();
      console.log('Login response data:', data); // Для отладки

      if (response.ok) {
        // Проверяем, что пользователь является администратором
        if (data.user && data.user.role === 'admin') {
          console.log('Admin login successful'); // Для отладки
          onLogin(data.user, data.token);
        } else {
          setError('У вас нет прав администратора');
        }
      } else {
        setError(data.error || 'Ошибка входа');
      }
    } catch (error) {
      console.error('Login error:', error); // Для отладки
      setError('Ошибка подключения к серверу: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <h2 className="admin-login-title">Вход в панель администратора</h2>
        
        {/* Информация для отладки */}
        <div style={{ 
          background: '#f0f0f0', 
          padding: '10px', 
          marginBottom: '20px', 
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          <strong>Данные администратора по умолчанию:</strong><br/>
          Логин: admin<br/>
          Пароль: admin123
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-form-field">
            <label htmlFor="username" className="admin-form-label">Имя пользователя:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
              className="admin-form-input"
              autoComplete="username"
            />
          </div>
          <div className="admin-form-field">
            <label htmlFor="password" className="admin-form-label">Пароль:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              className="admin-form-input"
              autoComplete="current-password"
            />
          </div>
          {error && <div className="admin-error-msg">{error}</div>}
          <button type="submit" disabled={loading} className="admin-submit-btn">
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
        
        <div className="admin-switch-auth">
          <p>Нет аккаунта администратора?</p>
          <button 
            type="button" 
            onClick={onSwitchToRegister}
            className="admin-switch-btn"
          >
            Зарегистрироваться
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;