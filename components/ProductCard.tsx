"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import type { NormalizedProduct as Product } from '../types/product';
import { Heart, Eye, ShoppingBag, Check, Star } from 'lucide-react';

export interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
  aspectRatio?: '4/5' | '3/4' | '1/1' | '135%';
  className?: string;
  style?: React.CSSProperties;
}

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL', '4XL'];

const sortSizes = (sizes?: string[]): string[] => {
  if (!sizes || sizes.length === 0) return [];
  return [...sizes].sort((a, b) => {
    const indexA = SIZE_ORDER.indexOf(a.trim().toUpperCase());
    const indexB = SIZE_ORDER.indexOf(b.trim().toUpperCase());
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.localeCompare(b);
  });
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
  aspectRatio = '135%',
  className = '',
  style = {},
}) => {
  const router = useRouter();
  const { addToCart, setQuickViewProduct, setSelectedProduct, setActivePage, toggleWishlist, isInWishlist } = useCart();
  
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const sortedSizes = sortSizes(product.sizes);
  const inWishlist = isInWishlist(product.id);
  const hasSecondaryImage = product.images && product.images.length > 1;
  const primaryImage = product.images[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800';
  const secondaryImage = hasSecondaryImage ? product.images[1] : null;

  // Calculate discount percentage
  const discountPercent = product.onSale && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleCardClick = (e: React.MouseEvent) => {
    // If user clicked inside an interactive button, ignore card navigation
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    if (onClick) {
      onClick(product);
    } else {
      setSelectedProduct(product);
      setActivePage('product');
      router.push(`/product/${product.id}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleQuickAdd = (e: React.MouseEvent, sizeOverride?: string) => {
    e.stopPropagation();
    const sizeToUse = sizeOverride || selectedSize || (product.sizes[0] || 'M');
    addToCart(product, sizeToUse, 'Default', 1);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
    }, 1800);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  // Determine padding top ratio
  const getPaddingTop = () => {
    switch (aspectRatio) {
      case '4/5': return '125%';
      case '3/4': return '133.33%';
      case '1/1': return '100%';
      case '135%':
      default: return '135%';
    }
  };

  const categoryName = product.categories?.[0]?.name || product.category || 'Couture';

  return (
    <article
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`tazaari-product-card group ${className}`}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        border: '1px solid rgba(18, 18, 20, 0.07)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1)',
        boxShadow: isHovered ? '0 14px 32px rgba(18, 18, 20, 0.09)' : '0 2px 10px rgba(0, 0, 0, 0.02)',
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        ...style,
      }}
      itemScope
      itemType="https://schema.org/Product"
    >
      {/* Schema.org Structured Data */}
      <meta itemProp="name" content={product.name} />
      <meta itemProp="sku" content={product.sku || product.id} />
      <span itemProp="offers" itemScope itemType="https://schema.org/Offer" style={{ display: 'none' }}>
        <meta itemProp="price" content={String(product.price)} />
        <meta itemProp="priceCurrency" content="INR" />
        <meta itemProp="availability" content={product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'} />
      </span>

      {/* ── IMAGE CONTAINER ── */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: getPaddingTop(),
          overflow: 'hidden',
          backgroundColor: '#FAF8F5',
        }}
      >
        {/* Primary Image */}
        <img
          src={primaryImage}
          alt={product.imageAlts?.[0] || product.name}
          loading="lazy"
          srcSet={product.imageSrcsets?.[0] || undefined}
          itemProp="image"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'top center',
            transition: 'all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)',
            opacity: isHovered && secondaryImage ? 0 : 1,
            transform: isHovered && !secondaryImage ? 'scale(1.05)' : 'scale(1)',
          }}
        />

        {/* Secondary Image (Hover Swap) */}
        {secondaryImage && (
          <img
            src={secondaryImage}
            alt={`${product.name} alternate view`}
            loading="lazy"
            srcSet={product.imageSrcsets?.[1] || undefined}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top center',
              transition: 'all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)',
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'scale(1.04)' : 'scale(1)',
            }}
          />
        )}

        {/* ── TOP BADGES (Left Aligned) ── */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            zIndex: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            alignItems: 'flex-start',
            pointerEvents: 'none',
          }}
        >
          {/* Discount Tag */}
          {product.onSale && (
            <span
              style={{
                backgroundColor: '#8B4A47',
                color: '#FFFFFF',
                fontSize: '0.65rem',
                fontWeight: 800,
                letterSpacing: '0.1em',
                padding: '4px 10px',
                borderRadius: '4px',
                boxShadow: '0 4px 12px rgba(139, 74, 71, 0.3)',
                textTransform: 'uppercase',
              }}
            >
              {discountPercent > 0 ? `${discountPercent}% OFF` : 'SALE'}
            </span>
          )}

          {/* New Arrival Tag */}
          {product.isNewArrival && !product.onSale && (
            <span
              style={{
                backgroundColor: '#121214',
                color: '#D4AF37',
                fontSize: '0.65rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                padding: '4px 10px',
                borderRadius: '4px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                textTransform: 'uppercase',
                border: '1px solid rgba(212, 175, 55, 0.4)',
              }}
            >
              NEW
            </span>
          )}

          {/* Out of Stock Tag */}
          {!product.inStock && (
            <span
              style={{
                backgroundColor: 'rgba(18, 18, 20, 0.85)',
                backdropFilter: 'blur(4px)',
                color: '#FFFFFF',
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                padding: '4px 10px',
                borderRadius: '4px',
                textTransform: 'uppercase',
              }}
            >
              SOLD OUT
            </span>
          )}
        </div>

        {/* ── TOP ACTION BUTTONS (Wishlist & QuickView Right Aligned) ── */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            aria-label={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: inWishlist ? '#E05D5D' : '#121214',
              transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transform: isHovered || inWishlist ? 'scale(1)' : 'scale(0.92)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.12)';
              e.currentTarget.style.backgroundColor = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = isHovered || inWishlist ? 'scale(1)' : 'scale(0.92)';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.92)';
            }}
          >
            <Heart
              size={17}
              fill={inWishlist ? '#E05D5D' : 'none'}
              stroke={inWishlist ? '#E05D5D' : '#121214'}
              strokeWidth={2}
            />
          </button>

          {/* Quick View Button */}
          <button
            onClick={handleQuickView}
            aria-label="Quick View Product"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#121214',
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'translateY(0) scale(1)' : 'translateY(-6px) scale(0.8)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.12)';
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.color = '#C5A059';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.92)';
              e.currentTarget.style.color = '#121214';
            }}
          >
            <Eye size={16} strokeWidth={2} />
          </button>
        </div>

      </div>

      {/* ── DETAILS SECTION ── */}
      <div
        style={{
          padding: '16px 14px 16px',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          justifyContent: 'space-between',
          backgroundColor: '#FFFFFF',
          gap: '10px'
        }}
      >
        <div>
          {/* Category & Star Rating */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '6px',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.675rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#5c81b3',
              }}
            >
              {categoryName}
            </span>

            {/* Star Rating indicator */}
            {product.rating > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Star size={12} fill="#C5A059" color="#C5A059" />
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#121214' }}>
                  {product.rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* Product Name */}
          <h3
            itemProp="name"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.925rem',
              fontWeight: 600,
              color: isHovered ? '#5c81b3' : '#121214',
              lineHeight: 1.35,
              margin: '0 0 8px 0',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              height: '2.5em',
              transition: 'color 0.25s ease',
            }}
          >
            {product.name}
          </h3>

          {/* Price Block */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1.05rem',
                fontWeight: 800,
                color: product.onSale ? '#8B4A47' : '#121214',
                letterSpacing: '-0.01em',
              }}
            >
              ₹{product.price.toLocaleString('en-IN')}
            </span>

            {product.onSale && product.originalPrice > product.price && (
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  color: '#999999',
                  textDecoration: 'line-through',
                }}
              >
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

        {/* ── ALWAYS VISIBLE SIZE SELECTOR & QUICK ADD (Sorted S, M, L, XL...) ── */}
        {sortedSizes && sortedSizes.length > 0 ? (
          <div style={{ borderTop: '1px solid #F0ECE6', paddingTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.625rem', fontWeight: 800, letterSpacing: '0.12em', color: '#888888', textTransform: 'uppercase' }}>
                {addedSuccess ? 'ADDED TO BAG ✓' : 'SELECT SIZE'}
              </span>
              {selectedSize && (
                <span style={{ fontSize: '0.625rem', fontWeight: 800, color: '#5c81b3' }}>
                  {selectedSize}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
              {sortedSizes.slice(0, 6).map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    setSelectedSize(size);
                    handleQuickAdd(e, size);
                  }}
                  style={{
                    flex: 1,
                    minWidth: '28px',
                    padding: '5px 0',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    borderRadius: '4px',
                    border: selectedSize === size ? '1px solid #121214' : '1px solid #E0DCD7',
                    backgroundColor: selectedSize === size ? '#121214' : '#FFFFFF',
                    color: selectedSize === size ? '#FFFFFF' : '#121214',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'center',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedSize !== size) {
                      e.currentTarget.style.backgroundColor = '#5c81b3';
                      e.currentTarget.style.color = '#FFFFFF';
                      e.currentTarget.style.borderColor = '#5c81b3';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedSize !== size) {
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                      e.currentTarget.style.color = '#121214';
                      e.currentTarget.style.borderColor = '#E0DCD7';
                    }
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ borderTop: '1px solid #F0ECE6', paddingTop: '10px' }}>
            <button
              onClick={(e) => handleQuickAdd(e)}
              disabled={!product.inStock}
              style={{
                width: '100%',
                padding: '8px 12px',
                backgroundColor: addedSuccess ? '#2E7D32' : '#121214',
                color: '#FFFFFF',
                fontSize: '0.725rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                border: 'none',
                borderRadius: '4px',
                cursor: product.inStock ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (product.inStock && !addedSuccess) {
                  e.currentTarget.style.backgroundColor = '#5c81b3';
                }
              }}
              onMouseLeave={(e) => {
                if (product.inStock && !addedSuccess) {
                  e.currentTarget.style.backgroundColor = '#121214';
                }
              }}
            >
              {addedSuccess ? <Check size={14} /> : <ShoppingBag size={14} />}
              <span>{addedSuccess ? 'ADDED TO BAG' : (product.inStock ? 'ADD TO BAG' : 'OUT OF STOCK')}</span>
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

// ── SKELETON CARD COMPONENT FOR LOADING STATES ──
export const ProductCardSkeleton: React.FC<{ aspectRatio?: string }> = ({ aspectRatio = '135%' }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid rgba(18, 18, 20, 0.05)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: aspectRatio === '4/5' ? '125%' : '135%',
          backgroundColor: '#F3F0EA',
          animation: 'pulseSkeleton 1.5s ease-in-out infinite',
        }}
      />
      <div style={{ padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ width: '40%', height: '10px', backgroundColor: '#F3F0EA', borderRadius: '4px' }} />
        <div style={{ width: '85%', height: '14px', backgroundColor: '#F3F0EA', borderRadius: '4px' }} />
        <div style={{ width: '60%', height: '14px', backgroundColor: '#F3F0EA', borderRadius: '4px' }} />
        <div style={{ width: '50%', height: '18px', backgroundColor: '#F3F0EA', borderRadius: '4px', marginTop: '6px' }} />
      </div>
      <style>{`
        @keyframes pulseSkeleton {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default ProductCard;
