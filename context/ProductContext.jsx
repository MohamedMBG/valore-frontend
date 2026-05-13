'use client';

import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/services/api';

export const ProductContext = createContext();

export const useProductContext = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProductContext must be used within a ProductProvider');
    }
    return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      // Fallback for when backend is not running yet
      const res = await axios.get(`${API_BASE_URL}/products`).catch(() => ({ data: [
        { id: 1, title: 'The Ultimate Creator Guide', price: 29.99, category: 'Guide PDF', imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80', rating: 5, reviews: 120, description: "A complete 50-page PDF guide that teaches you how to hack the TikTok algorithm." },
        { id: 2, title: 'Cinematic LUTs Pack', price: 49.99, category: 'Templates', imageUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&q=80', rating: 4.8, reviews: 85, description: "10 exclusive LUTs to give a cinematic look to your videos." },
        { id: 3, title: 'TikTok Virality Masterclass', price: 99.99, category: 'Mini-Course', imageUrl: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=800&q=80', rating: 4.9, reviews: 200, description: "A 2-hour video training to go from 0 to 100k followers." },
        { id: 4, title: 'Notion Creator Dashboard', price: 19.99, category: 'Templates', imageUrl: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&q=80', rating: 4.5, reviews: 40, description: "The Notion template I use to organize my scripts and shoots." },
      ]}));
      
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchProducts(false);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const addProduct = (product) => {
    const newProduct = { ...product, id: Date.now() };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (updatedProduct) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <ProductContext.Provider value={{ 
      products, 
      loading, 
      fetchProducts,
      addProduct,
      updateProduct,
      deleteProduct
    }}>
      {children}
    </ProductContext.Provider>
  );
};
