'use client';

import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { API_BASE_URL } from '@/services/api';

export const ProductContext = createContext();

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};

// Module-level constant — no re-allocation on every render
const FALLBACK_PRODUCTS = [
  { id: 1, title: 'The Ultimate Creator Guide', price: 29.99, category: 'Guide PDF', imageUrl: '/generated/product-guide.jpg', rating: 5, reviews: 120, description: "A complete 50-page PDF guide that teaches you how to hack the TikTok algorithm." },
  { id: 2, title: 'Cinematic LUTs Pack', price: 49.99, category: 'Templates', imageUrl: '/generated/product-luts.jpg', rating: 4.8, reviews: 85, description: "10 exclusive LUTs to give a cinematic look to your videos." },
  { id: 3, title: 'TikTok Virality Masterclass', price: 99.99, category: 'Mini-Course', imageUrl: '/generated/product-masterclass.jpg', rating: 4.9, reviews: 200, description: "A 2-hour video training to go from 0 to 100k followers." },
  { id: 4, title: 'Notion Creator Dashboard', price: 19.99, category: 'Templates', imageUrl: '/generated/product-notion.jpg', rating: 4.5, reviews: 40, description: "The Notion template I use to organize my scripts and shoots." },
];

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // useCallback gives fetchProducts a stable reference — safe to add to useEffect deps
  const fetchProducts = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);

      let data;
      try {
        const res = await fetch(`${API_BASE_URL}/products`);
        if (!res.ok) throw new Error('API error');
        data = await res.json();
      } catch {
        // Backend unreachable — render shop from local fallback so users aren't blocked
        data = FALLBACK_PRODUCTS;
      }

      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // setTimeout(0) defers fetch past paint so it doesn't block the intro animation
    const timer = setTimeout(() => void fetchProducts(false), 0);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  return (
    <ProductContext.Provider value={{ products, loading, fetchProducts }}>
      {children}
    </ProductContext.Provider>
  );
};
