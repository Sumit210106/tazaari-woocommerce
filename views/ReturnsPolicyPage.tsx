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

export const ReturnsPolicyPage: React.FC = () => {
  const { setActivePage } = useCart();
  const router = useRouter();

  usePageMeta(
    'Refund and Returns Policy | Tazaari',
    'Read Tazaari’s official Refund and Returns Policy. Learn about return windows, eligibility, store credit, and return shipping.'
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
          margin: '0 0 48px',
          letterSpacing: '-0.02em'
        }}>
          Refund and Returns Policy
        </h1>

        {/* Clean Document Sections */}
        <div style={{ fontSize: '0.95rem', color: '#333333', lineHeight: 1.85 }}>
          
          <h2 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.5rem', fontWeight: 500, color: '#111111', marginTop: '40px', marginBottom: '16px', borderBottom: '1px solid #EAE6E1', paddingBottom: '8px' }}>
            Our Commitment to Quality
          </h2>
          <p style={{ marginBottom: '20px' }}>
            At Tazaari, we take pride in crafting high-quality apparel with care. Your satisfaction matters to us.
          </p>

          <h2 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.5rem', fontWeight: 500, color: '#111111', marginTop: '40px', marginBottom: '16px', borderBottom: '1px solid #EAE6E1', paddingBottom: '8px' }}>
            Change of Mind
          </h2>
          <p style={{ marginBottom: '20px' }}>
            We do not accept returns or offer refunds for change of mind. No size or style exchanges are available at this time.
          </p>

          <h2 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.5rem', fontWeight: 500, color: '#111111', marginTop: '40px', marginBottom: '16px', borderBottom: '1px solid #EAE6E1', paddingBottom: '8px' }}>
            Eligibility &amp; Return Window
          </h2>
          <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            <li style={{ marginBottom: '8px' }}>Returns are accepted only for items that are faulty, damaged, or incorrect on arrival.</li>
            <li style={{ marginBottom: '8px' }}>Returns must be initiated within 5 days of delivery.</li>
            <li style={{ marginBottom: '8px' }}>Items must be in new, unworn, unwashed condition with all tags, original packaging, and proof of purchase.</li>
          </ul>

          <h2 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.5rem', fontWeight: 500, color: '#111111', marginTop: '40px', marginBottom: '16px', borderBottom: '1px solid #EAE6E1', paddingBottom: '8px' }}>
            What You’ll Receive
          </h2>
          <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            <li style={{ marginBottom: '8px' }}>For approved returns, we issue Tazaari Store Credit. No bank refunds are provided.</li>
            <li style={{ marginBottom: '8px' }}>Like-for-like replacement may be offered for defective/incorrect items, subject to stock availability.</li>
          </ul>

          <h2 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.5rem', fontWeight: 500, color: '#111111', marginTop: '40px', marginBottom: '16px', borderBottom: '1px solid #EAE6E1', paddingBottom: '8px' }}>
            How to Initiate a Return
          </h2>
          <ol style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            <li style={{ marginBottom: '8px' }}>Email us at <a href="mailto:info@tazaari.com" style={{ color: '#111111', fontWeight: 700, textDecoration: 'underline' }}>info@tazaari.com</a> within 5 days of delivery.</li>
            <li style={{ marginBottom: '8px' }}>Include your order number, a brief description of the issue, and clear photos of the defect/incorrect item, the outer courier pouch/label, and the original packaging.</li>
            <li style={{ marginBottom: '8px' }}>Wait for our return authorization and instructions before shipping the item back.</li>
          </ol>

          <h2 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.5rem', fontWeight: 500, color: '#111111', marginTop: '40px', marginBottom: '16px', borderBottom: '1px solid #EAE6E1', paddingBottom: '8px' }}>
            Return Shipping
          </h2>
          <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            <li style={{ marginBottom: '8px' }}>For standard returns, customers are responsible for the return shipping cost. Please use a tracked and insured courier and include the packing slip or a note with your order number.</li>
            <li style={{ marginBottom: '8px' }}>For faulty or incorrect items, Tazaari will cover reasonable return shipping costs (or provide a return label, where available) once the return is approved.</li>
          </ul>

          <h2 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.5rem', fontWeight: 500, color: '#111111', marginTop: '40px', marginBottom: '16px', borderBottom: '1px solid #EAE6E1', paddingBottom: '8px' }}>
            Inspection &amp; Processing
          </h2>
          <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            <li style={{ marginBottom: '8px' }}>Once the returned item is received and inspected, approved returns are processed within 3–5 business days.</li>
            <li style={{ marginBottom: '8px' }}>Store credit details (amount and validity) will be shared via email.</li>
          </ul>

          <h2 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.5rem', fontWeight: 500, color: '#111111', marginTop: '40px', marginBottom: '16px', borderBottom: '1px solid #EAE6E1', paddingBottom: '8px' }}>
            Non-Returnable Conditions
          </h2>
          <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            <li style={{ marginBottom: '8px' }}>Items that are worn, washed, stained, or damaged after delivery.</li>
            <li style={{ marginBottom: '8px' }}>Items without original tags/packaging or lacking proof of purchase.</li>
            <li style={{ marginBottom: '8px' }}>Any item returned without prior authorization.</li>
          </ul>

          <h2 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.5rem', fontWeight: 500, color: '#111111', marginTop: '40px', marginBottom: '16px', borderBottom: '1px solid #EAE6E1', paddingBottom: '8px' }}>
            Damaged or Incorrect Items
          </h2>
          <p style={{ marginBottom: '20px' }}>
            If your item arrives damaged or incorrect, we will meet our obligations under applicable consumer laws. Please contact us immediately at <a href="mailto:info@tazaari.com" style={{ color: '#111111', fontWeight: 700, textDecoration: 'underline' }}>info@tazaari.com</a> with the required photos for quick assistance.
          </p>

          <h2 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.5rem', fontWeight: 500, color: '#111111', marginTop: '40px', marginBottom: '16px', borderBottom: '1px solid #EAE6E1', paddingBottom: '8px' }}>
            Contact Us
          </h2>
          <p style={{ marginBottom: '32px' }}>
            For any queries, write to: &nbsp;
            <a href="mailto:info@tazaari.com" style={{ color: '#111111', fontWeight: 700, textDecoration: 'underline' }}>
              info@tazaari.com
            </a>
          </p>

          <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '2px solid #111111', fontSize: '0.85rem', color: '#666666', fontStyle: 'italic' }}>
            Note: Tazaari reserves the right to decline returns that do not meet the above conditions.
          </div>

        </div>

      </div>
    </div>
  );
};

export default ReturnsPolicyPage;
