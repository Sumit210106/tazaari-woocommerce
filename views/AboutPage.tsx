"use client";

import React from 'react';
import { useCart } from '../context/CartContext';

export const AboutPage: React.FC = () => {
  const { setActivePage } = useCart();

  return (
    <div style={{ backgroundColor: '#FAF8F5', color: '#111111', fontFamily: '"Plus Jakarta Sans", sans-serif', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* Styles for Editorial Layout */}
      <style>{`
        .editorial-title {
          font-family: var(--font-serif, 'Playfair Display', 'Cormorant Garamond', serif);
          font-size: clamp(3.2rem, 8vw, 7.5rem);
          font-weight: 400;
          letter-spacing: -0.03em;
          color: #111111;
          line-height: 0.95;
          text-transform: uppercase;
        }

        .editorial-subtitle {
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #777777;
          display: block;
          margin-top: 16px;
        }

        .editorial-quote {
          font-family: var(--font-serif, 'Playfair Display', 'Cormorant Garamond', serif);
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 400;
          line-height: 1.2;
          letter-spacing: -0.02em;
          color: #111111;
        }

        .editorial-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 24px;
          border: 1px solid #111111;
          background: transparent;
          color: #111111;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .editorial-btn:hover {
          background: #111111;
          color: #FFFFFF;
          transform: translateY(-2px);
        }

        @media (max-width: 992px) {
          .hero-stack-container {
            flex-direction: column !important;
            align-items: center !important;
          }
          .hero-left-inset {
            position: relative !important;
            left: 0 !important;
            top: 0 !important;
            margin-bottom: 20px;
            width: 100% !important;
            max-width: 320px;
          }
          .hero-right-card {
            position: relative !important;
            right: 0 !important;
            top: 0 !important;
            margin-top: 20px;
            width: 100% !important;
          }
          .dark-split-container {
            grid-template-columns: 1fr !important;
          }
          .dark-split-image {
            height: 480px !important;
          }
        }
      `}</style>

      {/* SECTION 1: HERO EDITORIAL COLLAGE */}
      <section style={{ padding: '100px 24px 80px', maxWidth: '1280px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>

        {/* Giant Backdrop Header */}
        <h1 className="editorial-title">
          THE MAISON STORY
        </h1>
        <span className="editorial-subtitle">A LITTLE OF OUR STORY</span>

        {/* Asymmetric Overlapping Photo & Text Stack Container */}
        <div
          className="hero-stack-container"
          style={{
            position: 'relative',
            maxWidth: '960px',
            margin: '60px auto 0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {/* Left Floating Inset Image */}
          <div
            className="hero-left-inset"
            style={{
              position: 'absolute',
              left: '-80px',
              top: '80px',
              width: '240px',
              height: '320px',
              zIndex: 3,
              boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
              overflow: 'hidden'
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800"
              alt="Maison Craft Inset"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Center Main Portrait Image */}
          <div
            style={{
              width: '100%',
              maxWidth: '560px',
              height: '640px',
              backgroundColor: '#EAE6E1',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.08)'
            }}
          >
            <img
              src="/images/pexels-pavel-danilyuk-5789582.jpg"
              alt="Tazaari Creative Director"
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(0.15) contrast(1.05)' }}
            />
          </div>

          {/* Right Overlapping White Glass Card */}
          <div
            className="hero-right-card"
            style={{
              position: 'absolute',
              right: '-60px',
              top: '60px',
              width: '400px',
              backgroundColor: '#FFFFFF',
              padding: '48px 40px',
              zIndex: 4,
              boxShadow: '0 20px 50px rgba(0,0,0,0.08)',
              border: '1px solid rgba(17, 17, 17, 0.06)',
              textAlign: 'left'
            }}
          >
            <h2 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.65rem', fontWeight: 500, lineHeight: 1.3, color: '#111111', margin: '0 0 16px' }}>
              It all started with a passion for Indian textiles and a love affair with minimal luxury couture.
            </h2>

            <p style={{ fontSize: '0.875rem', color: '#666666', lineHeight: 1.7, margin: '0 0 28px' }}>
              From hours of exploring hand-loomed heritage fabrics to refining 300 GSM heavyweight silhouettes, Tazaari was born to elevate daily wear into a statement of quiet confidence.
            </p>

            <button
              onClick={() => setActivePage('shop')}
              className="editorial-btn"
            >
              <span>Explore Collection →</span>
            </button>
          </div>

        </div>

      </section>

      {/* SECTION 2: STATEMENT HEADING & TWO-COLUMN EDITORIAL TEXT */}
      <section style={{ padding: '120px 24px 100px', maxWidth: '1080px', margin: '0 auto', textAlign: 'center' }}>

        {/* Large Statement Quote */}
        <h2 className="editorial-quote" style={{ maxWidth: '920px', margin: '0 auto 60px' }}>
          This is a space dedicated to elevating your everyday. To help you elevate your wardrobe, your space, your closet, your confidence...
        </h2>

        {/* Two-Column Text Block */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', textAlign: 'left' }}>
          <div>
            <p style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.4rem', fontWeight: 500, color: '#111111', lineHeight: 1.45, margin: '0 0 16px' }}>
              We believe organic authentic craftsmanship, heavy cotton weaves, and timeless tailoring should feel effortless.
            </p>
            <p style={{ fontSize: '0.925rem', color: '#555555', lineHeight: 1.7, margin: 0 }}>
              Every piece in our collection undergoes rigorous prototyping to balance boxy modern drape with tailored precision. No loud logos, just pure material integrity.
            </p>
          </div>

          <div>
            <p style={{ fontSize: '0.925rem', color: '#555555', lineHeight: 1.7, margin: '0 0 16px' }}>
              Our garments are ethically crafted by master artisans in small, quality-controlled batches. By focusing on 300 GSM pre-shrunk combed cotton, we ensure your wardrobe staples age gracefully wash after wash.
            </p>
            <p style={{ fontSize: '0.925rem', color: '#555555', lineHeight: 1.7, margin: 0 }}>
              Tazaari represents the bridge between Indian textile heritage and global street elegance.
            </p>
          </div>
        </div>

      </section>

      {/* SECTION 3: ASYMMETRIC SPLIT DARK & LIGHT ATELIER SECTION */}
      <section style={{ padding: '40px 0 120px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>

          <div
            className="dark-split-container"
            style={{
              display: 'grid',
              gridTemplateColumns: '7fr 5fr',
              alignItems: 'center',
              position: 'relative'
            }}
          >
            {/* Left Dark Container */}
            <div style={{
              backgroundColor: '#ffffff',
              color: '#111111',
              padding: '90px 70px 90px 70px',
              zIndex: 1
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#D4AF37', display: 'block', marginBottom: '14px' }}>
                BEHIND THE BRAND
              </span>

              <h2 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '3rem', fontWeight: 400, color: '#030303ff', margin: '0 0 20px', letterSpacing: '-0.02em' }}>
                Tazaari Atelier
              </h2>

              <h3 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.5rem', fontWeight: 400, color: 'rgba(56, 56, 56, 0.9)', lineHeight: 1.4, margin: '0 0 28px' }}>
                We didn't just build a fashion brand — we curated a movement of quiet luxury and architectural silhouette.
              </h3>

              <p style={{ fontSize: '0.9rem', color: '#A0A0A0', lineHeight: 1.7, margin: '0 0 20px', maxWidth: '520px' }}>
                Founded with a conviction that modern luxury lies in subtle tactile depth rather than loud branding, our studio works directly with ethical weavers across Mumbai and New Delhi.
              </p>

              <p style={{ fontSize: '0.9rem', color: '#A0A0A0', lineHeight: 1.7, margin: '0 0 36px', maxWidth: '520px' }}>
                Each garment is designed with pre-shrunk heavyweight fabrics, reinforced seams, and intentional drape that contour naturally to the wearer.
              </p>

              <button
                onClick={() => setActivePage('contact')}
                style={{
                  padding: '14px 32px',
                  backgroundColor: '#FFFFFF',
                  color: '#111111',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                BOOK STYLING SESSION
              </button>
            </div>

            {/* Right Overlapping Model Image */}
            <div
              className="dark-split-image"
              style={{
                position: 'relative',
                height: '680px',
                zIndex: 2,
                marginLeft: '-40px',
                boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
                overflow: 'hidden'
              }}
            >
              <img
                src="/images/about-hero-editorial.png"
                alt="Tazaari Tailored Blazer Couture"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};