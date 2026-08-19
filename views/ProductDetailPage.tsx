"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { NormalizedProduct, sortSizes } from '../types/product';
import { fetchProducts } from '../services/wooApi';
import ProductCard from '../components/ProductCard';
import {
  Heart, ShoppingBag, Star, ShieldCheck, Truck,
  Sparkles, Check, ChevronDown, ChevronUp, ZoomIn, Ruler, X,
  ChevronLeft, ChevronRight
} from 'lucide-react';

// ─── SEO ──────────────────────────────────────────────────────────────────────
const useProductMeta = (product: NormalizedProduct | null) => {
  useEffect(() => {
    if (!product) return;
    document.title = `${product.name} | Tazaari – Premium Indian Streetwear`;
    let desc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!desc) { desc = document.createElement('meta'); desc.name = 'description'; document.head.appendChild(desc); }
    desc.content = product.shortDescription || `Buy ${product.name} at Tazaari. Premium handcrafted Indian streetwear. Free express shipping.`;

    let og = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    if (!og) { og = document.createElement('meta'); og.setAttribute('property', 'og:title'); document.head.appendChild(og); }
    og.content = `${product.name} | Tazaari`;

    let ogImg = document.querySelector<HTMLMetaElement>('meta[property="og:image"]');
    if (!ogImg) { ogImg = document.createElement('meta'); ogImg.setAttribute('property', 'og:image'); document.head.appendChild(ogImg); }
    if (product.images[0]) ogImg.content = product.images[0];
  }, [product]);
};

// ─── Accordion section component ──────────────────────────────────────────────
const Accordion: React.FC<{ title: string; defaultOpen?: boolean; children: React.ReactNode }> = ({
  title, defaultOpen = false, children
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderTop: '1px solid var(--color-border)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '18px 0', background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 800,
          letterSpacing: '0.14em', textTransform: 'uppercase', color: '#111111'
        }}
      >
        {title}
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && (
        <div style={{ paddingBottom: '20px' }}>
          {children}
        </div>
      )}
    </div>
  );
};

// ─── Rich HTML renderer (description from WooCommerce) ────────────────────────
const sanitizeWooDescription = (html: string): string => {
  if (!html) return '';

  if (typeof window === 'undefined') {
    return html
      .replace(/<table[\s\S]*?<\/table>/gi, '')
      .replace(/<(p|h[1-6]|div|strong|b|span)[^>]*>\s*(PRODUCT DETAILS|SPECIFICATION|SIZE CHART|KEY DETAILS|PRODUCT CARE)\s*<\/(p|h[1-6]|div|strong|b|span)>/gi, '')
      .replace(/<strong>\s*(PRODUCT DETAILS|SPECIFICATION|SIZE CHART|KEY DETAILS|PRODUCT CARE)\s*<\/strong>/gi, '');
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Remove tables
    doc.querySelectorAll('table').forEach(el => el.remove());

    const targetHeadings = ['PRODUCT DETAILS', 'SPECIFICATION', 'SIZE CHART', 'KEY DETAILS', 'PRODUCT CARE'];

    const elements = Array.from(doc.body.querySelectorAll('*'));
    elements.forEach(el => {
      const text = el.textContent?.trim().toUpperCase() || '';
      if (targetHeadings.includes(text)) {
        if (text === 'KEY DETAILS' || text === 'PRODUCT CARE' || text === 'SPECIFICATION') {
          let next = el.nextElementSibling;
          while (next && (next.tagName === 'UL' || next.tagName === 'OL' || next.tagName === 'P' || next.tagName === 'TABLE' || next.tagName === 'DIV')) {
            const nextEl = next;
            next = next.nextElementSibling;
            nextEl.remove();
          }
        }
        el.remove();
      }
    });

    return doc.body.innerHTML.trim();
  } catch {
    return html;
  }
};

const RichDescription: React.FC<{ html: string }> = ({ html }) => (
  <div
    className="woo-description"
    dangerouslySetInnerHTML={{ __html: sanitizeWooDescription(html) }}
  />
);




