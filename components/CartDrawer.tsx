"use client";

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
    currency,
    clearCart
  } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [isCheckedOut, setIsCheckedOut] = useState(false);

  const freeShippingThreshold = 250;
  const progressPercent = Math.min((cartTotal / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = freeShippingThreshold - cartTotal;

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'TAZAARI15') {
      setDiscountPercent(15);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code');
    }
  };

  const finalTotal = cartTotal * (1 - discountPercent / 100);

  if (!isCartOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}>
      {/* Backdrop Overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)'
        }}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Slide-out Drawer Panel */}
      <div
        className="animate-slide-right"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '480px',
          height: '100%',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 1001
        }}
      >
        {/* Drawer Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} style={{ color: 'var(--color-gold)' }} />
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 600 }}>Your Shopping Bag</h3>
          </div>
          <button onClick={() => setIsCartOpen(false)} style={{ color: 'var(--color-primary)', padding: '4px' }}>
            <X size={22} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div style={{ padding: '14px 24px', backgroundColor: 'var(--color-gold-light)', borderBottom: '1px solid rgba(197, 160, 89, 0.2)' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} style={{ color: 'var(--color-gold)' }} />
            {remainingForFreeShipping > 0 ? (
              <span>Add <strong>{currency}{remainingForFreeShipping.toFixed(0)}</strong> more for <strong>FREE Express Shipping</strong></span>
            ) : (
              <span style={{ color: '#2B7A4B' }}>🎉 You unlocked FREE Express Worldwide Shipping!</span>
            )}
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(197, 160, 89, 0.25)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: 'var(--color-gold)', transition: 'width 0.4s ease' }} />
          </div>
        </div>

        {/* Cart Item List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', margin: 'auto 0', color: 'var(--color-text-muted)' }}>
              <ShoppingBag size={48} style={{ color: 'var(--color-gold)', margin: '0 auto 16px', opacity: 0.5 }} />
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '8px' }}>Your bag is currently empty</p>
              <p style={{ fontSize: '0.875rem' }}>Explore our handcrafted luxury collections to find your perfect statement piece.</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`} style={{ display: 'flex', gap: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  style={{ width: '80px', height: '100px', objectFit: 'cover', borderRadius: '2px' }}
                />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 600, lineHeight: 1.2 }}>{item.product.name}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                      Size: <strong>{item.selectedSize}</strong> | Color: <strong>{item.selectedColor}</strong>
                    </p>
                    <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary)', marginTop: '4px' }}>
                      {currency}{item.product.price}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', borderRadius: '2px' }}>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, -1)}
                        style={{ padding: '4px 8px', color: 'var(--color-primary)' }}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ padding: '0 10px', fontSize: '0.85rem', fontWeight: 600 }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, 1)}
                        style={{ padding: '4px 8px', color: 'var(--color-primary)' }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)}
                      style={{ color: 'var(--color-text-light)', transition: 'color 0.2s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent-rose)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-light)')}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cart.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid var(--color-border)', backgroundColor: '#FAF8F5' }}>
            {/* Promo Code Input */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input
                type="text"
                placeholder="Promo Code (e.g. TAZAARI15)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: '2px', fontSize: '0.8125rem' }}
              />
              <button onClick={handleApplyPromo} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.75rem' }}>
                Apply
              </button>
            </div>
            {discountPercent > 0 && (
              <p style={{ fontSize: '0.75rem', color: '#2B7A4B', fontWeight: 600, marginBottom: '8px' }}>
                ✓ {discountPercent}% discount applied!
              </p>
            )}
            {promoError && <p style={{ fontSize: '0.75rem', color: 'var(--color-accent-rose)', marginBottom: '8px' }}>{promoError}</p>}

            {/* Totals */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                <span>Subtotal</span>
                <span>{currency}{cartTotal.toFixed(2)}</span>
              </div>
              {discountPercent > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#2B7A4B' }}>
                  <span>VIP Discount ({discountPercent}%)</span>
                  <span>-{currency}{(cartTotal * (discountPercent / 100)).toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                <span>Estimated Express Shipping</span>
                <span>{remainingForFreeShipping <= 0 ? 'FREE' : `${currency}25.00`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', borderTop: '1px solid var(--color-border)', paddingTop: '10px' }}>
                <span>Total</span>
                <span>{currency}{(finalTotal + (remainingForFreeShipping <= 0 ? 0 : 25)).toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            {isCheckedOut ? (
              <div style={{ padding: '12px', backgroundColor: '#E8F5E9', border: '1px solid #C8E6C9', borderRadius: '4px', textAlign: 'center' }}>
                <p style={{ color: '#2E7D32', fontWeight: 700, fontSize: '0.95rem' }}>✨ Order Placed Successfully!</p>
                <p style={{ fontSize: '0.75rem', color: '#388E3C', marginTop: '4px' }}>Thank you for choosing TAZAARI. Order confirmation sent to your email.</p>
                <button
                  onClick={() => {
                    clearCart();
                    setIsCheckedOut(false);
                    setIsCartOpen(false);
                  }}
                  style={{ marginTop: '10px', fontSize: '0.75rem', textDecoration: 'underline', color: '#1B5E20' }}
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsCheckedOut(true)}
                className="btn-gold"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <span>PROCEED TO SECURE CHECKOUT</span>
                <ArrowRight size={16} />
              </button>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '12px', fontSize: '0.725rem', color: 'var(--color-text-muted)' }}>
              <ShieldCheck size={14} style={{ color: 'var(--color-gold)' }} />
              <span>Encrypted 256-Bit SSL Checkout | 14-Day Complimentary Returns</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
