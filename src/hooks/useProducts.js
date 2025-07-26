import { useState, useEffect } from 'react';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch products from server
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/products');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products. Please check server connection.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Add new product
  const addProduct = async (productData) => {
    try {
      setLoading(true);
      setError(null);
      
      const formData = new FormData();
      Object.keys(productData).forEach(key => {
        if (key === 'sizes' && Array.isArray(productData[key])) {
          formData.append(key, JSON.stringify(productData[key]));
        } else {
          formData.append(key, productData[key]);
        }
      });

      const response = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newProduct = await response.json();
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      setError('Failed to add product. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update product
  const updateProduct = async (productId, productData) => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      Object.keys(productData).forEach(key => {
        if (key === 'sizes' && Array.isArray(productData[key])) {
          formData.append(key, JSON.stringify(productData[key]));
        } else {
          formData.append(key, productData[key]);
        }
      });

      const response = await fetch(`/api/products${productId}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedProduct = await response.json();
      setProducts(prev => prev.map(p => p._id === productId ? updatedProduct : p));
      return updatedProduct;
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Failed to update product. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const deleteProduct = async (productId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setProducts(prev => prev.filter(p => p._id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Failed to delete product. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Load products on hook initialization
  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    setProducts,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};