// ─── Main component ───────────────────────────────────────────────────────────
export const ProductDetailPage: React.FC = () => {
  const { selectedProduct, setSelectedProduct, setActivePage, addToCart, toggleWishlist, isInWishlist } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<NormalizedProduct[]>([]);
  const [zoomed, setZoomed] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  const product = selectedProduct;

  useProductMeta(product);

  const sortedSizes = sortSizes(product?.sizes || []);

  // Reset on product change
  useEffect(() => {
    setSelectedImage(0);
    setSelectedSize(sortedSizes[0] || '');
    setQuantity(1);
    setRelatedProducts([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product?.id]);

  // Fetch related products
  useEffect(() => {
    if (!product) return;
    const slug = product.categories[0]?.slug;
    fetchProducts({ category: slug, per_page: 5 })
      .then(r => setRelatedProducts(r.products.filter(p => p.id !== product.id).slice(0, 4)))
      .catch(() => setRelatedProducts([]));
  }, [product?.id]);

  if (!product) {
    return (
      <div style={{ paddingTop: '140px', paddingBottom: '96px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.1rem', color: '#666' }}>
          No product selected.
        </p>
        <button
          onClick={() => setActivePage('shop')}
          style={{
            marginTop: '24px', padding: '14px 32px', backgroundColor: '#111111', color: '#FFFFFF',
            border: 'none', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', fontWeight: 800,
            letterSpacing: '0.15em', cursor: 'pointer'
          }}
        >
          GO TO SHOP
        </button>
      </div>
    );
  }

  const activeSize = selectedSize || sortedSizes[0] || 'Standard';
  const wishlisted = isInWishlist(product.id);
  const displayPrice = `₹${product.price.toLocaleString('en-IN')}`;
  const displayOriginal = product.onSale && product.originalPrice !== product.price
    ? `₹${product.originalPrice.toLocaleString('en-IN')}`
    : null;
  const discount = displayOriginal
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, activeSize, 'Default', quantity);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2200);
  };

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription,
    sku: product.sku,
    image: product.images,
    url: product.permalink,
    brand: { '@type': 'Brand', name: 'Tazaari' },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'INR',
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: product.permalink,
      seller: { '@type': 'Organization', name: 'Tazaari' },
    },
    ...(product.reviewsCount > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewsCount,
        bestRating: 5,
      },
    }),
  };

  return (
    <>
      {/* Inline styles for woo description HTML rendering */}
      <style>{`
        .woo-description h4 {
          font-family: var(--font-sans);
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #111111;
          margin: 24px 0 12px;
        }
        .woo-description h4:first-child { margin-top: 0; }
        .woo-description p {
          font-family: var(--font-sans);
          font-size: 0.925rem;
          color: #555555;
          line-height: 1.75;
          margin-bottom: 12px;
        }
        .woo-description ul {
          padding-left: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 16px;
        }
        .woo-description ul li {
          font-family: var(--font-sans);
          font-size: 0.875rem;
          color: #555555;
          padding-left: 16px;
          position: relative;
          line-height: 1.6;
        }
        .woo-description ul li::before {
          content: '—';
          position: absolute;
          left: 0;
          color: var(--color-gold);
          font-weight: 700;
        }
        .woo-description table {
          display: none !important;
        }
        .woo-description table td {
          border: 1px solid #E8E2D9;
          padding: 10px 12px;
          font-family: var(--font-sans);
          color: #444444;
          line-height: 1.5;
        }
        .woo-description table tr:first-child td {
          background-color: #FAF8F5;
          font-weight: 700;
          color: #111111;
        }
        .woo-description strong { font-weight: 700; color: #111111; }
        .woo-description div { margin-bottom: 4px; }
        .product-thumb-btn { transition: all 0.2s ease; }
        .product-thumb-btn:hover { opacity: 1 !important; transform: scale(1.03); }
        .related-card:hover img { transform: scale(1.06); }
        .size-btn:hover { border-color: #111111 !important; }
        .add-cart-btn:hover { background-color: var(--color-gold) !important; color: #111111 !important; }
      `}</style>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div style={{ backgroundColor: '#FFFFFF', color: '#111111', paddingTop: '160px', paddingBottom: '96px' }}>
        <div className="container">

          {/* ── Breadcrumb ──
          <nav aria-label="breadcrumb" style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <button
              onClick={() => setActivePage('shop')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 800,
                letterSpacing: '0.12em', color: '#5c81b3', background: 'none', border: 'none', cursor: 'pointer'
              }}
            >
              <ArrowLeft size={15} /> BACK TO SHOP
            </button>
            <ol itemScope itemType="https://schema.org/BreadcrumbList" style={{ display: 'flex', alignItems: 'center', gap: '6px', listStyle: 'none', fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: '#999999' }}>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <button onClick={() => setActivePage('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontFamily: 'var(--font-sans)', fontSize: '0.8rem' }} itemProp="name">Home</button>
                <meta itemProp="position" content="1" />
              </li>
              <li>/</li>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <button onClick={() => setActivePage('shop')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontFamily: 'var(--font-sans)', fontSize: '0.8rem' }} itemProp="name">Shop</button>
                <meta itemProp="position" content="2" />
              </li>
              <li>/</li>
              <li style={{ color: '#111111', fontWeight: 600 }} itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <span itemProp="name">{product.name}</span>
                <meta itemProp="position" content="3" />
              </li>
            </ol>
          </nav> */}

          {/* ── Main 2-Column Layout ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '64px', alignItems: 'start', marginBottom: '96px' }}
            itemScope itemType="https://schema.org/Product">

            {/* ═══════════════════════════════════ LEFT: Gallery ═════════════════════ */}
            <div className="product-pdp-gallery">
              {/* Left Column: Vertical Thumbnails Stack */}
              {product.images.length > 1 && (
                <div className="pdp-thumb-col">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      className={`pdp-thumb-btn ${selectedImage === idx ? 'active' : ''}`}
                      onClick={() => { setSelectedImage(idx); }}
                      aria-label={`View image ${idx + 1}`}
                    >
                      <img
                        src={product.thumbnails[idx] || img}
                        alt={`${product.name} – view ${idx + 1}`}
                        loading="lazy"
                      />
                    </button>
                  ))}

                  {/* Scroll down indicator arrow button */}
                  {product.images.length > 3 && (
                    <button
                      className="pdp-thumb-scroll-btn"
                      onClick={() => {
                        setSelectedImage(prev => (prev === product.images.length - 1 ? 0 : prev + 1));
                      }}
                      aria-label="Next image"
                      title="Next image"
                    >
                      <ChevronDown size={16} style={{ color: '#555555' }} />
                    </button>
                  )}
                </div>
              )}

              {/* Right Column: Main Image Showcase */}
              <div
                ref={imgRef}
                className="pdp-main-img-box"
                onClick={() => setIsLightboxOpen(true)}
              >
                <img
                  src={product.images[selectedImage] || product.images[0]}
                  alt={product.imageAlts[selectedImage] || product.name}
                  srcSet={product.imageSrcsets[selectedImage] || undefined}
                  loading="eager"
                  fetchPriority="high"
                  itemProp="image"
                  className="pdp-main-img"
                />
                {product.onSale && (
                  <div style={{
                    position: 'absolute', top: '16px', left: '16px',
                    backgroundColor: 'var(--color-accent-rose)', color: '#FFFFFF',
                    fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 900,
                    letterSpacing: '0.18em', padding: '6px 12px', zIndex: 2, borderRadius: '4px'
                  }}>
                    SALE – {discount}% OFF
                  </div>
                )}
                {!product.inStock && (
                  <div style={{
                    position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(4px)', zIndex: 3
                  }}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: 800, letterSpacing: '0.2em', color: '#111111' }}>
                      SOLD OUT
                    </span>
                  </div>
                )}
                <div className="pdp-zoom-btn">
                  <ZoomIn size={18} style={{ color: '#111111' }} />
                </div>
              </div>
            </div>

            {/* ═══════════════════════════════════ RIGHT: Info & Purchase ═══════════ */}
            <div style={{ paddingTop: '8px' }}>

              {/* Category tag + SKU */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{
                  fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 900,
                  letterSpacing: '0.2em', color: '#5c81b3', textTransform: 'uppercase'
                }}>
                  {product.categories.map(c => c.name).join(' · ')}
                </span>
                {product.sku && (
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#AAAAAA' }}>
                    SKU: {product.sku}
                  </span>
                )}
              </div>

              {/* Product name – h1 for SEO */}
              <h1
                itemProp="name"
                style={{
                  fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3rem)',
                  fontWeight: 600, color: '#111111', lineHeight: 1.15, marginBottom: '16px',
                  letterSpacing: '-0.01em'
                }}
              >
                {product.name}
              </h1>

              {/* Rating */}
              {/* <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i} size={15}
                      fill={i < Math.round(product.rating) ? '#C5A059' : 'none'}
                      style={{ color: '#C5A059' }}
                    />
                  ))}
                </div>
                {/* <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: '#888888' }}>
                  {product.rating > 0
                    ? `${product.rating} (${product.reviewsCount} review${product.reviewsCount !== 1 ? 's' : ''})`
                    : 'Be the first to review'}
                </span> 
              </div> 
              */}

              {/* Price block */}
              <div
                itemProp="offers" itemScope itemType="https://schema.org/Offer"
                style={{ display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '8px' }}
              >
                <meta itemProp="priceCurrency" content="INR" />
                <meta itemProp="price" content={String(product.price)} />
                <meta itemProp="availability" content={product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'} />
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '2.25rem', fontWeight: 800, color: product.onSale ? 'var(--color-accent-rose)' : '#111111', letterSpacing: '-0.02em' }}>
                  {displayPrice}
                </span>
                {displayOriginal && (
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '1.25rem', color: '#AAAAAA', textDecoration: 'line-through' }}>
                    {displayOriginal}
                  </span>
                )}
                {discount > 0 && (
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 800, color: '#FFFFFF', backgroundColor: 'var(--color-accent-rose)', padding: '3px 10px' }}>
                    {discount}% OFF
                  </span>
                )}
              </div>

              {/* GST note */}
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.78rem', color: '#AAAAAA', marginBottom: '24px' }}>
                Inclusive of all taxes &nbsp;·&nbsp; Free express shipping
              </p>

              {/* Short description */}
              {product.shortDescription && (
                <p
                  itemProp="description"
                  style={{ fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: '#555555', lineHeight: 1.75, marginBottom: '28px', paddingBottom: '28px', borderBottom: '1px solid var(--color-border)' }}
                >
                  {product.shortDescription}
                </p>
              )}

              {/* ── Size Selector ── */}
              {sortedSizes.length > 0 && (
                <div style={{ marginBottom: '28px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#111111' }}>
                      SIZE:&nbsp;<span style={{ color: '#5c81b3', fontWeight: 900 }}>{activeSize}</span>
                    </span>
                    <button 
                      onClick={() => setIsSizeChartOpen(true)}
                      style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#5c81b3', fontWeight: 700, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Ruler size={13} />
                      <span>Size Chart</span>
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {sortedSizes.map(size => (
                      <button
                        key={size}
                        className="size-btn"
                        onClick={() => setSelectedSize(size)}
                        style={{
                          minWidth: '52px', padding: '11px 16px',
                          fontFamily: 'var(--font-sans)', fontSize: '0.85rem', fontWeight: 800,
                          border: activeSize === size ? '2px solid #111111' : '1px solid #E0DCD7',
                          backgroundColor: activeSize === size ? '#111111' : '#FFFFFF',
                          color: activeSize === size ? '#FFFFFF' : '#111111',
                          cursor: 'pointer', transition: 'all 0.18s ease',
                          letterSpacing: '0.05em'
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Quantity + Add to Cart ── */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'stretch', marginBottom: '16px' }}>
                {/* Qty */}
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E0DCD7', height: '52px' }}>
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    style={{ width: '44px', height: '100%', border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '1.25rem', color: '#111111', fontWeight: 600 }}
                  >−</button>
                  <span style={{ width: '36px', textAlign: 'center', fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: '0.95rem', color: '#111111' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    style={{ width: '44px', height: '100%', border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: '1.25rem', color: '#111111', fontWeight: 600 }}
                  >+</button>
                </div>

                {/* Add to Cart */}
                <button
                  className="add-cart-btn"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  style={{
                    flex: 1, height: '52px', backgroundColor: addedFeedback ? 'var(--color-gold)' : '#111111',
                    color: addedFeedback ? '#111111' : '#FFFFFF',
                    border: 'none', cursor: product.inStock ? 'pointer' : 'not-allowed',
                    fontFamily: 'var(--font-sans)', fontWeight: 900, fontSize: '0.8rem',
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    transition: 'all 0.25s ease', boxShadow: addedFeedback ? 'var(--shadow-gold)' : '0 6px 20px rgba(0,0,0,0.12)'
                  }}
                >
                  {addedFeedback ? <Check size={18} /> : <ShoppingBag size={18} />}
                  <span>{addedFeedback ? 'ADDED TO BAG' : 'ADD TO BAG'}</span>
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  style={{
                    width: '52px', height: '52px', flexShrink: 0,
                    border: '1px solid #E0DCD7', backgroundColor: '#FFFFFF',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Heart size={20} style={{ color: wishlisted ? '#E53935' : '#111111', fill: wishlisted ? '#E53935' : 'none', transition: 'all 0.2s ease' }} />
                </button>
              </div>

              {/* Stock indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: product.inStock ? '#2E7D32' : '#C62828', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 700, color: product.inStock ? '#2E7D32' : '#C62828' }}>
                  {product.inStock ? 'In Stock – Ships in 24–48 hrs' : 'Currently Out of Stock'}
                </span>
              </div>

              {/* ── Trust Badges ── */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', padding: '20px 0', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', marginBottom: '28px' }}>
                {[
                  { Icon: Truck, label: 'Free Express\nShipping' },
                  { Icon: ShieldCheck, label: '100% Authentic\nCraftsmanship' },
                  { Icon: Sparkles, label: '300 GSM\nPremium Cotton' },
                ].map(({ Icon, label }) => (
                  <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', textAlign: 'center' }}>
                    <Icon size={20} style={{ color: '#5c81b3' }} />
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', fontWeight: 700, color: '#444444', lineHeight: 1.4, whiteSpace: 'pre-line' }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {/* ── Accordions: Full Product Description ── */}
              {product.description && (
                <Accordion title="Product Details" defaultOpen={true}>
                  <RichDescription html={product.description} />
                </Accordion>
              )}

              <Accordion title="Specifications">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', fontFamily: 'var(--font-sans)', fontSize: '0.85rem' }}>
                  {[
                    { label: 'Fabric / Material', value: '300 GSM Heavyweight Cotton' },
                    { label: 'Silhouette', value: 'Relaxed Oversized Fit' },
                    { label: 'Neckline', value: 'Reinforced Crew Neck' },
                    { label: 'Sleeve Type', value: 'Drop Shoulder Half Sleeve' },
                    { label: 'Finish', value: 'Pre-Shrunk & Bio-Washed' },
                    { label: 'Origin', value: 'Crafted in India' }
                  ].map((spec, i) => (
                    <div key={i} style={{ padding: '10px 14px', backgroundColor: '#FAF8F5', border: '1px solid #EAE6E1', borderRadius: '4px' }}>
                      <span style={{ fontSize: '0.725rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5c81b3', display: 'block', marginBottom: '4px' }}>
                        {spec.label}
                      </span>
                      <span style={{ fontWeight: 600, color: '#111111' }}>
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </Accordion>

              <Accordion title="Key Details">
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    '300 GSM Heavyweight Combed Cotton Blend',
                    'Relaxed Oversized Drop-Shoulder Silhouette',
                    'Reinforced Ribbed Crew Collar for Structural Drape',
                    'Pre-Shrunk Weave for Zero Shrinkage After Washing',
                    'Handcrafted & Ethically Produced in Small Batches in India'
                  ].map(txt => (
                    <li key={txt} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: '#555555', paddingLeft: '16px', position: 'relative', lineHeight: 1.6 }}>
                      <span style={{ position: 'absolute', left: 0, color: '#5c81b3', fontWeight: 700 }}>—</span>
                      {txt}
                    </li>
                  ))}
                </ul>
              </Accordion>

              <Accordion title="Product Care">
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    'Machine wash cold (30°C) with like colors',
                    'Wash inside out to protect fabric texture and print',
                    'Do not bleach or use harsh chemical detergents',
                    'Tumble dry low or line dry in shade for best longevity',
                    'Warm iron on reverse side (Do not iron directly on print/embroidery)'
                  ].map(txt => (
                    <li key={txt} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: '#555555', paddingLeft: '16px', position: 'relative', lineHeight: 1.6 }}>
                      <span style={{ position: 'absolute', left: 0, color: '#5c81b3', fontWeight: 700 }}>—</span>
                      {txt}
                    </li>
                  ))}
                </ul>
              </Accordion>
            </div>
          </div>

          {/* ── Related Products ── */}
          {relatedProducts.length > 0 && (
            <section aria-label="You may also like" style={{ paddingTop: '64px', borderTop: '1px solid var(--color-border)' }}>
              <h2 style={{
                fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                fontWeight: 600, color: '#111111', marginBottom: '36px', textAlign: 'center',
                letterSpacing: '-0.01em'
              }}>
                You May Also Like
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
                {relatedProducts.map(rel => (
                  <ProductCard
                    key={rel.id}
                    product={rel}
                    onClick={(relProd) => {
                      setSelectedProduct(relProd);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                ))}
              </div>
            </section>
          )}

        </div>
      </div>

      {/* ── SIZE CHART MODAL ── */}
      {isSizeChartOpen && (
        <div
          onClick={() => setIsSizeChartOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(6px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              width: '100%',
              maxWidth: '620px',
              padding: '36px 32px',
              borderRadius: '4px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
              position: 'relative',
              animation: 'dropdownFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards'
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #EAE6E1', paddingBottom: '16px' }}>
              <div>
                <h3 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.6rem', fontWeight: 500, margin: '0 0 4px', color: '#111111' }}>
                  Size Chart &amp; Fit Guide
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#777777', margin: 0 }}>
                  Measurements in inches (Relaxed Heavyweight Oversized Fit)
                </p>
              </div>
              <button
                onClick={() => setIsSizeChartOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#111111', padding: '4px' }}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Measurement Table */}
            <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#FAF8F5', borderBottom: '2px solid #111111' }}>
                    <th style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 800, color: '#111111' }}>SIZE</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#111111' }}>CHEST</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#111111' }}>SHOULDER</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#111111' }}>LENGTH</th>
                    <th style={{ padding: '12px 14px', fontWeight: 800, color: '#111111' }}>SLEEVE</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { size: 'S', chest: '42"', shoulder: '21"', length: '28"', sleeve: '8.5"' },
                    { size: 'M', chest: '44"', shoulder: '22"', length: '29"', sleeve: '9.0"' },
                    { size: 'L', chest: '46"', shoulder: '23"', length: '30"', sleeve: '9.5"' },
                    { size: 'XL', chest: '48"', shoulder: '24"', length: '31"', sleeve: '10.0"' },
                    { size: 'XXL', chest: '50"', shoulder: '25"', length: '32"', sleeve: '10.5"' },
                  ].map((row, i) => (
                    <tr key={row.size} style={{ borderBottom: '1px solid #EAE6E1', backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#FAF8F5' }}>
                      <td style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 800, color: '#5c81b3' }}>{row.size}</td>
                      <td style={{ padding: '12px 14px', color: '#444444' }}>{row.chest}</td>
                      <td style={{ padding: '12px 14px', color: '#444444' }}>{row.shoulder}</td>
                      <td style={{ padding: '12px 14px', color: '#444444' }}>{row.length}</td>
                      <td style={{ padding: '12px 14px', color: '#444444' }}>{row.sleeve}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Fit Tip Note */}
            <div style={{ backgroundColor: '#FAF8F5', borderLeft: '3px solid #5c81b3', padding: '14px 16px', fontSize: '0.825rem', color: '#444444', lineHeight: 1.6 }}>
              <strong>Fit Guidance:</strong> Our silhouettes are designed with a contemporary boxy oversized fit. If you prefer a regular tailored fit, we recommend ordering one size smaller.
            </div>
          </div>
        </div>
      )}

      {/* ── FULL IMAGE LIGHTBOX MODAL ── */}
      {isLightboxOpen && (
        <div
          onClick={() => setIsLightboxOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.92)',
            backdropFilter: 'blur(10px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '24px',
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100000,
              transition: 'background-color 0.2s ease'
            }}
            aria-label="Close full view"
          >
            <X size={24} />
          </button>

          {/* Previous image arrow */}
          {product.images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(prev => (prev === 0 ? product.images.length - 1 : prev - 1));
              }}
              style={{
                position: 'absolute',
                left: '24px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100000,
                transition: 'background-color 0.2s ease'
              }}
              aria-label="Previous image"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {/* Main Full Image */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxHeight: '90vh',
              maxWidth: '90vw',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <img
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              style={{
                maxHeight: '85vh',
                maxWidth: '85vw',
                objectFit: 'contain',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
              }}
            />
            {product.images.length > 1 && (
              <div style={{ marginTop: '16px', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
                {selectedImage + 1} / {product.images.length}
              </div>
            )}
          </div>

          {/* Next image arrow */}
          {product.images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(prev => (prev === product.images.length - 1 ? 0 : prev + 1));
              }}
              style={{
                position: 'absolute',
                right: '24px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100000,
                transition: 'background-color 0.2s ease'
              }}
              aria-label="Next image"
            >
              <ChevronRight size={28} />
            </button>
          )}
        </div>
      )}

      {/* ── STYLING FOR VERTICAL GALLERY ── */}
      <style jsx>{`
        .product-pdp-gallery {
          display: flex;
          gap: 20px;
          align-items: flex-start;
          width: 100%;
        }

        .pdp-thumb-col {
          display: flex;
          flex-direction: column;
          gap: 14px;
          width: 86px;
          flex-shrink: 0;
        }

        .pdp-thumb-btn {
          width: 86px;
          height: 110px;
          padding: 0;
          border: 1px solid #EAE6E1;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          opacity: 0.7;
          background-color: #FAF8F5;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          display: block;
        }

        .pdp-thumb-btn:hover {
          opacity: 1;
          border-color: #111111;
        }

        .pdp-thumb-btn.active {
          opacity: 1;
          border: 2px solid #111111;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
        }

        .pdp-thumb-btn img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          display: block;
        }

        .pdp-thumb-scroll-btn {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background-color: #FAF8F5;
          border: 1px solid #EAE6E1;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 4px auto 0;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pdp-thumb-scroll-btn:hover {
          background-color: #111111;
          border-color: #111111;
        }

        .pdp-thumb-scroll-btn:hover :global(svg) {
          color: #FFFFFF !important;
        }

        .pdp-main-img-box {
          flex: 1;
          position: relative;
          width: 100%;
          padding-top: 130%;
          background-color: #FAF8F5;
          border-radius: 16px;
          overflow: hidden;
          cursor: zoom-in;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
        }

        .pdp-main-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          transition: transform 0.4s ease;
        }

        .pdp-zoom-btn {
          position: absolute;
          bottom: 16px;
          right: 16px;
          z-index: 2;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #FFFFFF;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .pdp-zoom-btn:hover {
          transform: scale(1.08);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18);
        }

        @media (max-width: 768px) {
          .product-pdp-gallery {
            flex-direction: column-reverse;
            gap: 14px;
          }

          .pdp-thumb-col {
            flex-direction: row;
            width: 100%;
            overflow-x: auto;
            padding-bottom: 6px;
          }

          .pdp-thumb-btn {
            width: 72px;
            height: 92px;
            border-radius: 8px;
            flex-shrink: 0;
          }

          .pdp-thumb-scroll-btn {
            display: none;
          }

          .pdp-main-img-box {
            border-radius: 12px;
          }
        }
      `}</style>
    </>
  );
};

export default ProductDetailPage;
