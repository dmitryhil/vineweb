import React, { useState } from 'react';
import './Login.css'; // Используем те же стили

const Register = ({ onRegister, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'admin'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Функция автозаполнения для тестирования
  const fillTestData = () => {
    setFormData({
      username: 'Admin',
      email: 'basa@basa.basa',
      password: 'basabasa',
      confirmPassword: 'basabasa',
      role: 'admin'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Проверка совпадения паролей
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Администратор успешно зарегистрирован!');
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'admin'
        });
        // Автоматически переключаемся на логин через 2 секунды
        setTimeout(() => {
          onSwitchToLogin();
        }, 2000);
      } else {
        setError(data.error || 'Ошибка регистрации');
      }
    } catch (error) {
      setError('Ошибка подключения к серверу');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Регистрация администратора</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Имя пользователя:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Пароль:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Подтвердите пароль:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Регистрация...' : 'Зарегистрировать'}
          </button>
          <button type="button" onClick={fillTestData} className="test-fill-btn">
            🧪 Заполнить тестовые данные
          </button>
          <button type="button" onClick={onSwitchToLogin} className="switch-btn">
            Уже есть аккаунт? Войти
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;