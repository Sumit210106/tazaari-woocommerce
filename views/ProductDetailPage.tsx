"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import type { NormalizedProduct } from '../types/product';
import { fetchProducts } from '../services/wooApi';
import ProductCard from '../components/ProductCard';
import {
  Heart, ShoppingBag, Star, ArrowLeft, ShieldCheck, Truck,
  Sparkles, Check, ChevronDown, ChevronUp, ZoomIn
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
const RichDescription: React.FC<{ html: string }> = ({ html }) => (
  <div
    className="woo-description"
    dangerouslySetInnerHTML={{ __html: html }}
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
  const imgRef = useRef<HTMLDivElement>(null);

  const product = selectedProduct;

  useProductMeta(product);

  // Reset on product change
  useEffect(() => {
    setSelectedImage(0);
    setSelectedSize(product?.sizes[0] || '');
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

  const activeSize = selectedSize || product.sizes[0] || 'Standard';
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
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 16px;
          font-size: 0.85rem;
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

      <div style={{ backgroundColor: '#FFFFFF', color: '#111111', paddingTop: '100px', paddingBottom: '96px' }}>
        <div className="container">

          {/* ── Breadcrumb ── */}
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
          </nav>

          {/* ── Main 2-Column Layout ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '64px', alignItems: 'start', marginBottom: '96px' }}
            itemScope itemType="https://schema.org/Product">

            {/* ═══════════════════════════════════ LEFT: Gallery ═════════════════════ */}
            <div>
              {/* Main Image */}
              <div
                ref={imgRef}
                onClick={() => setZoomed(z => !z)}
                style={{
                  position: 'relative', width: '100%', paddingTop: '125%',
                  backgroundColor: '#FAF8F5', overflow: 'hidden', marginBottom: '14px',
                  cursor: zoomed ? 'zoom-out' : 'zoom-in',
                  boxShadow: '0 6px 24px rgba(0,0,0,0.07)'
                }}
              >
                <img
                  src={product.images[selectedImage] || product.images[0]}
                  alt={product.imageAlts[selectedImage] || product.name}
                  srcSet={product.imageSrcsets[selectedImage] || undefined}
                  loading="eager"
                  fetchPriority="high"
                  itemProp="image"
                  style={{
                    position: 'absolute', inset: 0, width: '100%', height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
                    transform: zoomed ? 'scale(1.15)' : 'scale(1)',
                  }}
                />
                {product.onSale && (
                  <div style={{
                    position: 'absolute', top: '14px', left: '14px',
                    backgroundColor: 'var(--color-accent-rose)', color: '#FFFFFF',
                    fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 900,
                    letterSpacing: '0.18em', padding: '5px 10px', zIndex: 2
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
                <div style={{ position: 'absolute', bottom: '12px', right: '12px', zIndex: 2 }}>
                  <ZoomIn size={20} style={{ color: 'rgba(255,255,255,0.9)', filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.4))' }} />
                </div>
              </div>

              {/* Thumbnail Strip */}
              {product.images.length > 1 && (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      className="product-thumb-btn"
                      onClick={() => { setSelectedImage(idx); setZoomed(false); }}
                      style={{
                        width: '72px', height: '90px', padding: 0, border: 'none',
                        outline: selectedImage === idx ? '2px solid #5c81b3' : '1px solid #EAE6E1',
                        outlineOffset: selectedImage === idx ? '2px' : '0',
                        overflow: 'hidden', cursor: 'pointer',
                        opacity: selectedImage === idx ? 1 : 0.65,
                        backgroundColor: '#FAF8F5'
                      }}
                      aria-label={`View image ${idx + 1}`}
                    >
                      <img
                        src={product.thumbnails[idx] || img}
                        alt={`${product.name} – view ${idx + 1}`}
                        loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </button>
                  ))}
                </div>
              )}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i} size={15}
                      fill={i < Math.round(product.rating) ? '#C5A059' : 'none'}
                      style={{ color: '#C5A059' }}
                    />
                  ))}
                </div>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: '#888888' }}>
                  {product.rating > 0
                    ? `${product.rating} (${product.reviewsCount} review${product.reviewsCount !== 1 ? 's' : ''})`
                    : 'Be the first to review'}
                </span>
              </div>

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
              {product.sizes.length > 0 && (
                <div style={{ marginBottom: '28px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#111111' }}>
                      SIZE:&nbsp;<span style={{ color: '#5c81b3', fontWeight: 900 }}>{activeSize}</span>
                    </span>
                    <button style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', color: '#5c81b3', fontWeight: 700, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>
                      Size Guide
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {product.sizes.map(size => (
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

              <Accordion title="Shipping & Returns">
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    'Free express shipping on all orders across India',
                    'Delivered within 3–5 business days',
                    'International shipping available at checkout',
                    '14-day hassle-free returns & exchanges',
                    'Items must be unworn, unwashed, with tags intact',
                  ].map(txt => (
                    <li key={txt} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: '#555555', paddingLeft: '16px', position: 'relative', lineHeight: 1.6 }}>
                      <span style={{ position: 'absolute', left: 0, color: 'var(--color-gold)', fontWeight: 700 }}>—</span>
                      {txt}
                    </li>
                  ))}
                </ul>
              </Accordion>

              <Accordion title="Authenticity Guarantee">
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: '#555555', lineHeight: 1.75 }}>
                  Every Tazaari piece is crafted using 300 GSM heavyweight premium cotton blend, vetted for quality at every production stage. Each garment carries a signature authenticity tag. If you ever receive a defective item, we'll replace it at no cost — guaranteed.
                </p>
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
    </>
  );
};

export default ProductDetailPage;
