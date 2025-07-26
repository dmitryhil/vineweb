import React, { useState } from 'react';
import './ProductList.css';

const ProductList = ({ products, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Определяем категории для навигации
  const allCategories = [...new Set(products.map(p => p.category))];
  const categoryTabs = [
    { key: '', label: 'Всі товари', icon: '📦' },
    { key: 'low-stock', label: 'Мало на складі', icon: '⚠️' },
    ...allCategories.map(cat => ({
      key: cat,
      label: cat,
      icon: cat === 'Дівчатка' ? '👧' : cat === 'Хлопчики' ? '👦' : cat === 'Аксесуари' ? '👜' : '📂'
    }))
  ];

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesCategory = true;
      if (categoryFilter === 'low-stock') {
        matchesCategory = (product.stockQuantity || product.stock || 0) < 2;
      } else if (categoryFilter) {
        matchesCategory = product.category === categoryFilter;
      }
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'price' || sortBy === 'stock' || sortBy === 'stockQuantity') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getStockQuantity = (product) => {
    return product.stockQuantity || product.stock || 0;
  };

  return (
    <div className="product-list">
      <div className="product-list-header">
        <h2>Управління товарами</h2>
        
        {/* Навигация по категориям */}
        <div className="category-navigation">
          {categoryTabs.map(tab => {
            const count = tab.key === '' 
              ? products.length 
              : tab.key === 'low-stock'
                ? products.filter(p => getStockQuantity(p) < 2).length
                : products.filter(p => p.category === tab.key).length;
            
            return (
              <button
                key={tab.key}
                className={`category-tab ${categoryFilter === tab.key ? 'active' : ''}`}
                onClick={() => setCategoryFilter(tab.key)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
                <span className="tab-count">({count})</span>
              </button>
            );
          })}
        </div>
        
        <div className="filters">
          <input
            type="text"
            placeholder="Пошук товарів..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}
            className="sort-select"
          >
            <option value="name-asc">Назва (А-Я)</option>
            <option value="name-desc">Назва (Я-А)</option>
            <option value="price-asc">Ціна (за зростанням)</option>
            <option value="price-desc">Ціна (за спаданням)</option>
            <option value="stockQuantity-asc">Залишок (за зростанням)</option>
            <option value="stockQuantity-desc">Залишок (за спаданням)</option>
          </select>
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => {
          const stockQuantity = getStockQuantity(product);
          const isLowStock = stockQuantity < 2;
          const isVeryLowStock = stockQuantity === 0;
          
          return (
            <div key={product._id} className={`product-card ${isLowStock ? 'low-stock' : ''} ${isVeryLowStock ? 'out-of-stock' : ''}`}>
              <div className="product-image">
                <img 
                  src={product.image ? `${product.image}` : '/placeholder.jpg'} 
                  alt={product.name} 
                  onError={(e) => {
                    e.target.src = '/placeholder.jpg';
                  }}
                />
                {product.isNew && <span className="badge new">Новинка</span>}
                {product.isPopular && <span className="badge popular">Хіт</span>}
                {isVeryLowStock && <span className="badge out-of-stock">Немає в наявності</span>}
                {isLowStock && !isVeryLowStock && <span className="badge low-stock">Мало</span>}
              </div>
              
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-description">
                  {product.description && product.description.length > 50 
                    ? product.description.substring(0, 50) + '...' 
                    : product.description || 'Без опису'
                  }
                </p>
                
                {/* Основная информация о товаре */}
                <div className="product-main-info">
                  <div className="price-info">
                    <span className="price-label">Ціна:</span>
                    <span className="price">{product.price} ₴</span>
                  </div>
                  <div className="stock-info">
                    <span className="stock-label">Кількість:</span>
                    <span className={`stock ${isLowStock ? 'low' : ''} ${isVeryLowStock ? 'zero' : ''}`}>
                      {stockQuantity} од.
                    </span>
                  </div>
                </div>
                
                <div className="product-details">
                  <span className="category">📂 {product.category}</span>
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="product-sizes">
                      <strong>Розміри:</strong>
                      <div className="sizes">
                        {product.sizes.map(size => (
                          <span key={size} className="size">{size}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="product-actions">
                <button 
                  onClick={() => onEdit(product)}
                  className="edit-btn"
                  title="Редагувати товар"
                >
                  ✏️ Редагувати
                </button>
                <button 
                  onClick={() => onDelete(product._id)}
                  className="delete-btn"
                  title="Видалити товар"
                >
                  🗑️ Видалити
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="no-products">
          <p>
            {categoryFilter === 'low-stock' 
              ? 'Немає товарів з малою кількістю на складі' 
              : 'Товари не знайдені'
            }
          </p>
        </div>
      )}
      
      {/* Статистика внизу */}
      <div className="products-summary">
        <div className="summary-item">
          <span className="summary-label">Показано товарів:</span>
          <span className="summary-value">{filteredProducts.length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Загальна вартість:</span>
          <span className="summary-value">
            {filteredProducts.reduce((sum, p) => sum + (p.price * getStockQuantity(p)), 0).toLocaleString('uk-UA')} ₴
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductList;