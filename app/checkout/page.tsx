"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useCart } from '../../context/CartContext';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  ChevronLeft,
  Loader2,
  CheckCircle2,
  Package,
  MapPin,
  AlertCircle,
} from 'lucide-react';
import * as wooCart from '../../services/wooCartApi';
import type { WcAddress, WcShippingRate, CheckoutPayload, WcCheckoutResponse } from '../../services/wooCartApi';

// ---------------------------------------------------------------------------
// Form field component
// ---------------------------------------------------------------------------

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (name: string, value: string) => void;
  required?: boolean;
  placeholder?: string;
  half?: boolean;
  error?: string;
}

const Field: React.FC<FieldProps> = ({ label, name, type = 'text', value, onChange, required, placeholder, half, error }) => (
  <div style={{ flex: half ? '1 1 48%' : '1 1 100%', minWidth: half ? '180px' : '100%' }}>
    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', color: '#333' }}>
      {label} {required && <span style={{ color: '#C62828' }}>*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={(e) => onChange(name, e.target.value)}
      placeholder={placeholder}
      required={required}
      style={{
        width: '100%',
        padding: '12px 14px',
        border: error ? '2px solid #C62828' : '1px solid var(--color-border)',
        borderRadius: '4px',
        fontSize: '0.9rem',
        fontFamily: 'var(--font-sans)',
        outline: 'none',
        transition: 'border-color 0.2s',
        backgroundColor: '#FAFAFA',
      }}
      onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-gold)'; e.currentTarget.style.backgroundColor = '#FFF'; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = error ? '#C62828' : 'var(--color-border)'; e.currentTarget.style.backgroundColor = '#FAFAFA'; }}
    />
    {error && <p style={{ fontSize: '0.7rem', color: '#C62828', marginTop: '4px' }}>{error}</p>}
  </div>
);

// ---------------------------------------------------------------------------
// Initial address state
// ---------------------------------------------------------------------------

const emptyAddress: WcAddress = {
  first_name: '',
  last_name: '',
  address_1: '',
  address_2: '',
  city: '',
  state: '',
  postcode: '',
  country: 'IN',
  email: '',
  phone: '',
};

// ---------------------------------------------------------------------------
// Checkout Page Component
// ---------------------------------------------------------------------------

