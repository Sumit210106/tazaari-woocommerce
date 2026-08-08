"use client";

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Star, Heart, ShoppingBag, Truck, RefreshCw, ShieldCheck } from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
  } = useCart();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const activeSize = selectedSize || quickViewProduct.sizes[0] || '';
  const isWishlisted = isInWishlist(quickViewProduct.id);
  const displayPrice = `₹${quickViewProduct.price.toLocaleString('en-IN')}`;
  const displayOriginal = quickViewProduct.onSale && quickViewProduct.originalPrice !== quickViewProduct.price
    ? `₹${quickViewProduct.originalPrice.toLocaleString('en-IN')}`
    : null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)'
        }}
        onClick={() => setQuickViewProduct(null)}
      />

      {/* Modal Card */}
      <div
        className="animate-fade-in"
        style={{
          position: 'relative',
          backgroundColor: '#FFFFFF',
          borderRadius: '4px',
          width: '100%',
          maxWidth: '960px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 1051,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))'
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            backgroundColor: '#FFFFFF',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)',
            zIndex: 10
          }}
        >
          <X size={20} />
        </button>

        {/* Gallery Column */}
        <div style={{ padding: '24px', backgroundColor: '#F8F6F2', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ width: '100%', paddingTop: '125%', position: 'relative', overflow: 'hidden', borderRadius: '2px' }}>
            <img
              src={quickViewProduct.images[selectedImageIndex] || quickViewProduct.images[0]}
              alt={quickViewProduct.name}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {quickViewProduct.images.length > 1 && (
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
              {quickViewProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  style={{
                    width: '64px',
                    height: '80px',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    border: selectedImageIndex === idx ? '2px solid var(--color-gold)' : '1px solid var(--color-border)',
                    padding: 0
                  }}
                >
                  <img src={img} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info & Purchase Details Column */}
        <div style={{ padding: '36px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '24px' }}>
          <div>
            <span className="badge-gold" style={{ marginBottom: '12px', display: 'inline-block' }}>
              {quickViewProduct.category.toUpperCase()} COUTURE
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 600, color: 'var(--color-primary)', lineHeight: 1.2, marginBottom: '8px' }}>
              {quickViewProduct.name}
            </h2>

            {/* Rating & Reviews */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', color: '#D4AF37' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < Math.floor(quickViewProduct.rating) ? '#D4AF37' : 'none'} />
                ))}
              </div>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                {quickViewProduct.rating} ({quickViewProduct.reviewsCount} Artisan Reviews)
              </span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                {displayPrice}
              </span>
              {displayOriginal && (
                <span style={{ fontSize: '1.1rem', color: 'var(--color-text-light)', textDecoration: 'line-through' }}>
                  {displayOriginal}
                </span>
              )}
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '24px' }}>
              {quickViewProduct.shortDescription || quickViewProduct.name}
            </p>


            {/* Quantity Selector */}
            <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Quantity:</span>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: '2px' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ padding: '6px 12px', fontSize: '0.9rem', color: 'var(--color-primary)' }}
                >
                  -
                </button>
                <span style={{ padding: '0 12px', fontSize: '0.9rem', fontWeight: 600 }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ padding: '6px 12px', fontSize: '0.9rem', color: 'var(--color-primary)' }}
                >
                  +
                </button>
              </div>
            </div>
            {quickViewProduct.sizes.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Select Size
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-gold)', cursor: 'pointer', textDecoration: 'underline' }}>
                    Sizing Guide & Fit
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {quickViewProduct.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        padding: '8px 16px',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        border: activeSize === size ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                        backgroundColor: activeSize === size ? 'var(--color-primary)' : '#FFFFFF',
                        color: activeSize === size ? '#FFFFFF' : 'var(--color-primary)',
                        borderRadius: '2px',
                        transition: 'var(--transition-fast)'
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Product Details List */}
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px', marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '8px', letterSpacing: '0.05em' }}>CRAFT &amp; CARE:</h4>
              <ul style={{ paddingLeft: '18px', fontSize: '0.8125rem', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li>300 GSM Premium Cotton Mix Fabric</li>
                <li>Hand Wash Separately in Cold Water</li>
                <li>Do Not Bleach or Tumble Dry</li>
                <li>Iron on Low Heat</li>
              </ul>
            </div>
          </div>

          {/* Action Row */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => {
              addToCart(quickViewProduct, activeSize, 'Default', quantity);
                setQuickViewProduct(null);
              }}
              className="btn-primary"
              style={{ flex: 1 }}
            >
              <ShoppingBag size={18} />
              <span>ADD TO BAG</span>
            </button>

            <button
              onClick={() => toggleWishlist(quickViewProduct.id)}
              style={{
                width: '48px',
                height: '48px',
                border: '1px solid var(--color-border)',
                borderRadius: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isWishlisted ? 'var(--color-accent-rose)' : 'var(--color-primary)'
              }}
              title="Add to Wishlist"
            >
              <Heart size={20} fill={isWishlisted ? 'var(--color-accent-rose)' : 'none'} />
            </button>
          </div>

          {/* Guarantees */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--color-border)', textAlign: 'center', fontSize: '0.725rem', color: 'var(--color-text-muted)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <Truck size={16} style={{ color: 'var(--color-gold)' }} />
              <span>Complimentary Shipping</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <RefreshCw size={16} style={{ color: 'var(--color-gold)' }} />
              <span>14-Day Easy Returns</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={16} style={{ color: 'var(--color-gold)' }} />
              <span>Authentic Certificate</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
