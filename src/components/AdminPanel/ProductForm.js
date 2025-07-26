import React, { useState, useEffect } from 'react';
import './ProductForm.css';

const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    subcategory: '',
    gender: '',
    sizes: [],
    colors: [],
    stockQuantity: '',
    images: [],
    isNew: false,
    discount: 0
  });
  
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'men', label: 'Чоловічий одяг' },
    { value: 'women', label: 'Жіночий одяг' },
    { value: 'children', label: 'Дитячий одяг' },
    { value: 'accessories', label: 'Аксесуари' }
  ];

  const subcategories = {
    men: [
      { value: 'jeans', label: 'Джинси' },
      { value: 'sweatpants', label: 'Спортивні штани' },
      { value: 'sweatshirts', label: 'Світшоти' },
      { value: 'hoodies', label: 'Худі' },
      { value: 'shirts', label: 'Сорочки' },
      { value: 't-shirts', label: 'Футболки' },
      { value: 'shorts', label: 'Шорти' },
      { value: 'jackets', label: 'Куртки' },
      { value: 'windbreakers', label: 'Вітровки' }
    ],
    women: [
      { value: 'jeans', label: 'Джинси' },
      { value: 'sweatpants', label: 'Спортивні штани' },
      { value: 'sweatshirts', label: 'Світшоти' },
      { value: 'hoodies', label: 'Худі' },
      { value: 'shirts', label: 'Сорочки' },
      { value: 't-shirts', label: 'Футболки' },
      { value: 'swimsuits', label: 'Купальники' },
      { value: 'shorts', label: 'Шорти' },
      { value: 'tank-tops', label: 'Майки' },
      { value: 'skirts', label: 'Спідниці' },
      { value: 'business-suits', label: 'Ділові костюми' },
      { value: 'dresses', label: 'Сукні' },
      { value: 'jackets', label: 'Куртки' },
      { value: 'windbreakers', label: 'Вітровки' }
    ],
    children: [
      { value: 't-shirts', label: 'Футболки' },
      { value: 'shorts', label: 'Шорти' },
      { value: 'jeans', label: 'Джинси' },
      { value: 'sweatshirts', label: 'Світшоти' },
      { value: 'hoodies', label: 'Худі' },
      { value: 'skirts', label: 'Спідниці' },
      { value: 'jackets', label: 'Куртки' }
    ],
    accessories: [
      { value: 'bags', label: 'Сумки' },
      { value: 'belts', label: 'Ремені' },
      { value: 'accessories-other', label: 'Інші аксесуари' }
    ]
  };

  const genderOptions = [
    { value: '', label: 'Не вказано' },
    { value: 'boys', label: 'Для хлопчиків' },
    { value: 'girls', label: 'Для дівчаток' }
  ];

  const availableSizes = ['98', '104', '110', '116', '122', '128', '134', '140', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const availableColors = [
    { value: 'black', label: 'Чорний', hex: '#000000' },
    { value: 'white', label: 'Білий', hex: '#ffffff' },
    { value: 'blue', label: 'Синій', hex: '#1e3a8a' },
    { value: 'red', label: 'Червоний', hex: '#dc2626' },
    { value: 'green', label: 'Зелений', hex: '#16a34a' },
    { value: 'gray', label: 'Сірий', hex: '#6b7280' },
    { value: 'brown', label: 'Коричневий', hex: '#92400e' },
    { value: 'pink', label: 'Рожевий', hex: '#ec4899' }
  ];

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        category: product.category || '',
        subcategory: product.subcategory || '',
        gender: product.gender || '',
        sizes: product.sizes || [],
        colors: product.colors || [],
        stockQuantity: product.stockQuantity || '',
        images: [],
        isNew: product.isNew || false,
        discount: product.discount || 0
      });
      // Исправлено: используем setImagePreviews вместо setImagePreview
      if (product.image) {
        setImagePreviews([product.image]);
      } else if (product.images && product.images.length > 0) {
        setImagePreviews(product.images);
      } else {
        setImagePreviews([]);
      }
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (name === 'category') {
      setFormData(prev => ({ ...prev, subcategory: '', gender: '', colors: [] }));
    }
  };

  const handleSizeToggle = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleColorToggle = (color) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setFormData(prev => ({ ...prev, images: files }));
      
      const previews = [];
      let loadedCount = 0;
      
      files.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          previews[index] = e.target.result;
          loadedCount++;
          if (loadedCount === files.length) {
            setImagePreviews([...previews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages }));
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category || !formData.subcategory || formData.sizes.length === 0 || formData.colors.length === 0) {
      alert('Будь ласка, заповніть всі обов\'язкові поля');
      return;
    }

    setLoading(true);
    await onSave(formData);
    setLoading(false);
  };

  return (
    <div className="product-form">
      <div className="form-header">
        <h2>{product ? 'Редагувати товар' : 'Додати новий товар'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-grid">
          <div className="form-section">
            <div className="form-group">
              <label htmlFor="name">Назва товару *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Короткий опис</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="2"
                maxLength="150"
                placeholder="Короткий опис товару (до 150 символів)"
              />
              <small>{formData.description.length}/150 символів</small>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Ціна (₴) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="originalPrice">Стара ціна (₴)</label>
                <input
                  type="number"
                  id="originalPrice"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="stockQuantity">Кількість на складі</label>
                <input
                  type="number"
                  id="stockQuantity"
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="category">Категорія *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Оберіть категорію</option>
                {categories.map(category => (
                  <option key={category.value} value={category.value}>{category.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="subcategory">Підкатегорія *</label>
              <select
                id="subcategory"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                required
                disabled={!formData.category}
              >
                <option value="">Оберіть підкатегорію</option>
                {formData.category && subcategories[formData.category]?.map(sub => (
                  <option key={sub.value} value={sub.value}>{sub.label}</option>
                ))}
              </select>
            </div>

            {formData.category === 'children' && (
              <div className="form-group">
                <label htmlFor="gender">Стать</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  {genderOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-group">
              <label>Розміри *</label>
              <div className="sizes-grid">
                {availableSizes.map(size => (
                  <label key={size} className="size-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.sizes.includes(size)}
                      onChange={() => handleSizeToggle(size)}
                    />
                    <span>{size}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Кольори *</label>
              <div className="colors-grid">
                {availableColors.map(color => (
                  <label key={color.value} className="color-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.colors.includes(color.value)}
                      onChange={() => handleColorToggle(color.value)}
                    />
                    <span style={{ backgroundColor: color.hex }} className="color-box"></span>
                    <span>{color.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="discount">Знижка (%)</label>
              <input
                type="number"
                id="discount"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                min="0"
                max="100"
              />
            </div>

            <div className="form-group">
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isNew"
                    checked={formData.isNew}
                    onChange={handleChange}
                  />
                  <span>Новинка</span>
                </label>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-group">
              <label htmlFor="images">Зображення товару (можна обрати декілька)</label>
              <input
                type="file"
                id="images"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
              {imagePreviews.length > 0 && (
                <div className="images-preview">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="image-preview-item">
                      <img src={preview} alt={`Попередній перегляд ${index + 1}`} />
                      <button 
                        type="button" 
                        onClick={() => removeImage(index)}
                        className="remove-image-btn"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn-cancel">
            Скасувати
          </button>
          <button type="submit" disabled={loading} className="btn-save">
            {loading ? 'Збереження...' : (product ? 'Оновити товар' : 'Додати товар')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
