"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useCart } from '../context/CartContext';

import { ShoppingBag, Loader } from 'lucide-react';

const TABS = [
  { id: 'all',          label: 'ALL' },
  { id: 'essentials',   label: 'ESSENTIALS' },
  { id: 'man',          label: 'MAN' },
  { id: 'unisex',       label: 'UNISEX' },
  { id: 'woman',        label: 'WOMAN' },
];

// Skeleton placeholder card
const SkeletonCard: React.FC = () => (
  <div style={{
    position: 'relative', paddingTop: '135%', borderRadius: '0px',
    backgroundColor: '#F0EDE8', overflow: 'hidden', animation: 'pulse 1.5s ease-in-out infinite'
  }}>
    <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }`}</style>
  </div>
);

export const NewArrivals: React.FC = () => {
  const { setQuickViewProduct, addToCart } = useCart();

  const [activeTab, setActiveTab] = useState('all');
  const [tabProducts, setTabProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTabProducts = useCallback(async (tab: string) => {
    setLoading(true);
    try {
      // Import fetch function directly to avoid polluting global products state
      const { fetchProducts } = await import('../services/wooApi');
      const result = await fetchProducts({
        per_page: 8,
        page: 1,
        category: tab !== 'all' ? tab : undefined,
        orderby: 'date',
        order: 'desc',
      });
      setTabProducts(result.products);
    } catch {
      setTabProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTabProducts(activeTab);
  }, [activeTab, fetchTabProducts]);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <section style={{ padding: '24px 0 60px' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontFamily: "'Urbanist', 'Outfit', sans-serif", fontSize: '3.25rem', fontWeight: 400, color: '#111111', letterSpacing: '-0.02em' }}>
            New Arrivals
          </h2>

          {/* Category Sub-Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginTop: '24px', flexWrap: 'wrap' }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                style={{
                  fontFamily: "'Urbanist', 'Outfit', sans-serif",
                  fontSize: '0.8125rem',
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  letterSpacing: '0.15em',
                  color: activeTab === tab.id ? '#111111' : '#A0A0A0',
                  borderBottom: activeTab === tab.id ? '2px solid #111111' : '2px solid transparent',
                  paddingBottom: '4px',
                  transition: 'var(--transition-fast)'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Product Grid - 4 visible at a time */}
        {!loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {tabProducts.slice(0, 4).map(product => (
              <div
                key={product.id}
                onClick={() => setQuickViewProduct(product)}
                className="product-card group"
                style={{
                  position: 'relative',
                  paddingTop: '135%',
                  overflow: 'hidden',
                  backgroundColor: '#FAF8F5',
                  borderRadius: '0px',
                  cursor: 'pointer'
                }}
              >
                <img
                  src={product.images[0]}
                  alt={product.imageAlts?.[0] || product.name}
                  loading="lazy"
                  srcSet={product.imageSrcsets?.[0] || undefined}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease'
                  }}
                />

                {/* On-Sale badge */}
                {product.onSale && (
                  <div style={{
                    position: 'absolute', top: '12px', left: '12px', zIndex: 2,
                    backgroundColor: '#8B4A47', color: '#FFFFFF', fontSize: '0.65rem',
                    fontWeight: 800, letterSpacing: '0.12em', padding: '4px 8px'
                  }}>
                    SALE
                  </div>
                )}

                {/* Glassmorphism Hover Overlay */}
                <div
                  className="product-hover-overlay"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '28%',
                    background: 'rgba(255, 255, 255, 0.38)',
                    backdropFilter: 'blur(14px)',
                    WebkitBackdropFilter: 'blur(14px)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.6)',
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    zIndex: 3
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.825rem', fontWeight: 800, color: '#111111', fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '65%' }}>
                      {product.name}
                    </span>
                    <span style={{ fontSize: '0.825rem', fontWeight: 800, color: product.onSale ? '#8B4A47' : '#111111' }}>
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product, product.sizes[0] || 'M', 'Default');
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      backgroundColor: '#111111',
                      color: '#FFFFFF',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      border: 'none',
                      borderRadius: '0px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.25s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#D4AF37'; e.currentTarget.style.color = '#111111'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#111111'; e.currentTarget.style.color = '#FFFFFF'; }}
                  >
                    <ShoppingBag size={12} />
                    <span>ADD TO CART</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Loading spinner during tab switch */}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
            <Loader size={22} style={{ color: '#D4AF37', animation: 'spin 1s linear infinite' }} />
            <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
          </div>
        )}

      </div>
    </section>
  );
};

export default NewArrivals;
