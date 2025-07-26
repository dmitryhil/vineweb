import React, { useState } from 'react';

const ApiTester = () => {
  const [endpoint, setEndpoint] = useState('/api/products');
  const [method, setMethod] = useState('GET');
  const [headers, setHeaders] = useState('{}');
  const [body, setBody] = useState('{}');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const testRequest = async () => {
    setLoading(true);
    try {
      const adminToken = localStorage.getItem('adminToken');
      const defaultHeaders = {
        'Content-Type': 'application/json',
        ...(adminToken && { 'Authorization': `Bearer ${adminToken}` })
      };
      
      const customHeaders = JSON.parse(headers);
      const finalHeaders = { ...defaultHeaders, ...customHeaders };
      
      const config = {
        method,
        headers: finalHeaders
      };
      
      if (method !== 'GET' && method !== 'DELETE') {
        config.body = body;
      }
      
      const res = await fetch(`http://localhost:5000${endpoint}`, config);
      const responseText = await res.text();
      
      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        body: responseText
      });
    } catch (error) {
      setResponse({
        error: error.message
      });
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>🌐 API Тестер</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <h3>Запрос</h3>
          <div style={{ marginBottom: '10px' }}>
            <label>Метод:</label>
            <select value={method} onChange={(e) => setMethod(e.target.value)} style={{ marginLeft: '10px', padding: '5px' }}>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <label>Endpoint:</label>
            <input 
              type="text" 
              value={endpoint} 
              onChange={(e) => setEndpoint(e.target.value)}
              style={{ width: '100%', padding: '5px', marginTop: '5px' }}
            />
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <label>Дополнительные заголовки (JSON):</label>
            <textarea 
              value={headers} 
              onChange={(e) => setHeaders(e.target.value)}
              style={{ width: '100%', height: '80px', padding: '5px', marginTop: '5px' }}
            />
          </div>
          
          {method !== 'GET' && method !== 'DELETE' && (
            <div style={{ marginBottom: '10px' }}>
              <label>Тело запроса (JSON):</label>
              <textarea 
                value={body} 
                onChange={(e) => setBody(e.target.value)}
                style={{ width: '100%', height: '120px', padding: '5px', marginTop: '5px' }}
              />
            </div>
          )}
          
          <button 
            onClick={testRequest} 
            disabled={loading}
            style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            {loading ? 'Отправка...' : 'Отправить запрос'}
          </button>
        </div>
        
        <div>
          <h3>Ответ</h3>
          {response && (
            <pre style={{ 
              background: '#f5f5f5', 
              padding: '10px', 
              borderRadius: '5px', 
              maxHeight: '500px', 
              overflow: 'auto',
              fontSize: '12px'
            }}>
              {JSON.stringify(response, null, 2)}
            </pre>
          )}
        </div>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h3>🚀 Быстрые тесты</h3>
        <button onClick={() => {
          setEndpoint('/api/products');
          setMethod('GET');
          testRequest();
        }} style={{ margin: '5px', padding: '8px 15px' }}>
          Получить товары
        </button>
        
        <button onClick={() => {
          setEndpoint('/api/admin/stats');
          setMethod('GET');
          testRequest();
        }} style={{ margin: '5px', padding: '8px 15px' }}>
          Админ статистика
        </button>
        
        <button onClick={() => {
          setEndpoint('/api/products/test');
          setMethod('DELETE');
          testRequest();
        }} style={{ margin: '5px', padding: '8px 15px' }}>
          Тест удаления
        </button>
      </div>
    </div>
  );
};

export default ApiTester;