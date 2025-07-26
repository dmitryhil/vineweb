const API_BASE_URL = '/api';

class ApiService {
  getAuthHeaders() {
    // Сначала проверяем adminToken, потом userToken
    const token = localStorage.getItem('adminToken') || localStorage.getItem('userToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async fetchProducts() {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      const data = await response.json();
      return data.products || [];
    } catch (error) {
      console.error('Помилка завантаження товарів:', error);
      return [];
    }
  }

  async createProduct(productData) {
    try {
      const token = localStorage.getItem('userToken');
      const isAdmin = localStorage.getItem('isAdmin');
      if (!isAdmin) {
        throw new Error('Тільки адміністратори можуть створювати товари');
      }
      const formData = new FormData();
      
      Object.keys(productData).forEach(key => {
        if (key === 'sizes') {
          formData.append(key, JSON.stringify(productData[key]));
        } else if (key === 'images' && Array.isArray(productData[key])) {
          productData[key].forEach((file) => {
            formData.append('images', file);
          });
        } else {
          formData.append(key, productData[key]);
        }
      });

      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Помилка створення товару');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Помилка створення товару:', error);
      throw error;
    }
  }

  async updateProduct(id, productData) {
    try {
      const token = localStorage.getItem('userToken');
      const isAdmin = localStorage.getItem('isAdmin');
      if (!isAdmin) {
        throw new Error('Тільки адміністратори можуть оновлювати товари');
      }
      const formData = new FormData();
      
      Object.keys(productData).forEach(key => {
        if (key === 'sizes') {
          formData.append(key, JSON.stringify(productData[key]));
        } else if (key === 'images' && Array.isArray(productData[key])) {
          productData[key].forEach((file) => {
            formData.append('images', file);
          });
        } else {
          formData.append(key, productData[key]);
        }
      });

      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Помилка оновлення товару');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Помилка оновлення товару:', error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      // Используем adminToken для операций администратора
      const token = localStorage.getItem('adminToken');
      const isAdmin = localStorage.getItem('isAdmin');
      if (!token) {
        throw new Error('Необхідна авторизація адміністратора');
      }
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Помилка видалення товару');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Помилка видалення товару:', error);
      throw error;
    }
  }

  // Новые методы для корзины и избранного
  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Помилка авторизації');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Помилка авторизації:', error);
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Помилка реєстрації');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Помилка реєстрації:', error);
      throw error;
    }
  }
}

export default new ApiService();