"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { NormalizedProduct as Product } from '../types/product';
import { usePathname, useRouter } from 'next/navigation';

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export type PageType = 'home' | 'shop' | 'about' | 'contact' | 'product';

interface CartContextType {
  cart: CartItem[];
  wishlist: string[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  activePage: PageType;
  setActivePage: (page: PageType) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currency: string;
  setCurrency: (curr: string) => void;
  addToCart: (product: Product, size?: string, color?: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, delta: number) => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  notification: string | null;
  setNotification: (msg: string | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewState] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activePage, setActivePage] = useState<PageType>('home');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currency, setCurrency] = useState('$');
  const pathname = usePathname();
  const router = useRouter();

  const setQuickViewProduct = (prod: Product | null) => {
    if (prod) {
      setSelectedProduct(prod);
      setActivePage('product');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setQuickViewState(null);
    }
  };
  const [notification, setNotification] = useState<string | null>(null);

  // Sync active page with Next.js current pathname
  useEffect(() => {
    if (!pathname) return;
    if (pathname === '/shop') {
      setActivePage('shop');
    } else if (pathname === '/about') {
      setActivePage('about');
    } else if (pathname === '/contact') {
      setActivePage('contact');
    } else if (pathname.startsWith('/product/')) {
      setActivePage('product');
    } else {
      setActivePage('home');
    }
  }, [pathname]);

  // Sync route path when global activePage state is changed programmatically
  useEffect(() => {
    let targetPath = '/';
    if (activePage === 'shop') {
      targetPath = '/shop';
    } else if (activePage === 'about') {
      targetPath = '/about';
    } else if (activePage === 'contact') {
      targetPath = '/contact';
    } else if (activePage === 'product' && selectedProduct) {
      targetPath = `/product/${selectedProduct.id}`;
    }

    if (window.location.pathname !== targetPath) {
      router.push(targetPath);
    }
  }, [activePage, selectedProduct, router]);

  // Auto clear notification after 3s
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const addToCart = (product: Product, size?: string, color?: string, quantity: number = 1) => {
    const chosenSize = size || product.sizes[0] || 'Standard';
    const chosenColor = color || 'Default';

    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.selectedSize === chosenSize && item.selectedColor === chosenColor
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [...prev, { product, selectedSize: chosenSize, selectedColor: chosenColor, quantity }];
    });

    setNotification(`Added "${product.name}" to your bag`);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, size: string, color: string) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.selectedSize === size && item.selectedColor === color)));
  };

  const updateQuantity = (productId: string, size: string, color: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId && item.selectedSize === size && item.selectedColor === color) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        setNotification('Item removed from wishlist');
        return prev.filter(id => id !== productId);
      } else {
        setNotification('Item saved to wishlist');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        isCartOpen,
        setIsCartOpen,
        quickViewProduct,
        setQuickViewProduct,
        selectedProduct,
        setSelectedProduct,
        activePage,
        setActivePage,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        currency,
        setCurrency,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleWishlist,
        isInWishlist,
        clearCart,
        cartTotal,
        cartCount,
        notification,
        setNotification
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
