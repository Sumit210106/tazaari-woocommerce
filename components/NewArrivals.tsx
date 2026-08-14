"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useCart } from '../context/CartContext';
import ProductCard, { ProductCardSkeleton } from './ProductCard';
import { Loader } from 'lucide-react';

const TABS = [
  { id: 'all',          label: 'ALL' },
  { id: 'essentials',   label: 'ESSENTIALS' },
  { id: 'man',          label: 'MAN' },
  { id: 'unisex',       label: 'UNISEX' },
  { id: 'woman',        label: 'WOMAN' },
];

export const NewArrivals: React.FC = () => {
  const { setActiveCategory, setActivePage } = useCart();
  const [activeTab, setActiveTab] = useState('all');
  const [tabProducts, setTabProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTabProducts = useCallback(async (tab: string) => {
    setLoading(true);
    try {
      const { fetchProducts } = await import('../services/wooApi');
      const result = await fetchProducts({
        per_page: 12,
        page: 1,
        category: tab !== 'all' ? tab : undefined,
        orderby: 'date',
        order: 'desc',
      });
      
      // If a category tab returns 0 items due to slug mismatch, fallback to fetching recent products
      if (result.products.length === 0 && tab !== 'all') {
        const fallbackResult = await fetchProducts({
          per_page: 8,
          page: 1,
          orderby: 'date',
          order: 'desc',
        });
        setTabProducts(fallbackResult.products);
      } else {
        setTabProducts(result.products);
      }
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
    <section style={{ padding: '36px 0 64px' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontFamily: "'Urbanist', 'Outfit', sans-serif", fontSize: '3rem', fontWeight: 500, color: '#111111', letterSpacing: '-0.02em' }}>
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
                  transition: 'var(--transition-fast)',
                  cursor: 'pointer',
                  background: 'none',
                  borderTop: 'none',
                  borderLeft: 'none',
                  borderRight: 'none',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Global Styles for Mobile 2-column grid */}
        <style>{`
          .new-arrivals-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 24px;
          }
          @media (max-width: 1024px) {
            .new-arrivals-grid {
              grid-template-columns: repeat(3, 1fr);
              gap: 16px;
            }
          }
          @media (max-width: 768px) {
            .new-arrivals-grid {
              grid-template-columns: repeat(2, 1fr);
              gap: 12px;
            }
          }
        `}</style>

        {/* Loading state */}
        {loading && (
          <div className="new-arrivals-grid">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        )}

        {/* Product Grid - Shows all loaded tab products */}
        {!loading && tabProducts.length > 0 && (
          <div className="new-arrivals-grid">
            {tabProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Empty fallback state */}
        {!loading && tabProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#666666' }}>
            <p>No products found in this category right now.</p>
          </div>
        )}

        {/* View All Products CTA */}
        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <button
            onClick={() => {
              setActiveCategory(activeTab !== 'all' ? activeTab : 'all');
              setActivePage('shop');
            }}
            style={{
              padding: '14px 36px',
              backgroundColor: '#121214',
              color: '#FFFFFF',
              fontSize: '0.8125rem',
              fontWeight: 800,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#C5A059';
              e.currentTarget.style.color = '#121214';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#121214';
              e.currentTarget.style.color = '#FFFFFF';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            EXPLORE ALL PRODUCTS
          </button>
        </div>

      </div>
    </section>
  );
};

export default NewArrivals;
