"use client";

"use client";

import React from 'react';
import { CartProvider } from '../context/CartContext';
import { ProductProvider } from '../context/ProductContext';

import { AuthProvider } from '../context/AuthContext';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
};

export default Providers;
