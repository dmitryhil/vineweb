import React from 'react';
import AdminPanel from '../components/AdminPanel/AdminPanel';
import { useProducts } from '../hooks/useProducts';

const AdminPage = () => {
  const { products, setProducts } = useProducts();

  return (
    <AdminPanel 
      products={products} 
      setProducts={setProducts} 
    />
  );
};

export default AdminPage;