"use client";

import React from 'react';
import { useCart } from '../context/CartContext';

export const FabricStory: React.FC = () => {
  const { setActivePage } = useCart();

  return (
    <section style={{ padding: '32px 0 20px', width: '100%' }}>
      <div style={{
        position: 'relative',
        height: '540px',
        width: '100%',
        overflow: 'hidden',
        borderRadius: '0px',
        background: 'linear-gradient(90deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.85) 100%), url("/images/pexels-pavel-danilyuk-5789582.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '48px 64px'
      }}>
        {/* Right Floating Transparent Editorial Card */}
        <div style={{
          maxWidth: '460px',
          width: '100%',
          color: '#FFFFFF',
          zIndex: 3
        }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '0.22em',
            color: '#FFFFFF',
            textTransform: 'uppercase',
            marginBottom: '12px',
            display: 'block',
            textShadow: '0 2px 10px rgba(0,0,0,0.5)'
          }}>
            OUR FABRIC STORY
          </span>
          <h3 style={{
            fontFamily: "var(--font-sans)",
            fontSize: '2.25rem',
            fontWeight: 700,
            color: '#FFFFFF',
            lineHeight: 1.2,
            marginBottom: '14px',
            textShadow: '0 2px 16px rgba(0,0,0,0.6)'
          }}>
            300 GSM Heavyweight Cotton & Refined Fits
          </h3>
          <p style={{
            fontSize: '0.925rem',
            color: 'rgba(255, 255, 255, 0.9)',
            lineHeight: 1.6,
            marginBottom: '24px',
            textShadow: '0 2px 10px rgba(0,0,0,0.5)'
          }}>
            Every piece is crafted from premium cotton blends, chosen for durability, structure, and an ultra-refined hand-feel.
          </p>
          <button
            onClick={() => setActivePage('about')}
            style={{
              fontSize: '0.8125rem',
              fontWeight: 800,
              letterSpacing: '0.18em',
              color: '#FFFFFF',
              textTransform: 'uppercase',
              textDecoration: 'underline',
              textUnderlineOffset: '6px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              border: 'none',
              background: 'none',
              padding: 0,
              textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}
          >
            <span>OUR FABRIC STORY</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FabricStory;