export default function CheckoutPage() {
  const { cart, wcCart, currency, isCartLoading, clearCart, refreshCart, setNotification } = useCart();
  const router = useRouter();

  const [billing, setBilling] = useState<WcAddress>({ ...emptyAddress });
  const [shipping, setShipping] = useState<WcAddress>({ ...emptyAddress });
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [customerNote, setCustomerNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderResult, setOrderResult] = useState<WcCheckoutResponse | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [checkoutError, setCheckoutError] = useState('');
  const [shippingRates, setShippingRates] = useState<WcShippingRate[]>([]);
  const [selectedShippingRate, setSelectedShippingRate] = useState<string>('');

  // Fetch shipping rates when address changes
  const fetchShippingRates = useCallback(async () => {
    if (!billing.postcode || !billing.country || !billing.city) return;
    try {
      const addressToSend = sameAsBilling ? billing : shipping;
      const updatedCart = await wooCart.updateCustomer(billing, addressToSend);
      if (updatedCart.shipping_rates.length > 0) {
        const rates = updatedCart.shipping_rates[0].shipping_rates;
        setShippingRates(rates);
        const selected = rates.find(r => r.selected) || rates[0];
        if (selected) setSelectedShippingRate(selected.rate_id);
      }
    } catch {
      // Silently handle — shipping rates will be empty
    }
  }, [billing, shipping, sameAsBilling]);

  // Refresh cart on mount
  useEffect(() => {
    refreshCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // WooCommerce totals
  const minorUnit = wcCart?.totals.currency_minor_unit ?? 2;
  const subtotal = wcCart ? wooCart.wcPriceToNumber(wcCart.totals.total_items, minorUnit) : 0;
  const totalDiscount = wcCart ? wooCart.wcPriceToNumber(wcCart.totals.total_discount, minorUnit) : 0;
  const totalShipping = wcCart ? wooCart.wcPriceToNumber(wcCart.totals.total_shipping, minorUnit) : 0;
  const totalTax = wcCart ? wooCart.wcPriceToNumber(wcCart.totals.total_tax, minorUnit) : 0;
  const grandTotal = wcCart ? wooCart.wcPriceToNumber(wcCart.totals.total_price, minorUnit) : 0;
  const appliedCoupons = wcCart?.coupons || [];

  // -------------------------------------------------------------------------
  // Address handlers
  // -------------------------------------------------------------------------
  const handleBillingChange = (name: string, value: string) => {
    setBilling(prev => ({ ...prev, [name]: value }));
    if (errors[`billing_${name}`]) {
      setErrors(prev => { const next = { ...prev }; delete next[`billing_${name}`]; return next; });
    }
  };

  const handleShippingChange = (name: string, value: string) => {
    setShipping(prev => ({ ...prev, [name]: value }));
    if (errors[`shipping_${name}`]) {
      setErrors(prev => { const next = { ...prev }; delete next[`shipping_${name}`]; return next; });
    }
  };

  // -------------------------------------------------------------------------
  // Validation
  // -------------------------------------------------------------------------
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Billing validation
    if (!billing.first_name.trim()) newErrors.billing_first_name = 'Required';
    if (!billing.last_name.trim()) newErrors.billing_last_name = 'Required';
    if (!billing.email?.trim()) newErrors.billing_email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billing.email)) newErrors.billing_email = 'Invalid email';
    if (!billing.phone?.trim()) newErrors.billing_phone = 'Required';
    if (!billing.address_1.trim()) newErrors.billing_address_1 = 'Required';
    if (!billing.city.trim()) newErrors.billing_city = 'Required';
    if (!billing.state.trim()) newErrors.billing_state = 'Required';
    if (!billing.postcode.trim()) newErrors.billing_postcode = 'Required';
    if (!billing.country.trim()) newErrors.billing_country = 'Required';

    // Shipping validation (if different from billing)
    if (!sameAsBilling) {
      if (!shipping.first_name.trim()) newErrors.shipping_first_name = 'Required';
      if (!shipping.last_name.trim()) newErrors.shipping_last_name = 'Required';
      if (!shipping.address_1.trim()) newErrors.shipping_address_1 = 'Required';
      if (!shipping.city.trim()) newErrors.shipping_city = 'Required';
      if (!shipping.state.trim()) newErrors.shipping_state = 'Required';
      if (!shipping.postcode.trim()) newErrors.shipping_postcode = 'Required';
      if (!shipping.country.trim()) newErrors.shipping_country = 'Required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -------------------------------------------------------------------------
  // Handle Shipping Rate Selection
  // -------------------------------------------------------------------------
  const handleShippingRateSelect = async (rateId: string) => {
    setSelectedShippingRate(rateId);
    try {
      await wooCart.selectShippingRate(0, rateId);
      await refreshCart();
    } catch {
      // Silently handle
    }
  };

  // -------------------------------------------------------------------------
  // Process Checkout
  // -------------------------------------------------------------------------
  const handlePlaceOrder = async () => {
    if (!validate()) {
      setCheckoutError('Please fill in all required fields.');
      return;
    }

    setIsProcessing(true);
    setCheckoutError('');

    try {
      // Update customer addresses first
      const shippingAddr = sameAsBilling ? billing : shipping;
      await wooCart.updateCustomer(billing, shippingAddr);

      // Build checkout payload
      const payload: CheckoutPayload = {
        billing_address: billing,
        shipping_address: shippingAddr,
        payment_method: paymentMethod,
        create_account: false,
        customer_note: customerNote || undefined,
      };

      // For COD, just submit directly
      if (paymentMethod === 'cod') {
        const result = await wooCart.processCheckout(payload);
        setOrderResult(result);
        wooCart.clearCartToken();
        await clearCart();
        setNotification('🎉 Order placed successfully!');
        return;
      }

      // For Razorpay — process checkout to create the order, then handle payment
      const result = await wooCart.processCheckout(payload);

      // Check if Razorpay redirect URL is provided
      if (result.payment_result?.redirect_url) {
        // Redirect to Razorpay payment page
        window.location.href = result.payment_result.redirect_url;
        return;
      }

      // If order is already completed (e.g. zero-total order)
      if (result.status === 'processing' || result.status === 'completed') {
        setOrderResult(result);
        wooCart.clearCartToken();
        await clearCart();
        setNotification('🎉 Order placed successfully!');
        return;
      }

      // Fallback: Show order confirmation
      setOrderResult(result);
      wooCart.clearCartToken();
      await clearCart();
    } catch (err) {
      console.error('Checkout error:', err);
      const message = err instanceof wooCart.WooCommerceCartError
        ? err.message
        : 'An error occurred during checkout. Please try again.';
      setCheckoutError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  // -------------------------------------------------------------------------
  // Order Confirmation View
  // -------------------------------------------------------------------------
  if (orderResult) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', paddingTop: '120px' }}>
        <div style={{ maxWidth: '560px', width: '100%', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CheckCircle2 size={40} style={{ color: '#2E7D32' }} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 600, marginBottom: '12px', color: 'var(--color-primary)' }}>
            Order Confirmed!
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', marginBottom: '24px', lineHeight: 1.6 }}>
            Thank you for your order. Your order number is <strong style={{ color: 'var(--color-gold)' }}>#{orderResult.order_id}</strong>.
            We&apos;ll send a confirmation email to <strong>{billing.email}</strong>.
          </p>

          <div style={{ padding: '24px', backgroundColor: '#FAF8F5', border: '1px solid var(--color-border)', borderRadius: '8px', marginBottom: '24px', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Package size={18} style={{ color: 'var(--color-gold)' }} />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Order Details</h3>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Order Number</span>
              <span style={{ fontWeight: 600 }}>#{orderResult.order_id}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Status</span>
              <span style={{ fontWeight: 600, color: '#2E7D32', textTransform: 'capitalize' }}>{orderResult.status}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Payment Method</span>
              <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{orderResult.payment_method}</span>
            </div>
          </div>

          <button
            onClick={() => router.push('/shop')}
            className="btn-gold"
            style={{ padding: '14px 40px', fontSize: '0.85rem' }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Empty cart
  // -------------------------------------------------------------------------
  if (!isCartLoading && cart.length === 0) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', paddingTop: '120px' }}>
        <div style={{ textAlign: 'center' }}>
          <Package size={48} style={{ color: 'var(--color-gold)', margin: '0 auto 16px', opacity: 0.5 }} />
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '12px' }}>Your cart is empty</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>Add some items to your cart before checking out.</p>
          <button onClick={() => router.push('/shop')} className="btn-gold" style={{ padding: '12px 32px' }}>
            Browse Collection
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Main Checkout Layout
  // -------------------------------------------------------------------------
  return (
    <div style={{ minHeight: '100vh', paddingTop: '110px', paddingBottom: '60px', backgroundColor: '#F9F8F6' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        {/* Back to cart */}
        <button
          onClick={() => router.back()}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '32px', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <ChevronLeft size={16} />
          Back to shopping
        </button>

        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', fontWeight: 600, marginBottom: '8px', color: 'var(--color-primary)' }}>
          Secure Checkout
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '40px' }}>
          Complete your order below. All transactions are encrypted and secure.
        </p>

        {checkoutError && (
          <div style={{ padding: '14px 18px', backgroundColor: '#FFF0F0', border: '1px solid #FFCDD2', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={18} style={{ color: '#C62828', flexShrink: 0 }} />
            <p style={{ fontSize: '0.85rem', color: '#C62828', fontWeight: 600 }}>{checkoutError}</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }}>
          {/* Responsive 2-column on desktop */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '40px' }} className="checkout-grid">

            {/* LEFT — Forms */}
            <div>
              {/* Billing Address */}
              <div style={{ backgroundColor: '#FFF', padding: '32px', borderRadius: '12px', border: '1px solid var(--color-border)', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                  <MapPin size={20} style={{ color: 'var(--color-gold)' }} />
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 600 }}>Billing Address</h2>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                  <Field label="First Name" name="first_name" value={billing.first_name} onChange={handleBillingChange} required half error={errors.billing_first_name} />
                  <Field label="Last Name" name="last_name" value={billing.last_name} onChange={handleBillingChange} required half error={errors.billing_last_name} />
                  <Field label="Email" name="email" type="email" value={billing.email || ''} onChange={handleBillingChange} required half placeholder="you@example.com" error={errors.billing_email} />
                  <Field label="Phone" name="phone" type="tel" value={billing.phone || ''} onChange={handleBillingChange} required half placeholder="+91 98765 43210" error={errors.billing_phone} />
                  <Field label="Address Line 1" name="address_1" value={billing.address_1} onChange={handleBillingChange} required placeholder="Street address" error={errors.billing_address_1} />
                  <Field label="Address Line 2" name="address_2" value={billing.address_2 || ''} onChange={handleBillingChange} placeholder="Apartment, suite, etc. (optional)" />
                  <Field label="City" name="city" value={billing.city} onChange={handleBillingChange} required half error={errors.billing_city} />
                  <Field label="State / Province" name="state" value={billing.state} onChange={handleBillingChange} required half error={errors.billing_state} />
                  <Field label="Postcode / ZIP" name="postcode" value={billing.postcode} onChange={handleBillingChange} required half error={errors.billing_postcode}  />
                  <Field label="Country" name="country" value={billing.country} onChange={handleBillingChange} required half error={errors.billing_country} />
                </div>
              </div>

              {/* Shipping Address Toggle */}
              <div style={{ backgroundColor: '#FFF', padding: '32px', borderRadius: '12px', border: '1px solid var(--color-border)', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <Truck size={20} style={{ color: 'var(--color-gold)' }} />
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 600 }}>Shipping Address</h2>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: sameAsBilling ? '0' : '20px' }}>
                  <input
                    type="checkbox"
                    checked={sameAsBilling}
                    onChange={() => setSameAsBilling(!sameAsBilling)}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--color-gold)' }}
                  />
                  <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Same as billing address</span>
                </label>

                {!sameAsBilling && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '16px' }}>
                    <Field label="First Name" name="first_name" value={shipping.first_name} onChange={handleShippingChange} required half error={errors.shipping_first_name} />
                    <Field label="Last Name" name="last_name" value={shipping.last_name} onChange={handleShippingChange} required half error={errors.shipping_last_name} />
                    <Field label="Address Line 1" name="address_1" value={shipping.address_1} onChange={handleShippingChange} required error={errors.shipping_address_1} />
                    <Field label="Address Line 2" name="address_2" value={shipping.address_2 || ''} onChange={handleShippingChange} />
                    <Field label="City" name="city" value={shipping.city} onChange={handleShippingChange} required half error={errors.shipping_city} />
                    <Field label="State / Province" name="state" value={shipping.state} onChange={handleShippingChange} required half error={errors.shipping_state} />
                    <Field label="Postcode / ZIP" name="postcode" value={shipping.postcode} onChange={handleShippingChange} required half error={errors.shipping_postcode} />
                    <Field label="Country" name="country" value={shipping.country} onChange={handleShippingChange} required half error={errors.shipping_country} />
                  </div>
                )}

                {/* Fetch shipping rates button */}
                {billing.postcode && billing.city && billing.country && (
                  <button
                    onClick={fetchShippingRates}
                    style={{ marginTop: '16px', fontSize: '0.8rem', color: 'var(--color-gold)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Calculate Shipping Rates
                  </button>
                )}

                {/* Shipping rates */}
                {shippingRates.length > 0 && (
                  <div style={{ marginTop: '16px' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Available Shipping Methods</p>
                    {shippingRates.map(rate => {
                      const ratePrice = wooCart.wcPriceToNumber(rate.price, rate.currency_minor_unit);
                      return (
                        <label key={rate.rate_id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', border: selectedShippingRate === rate.rate_id ? '2px solid var(--color-gold)' : '1px solid var(--color-border)', borderRadius: '8px', marginBottom: '8px', cursor: 'pointer', backgroundColor: selectedShippingRate === rate.rate_id ? '#FFFDF5' : '#FFF' }}>
                          <input
                            type="radio"
                            name="shipping_rate"
                            value={rate.rate_id}
                            checked={selectedShippingRate === rate.rate_id}
                            onChange={() => handleShippingRateSelect(rate.rate_id)}
                            style={{ accentColor: 'var(--color-gold)' }}
                          />
                          <div style={{ flex: 1 }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{rate.name}</span>
                            {rate.description && <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{rate.description}</p>}
                          </div>
                          <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                            {ratePrice === 0 ? 'FREE' : `${currency}${ratePrice.toFixed(2)}`}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div style={{ backgroundColor: '#FFF', padding: '32px', borderRadius: '12px', border: '1px solid var(--color-border)', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <CreditCard size={20} style={{ color: 'var(--color-gold)' }} />
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 600 }}>Payment Method</h2>
                </div>

                {/* Razorpay */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', border: paymentMethod === 'razorpay' ? '2px solid var(--color-gold)' : '1px solid var(--color-border)', borderRadius: '8px', marginBottom: '10px', cursor: 'pointer', backgroundColor: paymentMethod === 'razorpay' ? '#FFFDF5' : '#FFF' }}>
                  <input type="radio" name="payment" value="razorpay" checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} style={{ accentColor: 'var(--color-gold)' }} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Razorpay</span>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Credit Card, Debit Card, UPI, Netbanking & more</p>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', backgroundColor: '#E3F2FD', color: '#1565C0', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>UPI</span>
                    <span style={{ fontSize: '0.7rem', backgroundColor: '#E8F5E9', color: '#2E7D32', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>Cards</span>
                  </div>
                </label>

                {/* COD */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', border: paymentMethod === 'cod' ? '2px solid var(--color-gold)' : '1px solid var(--color-border)', borderRadius: '8px', cursor: 'pointer', backgroundColor: paymentMethod === 'cod' ? '#FFFDF5' : '#FFF' }}>
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} style={{ accentColor: 'var(--color-gold)' }} />
                  <div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Cash on Delivery</span>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Pay when your order arrives</p>
                  </div>
                </label>
              </div>

              {/* Order Notes */}
              <div style={{ backgroundColor: '#FFF', padding: '32px', borderRadius: '12px', border: '1px solid var(--color-border)', marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                  Order Notes (Optional)
                </label>
                <textarea
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  placeholder="Special delivery instructions, gift messages..."
                  rows={3}
                  style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--color-border)', borderRadius: '4px', fontSize: '0.9rem', fontFamily: 'var(--font-sans)', resize: 'vertical', backgroundColor: '#FAFAFA' }}
                />
              </div>
            </div>

            {/* RIGHT — Order Summary (Sticky on desktop) */}
            <div>
              <div style={{ backgroundColor: '#FFF', padding: '32px', borderRadius: '12px', border: '1px solid var(--color-border)', position: 'sticky', top: '120px' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 600, marginBottom: '24px' }}>
                  Order Summary
                </h2>

                {/* Cart items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px', maxHeight: '300px', overflowY: 'auto' }}>
                  {cart.map(item => (
                    <div key={item.wcKey || item.product.id} style={{ display: 'flex', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--color-border)' }}>
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        style={{ width: '60px', height: '75px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                      <div style={{ flex: 1 }}>
                        <h4 
                          style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '2px', lineHeight: 1.3 }}
                          dangerouslySetInnerHTML={{ __html: item.product.name }}
                        />
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          {item.selectedSize !== 'Standard' && `Size: ${item.selectedSize}`}
                          {item.selectedColor !== 'Default' && ` | Color: ${item.selectedColor}`}
                          {' × '}{item.quantity}
                        </p>
                        <p style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '4px' }}>
                          {currency}{(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Applied coupons */}
                {appliedCoupons.map(coupon => (
                  <div key={coupon.code} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#2E7D32', fontWeight: 600, marginBottom: '12px', padding: '8px 10px', backgroundColor: '#E8F5E9', borderRadius: '4px' }}>
                    <span>✓ {coupon.code.toUpperCase()}</span>
                    <span>-{currency}{wooCart.wcPriceToNumber(coupon.totals.total_discount, coupon.totals.currency_minor_unit).toFixed(2)}</span>
                  </div>
                ))}

                {/* Totals */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    <span>Subtotal</span>
                    <span>{currency}{subtotal.toFixed(2)}</span>
                  </div>
                  {totalDiscount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#2E7D32' }}>
                      <span>Discount</span>
                      <span>-{currency}{totalDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    <span>Shipping</span>
                    <span>{totalShipping === 0 ? 'Calculated at next step' : `${currency}${totalShipping.toFixed(2)}`}</span>
                  </div>
                  {totalTax > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      <span>Tax</span>
                      <span>{currency}{totalTax.toFixed(2)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-primary)', borderTop: '1px solid var(--color-border)', paddingTop: '12px', marginTop: '4px' }}>
                    <span>Total</span>
                    <span>{currency}{grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  className="btn-gold"
                  disabled={isProcessing || isCartLoading}
                  style={{ width: '100%', marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '16px', fontSize: '0.9rem' }}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={18} />
                      PLACE ORDER — {currency}{grandTotal.toFixed(2)}
                    </>
                  )}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '14px', fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                  <ShieldCheck size={12} style={{ color: 'var(--color-gold)' }} />
                  <span>Encrypted 256-Bit SSL • Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive grid style */}
      <style>{`
        @media (min-width: 768px) {
          .checkout-grid {
            grid-template-columns: 1.4fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
