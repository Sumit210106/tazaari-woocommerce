"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { NormalizedProduct as Product } from '../types/product';
import { usePathname, useRouter } from 'next/navigation';
import * as wooCart from '../services/wooCartApi';
import type { WcCart, WcCartItem } from '../services/wooCartApi';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  /** WooCommerce cart item key — required for update/remove operations */
  wcKey: string;
}

export type PageType = 'home' | 'shop' | 'about' | 'contact' | 'product' | 'checkout';

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
  /** WooCommerce-synced state */
  wcCart: WcCart | null;
  isCartLoading: boolean;
  cartError: string | null;
  refreshCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: (code: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// ---------------------------------------------------------------------------
// Helpers: Map WooCommerce cart items to local CartItem shape
// ---------------------------------------------------------------------------

function mapWcItemToCartItem(wcItem: WcCartItem): CartItem {
  const minorUnit = wcItem.prices.currency_minor_unit ?? 2;
  const price = parseInt(wcItem.prices.price || '0', 10) / Math.pow(10, minorUnit);
  const regularPrice = parseInt(wcItem.prices.regular_price || '0', 10) / Math.pow(10, minorUnit);

  // Extract size & color from variation attributes
  let selectedSize = 'Standard';
  let selectedColor = 'Default';
  if (wcItem.variation && wcItem.variation.length > 0) {
    for (const v of wcItem.variation) {
      const attrLower = v.attribute.toLowerCase();
      if (attrLower.includes('size')) selectedSize = v.value;
      if (attrLower.includes('color') || attrLower.includes('colour')) selectedColor = v.value;
    }
  }

  // Build a lightweight Product from WC cart item data
  const product: Product = {
    id: String(wcItem.id),
    name: wcItem.name,
    slug: '',
    category: '',
    categories: [],
    price,
    originalPrice: regularPrice,
    onSale: price < regularPrice,
    rating: 0,
    reviewsCount: 0,
    images: wcItem.images.map(img => img.src),
    thumbnails: wcItem.images.map(img => img.thumbnail),
    imageSrcsets: [],
    imageAlts: wcItem.images.map(img => img.alt || wcItem.name),
    sizes: [],
    description: '',
    shortDescription: wcItem.short_description || '',
    permalink: wcItem.permalink,
    sku: wcItem.sku,
    inStock: true,
    isNewArrival: false,
    isBestSeller: false,
  };

  return {
    product,
    selectedSize,
    selectedColor,
    quantity: wcItem.quantity,
    wcKey: wcItem.key,
  };
}

function mapWcCartToItems(wcCartData: WcCart): CartItem[] {
  return wcCartData.items.map(mapWcItemToCartItem);
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wcCartState, setWcCartState] = useState<WcCart | null>(null);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);

  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewState] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activePage, setActivePage] = useState<PageType>('home');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currency, setCurrency] = useState('₹');
  const pathname = usePathname();
  const router = useRouter();
  const [notification, setNotification] = useState<string | null>(null);

  // Prevent duplicate hydration calls
  const hasHydrated = useRef(false);

  const setQuickViewProduct = (prod: Product | null) => {
    if (prod) {
      setSelectedProduct(prod);
      setActivePage('product');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setQuickViewState(null);
    }
  };

  // -------------------------------------------------------------------------
  // Sync WcCart → local state
  // -------------------------------------------------------------------------
  const syncFromWcCart = useCallback((wcData: WcCart) => {
    setWcCartState(wcData);
    setCart(mapWcCartToItems(wcData));
    // Sync currency from WooCommerce
    if (wcData.totals.currency_symbol) {
      setCurrency(wcData.totals.currency_symbol);
    }
    setCartError(null);
  }, []);

  // -------------------------------------------------------------------------
  // Hydrate cart from WooCommerce on mount
  // -------------------------------------------------------------------------
  const refreshCart = useCallback(async () => {
    if (isCartLoading) return;
    setIsCartLoading(true);
    try {
      const wcData = await wooCart.getCart();
      syncFromWcCart(wcData);
    } catch (err) {
      console.error('Failed to fetch WooCommerce cart:', err);
      setCartError(err instanceof Error ? err.message : 'Failed to load cart');
    } finally {
      setIsCartLoading(false);
    }
  }, [syncFromWcCart, isCartLoading]);

  useEffect(() => {
    if (!hasHydrated.current) {
      hasHydrated.current = true;
      refreshCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------------------------------------------------------
  // Sync active page with pathname
  // -------------------------------------------------------------------------
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!pathname) return;
    if (pathname === '/shop') {
      setActivePage('shop');
    } else if (pathname === '/about') {
      setActivePage('about');
    } else if (pathname === '/contact') {
      setActivePage('contact');
    } else if (pathname === '/checkout') {
      setActivePage('checkout');
    } else if (pathname.startsWith('/product/')) {
      setActivePage('product');
    } else {
      setActivePage('home');
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    } else if (activePage === 'checkout') {
      targetPath = '/checkout';
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

  // -------------------------------------------------------------------------
  // Cart Operations (WooCommerce-backed)
  // -------------------------------------------------------------------------

  const addToCart = useCallback(async (product: Product, size?: string, color?: string, quantity: number = 1) => {
    setIsCartLoading(true);
    setCartError(null);

    try {
      // Build variation attributes if size/color are specified
      const variation: Array<{ attribute: string; value: string }> = [];
      if (size) variation.push({ attribute: 'pa_size', value: size.toLowerCase() });
      if (color && color !== 'Default') variation.push({ attribute: 'pa_color', value: color.toLowerCase() });

      const wcData = await wooCart.addItem(
        parseInt(product.id, 10),
        quantity,
        variation.length > 0 ? variation : undefined
      );
      syncFromWcCart(wcData);
      setNotification(`Added "${product.name}" to your bag`);
      setIsCartOpen(true);
    } catch (err) {
      console.error('Failed to add item to cart:', err);
      const message = err instanceof wooCart.WooCommerceCartError ? err.message : 'Failed to add item';
      setCartError(message);
      setNotification(`Error: ${message}`);
    } finally {
      setIsCartLoading(false);
    }
  }, [syncFromWcCart]);

  const removeFromCart = useCallback(async (productId: string, size: string, color: string) => {
    // Find the item by productId + size + color to get the wcKey
    const item = cart.find(
      i => i.product.id === productId && i.selectedSize === size && i.selectedColor === color
    );
    if (!item?.wcKey) {
      // Fallback: remove from local state only
      setCart(prev => prev.filter(i => !(i.product.id === productId && i.selectedSize === size && i.selectedColor === color)));
      return;
    }

    setIsCartLoading(true);
    setCartError(null);
    try {
      const wcData = await wooCart.removeItem(item.wcKey);
      syncFromWcCart(wcData);
    } catch (err) {
      console.error('Failed to remove item from cart:', err);
      setCartError(err instanceof Error ? err.message : 'Failed to remove item');
    } finally {
      setIsCartLoading(false);
    }
  }, [cart, syncFromWcCart]);

  const updateQuantity = useCallback(async (productId: string, size: string, color: string, delta: number) => {
    const item = cart.find(
      i => i.product.id === productId && i.selectedSize === size && i.selectedColor === color
    );
    if (!item?.wcKey) return;

    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      return removeFromCart(productId, size, color);
    }

    setIsCartLoading(true);
    setCartError(null);
    try {
      const wcData = await wooCart.updateItem(item.wcKey, newQty);
      syncFromWcCart(wcData);
    } catch (err) {
      console.error('Failed to update item quantity:', err);
      setCartError(err instanceof Error ? err.message : 'Failed to update quantity');
    } finally {
      setIsCartLoading(false);
    }
  }, [cart, syncFromWcCart, removeFromCart]);

  const clearCart = useCallback(async () => {
    setIsCartLoading(true);
    setCartError(null);
    try {
      // Remove items one by one (WC Store API has no bulk clear)
      let currentCart = wcCartState;
      if (currentCart) {
        for (const item of currentCart.items) {
          currentCart = await wooCart.removeItem(item.key);
        }
        syncFromWcCart(currentCart);
      }
    } catch (err) {
      console.error('Failed to clear cart:', err);
      setCartError(err instanceof Error ? err.message : 'Failed to clear cart');
    } finally {
      setIsCartLoading(false);
    }
  }, [wcCartState, syncFromWcCart]);

  // -------------------------------------------------------------------------
  // Coupon Operations
  // -------------------------------------------------------------------------

  const handleApplyCoupon = useCallback(async (code: string) => {
    setIsCartLoading(true);
    setCartError(null);
    try {
      const wcData = await wooCart.applyCoupon(code);
      syncFromWcCart(wcData);
      setNotification(`Coupon "${code.toUpperCase()}" applied!`);
    } catch (err) {
      const message = err instanceof wooCart.WooCommerceCartError ? err.message : 'Invalid coupon';
      setCartError(message);
      setNotification(`Coupon error: ${message}`);
      throw err; // re-throw so the UI can handle it
    } finally {
      setIsCartLoading(false);
    }
  }, [syncFromWcCart]);

  const handleRemoveCoupon = useCallback(async (code: string) => {
    setIsCartLoading(true);
    setCartError(null);
    try {
      const wcData = await wooCart.removeCoupon(code);
      syncFromWcCart(wcData);
      setNotification('Coupon removed');
    } catch (err) {
      setCartError(err instanceof Error ? err.message : 'Failed to remove coupon');
    } finally {
      setIsCartLoading(false);
    }
  }, [syncFromWcCart]);

  // -------------------------------------------------------------------------
  // Wishlist (stays local — WC Store API doesn't support wishlists)
  // -------------------------------------------------------------------------

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

  // -------------------------------------------------------------------------
  // Computed totals — use WooCommerce calculations when available
  // -------------------------------------------------------------------------

  const cartTotal = wcCartState
    ? wooCart.wcPriceToNumber(wcCartState.totals.total_price, wcCartState.totals.currency_minor_unit)
    : cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const cartCount = wcCartState
    ? wcCartState.items_count
    : cart.reduce((sum, item) => sum + item.quantity, 0);

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
        setNotification,
        wcCart: wcCartState,
        isCartLoading,
        cartError,
        refreshCart,
        applyCoupon: handleApplyCoupon,
        removeCoupon: handleRemoveCoupon,
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
