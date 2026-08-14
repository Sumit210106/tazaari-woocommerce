"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import ProductCard, { ProductCardSkeleton } from '../components/ProductCard';
import { Search, X, ChevronLeft, ChevronRight, Loader, AlertCircle } from 'lucide-react';
import type { NormalizedProduct } from '../types/product';

// ─── SEO head helper ─────────────────────────────────────────────────────────
const usePageMeta = (title: string, description: string) => {
  useEffect(() => {
    document.title = title;
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = description;
  }, [title, description]);
};

// ─── Category slugs used in the sidebar ──────────────────────────────────────
const SIDEBAR_CATEGORIES = [
  { slug: 'man',          label: 'MAN' },
  { slug: 'woman',        label: 'WOMAN' },
  { slug: 'new-arrivals', label: 'New Arrivals' },
  { slug: 'essentials',   label: 'Essentials' },
  { slug: 'unisex',       label: 'Unisex' },
];

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'Featured' },
  { value: 'date:desc', label: 'Newest First' },
  { value: 'price:asc', label: 'Price: Low → High' },
  { value: 'price:desc', label: 'Price: High → Low' },
  { value: 'rating:desc', label: 'Top Rated' },
  { value: 'popularity:desc', label: 'Most Popular' },
];

export const ShopPage: React.FC = () => {
  const router = useRouter();
  const { activeCategory, setActiveCategory, setSelectedProduct, setActivePage, setQuickViewProduct, searchQuery, setSearchQuery } = useCart();
  const { products, isLoading, error, totalPages, currentPage, totalProducts, loadProducts } = useProducts();

  const [sort, setSort] = useState('');
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // ─── SEO meta ──────────────────────────────────────────────────────────────
  const categoryLabel = SIDEBAR_CATEGORIES.find(c => c.slug === activeCategory)?.label || 'All Collections';
  usePageMeta(
    `${categoryLabel} | Tazaari – Premium Indian Streetwear`,
    `Shop ${categoryLabel} at Tazaari. Premium 300 GSM heavyweight cotton streetwear, handcrafted in India. Free express shipping on all orders.`
  );

  // ─── Load products whenever filters/pagination change ──────────────────────
  const load = useCallback((page = 1) => {
    const [orderby, order] = sort ? (sort.split(':') as ['price' | 'rating' | 'popularity' | 'date', 'asc' | 'desc']) : [undefined, undefined];
    loadProducts({
      page,
      per_page: 12,
      category: activeCategory !== 'all' ? activeCategory : undefined,
      search: searchQuery || undefined,
      orderby: orderby as any,
      order: order as any,
    });
  }, [activeCategory, searchQuery, sort, loadProducts]);

  useEffect(() => { load(1); }, [load]);

  // ─── Sync external search query to local state ─────────────────────────────
  useEffect(() => { setLocalSearch(searchQuery); }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
  };

  const handleClearSearch = () => {
    setLocalSearch('');
    setSearchQuery('');
  };

  // ─── Product card click → product detail ──────────────────────────────────
  const handleProductClick = (product: NormalizedProduct) => {
    setSelectedProduct(product);
    setActivePage('product');
    router.push(`/product/${product.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ─── Category title for the banner ────────────────────────────────────────
  const categoryTitles: Record<string, string> = {
    all: 'All Luxury Collections',
    essentials: 'Everyday Essentials',
    man: "Men's Apparel",
    'new-arrivals': 'New Arrivals',
    unisex: 'Unisex Wardrobe',
    woman: "Women's Couture",
  };

  return (
    <div style={{ paddingTop: '85px', paddingBottom: '96px', backgroundColor: '#FFFFFF' }}>

      {/* ── Global CSS for Responsive Shop Page ── */}
      <style>{`
        /* Desktop vs Mobile layout for ShopPage */
        .shop-layout-grid {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 48px;
          align-items: start;
        }

        .shop-sidebar {
          position: sticky;
          top: 100px;
        }

        .shop-mobile-filter-toggle {
          display: none !important;
        }

        .shop-sidebar-content {
          display: block;
        }

        .shop-product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 24px;
        }

        .shop-hero-section {
          padding: 0 60px;
          min-height: 460px;
        }

        .shop-hero-title {
          font-size: 3.75rem;
        }

        .shop-categories-title {
          font-family: var(--font-sans);
          font-size: 1.1rem;
          font-weight: 600;
          color: #111111;
          margin-bottom: 16px;
        }

        .shop-categories-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .shop-categories-list li {
          border-bottom: 1px solid #EAE6E1;
        }

        .shop-categories-list button {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 0;
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--font-sans);
          font-size: 0.95rem;
          font-weight: 500;
          color: #666666;
          transition: color 0.2s ease;
          text-align: left;
        }

        .shop-categories-list button.active {
          font-weight: 700;
          color: #C5A059;
        }

        .shop-sidebar-filters {
          display: block;
        }

        .shop-categories-desktop-only {
          display: block;
        }

        .shop-categories-mobile-select-wrapper {
          display: none;
        }

        /* Mobile / Tablet Responsive Styles */
        @media (max-width: 1024px) {
          .shop-layout-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          
          .shop-sidebar {
            position: relative !important;
            top: 0 !important;
            margin-bottom: 16px;
          }

          .shop-mobile-filter-toggle {
            display: inline-flex !important;
          }

          .shop-sidebar-content {
            display: none;
            padding: 24px 20px;
            background-color: #FAFAFA;
            border: 1px solid #EAE6E1;
            border-radius: 8px;
            margin-bottom: 24px;
          }

          .shop-sidebar-content.open {
            display: block !important;
            animation: dropdownFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          .shop-sidebar-filters {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 16px !important;
            margin-bottom: 20px !important;
          }

          .shop-categories-title {
            font-size: 0.9rem !important;
            color: #888888 !important;
            text-transform: uppercase !important;
            letter-spacing: 0.1em !important;
            margin-bottom: 10px !important;
            border-bottom: 1px solid #EAE6E1;
            padding-bottom: 8px;
          }

          .shop-product-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }

          .shop-hero-section {
            padding: 0 20px !important;
            min-height: 260px !important;
          }

          .shop-hero-title {
            font-size: 2.2rem !important;
          }

          .shop-categories-desktop-only {
            display: none !important;
          }

          .shop-categories-mobile-select-wrapper {
            display: block !important;
          }
        }

        @media (max-width: 640px) {
          .shop-sidebar-filters {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
            margin-bottom: 16px !important;
          }

          .shop-product-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }

          .shop-hero-section {
            min-height: 200px !important;
          }

          .shop-hero-title {
            font-size: 1.75rem !important;
          }
        }

        @keyframes dropdownFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── Hero Parallelogram Banner ── */}
      <section className="shop-hero-section" style={{
        overflow: 'hidden', position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#FFFFFF'
      }}>
        {/* Skewed image strip */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center',
          gap: '5px', overflow: 'hidden', backgroundColor: '#FFFFFF', padding: '5px 0'
        }}>
          {[
            'https://tazaari.com/wp-content/uploads/2026/08/Tazaari-Black-Polo-scaled.jpg',
            'https://tazaari.com/wp-content/uploads/2026/08/Tazaari-fitted-tee-scaled.jpg',
            'https://tazaari.com/wp-content/uploads/2026/08/Tazaari-Ribbed-Crop-Top-scaled.jpg',
            'https://tazaari.com/wp-content/uploads/2026/07/Premium-Ribbed-Crop-Top-White-Tazaari.jpg',
            'https://tazaari.com/wp-content/uploads/2026/07/Premium-Ribbed-Crop-Top-Grey-Tazaari.jpg',
            'https://tazaari.com/wp-content/uploads/2026/07/Premium-Ribbed-Crop-Top-Beige-Tazaari.jpg',
            'https://tazaari.com/wp-content/uploads/2026/08/Noir-Polo-Tshirt-Black-Tazarri-India-Premium.jpg',
          ].map((imgUrl, idx) => (
            <div key={idx} style={{
              flex: 1, minWidth: '110px', height: '100%',
              transform: `skewX(-14deg) translateY(${idx % 2 === 1 ? -26 : 18}px)`,
              overflow: 'hidden', borderRadius: '2px', backgroundColor: '#222222',
              transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
              <img
                src={imgUrl}
                alt={`Shop Banner ${idx + 1}`}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'skewX(14deg) scale(1.5)', filter: 'brightness(0.8)' }}
              />
            </div>
          ))}
        </div>
        {/* Vignette */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 100%)', zIndex: 2 }} />
        {/* Overlay text */}
        <div className="container" style={{ position: 'relative', zIndex: 3, textAlign: 'center' }}>
          <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            <h1 className="shop-hero-title" style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, color: '#FFFFFF', margin: 0, textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
              {categoryTitles[activeCategory] || 'All Luxury Collections'}
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)', marginTop: '10px', lineHeight: 1.6, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
              Explore curated handcrafted garments, rich handloom textures, and bespoke couture for your finest moments.
            </p>
          </div>
        </div>
      </section>

      {/* ── Active Search Banner ── */}
      {searchQuery && (
        <div style={{ backgroundColor: 'var(--color-gold-light)', borderBottom: '1px solid var(--color-border)', padding: '12px 0' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-primary)' }}>
              Search results for: <strong>"{searchQuery}"</strong> &nbsp;({totalProducts} items)
            </span>
            <button onClick={handleClearSearch} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--color-accent-rose)', fontWeight: 600 }}>
              <X size={14} /> Clear Search
            </button>
          </div>
        </div>
      )}

      {/* ── Main Section: Sidebar + Product Grid ── */}
      <section style={{ padding: '60px 0', backgroundColor: '#FFFFFF' }}>
        <div className="container">
          <div className="shop-layout-grid" style={{ alignItems: 'start' }}>

            {/* ── LEFT SIDEBAR ── */}
            <aside className="shop-sidebar">

              {/* Mobile Filter Toggle Button */}
              <button
                onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                className="shop-mobile-filter-toggle"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  backgroundColor: '#121214',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  display: 'none',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  marginBottom: '16px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                <span>Filter & Sort</span>
                <span style={{ fontSize: '0.8rem', transition: 'transform 0.3s ease', transform: isMobileFiltersOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
              </button>

              {/* Collapsible Content */}
              <div className={`shop-sidebar-content ${isMobileFiltersOpen ? 'open' : ''}`}>
                <div className="shop-sidebar-filters">
                  {/* Search */}
                  <form onSubmit={handleSearchSubmit} style={{ marginBottom: '32px', display: 'flex', border: '1px solid #E0DCD7', borderRadius: '4px', overflow: 'hidden' }}>
                    <input
                      type="search"
                      placeholder="Search products…"
                      value={localSearch}
                      onChange={e => setLocalSearch(e.target.value)}
                      style={{
                        flex: 1, padding: '10px 14px', border: 'none', outline: 'none',
                        fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: '#111111', backgroundColor: '#FAFAFA'
                      }}
                    />
                    <button type="submit" style={{ padding: '0 12px', background: '#111111', border: 'none', cursor: 'pointer' }}>
                      <Search size={14} style={{ color: '#FFFFFF' }} />
                    </button>
                  </form>

                  {/* Sort */}
                  <div style={{ marginBottom: '32px' }}>
                    <h3 className="shop-sidebar-title" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888888', marginBottom: '12px' }}>Sort By</h3>
                    <select
                      value={sort}
                      onChange={e => setSort(e.target.value)}
                      style={{
                        width: '100%', padding: '10px 14px', border: '1px solid #E0DCD7', borderRadius: '4px',
                        fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: '#111111',
                        backgroundColor: '#FAFAFA', cursor: 'pointer', appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center'
                      }}
                    >
                      {SORT_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Categories Dropdown (Mobile only) */}
                <div className="shop-categories-mobile-select-wrapper">
                  <h3 className="shop-sidebar-title" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888888', marginBottom: '12px' }}>Categories</h3>
                  <select
                    value={activeCategory}
                    onChange={e => { setActiveCategory(e.target.value); setIsMobileFiltersOpen(false); }}
                    style={{
                      width: '100%', padding: '10px 14px', border: '1px solid #E0DCD7', borderRadius: '4px',
                      fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: '#111111',
                      backgroundColor: '#FAFAFA', cursor: 'pointer', appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
                      marginBottom: '16px'
                    }}
                  >
                    <option value="all">ALL</option>
                    {SIDEBAR_CATEGORIES.map(cat => (
                      <option key={cat.slug} value={cat.slug}>{cat.label.toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                {/* Categories List (Desktop only) */}
                <div className="shop-categories-desktop-only">
                  <h3 className="shop-categories-title">Categories</h3>
                  <ul className="shop-categories-list">
                    <li>
                      <button
                        onClick={() => { setActiveCategory('all'); }}
                        className={activeCategory === 'all' ? 'active' : ''}
                      >
                        <span>ALL</span>
                        {activeCategory === 'all' && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#C5A059' }} />}
                      </button>
                    </li>
                    {SIDEBAR_CATEGORIES.map(cat => (
                      <li key={cat.slug}>
                        <button
                          onClick={() => { setActiveCategory(cat.slug); }}
                          className={activeCategory === cat.slug ? 'active' : ''}
                        >
                          <span>{cat.label}</span>
                          {activeCategory === cat.slug && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#C5A059' }} />}
                        </button>
                      </li>
                    ))}
                  </ul>

                  {activeCategory !== 'all' && (
                    <button
                      onClick={() => { setActiveCategory('all'); }}
                      style={{ marginTop: '20px', fontSize: '0.8125rem', fontWeight: 700, color: '#C5A059', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      SHOW ALL PRODUCTS
                    </button>
                  )}
                </div>
              </div>
            </aside>

            {/* ── RIGHT: Product Grid ── */}
            <div>
              {/* Error state */}
              {error && (
                <div style={{ textAlign: 'center', padding: '60px 24px', color: '#8B4A47' }}>
                  <AlertCircle size={40} style={{ margin: '0 auto 16px', opacity: 0.7 }} />
                  <h3 style={{ marginBottom: '8px' }}>Couldn't load products</h3>
                  <p style={{ fontSize: '0.875rem', marginBottom: '20px', color: '#666' }}>{error}</p>
                  <button onClick={() => load(currentPage)} className="btn-primary" style={{ borderRadius: '0px' }}>
                    RETRY
                  </button>
                </div>
              )}

              {/* Loading skeletons */}
              {isLoading && !error && (
                <div className="shop-product-grid">
                  {Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                </div>
              )}

              {/* Empty state */}
              {!isLoading && !error && products.length === 0 && (
                <div style={{ textAlign: 'center', padding: '80px 24px', backgroundColor: '#FFFFFF', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                  <Search size={48} style={{ color: '#5c81b3', margin: '0 auto 16px', opacity: 0.6 }} />
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', marginBottom: '8px' }}>No Couture Pieces Found</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
                    We couldn't find any items matching your selected criteria. Try searching for something else or clearing filters.
                  </p>
                  <button onClick={() => { setActiveCategory('all'); setSearchQuery(''); }} className="btn-primary" style={{ borderRadius: '0px' }}>
                    RESET ALL FILTERS
                  </button>
                </div>
              )}

              {/* Product Grid */}
              {!isLoading && !error && products.length > 0 && (
                <>
                  <p style={{ fontSize: '0.8125rem', color: '#999', marginBottom: '24px', textAlign: 'right' }}>
                    {totalProducts} product{totalProducts !== 1 ? 's' : ''}
                  </p>
                  <div className="shop-product-grid">
                    {products.map(product => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onClick={handleProductClick}
                      />
                    ))}
                  </div>

                  {/* ── Pagination ── */}
                  {totalPages > 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '56px' }}>
                      <button
                        onClick={() => load(currentPage - 1)}
                        disabled={currentPage <= 1 || isLoading}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px',
                          fontSize: '0.8125rem', fontWeight: 700, letterSpacing: '0.1em',
                          border: '1px solid #E0DCD7', backgroundColor: currentPage <= 1 ? '#F5F5F5' : '#FFFFFF',
                          color: currentPage <= 1 ? '#CCC' : '#111111', cursor: currentPage <= 1 ? 'default' : 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <ChevronLeft size={16} /> PREV
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <button
                          key={p}
                          onClick={() => load(p)}
                          disabled={isLoading}
                          style={{
                            width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.875rem', fontWeight: p === currentPage ? 800 : 500,
                            border: p === currentPage ? '2px solid #111111' : '1px solid #E0DCD7',
                            backgroundColor: p === currentPage ? '#111111' : '#FFFFFF',
                            color: p === currentPage ? '#FFFFFF' : '#666666',
                            cursor: isLoading ? 'default' : 'pointer', transition: 'all 0.2s ease'
                          }}
                        >
                          {p}
                        </button>
                      ))}

                      <button
                        onClick={() => load(currentPage + 1)}
                        disabled={currentPage >= totalPages || isLoading}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px',
                          fontSize: '0.8125rem', fontWeight: 700, letterSpacing: '0.1em',
                          border: '1px solid #E0DCD7', backgroundColor: currentPage >= totalPages ? '#F5F5F5' : '#FFFFFF',
                          color: currentPage >= totalPages ? '#CCC' : '#111111', cursor: currentPage >= totalPages ? 'default' : 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        NEXT <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </>
              )}

              {isLoading && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
                  <Loader size={24} style={{ color: '#D4AF37', animation: 'spin 1s linear infinite' }} />
                  <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShopPage;
