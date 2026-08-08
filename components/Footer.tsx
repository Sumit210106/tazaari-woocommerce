"use client";

import React from 'react';
import { useCart } from '../context/CartContext';
import { 
  FaInstagram, 
  FaFacebookF, 
  FaPinterestP, 
  FaYoutube, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt 
} from 'react-icons/fa';

import { useRouter } from 'next/navigation';

export const Footer: React.FC = () => {
  const { setActivePage, setActiveCategory } = useCart();
  const router = useRouter();

  const handleCategoryClick = (categorySlug: string) => {
    setActiveCategory(categorySlug);
    setActivePage('shop');
    router.push('/shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (page: 'shop' | 'about' | 'contact') => {
    setActivePage(page);
    router.push(`/${page}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{
      position: 'relative',
      background: 'linear-gradient(rgba(18, 18, 20, 0.92), rgba(18, 18, 20, 0.96)), url("/images/pexels-suzyhazelwood-3769398.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center 40%',
      color: '#FFFFFF',
      paddingTop: '80px',
      paddingBottom: '40px',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      fontFamily: 'var(--font-sans)',
      overflow: 'hidden'
    }}>
      {/* Decorative subtle gradient overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)',
        opacity: 0.6
      }} />

      <div className="container">
        
        {/* Main Footer Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '48px', 
          marginBottom: '64px' 
        }}>
          
          {/* Brand Info Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <img
                src="/logo-white-transparent.png"
                alt="TAZAARI"
                style={{
                  height: '36px',
                  maxWidth: '160px',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
            </div>
            <p style={{ 
              fontSize: '0.85rem', 
              color: '#A0A0A0', 
              lineHeight: 1.7,
              margin: 0
            }}>
              Handcrafted streetwear born in India, tailored for the modern urban wardrobe. Combining luxury heavyweight textiles with minimalist silhouettes.
            </p>
            
            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '14px', marginTop: '8px' }}>
              {[
                { icon: FaInstagram, url: 'https://www.instagram.com/tazaariofficial/', label: 'Instagram' },
                { icon: FaFacebookF, url: 'https://facebook.com', label: 'Facebook' },
                { icon: FaPinterestP, url: 'https://pinterest.com', label: 'Pinterest' },
                { icon: FaYoutube, url: 'https://youtube.com', label: 'YouTube' }
              ].map((social, i) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={i}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="footer-social-link"
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      transition: 'all 0.25s ease',
                      textDecoration: 'none'
                    }}
                  >
                    <IconComponent size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 1: Collections */}
          <div>
            <h4 style={{ 
              fontFamily: 'var(--font-sans)', 
              fontSize: '0.85rem', 
              fontWeight: 800, 
              letterSpacing: '0.12em', 
              color: '#FFFFFF', 
              marginBottom: '24px',
              textTransform: 'uppercase'
            }}>
              Collections
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem', padding: 0, margin: 0 }}>
              {[
                { name: 'Men', slug: 'man' },
                { name: 'Women', slug: 'woman' },
                { name: 'Unisex', slug: 'unisex' },
                { name: 'New Arrivals', slug: 'new-arrivals' },
                { name: 'Essentials', slug: 'essentials' }
              ].map(cat => (
                <li key={cat.slug}>
                  <button 
                    onClick={() => handleCategoryClick(cat.slug)} 
                    className="footer-link"
                    style={{ 
                      color: '#A0A0A0', 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer', 
                      padding: 0,
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.85rem',
                      transition: 'all 0.2s ease',
                      textAlign: 'left'
                    }}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Assistance */}
          <div>
            <h4 style={{ 
              fontFamily: 'var(--font-sans)', 
              fontSize: '0.85rem', 
              fontWeight: 800, 
              letterSpacing: '0.12em', 
              color: '#FFFFFF', 
              marginBottom: '24px',
              textTransform: 'uppercase'
            }}>
              Assistance
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem', padding: 0, margin: 0 }}>
              {[
                { name: 'Shop All Pieces', page: 'shop' as const },
                { name: 'Track Order', page: 'contact' as const },
                { name: 'Contact Support', page: 'contact' as const },
                { name: 'Fabric & Craft Story', page: 'about' as const },
                { name: 'Sustainability Commitment', page: 'about' as const }
              ].map((link, i) => (
                <li key={i}>
                  <button 
                    onClick={() => handleLinkClick(link.page)} 
                    className="footer-link"
                    style={{ 
                      color: '#A0A0A0', 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer', 
                      padding: 0,
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.85rem',
                      transition: 'all 0.2s ease',
                      textAlign: 'left'
                    }}
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact & Studio Info */}
          <div>
            <h4 style={{ 
              fontFamily: 'var(--font-sans)', 
              fontSize: '0.85rem', 
              fontWeight: 800, 
              letterSpacing: '0.12em', 
              color: '#FFFFFF', 
              marginBottom: '24px',
              textTransform: 'uppercase'
            }}>
              Tazaari Studio
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.85rem', padding: 0, margin: 0 }}>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <FaMapMarkerAlt size={15} style={{ color: 'var(--color-gold)', marginTop: '3px', flexShrink: 0 }} />
                <span style={{ color: '#A0A0A0', lineHeight: 1.5 }}>
                  Mumbai, Maharashtra, India
                </span>
              </li>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <FaPhoneAlt size={13} style={{ color: 'var(--color-gold)', flexShrink: 0 }} />
                <a href="tel:+918591908733" style={{ color: '#A0A0A0', textDecoration: 'none', transition: 'color 0.2s ease' }} className="footer-link">
                  +91 8591 9087 33
                </a>
              </li>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <FaEnvelope size={14} style={{ color: 'var(--color-gold)', flexShrink: 0 }} />
                <a href="mailto:info@tazaari.com" style={{ color: '#A0A0A0', textDecoration: 'none', transition: 'color 0.2s ease' }} className="footer-link">
                  info@tazaari.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Fine Print Bar */}
        <div style={{ 
          borderTop: '1px solid rgba(255, 255, 255, 0.08)', 
          paddingTop: '28px', 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          gap: '16px', 
          fontSize: '0.75rem', 
          color: '#888888' 
        }}>
          <div>
            © {new Date().getFullYear()} TAZAARI. All rights reserved. Designed &amp; Crafted in India.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="footer-link" onClick={() => handleLinkClick('about')}>Privacy Policy</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="footer-link" onClick={() => handleLinkClick('contact')}>Terms of Service</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="footer-link" onClick={() => handleLinkClick('contact')}>Shipping &amp; Returns</span>
          </div>
        </div>

      </div>

      {/* CSS hover effects */}
      <style>{`
        .footer-link:hover {
          color: #FFFFFF !important;
        }
        .footer-social-link:hover {
          background-color: var(--color-gold) !important;
          color: #121214 !important;
          transform: translateY(-2px);
        }
      `}</style>
    </footer>
  );
};

export default Footer;
