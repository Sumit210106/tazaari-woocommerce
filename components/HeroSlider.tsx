"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

export const HeroSlider: React.FC = () => {
  const { setActivePage, setActiveCategory } = useCart();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const heroSlides = [
    {
      imageDesktop: 'https://tazaari.com/wp-content/uploads/2026/08/Tazaari-Black-Polo-scaled.jpg',
      imageMobile: 'https://tazaari.com/wp-content/uploads/2026/08/Tazaari-Black-Polo-Tshirt.jpg',
      title: <><span style={{ whiteSpace: 'nowrap', display: 'inline-block', transform: 'translateY(18px)' }}>Noir Polo</span> <br /><span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontWeight: 700 }}>T-Shirt</span></>,
      subtitle: 'PREMIUM WEIGHTED COTTON & SLICK MINIMALISM.',
      tag: 'TAZAARI NOIR COLLECTION.',
      fontFamily: "'Syne', 'Urbanist', 'Outfit', sans-serif",
      bgPosition: 'center 30%',
      align: 'flex-start',
      ariaLabel: 'Shop Noir Polo T-Shirt',
      category: 'man'
    },
    {
      imageDesktop: 'https://tazaari.com/wp-content/uploads/2026/08/Tazaari-fitted-tee-scaled.jpg',
      imageMobile: 'https://tazaari.com/wp-content/uploads/2026/08/Tazaari-fitted-tee-Premium.jpg',
      title: <>Modern <br /><span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontWeight: 400 }}>Essentials</span></>,
      subtitle: 'ORGANIC COTTON SILHOUETTES FOR EVERYDAY WEAR.',
      tag: 'TAZAARI STREETWEAR ESSENTIALS.',
      fontFamily: "'Tenor Sans', 'Urbanist', sans-serif",
      bgPosition: 'center 50%',
      align: 'flex-start',
      ariaLabel: 'Shop Essentials',
      category: 'essentials'
    },
    {
      imageDesktop: 'https://tazaari.com/wp-content/uploads/2026/08/Tazaari-Ribbed-Crop-Top-scaled.jpg',
      imageMobile: 'https://tazaari.com/wp-content/uploads/2026/08/Tazaari-Ribbed-Crop-Top-Premium.jpg',
      title: <>New <br /><span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic', fontWeight: 400 }}>Arrivals</span></>,
      subtitle: 'RIBBED CROP TOPS & TENSION TAILORED SHAPES.',
      tag: 'AUTUMN / WINTER LOOKBOOK.',
      fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
      bgPosition: 'center 40%',
      align: 'flex-start',
      ariaLabel: 'Shop New Arrivals',
      category: 'new-arrivals'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <>
      {/* Styles for Hero Slide Backgrounds */}
      <style>{`
        .hero-slide-bg {
          background-image: linear-gradient(90deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.05) 100%), var(--bg-desktop);
          background-size: cover;
          background-position: var(--bg-position, center 25%);
        }
        @media (max-width: 767px) {
          .hero-slide-bg {
            background-image: linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.75) 100%), var(--bg-mobile) !important;
            background-position: center center !important;
          }
        }
      `}</style>
      
      {/* Streetwear Editorial Hero Banner - Invisible Sliding Carousel */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        color: '#FFFFFF',
        padding: '140px 0 80px',
        marginTop: '0',
        overflow: 'hidden'
      }}>
        {/* Invisible Sliding Background Image Layers */}
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className="hero-slide-bg"
            style={{
              position: 'absolute',
              inset: 0,
              '--bg-desktop': `url("${slide.imageDesktop}")`,
              '--bg-mobile': `url("${slide.imageMobile}")`,
              '--bg-position': slide.bgPosition || 'center 25%',
              opacity: idx === currentSlideIndex ? 1 : 0,
              transform: idx === currentSlideIndex ? 'scale(1)' : 'scale(1.04)',
              transition: 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1), transform 1.8s cubic-bezier(0.4, 0, 0.2, 1)',
              zIndex: 1
            } as React.CSSProperties}
          />
        ))}

        {/* Far Left Vertical Rotated Tag */}
        <div
          className="desktop-only"
          style={{
            position: 'absolute',
            left: '24px',
            top: '50%',
            transform: 'translateY(-50%) rotate(-90deg)',
            transformOrigin: 'left center',
            fontFamily: "'Urbanist', sans-serif",
            fontSize: '0.8125rem',
            fontWeight: 800,
            letterSpacing: '0.3em',
            color: '#FFFFFF',
            whiteSpace: 'nowrap',
            textTransform: 'uppercase',
            zIndex: 3,
            textShadow: '0 2px 10px rgba(0,0,0,0.5)'
          }}
        >
          {heroSlides[currentSlideIndex].tag}
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: heroSlides[currentSlideIndex].align || 'flex-start', width: '100%', paddingLeft: '80px' }}>
          <div style={{ maxWidth: '680px', width: '100%', textAlign: 'left' }} key={currentSlideIndex} className="animate-fade-in">
            
            {/* <h1 style={{
              fontFamily: heroSlides[currentSlideIndex].fontFamily,
              fontSize: 'clamp(3.5rem, 5.8vw, 5.25rem)',
              fontWeight: 800,
              lineHeight: 0.95,
              marginBottom: '20px',
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              wordBreak: 'normal',
              overflowWrap: 'break-word',
              textShadow: '0 4px 30px rgba(0, 0, 0, 0.6)'
            }}>
              {heroSlides[currentSlideIndex].title}
            </h1>

            <p style={{
              fontFamily: "'Urbanist', sans-serif",
              fontSize: '0.9rem',
              fontWeight: 700,
              letterSpacing: '0.22em',
              color: '#FFFFFF',
              textTransform: 'uppercase',
              marginBottom: '32px',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.4)'
            }}>
              {heroSlides[currentSlideIndex].subtitle}
            </p> */}

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <a
                href="#shop"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveCategory(heroSlides[currentSlideIndex].category);
                  setActivePage('shop');
                }}
                aria-label={heroSlides[currentSlideIndex].ariaLabel}
                style={{
                  backgroundColor: 'rgba(100, 85, 70, 0.65)',
                  backdropFilter: 'blur(8px)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.7)',
                  padding: '14px 38px',
                  fontSize: '0.875rem',
                  fontWeight: 800,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  borderRadius: '0px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                  display: 'inline-block'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.color = '#111111';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(100, 85, 70, 0.65)';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
              >
                {heroSlides[currentSlideIndex].ariaLabel.replace('Shop ', '')}
              </a>
            </div>

          </div>
        </div>

        {/* Minimalist Slide Indicators */}
        <div style={{ position: 'absolute', bottom: '40px', right: '48px', display: 'flex', gap: '8px', zIndex: 4 }}>
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlideIndex(idx)}
              aria-label={`Slide ${idx + 1}`}
              style={{
                width: idx === currentSlideIndex ? '36px' : '12px',
                height: '4px',
                backgroundColor: idx === currentSlideIndex ? '#FFFFFF' : 'rgba(255, 255, 255, 0.35)',
                border: 'none',
                borderRadius: '0px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default HeroSlider;
