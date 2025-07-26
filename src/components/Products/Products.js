import React, { useState, useEffect } from 'react';
import './Products.desktop.css';
import './Products.mobile.css';
import ProductModal from './ProductModal';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sizeFilter, setSizeFilter] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Динамическое количество товаров на страницу
  const productsPerPage = isMobile ? 4 : 12;

  // Отслеживание изменения размера экрана
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      // Сброс на первую страницу при изменении режима
      if (mobile !== isMobile) {
        setCurrentPage(1);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  // Завантаження продуктів з сервера
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/products');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setProducts(data.products || []);
      setError(null);
    } catch (error) {
      console.error('Помилка завантаження товарів:', error);
      setError('Помилка завантаження товарів. Перевірте підключення до сервера.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Фільтрація та сортування
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    const matchesSize = !sizeFilter || product.sizes.includes(sizeFilter);
    const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
    
    return matchesSearch && matchesCategory && matchesSize && matchesPrice;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'newest':
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      default:
        return 0;
    }
  });

  // Пагінація
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  // Обробники подій
  const toggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const categories = [...new Set(products.map(p => p.category))];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  if (loading) {
    return (
      <div className="products-loading">
        <div className="loading-spinner"></div>
        <p>Завантаження товарів...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-error">
        <p>{error}</p>
        <button onClick={fetchProducts} className="retry-btn">
          Спробувати знову
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="products-empty">
        <p>Товари не знайдені. Перевірте підключення до сервера.</p>
        <button onClick={fetchProducts} className="retry-btn">
          Оновити
        </button>
      </div>
    );
  }

  return (
    <section id="products" className="products-section">
      {/* Анимация падающих объектов */}
      <div className="falling-objects">
        {[...Array(20)].map((_, i) => (
          <div key={i} className={`falling-object falling-object-${i % 4 + 1}`}></div>
        ))}
      </div>
      
      <div className="container">
        <div className="products-header">
          <h2 className="section-title">Наші товари</h2>
          <p className="section-subtitle">Відкрийте для себе найкращі товари нашої колекції</p>
        </div>

        {/* Фільтри */}
        <div className="filters-container">
          <div className="filters-row">
            <div className="filter-group">
              <input
                type="text"
                placeholder="Пошук товарів..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-group">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">Всі категорії</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <select
                value={sizeFilter}
                onChange={(e) => setSizeFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">Всі розміри</option>
                {sizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="name">За назвою</option>
                <option value="price-low">Ціна: від низької</option>
                <option value="price-high">Ціна: від високої</option>
                <option value="newest">Найновіші</option>
              </select>
            </div>
          </div>
        </div>

        {/* Сітка товарів */}
        <div className="products-grid">
          {currentProducts.map(product => (
            <div key={product._id} className="product-card">
              <div className="product-image-container">
                <img
                  src={product.image ? `http://localhost:5000${product.image}` : 'https://via.placeholder.com/300x400/f5f5f5/999999?text=No+Image'}
                  alt={product.name}
                  className="product-image"
                  width="100%"
                  height="100%"
                  loading="lazy"
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'center',
                    display: 'block',
                    minHeight: '100%'
                  }}
                  onClick={() => openModal(product)}
                  onError={(e) => {
                    if (e.target.src !== 'https://via.placeholder.com/300x400/f5f5f5/999999?text=No+Image') {
                      e.target.src = 'https://via.placeholder.com/300x400/f5f5f5/999999?text=No+Image';
                    }
                  }}
                />
                
                {/* Бейджі */}
                <div className="product-badges">
                  {product.originalPrice && (
                    <span className="badge badge-sale">
                      -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </span>
                  )}
                  {product.isPopular && <span className="badge badge-hot">HOT</span>}
                  {product.isNew && <span className="badge badge-new">NEW</span>}
                </div>
                
                {/* Кнопка вподобань */}
                <button
                  className={`favorite-btn ${favorites.includes(product._id) ? 'active' : ''}`}
                  onClick={() => toggleFavorite(product._id)}
                >
                  <i className={favorites.includes(product._id) ? 'fas fa-heart' : 'far fa-heart'}></i>
                </button>
                
                {/* Швидкий перегляд */}
                <button
                  className="quick-view-btn"
                  onClick={() => openModal(product)}
                >
                  Швидкий перегляд
                </button>
              </div>
              
              <div className="product-info">
                <h3 className="product-name" onClick={() => openModal(product)}>
                  {product.name}
                </h3>
                <p className="product-category">{product.category}</p>
                
                <div className="product-sizes">
                  {product.sizes.slice(0, 4).map(size => (
                    <span key={size} className="size-tag">{size}</span>
                  ))}
                  {product.sizes.length > 4 && (
                    <span className="size-more">+{product.sizes.length - 4}</span>
                  )}
                </div>
                
                <div className="product-price">
                  <span className="current-price">{product.price} ₴</span>
                  {product.originalPrice && (
                    <span className="original-price">{product.originalPrice} ₴</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Пагінація */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        )}
      </div>

      {/* Модальне вікно */}
      {isModalOpen && selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={closeModal}
          onAddToCart={(product, size, quantity) => {
            console.log('Додано до кошика:', product, size, quantity);
            // Тут буде логіка додавання до кошика
          }}
        />
      )}
    </section>
  );
};

export default Products;