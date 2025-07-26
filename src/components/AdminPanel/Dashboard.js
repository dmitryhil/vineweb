import React from 'react';
import './Dashboard.css';

const Dashboard = ({ products }) => {
  const totalProducts = products.length;
  const totalCategories = [...new Set(products.map(p => p.category))].length;
  
  // Улучшенная логика для определения количества товара
  const getStockQuantity = (product) => {
    return product.stockQuantity || product.stock || 0;
  };
  
  // Товары с малым количеством (меньше 2 единиц)
  const lowStockProducts = products.filter(p => getStockQuantity(p) < 2);
  const lowStockCount = lowStockProducts.length;
  
  // Общее количество всех товаров на складе
  const totalStockUnits = products.reduce((sum, p) => sum + getStockQuantity(p), 0);
  
  // Общая стоимость всех товаров в гривнах
  const totalValue = products.reduce((sum, p) => sum + (p.price * getStockQuantity(p)), 0);

  const categoryStats = products.reduce((acc, product) => {
    const category = product.category || 'Без категорії';
    if (!acc[category]) {
      acc[category] = {
        count: 0,
        totalStock: 0,
        totalValue: 0
      };
    }
    acc[category].count += 1;
    acc[category].totalStock += getStockQuantity(product);
    acc[category].totalValue += product.price * getStockQuantity(product);
    return acc;
  }, {});

  const recentProducts = products
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="dashboard">
      <h2>Панель управління</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>{totalProducts}</h3>
            <p>Всього товарів</p>
            <small>{totalStockUnits} одиниць на складі</small>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📂</div>
          <div className="stat-info">
            <h3>{totalCategories}</h3>
            <p>Категорій</p>
          </div>
        </div>
        
        <div className="stat-card warning">
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <h3>{lowStockCount}</h3>
            <p>Мало на складі</p>
            <small>Менше 2 одиниць</small>
          </div>
        </div>
        
        <div className="stat-card success">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>{totalValue.toLocaleString('uk-UA')} ₴</h3>
            <p>Загальна вартість</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Товары с малым количеством */}
        {lowStockProducts.length > 0 && (
          <div className="dashboard-section urgent">
            <h3>⚠️ Товари з малою кількістю (менше 2 од.)</h3>
            <div className="low-stock-products">
              {lowStockProducts.map(product => (
                <div key={product._id} className="low-stock-item">
                  <img 
                    src={product.image ? `${product.image}` : '/placeholder.jpg'}
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = '/placeholder.jpg';
                    }}
                  />
                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <p>{product.price} ₴</p>
                    <span className={`stock ${getStockQuantity(product) === 0 ? 'zero' : 'low'}`}>
                      Залишок: {getStockQuantity(product)} од.
                    </span>
                  </div>
                  <div className="urgency-indicator">
                    {getStockQuantity(product) === 0 ? '🚨' : '⚠️'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="dashboard-section">
          <h3>Статистика по категоріях</h3>
          <div className="category-stats">
            {Object.entries(categoryStats).map(([category, stats]) => (
              <div key={category} className="category-stat">
                <div className="category-header">
                  <span className="category-name">{category}</span>
                  <span className="category-count">{stats.count} товарів</span>
                </div>
                <div className="category-details">
                  <span className="category-stock">📦 {stats.totalStock} од.</span>
                  <span className="category-value">💰 {stats.totalValue.toLocaleString('uk-UA')} ₴</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <h3>Останні додані товари</h3>
          <div className="recent-products">
            {recentProducts.map(product => (
              <div key={product._id} className="recent-product">
                <img 
                  src={product.image ? `${product.image}` : '/placeholder.jpg'}
                  alt={product.name}
                  onError={(e) => {
                    if (e.target.src !== 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==') {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                    }
                  }}
                />
                <div className="product-info">
                  <h4>{product.name}</h4>
                  <p>{product.price} ₴</p>
                  <span className={`stock ${getStockQuantity(product) < 2 ? 'low' : ''}`}>
                    Залишок: {getStockQuantity(product)} од.
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;