"use client";

import React from 'react';
import { useCart } from '../context/CartContext';
import { Zap, Sparkles, ShieldCheck, PackageCheck } from 'lucide-react';

export const FeaturedCollection: React.FC = () => {
  const { setActivePage, setActiveCategory } = useCart();

  return (
    <section style={{ padding: '40px 0 10px', backgroundColor: '#FFFFFF' }}>
      <div className="container">
        
        {/* Centered Title */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{
            fontFamily: "'Urbanist', 'Tenor Sans', sans-serif",
            fontSize: '2.2rem',
            fontWeight: 500,
            color: '#111111',
            letterSpacing: '-0.01em'
          }}>
            Featured Collection
          </h2>
        </div>

        {/* 2 Equal Banners Split Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '16px',
          marginBottom: '48px'
        }}>
          
          {/* Left Banner: New Arrivals */}
          <div
            onClick={() => { setActiveCategory('western'); setActivePage('shop'); }}
            style={{
              position: 'relative',
              height: '460px',
              borderRadius: '0px',
              overflow: 'hidden',
              cursor: 'pointer',
              background: 'url("https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=1200")',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.22)',
              transition: 'background-color 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <h3 style={{
                fontFamily: "'Urbanist', 'Outfit', sans-serif",
                fontSize: '2.25rem',
                fontWeight: 700,
                color: '#FFFFFF',
                letterSpacing: '0.04em',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}>
                New Arrivals
              </h3>
            </div>
          </div>

          {/* Right Banner: Essentials */}
          <div
            onClick={() => { setActiveCategory('artisanal'); setActivePage('shop'); }}
            style={{
              position: 'relative',
              height: '460px',
              borderRadius: '0px',
              overflow: 'hidden',
              cursor: 'pointer',
              background: 'url("https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1200")',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.22)',
              transition: 'background-color 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <h3 style={{
                fontFamily: "'Urbanist', 'Outfit', sans-serif",
                fontSize: '2.25rem',
                fontWeight: 700,
                color: '#FFFFFF',
                letterSpacing: '0.04em',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}>
                Essentials
              </h3>
            </div>
          </div>

        </div>

        {/* Luxury 4-Pillar Brand Promise Bar (Unique & Premium Redesign) */}
        <div style={{
          padding: '32px 24px',
          backgroundColor: '#FAF8F5',
          borderRadius: '16px',
          border: '1px solid rgba(17, 17, 17, 0.06)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.02)',
          marginTop: '24px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '18px'
          }}>
            {[
              {
                icon: <Zap size={20} style={{ color: '#D4AF37' }} />,
                title: 'Express & Secure Payment',
                subtitle: 'Instant UPI, Cards & NetBanking'
              },
              {
                icon: <Sparkles size={20} style={{ color: '#D4AF37' }} />,
                title: 'Handcrafted in India',
                subtitle: 'Ethically milled by master artisans'
              },
              {
                icon: <ShieldCheck size={20} style={{ color: '#D4AF37' }} />,
                title: 'Limited Pieces',
                subtitle: 'Ethically made in small batches'
              },
              {
                icon: <PackageCheck size={20} style={{ color: '#D4AF37' }} />,
                title: 'Complimentary Shipping',
                subtitle: 'Free express dispatch on all orders'
              }
            ].map((pillar, idx) => (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '16px 20px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid rgba(17, 17, 17, 0.06)',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.02)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(212, 175, 55, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(17, 17, 17, 0.06)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.02)';
                }}
              >
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(212, 175, 55, 0.08)',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {pillar.icon}
                </div>
                <div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#111111', display: 'block', lineHeight: 1.25 }}>
                    {pillar.title}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#777777', display: 'block', marginTop: '2px' }}>
                    {pillar.subtitle}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default FeaturedCollection;
