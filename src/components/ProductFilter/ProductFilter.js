import React, { useState } from 'react';
import './ProductFilter.css';

const ProductFilter = ({ 
  products, 
  onFilterChange, 
  activeFilter, 
  searchTerm, 
  onSearchChange,
  priceRange,
  onPriceRangeChange,
  selectedSizes,
  onSizeChange,
  sortBy,
  onSortChange
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Получаем уникальные категории из товаров
  const categories = ['all', ...new Set(products.map(p => p.category))];
  
  // Получаем уникальные размеры
  const availableSizes = [...new Set(products.flatMap(p => p.sizes || []))].sort();
  
  // Получаем диапазон цен
  const prices = products.map(p => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const handlePriceSliderChange = (value) => {
    onPriceRangeChange([minPrice, parseInt(value)]);
  };

  const resetFilters = () => {
    onSearchChange('');
    onFilterChange('all');
    onPriceRangeChange([minPrice, maxPrice]);
    onSizeChange([]);
    onSortChange('name');
  };

  const toggleSize = (size) => {
    if (selectedSizes.includes(size)) {
      onSizeChange(selectedSizes.filter(s => s !== size));
    } else {
      onSizeChange([...selectedSizes, size]);
    }
  };

  return (
    <div className="product-filter">
      {/* Mobile Filter Toggle */}
      <div className="filter-mobile-toggle md:hidden">
        <button 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="filter-toggle-btn"
        >
          <i className="fas fa-sliders-h"></i>
          Фільтри
          <i className={`fas fa-chevron-${isFilterOpen ? 'up' : 'down'}`}></i>
        </button>
      </div>

      {/* Simplified Filter Panel */}
      <div className={`filter-panel ${isFilterOpen ? 'filter-panel-open' : ''}`}>
        
        {/* Search - Most Important */}
        <div className="filter-section">
          <div className="search-input-wrapper">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              placeholder="Що шукаєте? Введіть назву..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button 
                onClick={() => onSearchChange('')}
                className="clear-search-btn"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </div>

        {/* Quick Sort - Simple Dropdown */}
        <div className="filter-section">
          <select 
            value={sortBy} 
            onChange={(e) => onSortChange(e.target.value)}
            className="sort-select-simple"
          >
            <option value="name">📝 За назвою</option>
            <option value="price-low">💰 Спочатку дешевші</option>
            <option value="price-high">💎 Спочатку дорожчі</option>
          </select>
        </div>

        {/* Categories - Visual Pills */}
        <div className="filter-section">
          <div className="category-pills">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => onFilterChange(category)}
                className={`category-pill ${activeFilter === category ? 'active' : ''}`}
              >
                {category === 'all' ? '✨ Всі товари' : `👗 ${category}`}
              </button>
            ))}
          </div>
        </div>

        {/* Price Slider - Simple and Visual */}
        <div className="filter-section">
          <div className="price-slider-section">
            <label className="price-label">
              💰 Максимальна ціна: <span className="price-value">{priceRange[1]} ₴</span>
            </label>
            <input
              type="range"
              min={minPrice}
              max={maxPrice}
              value={priceRange[1]}
              onChange={(e) => handlePriceSliderChange(e.target.value)}
              className="price-slider"
            />
            <div className="price-range-labels">
              <span>{minPrice} ₴</span>
              <span>{maxPrice} ₴</span>
            </div>
          </div>
        </div>

        {/* Sizes - Only if available */}
        {availableSizes.length > 0 && (
          <div className="filter-section">
            <label className="size-label">👕 Розміри:</label>
            <div className="size-pills">
              {availableSizes.map(size => (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`size-pill ${selectedSizes.includes(size) ? 'active' : ''}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Reset - Only show if filters are active */}
        {(activeFilter !== 'all' || searchTerm || selectedSizes.length > 0 || priceRange[1] !== maxPrice) && (
          <div className="filter-section">
            <button onClick={resetFilters} className="reset-btn-simple">
              🔄 Очистити фільтри
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFilter;
