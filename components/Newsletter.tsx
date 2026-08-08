"use client";

import React, { useState } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  return (
    <section style={{
      position: 'relative',
      width: '100%',
      padding: '90px 24px',
      backgroundColor: '#1C1517',
      backgroundImage: 'linear-gradient(rgba(18, 14, 16, 0.82), rgba(18, 14, 16, 0.88)), url("/images/newsletter-fabric-bg.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: '#FFFFFF',
      textAlign: 'center',
      overflow: 'hidden'
    }}>
      <div style={{ maxWidth: '780px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        {/* Subtitle with accent lines */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <span style={{ width: '32px', height: '1px', background: '#D4AF37', display: 'inline-block' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#D4AF37' }}>
            JOIN THE INNER CIRCLE
          </span>
          <span style={{ width: '32px', height: '1px', background: '#D4AF37', display: 'inline-block' }} />
        </div>

        {/* Headline */}
        <h2 style={{
          fontFamily: '"Plus Jakarta Sans", "Outfit", sans-serif',
          fontSize: 'clamp(2rem, 4.2vw, 3.4rem)',
          fontWeight: 800,
          lineHeight: 1.15,
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
          color: '#FFFFFF',
          margin: '0 0 32px',
          textShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}>
          NEW DROPS. STYLING INSPO.<br />ZERO SPAM.
        </h2>

        {/* Email Subscription Form */}
        {subscribed ? (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: 'rgba(212, 175, 55, 0.15)',
            border: '1px solid #D4AF37',
            padding: '16px 32px',
            borderRadius: '4px',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.95rem'
          }}>
            <CheckCircle2 size={20} style={{ color: '#D4AF37' }} />
            <span>Welcome to the Tazaari Maison Inner Circle!</span>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); if (newsletterEmail) setSubscribed(true); }} style={{ maxWidth: '560px', margin: '0 auto 20px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              borderBottom: '1px solid rgba(255, 255, 255, 0.4)',
              paddingBottom: '8px'
            }}>
              <input
                type="email"
                required
                placeholder="Your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#FFFFFF',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  fontFamily: 'inherit',
                  padding: '8px 0'
                }}
              />
              <button
                type="submit"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#D4AF37',
                  fontWeight: 800,
                  fontSize: '0.8125rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px'
                }}
              >
                <span>SUBSCRIBE</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        )}

        <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.55)', margin: '16px 0 0' }}>
          By subscribing you agree to our Terms & Conditions.
        </p>
      </div>
    </section>
  );
};

export default Newsletter;
