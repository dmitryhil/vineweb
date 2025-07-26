import React from 'react';
import './Categories.css';

const Categories = ({ onCategorySelect, selectedCategory }) => {
  const categories = [
    {
      id: 'boys',
      name: 'Хлопчики',
      icon: '👔',
      description: 'Стильний одяг для хлопчиків'
    },
    {
      id: 'girls',
      name: 'Дівчата',
      icon: '👗',
      description: 'Елегантний одяг для дівчат'
    },
    {
      id: 'children',
      name: 'Діти',
      icon: '👶',
      description: 'Дитячий одяг 98-140см'
    },
    {
      id: 'accessories',
      name: 'Аксесуари',
      icon: '👜',
      description: 'Сумки, ремені та інше'
    }
  ];

  return (
    <section className="categories">
      <div className="categories-container">
        <div className="categories-header">
          <h2>Категорії товарів</h2>
          <p>Оберіть категорію для перегляду товарів</p>
        </div>
        
        <div className="categories-grid">
          {categories.map(category => (
            <div
              key={category.id}
              className={`category-card ${
                selectedCategory === category.id ? 'active' : ''
              }`}
              onClick={() => onCategorySelect(category.id)}
            >
              <div className="category-icon">
                <span>{category.icon}</span>
              </div>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
              <div className="category-arrow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;