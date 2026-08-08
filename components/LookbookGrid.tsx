"use client";

import React from 'react';
import { useCart } from '../context/CartContext';

export const LookbookGrid: React.FC = () => {
  const { setActivePage, setActiveCategory } = useCart();

  return (
    <section style={{ padding: '30px 0 80px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
          
          {/* Grid Box 1: Ethereal Elegance */}
          <div style={{
            position: 'relative',
            height: '500px',
            borderRadius: '0px',
            overflow: 'hidden',
            background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.72) 0%, rgba(0, 0, 0, 0.25) 45%, rgba(0, 0, 0, 0) 100%), url("https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800")',
            backgroundSize: 'cover',
            backgroundPosition: 'center 20%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'flex-start',
            padding: '40px 36px',
            textAlign: 'left'
          }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.95)',
              marginBottom: '8px',
              textShadow: '0 2px 6px rgba(0,0,0,0.4)'
            }}>
              ETHEREAL ELEGANCE
            </span>
            <h3 style={{
              fontFamily: '"Plus Jakarta Sans", "Outfit", sans-serif',
              fontSize: '2.2rem',
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.12,
              letterSpacing: '-0.02em',
              marginBottom: '24px',
              textShadow: '0 4px 16px rgba(0,0,0,0.5)'
            }}>
              Where Dreams <br />Meet Couture
            </h3>
            <button
              onClick={() => { setActiveCategory('western'); setActivePage('shop'); }}
              style={{
                padding: '12px 28px',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                backgroundColor: '#FFFFFF',
                color: '#111111',
                borderRadius: '0px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}
            >
              SHOP NOW
            </button>
          </div>

          {/* Grid Box 2: Enchanting Styles */}
          <div style={{
            position: 'relative',
            height: '500px',
            borderRadius: '0px',
            overflow: 'hidden',
            background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.72) 0%, rgba(0, 0, 0, 0.25) 45%, rgba(0, 0, 0, 0) 100%), url("https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800")',
            backgroundSize: 'cover',
            backgroundPosition: 'center 20%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'flex-start',
            padding: '40px 36px',
            textAlign: 'left'
          }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.95)',
              marginBottom: '8px',
              textShadow: '0 2px 6px rgba(0,0,0,0.4)'
            }}>
              ENCHANTING LOOKS
            </span>
            <h3 style={{
              fontFamily: '"Plus Jakarta Sans", "Outfit", sans-serif',
              fontSize: '2.2rem',
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.12,
              letterSpacing: '-0.02em',
              marginBottom: '24px',
              textShadow: '0 4px 16px rgba(0,0,0,0.5)'
            }}>
              Enchanting Styles <br />for Every Woman
            </h3>
            <button
              onClick={() => { setActiveCategory('ethnic'); setActivePage('shop'); }}
              style={{
                padding: '12px 28px',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                backgroundColor: '#FFFFFF',
                color: '#111111',
                borderRadius: '0px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}
            >
              SHOP NOW
            </button>
          </div>

          {/* Grid Box 3 & 4 Right Stack */}
          <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '12px', height: '500px' }}>
            
            {/* Chic Footwear */}
            <div style={{
              position: 'relative',
              borderRadius: '0px',
              overflow: 'hidden',
              backgroundColor: '#F4F2EE',
              padding: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', color: '#666666' }}>URBAN STRIDES</span>
                <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.35rem', fontWeight: 700, marginTop: '4px', marginBottom: '12px' }}>Chic Footwear for City Living</h4>
                <button onClick={() => { setActiveCategory('accessories'); setActivePage('shop'); }} className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.7rem', backgroundColor: '#FFFFFF', borderRadius: '0px' }}>SHOP NOW</button>
              </div>
            </div>

            {/* 50% Off Trendsetting Bags */}
            <div style={{
              position: 'relative',
              borderRadius: '0px',
              overflow: 'hidden',
              backgroundColor: '#4A6B82',
              color: '#FFFFFF',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Trendsetting Bags for Her</span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '3.5rem', fontWeight: 700, margin: '4px 0' }}>50%</h3>
              <button onClick={() => { setActiveCategory('accessories'); setActivePage('shop'); }} className="btn-primary" style={{ backgroundColor: '#FFFFFF', color: '#111111', margin: '0 auto', padding: '10px 24px', fontSize: '0.75rem', borderRadius: '0px' }}>
                SHOP NOW
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default LookbookGrid;
