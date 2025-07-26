import React, { useState, useEffect } from 'react';
import './AdminPanel.css';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import Dashboard from './Dashboard';
import AuthWrapper from './AuthWrapper';
import AdminDebugTest from '../../debug/AdminDebugTest';
import ApiTester from '../../debug/ApiTester';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    // Проверка токена при загрузке
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        if (parsedUser.role === 'admin') {
          setUser(parsedUser);
          setIsAuthenticated(true);
          loadProducts();
        } else {
          // Если пользователь не админ, очищаем данные
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
        }
      } catch (error) {
        console.error('Ошибка парсинга данных пользователя:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      }
    }
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/products');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Loaded products:', data); // Для отладки
      
      // API возвращает объект с полем products
      setProducts(data.products || []);
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error);
      setProducts([]);
      alert('Ошибка загрузки товаров: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData, token) => {
    console.log('Login data:', userData); // Для отладки
    
    if (userData.role !== 'admin') {
      alert('У вас нет прав администратора');
      return;
    }
    
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminUser', JSON.stringify(userData));
    loadProducts();
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setActiveTab('dashboard');
  };

  const handleProductSave = async (productData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        alert('Токен авторизации отсутствует');
        return;
      }

      console.log('Saving product:', productData); // Для отладки
      
      const formData = new FormData();
      
      // Добавляем все поля кроме изображений
      Object.keys(productData).forEach(key => {
        if (key === 'sizes') {
          formData.append(key, JSON.stringify(productData[key]));
        } else if (key === 'tags') {
          formData.append(key, JSON.stringify(productData[key] || []));
        } else if (key === 'images' && Array.isArray(productData[key])) {
          // Обработка множественных изображений
          productData[key].forEach((file) => {
            if (file instanceof File) {
              formData.append('images', file);
            }
          });
        } else if (key !== 'images') {
          formData.append(key, productData[key]);
        }
      });

      // Логируем содержимое FormData для отладки
      console.log('FormData contents:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const url = editingProduct 
        ? `http://localhost:5000/api/products/${editingProduct._id}`
        : 'http://localhost:5000/api/products';
      
      const method = editingProduct ? 'PUT' : 'POST';

      console.log(`Making ${method} request to:`, url); // Для отладки

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      console.log('Response status:', response.status); // Для отладки

      if (response.ok) {
        const result = await response.json();
        console.log('Product saved successfully:', result);
        
        await loadProducts(); // Перезагружаем товары
        setEditingProduct(null);
        setActiveTab('products');
        alert(editingProduct ? 'Товар успешно обновлен!' : 'Товар успешно добавлен!');
      } else {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        alert('Ошибка: ' + (errorData.error || 'Неизвестная ошибка сервера'));
      }
    } catch (error) {
      console.error('Ошибка сохранения товара:', error);
      alert('Ошибка сохранения товара: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProductEdit = (product) => {
    console.log('Editing product:', product); // Для отладки
    setEditingProduct(product);
    setActiveTab('add-product');
  };

  const handleProductDelete = async (productId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        alert('Токен авторизации отсутствует');
        return;
      }

      console.log('Deleting product ID:', productId); // Для отладки

      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Delete response status:', response.status); // Для отладки

      if (response.ok) {
        const result = await response.json();
        console.log('Product deleted successfully:', result);
        
        await loadProducts(); // Перезагружаем товары
        alert('Товар успешно удален!');
      } else {
        const errorData = await response.json();
        console.error('Delete error:', errorData);
        alert('Ошибка удаления: ' + (errorData.error || 'Неизвестная ошибка сервера'));
      }
    } catch (error) {
      console.error('Ошибка удаления товара:', error);
      alert('Ошибка удаления товара: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Функция для проверки подключения к серверу
  const checkServerConnection = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      if (response.ok) {
        console.log('Server connection OK');
        return true;
      } else {
        console.error('Server responded with error:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Server connection failed:', error);
      return false;
    }
  };

  if (!isAuthenticated) {
    return <AuthWrapper onLogin={handleLogin} />;
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Панель адміністратора VINESENT</h1>
        <div className="admin-user-info">
          <span>Вітаємо, {user?.username} ({user?.role})</span>
          <button onClick={handleLogout} className="logout-btn">
            Вийти
          </button>
        </div>
      </div>

      <div className="admin-content">
        <nav className="admin-nav">
          <button 
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Панель управління
          </button>
          <button 
            className={activeTab === 'products' ? 'active' : ''}
            onClick={() => setActiveTab('products')}
          >
            📦 Товари ({products.length})
          </button>
          <button 
            className={activeTab === 'add-product' ? 'active' : ''}
            onClick={() => {
              setEditingProduct(null);
              setActiveTab('add-product');
            }}
          >
            ➕ Додати товар
          </button>
          <button 
            className={activeTab === 'debug' ? 'active' : ''}
            onClick={() => setActiveTab('debug')}
          >
            🔧 Отладка
          </button>
          <button 
            className={activeTab === 'api-test' ? 'active' : ''}
            onClick={() => setActiveTab('api-test')}
          >
            🌐 API Тест
          </button>
        </nav>

        <main className="admin-main">
          {loading && (
            <div className="admin-loading">
              <div className="spinner"></div>
              <p>Завантаження...</p>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <Dashboard products={products} />
          )}

          {activeTab === 'products' && (
            <ProductList 
              products={products}
              onEdit={handleProductEdit}
              onDelete={handleProductDelete}
              loading={loading}
            />
          )}

          {activeTab === 'add-product' && (
            <ProductForm 
              product={editingProduct}
              onSave={handleProductSave}
              onCancel={() => {
                setEditingProduct(null);
                setActiveTab('products');
              }}
              loading={loading}
            />
          )}

          {activeTab === 'debug' && (
            <div className="debug-panel">
              <h3>Информация для отладки</h3>
              <div>
                <strong>Пользователь:</strong> {JSON.stringify(user, null, 2)}
              </div>
              <div>
                <strong>Токен:</strong> {localStorage.getItem('adminToken') ? 'Присутствует' : 'Отсутствует'}
              </div>
              <div>
                <strong>Количество товаров:</strong> {products.length}
              </div>
              <button onClick={checkServerConnection}>
                Проверить подключение к серверу
              </button>
              <button onClick={loadProducts}>
                Перезагрузить товары
              </button>
              {typeof AdminDebugTest !== 'undefined' && <AdminDebugTest />}
            </div>
          )}

          {activeTab === 'api-test' && (
            typeof ApiTester !== 'undefined' ? <ApiTester /> : 
            <div>API Tester компонент не найден</div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;