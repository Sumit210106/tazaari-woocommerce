"use client";

import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

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

export const ShippingPolicyPage: React.FC = () => {
  const { setActivePage } = useCart();
  const router = useRouter();

  usePageMeta(
    'Shipping Policy | Tazaari',
    'Read Tazaari’s official Shipping Policy. Learn about delivery timelines, order tracking, shipping coverage, and dispatch updates.'
  );

  return (
    <div style={{ backgroundColor: '#FFFFFF', color: '#111111', fontFamily: '"Plus Jakarta Sans", sans-serif', minHeight: '100vh', paddingTop: '140px', paddingBottom: '100px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Back Link */}
        <button
          onClick={() => {
            setActivePage('home');
            router.push('/');
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: '#666666',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            cursor: 'pointer',
            marginBottom: '32px',
            textTransform: 'uppercase'
          }}
        >
          <ArrowLeft size={15} /> Back to Home
        </button>

        {/* Page Title */}
        <h1 style={{
          fontFamily: "var(--font-serif, 'Playfair Display', serif)",
          fontSize: 'clamp(2.4rem, 5vw, 3.5rem)',
          fontWeight: 400,
          color: '#111111',
          margin: '0 0 16px',
          letterSpacing: '-0.02em'
        }}>
          Shipping Policy
        </h1>

        <p style={{ fontSize: '1rem', color: '#555555', lineHeight: 1.8, marginBottom: '48px', fontStyle: 'italic' }}>
          Welcome to Tazaari — where timeless craftsmanship meets modern minimalism. Thank you for choosing thoughtful, responsible fashion over fast trends.
        </p>

        {/* Clean Document Sections */}
        <div style={{ fontSize: '0.95rem', color: '#333333', lineHeight: 1.85 }}>
          
          <h2 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.5rem', fontWeight: 500, color: '#111111', marginTop: '40px', marginBottom: '16px', borderBottom: '1px solid #EAE6E1', paddingBottom: '8px' }}>
            Shipping Coverage
          </h2>
          <p style={{ marginBottom: '20px' }}>
            We currently ship within India only.
          </p>

          <h2 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.5rem', fontWeight: 500, color: '#111111', marginTop: '40px', marginBottom: '16px', borderBottom: '1px solid #EAE6E1', paddingBottom: '8px' }}>
            Processing &amp; Delivery Timeline
          </h2>
          <p style={{ marginBottom: '12px' }}>
            Each piece is carefully produced and quality-checked. Please allow time for processing before dispatch.
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            <li style={{ marginBottom: '8px' }}><strong>Shipping time (post-dispatch):</strong> 5–7 business days.</li>
            <li style={{ marginBottom: '8px' }}>You will receive a notification when your order is packed and shipped. Every piece is checked and packaged with attention to detail.</li>
          </ul>

          <h2 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.5rem', fontWeight: 500, color: '#111111', marginTop: '40px', marginBottom: '16px', borderBottom: '1px solid #EAE6E1', paddingBottom: '8px' }}>
            Order Tracking
          </h2>
          <p style={{ marginBottom: '12px' }}>
            Once your order ships, you’ll receive tracking updates via:
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            <li style={{ marginBottom: '8px' }}>Email</li>
            <li style={{ marginBottom: '8px' }}>SMS or WhatsApp (if provided at checkout)</li>
            <li style={{ marginBottom: '8px' }}>You can also track your order from the <strong>My Account</strong> section on our website.</li>
          </ul>

          <h2 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.5rem', fontWeight: 500, color: '#111111', marginTop: '40px', marginBottom: '16px', borderBottom: '1px solid #EAE6E1', paddingBottom: '8px' }}>
            Important Notes
          </h2>
          <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            <li style={{ marginBottom: '8px' }}>Tazaari is not responsible for delays caused by weather, operational issues with couriers, customs holds, or incorrect/incomplete shipping information submitted by the customer.</li>
            <li style={{ marginBottom: '8px' }}>If a parcel is returned due to an incomplete/incorrect address, re-shipping charges will apply.</li>
            <li style={{ marginBottom: '8px' }}>Please inform us within 24 hours if your parcel shows “delivered” but you have not received it. After this window, we may be unable to raise the issue with our courier partners.</li>
          </ul>

          <h2 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.5rem', fontWeight: 500, color: '#111111', marginTop: '40px', marginBottom: '16px', borderBottom: '1px solid #EAE6E1', paddingBottom: '8px' }}>
            Cancellations
          </h2>
          <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            <li style={{ marginBottom: '8px' }}>Once an order has been placed and processed, it cannot be cancelled.</li>
            <li style={{ marginBottom: '8px' }}>Shipping costs are non-refundable.</li>
          </ul>

          <h2 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.5rem', fontWeight: 500, color: '#111111', marginTop: '40px', marginBottom: '16px', borderBottom: '1px solid #EAE6E1', paddingBottom: '8px' }}>
            Returns &amp; Store Credit (No Exchanges)
          </h2>
          <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            <li style={{ marginBottom: '8px' }}>We currently offer returns for store credit only. Bank refunds are not available.</li>
            <li style={{ marginBottom: '8px' }}>No exchanges at this time.</li>
            <li style={{ marginBottom: '8px' }}>Return shipments must be sent back by the customer at their own cost.</li>
            <li style={{ marginBottom: '8px' }}>Tazaari reserves the right to refuse returns that do not meet our return requirements (e.g., worn/washed items, missing tags/packaging, damage not reported on delivery).</li>
          </ul>

          <h2 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.5rem', fontWeight: 500, color: '#111111', marginTop: '40px', marginBottom: '16px', borderBottom: '1px solid #EAE6E1', paddingBottom: '8px' }}>
            Damaged or Incorrect Items
          </h2>
          <p style={{ marginBottom: '12px' }}>
            If you’ve received a damaged item, please email us immediately with clear photos of:
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            <li style={{ marginBottom: '8px' }}>The defect</li>
            <li style={{ marginBottom: '8px' }}>The outer courier pouch/label</li>
            <li style={{ marginBottom: '8px' }}>The original packaging</li>
          </ul>

          <h2 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.5rem', fontWeight: 500, color: '#111111', marginTop: '40px', marginBottom: '16px', borderBottom: '1px solid #EAE6E1', paddingBottom: '8px' }}>
            Support
          </h2>
          <p style={{ marginBottom: '32px' }}>
            Need help with shipping or order updates? Write to us at: &nbsp;
            <a href="mailto:info@tazaari.com" style={{ color: '#111111', fontWeight: 700, textDecoration: 'underline' }}>
              info@tazaari.com
            </a>
          </p>

          <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '2px solid #111111', fontSize: '0.875rem', color: '#666666', fontStyle: 'italic' }}>
            Your patience helps us deliver pieces that are truly worth the wait.
          </div>

        </div>

      </div>
    </div>
  );
};

export default ShippingPolicyPage;
