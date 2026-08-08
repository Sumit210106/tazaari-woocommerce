"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { NormalizedProduct } from '../types/product';
import {
  fetchProducts as apiFetchProducts,
  fetchProduct as apiFetchProduct,
  fetchCategories as apiFetchCategories,
} from '../services/wooApi';
import type {
  FetchProductsParams,
  ProductsResponse,
  WooStoreCategory,
} from '../services/wooApi';

// ============================================================
// Context Type
// ============================================================

interface ProductContextType {
  /** Current page products */
  products: NormalizedProduct[];
  /** Whether a fetch is in progress */
  isLoading: boolean;
  /** Error message if last fetch failed */
  error: string | null;
  /** Total product count from API */
  totalProducts: number;
  /** Total pages available */
  totalPages: number;
  /** Current page number */
  currentPage: number;
  /** Available categories (fetched once) */
  categories: WooStoreCategory[];
  /** Fetch a page of products with optional filters */
  loadProducts: (params?: FetchProductsParams) => Promise<void>;
  /** Fetch a single product by id */
  loadProduct: (id: number | string) => Promise<NormalizedProduct | null>;
  /** Load all categories */
  loadCategories: () => Promise<void>;
  /** Last params used (for pagination controls to keep same filters) */
  lastParams: FetchProductsParams;
}

// ============================================================
// Context + Provider
// ============================================================

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<NormalizedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState<WooStoreCategory[]>([]);
  const [lastParams, setLastParams] = useState<FetchProductsParams>({});

  const loadProducts = useCallback(async (params: FetchProductsParams = {}) => {
    setIsLoading(true);
    setError(null);
    setLastParams(params);
    try {
      const result: ProductsResponse = await apiFetchProducts(params);
      setProducts(result.products);
      setTotalProducts(result.total);
      setTotalPages(result.totalPages);
      setCurrentPage(result.currentPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadProduct = useCallback(async (id: number | string): Promise<NormalizedProduct | null> => {
    try {
      return await apiFetchProduct(id);
    } catch (err) {
      console.error('Failed to fetch product:', err);
      return null;
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const cats = await apiFetchCategories();
      setCategories(cats);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }, []);

  return (
    <ProductContext.Provider value={{
      products,
      isLoading,
      error,
      totalProducts,
      totalPages,
      currentPage,
      categories,
      loadProducts,
      loadProduct,
      loadCategories,
      lastParams,
    }}>
      {children}
    </ProductContext.Provider>
  );
};

// ============================================================
// Hook
// ============================================================

export const useProducts = (): ProductContextType => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used inside <ProductProvider>');
  return ctx;
};
