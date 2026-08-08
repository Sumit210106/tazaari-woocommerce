"use client";

"use client";

import React from 'react';
import { CartProvider } from '../context/CartContext';
import { ProductProvider } from '../context/ProductContext';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ProductProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </ProductProvider>
  );
};

export default Providers;
