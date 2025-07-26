import React, { useState, useEffect } from 'react';

const AdminDebugTest = () => {
  const [debugInfo, setDebugInfo] = useState({});
  const [testResults, setTestResults] = useState([]);

  const addTestResult = (test, status, message) => {
    setTestResults(prev => [...prev, { test, status, message, timestamp: new Date().toLocaleTimeString() }]);
  };

  const checkTokens = () => {
    const adminToken = localStorage.getItem('adminToken');
    const userToken = localStorage.getItem('userToken');
    const isAdmin = localStorage.getItem('isAdmin');
    
    setDebugInfo({
      adminToken: adminToken ? 'Присутствует' : 'Отсутствует',
      userToken: userToken ? 'Присутствует' : 'Отсутствует',
      isAdmin: isAdmin,
      adminTokenLength: adminToken ? adminToken.length : 0,
      userTokenLength: userToken ? userToken.length : 0
    });

    addTestResult('Проверка токенов', 'info', `AdminToken: ${adminToken ? 'есть' : 'нет'}, UserToken: ${userToken ? 'есть' : 'нет'}`);
  };

  const testTokenDecoding = () => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      try {
        const payload = JSON.parse(atob(adminToken.split('.')[1]));
        addTestResult('Декодирование токена', 'success', `Роль: ${payload.role}, ID: ${payload.id}, Истекает: ${new Date(payload.exp * 1000).toLocaleString()}`);
      } catch (error) {
        addTestResult('Декодирование токена', 'error', `Ошибка: ${error.message}`);
      }
    } else {
      addTestResult('Декодирование токена', 'error', 'Токен отсутствует');
    }
  };

  const testApiConnection = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      if (response.ok) {
        addTestResult('Подключение к API', 'success', `Статус: ${response.status}`);
      } else {
        addTestResult('Подключение к API', 'error', `Статус: ${response.status}`);
      }
    } catch (error) {
      addTestResult('Подключение к API', 'error', `Ошибка: ${error.message}`);
    }
  };

  const testAdminAuth = async () => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      addTestResult('Тест админ авторизации', 'error', 'Токен отсутствует');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      
      if (response.ok) {
        addTestResult('Тест админ авторизации', 'success', 'Доступ к админ API получен');
      } else {
        const errorText = await response.text();
        addTestResult('Тест админ авторизации', 'error', `Статус: ${response.status}, Ошибка: ${errorText}`);
      }
    } catch (error) {
      addTestResult('Тест админ авторизации', 'error', `Ошибка: ${error.message}`);
    }
  };

  const testProductDeletion = async () => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      addTestResult('Тест удаления товара', 'error', 'Токен отсутствует');
      return;
    }

    // Создаем тестовый товар для удаления
    try {
      const createResponse = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          name: 'TEST_PRODUCT_FOR_DELETION',
          description: 'Тестовый товар для удаления',
          price: 1,
          category: 'test',
          stockQuantity: 1
        })
      });

      if (createResponse.ok) {
        const product = await createResponse.json();
        addTestResult('Создание тестового товара', 'success', `ID: ${product._id}`);
        
        // Пытаемся удалить
        const deleteResponse = await fetch(`http://localhost:5000/api/products/${product._id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${adminToken}`
          }
        });
        
        if (deleteResponse.ok) {
          addTestResult('Удаление товара', 'success', 'Товар успешно удален');
        } else {
          const errorText = await deleteResponse.text();
          addTestResult('Удаление товара', 'error', `Статус: ${deleteResponse.status}, Ошибка: ${errorText}`);
        }
      } else {
        const errorText = await createResponse.text();
        addTestResult('Создание тестового товара', 'error', `Статус: ${createResponse.status}, Ошибка: ${errorText}`);
      }
    } catch (error) {
      addTestResult('Тест удаления товара', 'error', `Ошибка: ${error.message}`);
    }
  };

  const runAllTests = () => {
    setTestResults([]);
    checkTokens();
    testTokenDecoding();
    testApiConnection();
    setTimeout(() => testAdminAuth(), 500);
    setTimeout(() => testProductDeletion(), 1000);
  };

  useEffect(() => {
    checkTokens();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>🔧 Отладка Админ Панели</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={runAllTests} style={{ padding: '10px 20px', marginRight: '10px' }}>
          Запустить все тесты
        </button>
        <button onClick={checkTokens} style={{ padding: '10px 20px', marginRight: '10px' }}>
          Проверить токены
        </button>
        <button onClick={() => {
          localStorage.clear();
          setDebugInfo({});
          addTestResult('Очистка', 'info', 'LocalStorage очищен');
        }} style={{ padding: '10px 20px', backgroundColor: '#ff6b6b', color: 'white' }}>
          Очистить localStorage
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <h3>📊 Информация о токенах</h3>
          <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
        
        <div>
          <h3>🧪 Результаты тестов</h3>
          <div style={{ maxHeight: '400px', overflow: 'auto' }}>
            {testResults.map((result, index) => (
              <div key={index} style={{
                padding: '8px',
                margin: '5px 0',
                borderRadius: '3px',
                backgroundColor: result.status === 'success' ? '#d4edda' : 
                                result.status === 'error' ? '#f8d7da' : '#d1ecf1',
                borderLeft: `4px solid ${result.status === 'success' ? '#28a745' : 
                                        result.status === 'error' ? '#dc3545' : '#17a2b8'}`
              }}>
                <strong>{result.test}</strong> [{result.timestamp}]<br/>
                <small>{result.message}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDebugTest;