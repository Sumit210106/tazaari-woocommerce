"use client";

import React, { use, useEffect } from 'react';
import ProductDetailPage from '../../../views/ProductDetailPage';
import { useCart } from '../../../context/CartContext';
import { fetchProduct } from '../../../services/wooApi';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductRoute({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const { selectedProduct, setSelectedProduct } = useCart();

  useEffect(() => {
    if (!selectedProduct || selectedProduct.id !== id) {
      fetchProduct(id)
        .then(prod => {
          if (prod) {
            setSelectedProduct(prod);
          }
        })
        .catch(err => {
          console.error("Error loading product on dynamic page:", err);
        });
    }
  }, [id, selectedProduct, setSelectedProduct]);

  return <ProductDetailPage />;
}
