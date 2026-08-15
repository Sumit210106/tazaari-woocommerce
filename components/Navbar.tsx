"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import type { PageType } from '../context/CartContext';
import { ShoppingBag, Heart, Search, ChevronDown, Menu, X, User, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TazaariLogo } from './TazaariLogo';
import { useAuth } from '../context/AuthContext';

const NAVIGATION_CATEGORIES = [
  { slug: 'man', title: 'MAN', items: ['Polo T-Shirts', 'Oversized Tees', 'Essentials'] },
  { slug: 'woman', title: 'WOMAN', items: ['Crop Tops', 'Ribbed Tops', 'Essentials'] },
  { slug: 'new-arrivals', title: 'NEW ARRIVALS', items: ['Latest Drops', 'Just In', 'Trending'] },
  { slug: 'essentials', title: 'ESSENTIALS', items: ['Basics', 'Everyday Wear', 'Must-Haves'] },
  { slug: 'unisex', title: 'UNISEX', items: ['Oversized Tees', 'Streetwear', 'All Genders'] },
];

export const Navbar: React.FC = () => {
  const {
    activePage,
    setActivePage,
    setActiveCategory,
    cartCount,
    wishlist,
    setIsCartOpen,
    searchQuery,
    setSearchQuery
  } = useCart();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'login' | 'register'>('login');
  const [modalEmail, setModalEmail] = useState('');
  const [modalPassword, setModalPassword] = useState('');
  const [modalFirstName, setModalFirstName] = useState('');
  const [modalLastName, setModalLastName] = useState('');
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  const { user, login, isAuthenticated } = useAuth();
  const router = useRouter();

  // Scroll Event Listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (page: PageType) => {
    setActivePage(page);
    setIsMobileMenuOpen(false);
    setIsShopDropdownOpen(false);
    if (page === 'home') {
      router.push('/');
    } else {
      router.push(`/${page}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (window.location.pathname !== '/shop') {
      router.push('/shop');
      setActivePage('shop');
    }
  };

  const handleCategorySelect = (catSlug: string) => {
    setActiveCategory(catSlug);
    setActivePage('shop');
    setIsMobileMenuOpen(false);
    setIsShopDropdownOpen(false);
    router.push('/shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    setModalSuccess('');
    setModalLoading(true);

    try {
      if (modalTab === 'login') {
        await login(modalEmail, modalPassword);
        setIsUserModalOpen(false);
        router.push('/account');
      } else {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: modalEmail,
            password: modalPassword,
            firstName: modalFirstName,
            lastName: modalLastName,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Registration failed.');
        }

        setModalSuccess('Account created successfully! Logging you in...');
        await login(modalEmail, modalPassword);
        setTimeout(() => {
          setIsUserModalOpen(false);
          router.push('/account');
        }, 1500);
      }
    } catch (err: any) {
      setModalError(err.message || 'An error occurred. Please try again.');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <header className="tazaari-header">
      {/* Top running marquee announcement bar */}
      <div className="tazaari-announcement-bar">
        <div className="tazaari-announcement-container">
          <div className="tazaari-marquee">
            <div className="tazaari-marquee-group">
              <span className="tazaari-marquee-item">
                <Sparkles size={11} style={{ color: 'var(--color-gold)' }} />
                COMPLIMENTARY EXPRESS All India SHIPPING OVER ₹2,500
              </span>
              <span>•</span>
              <span>USE CODE: <strong style={{ color: 'var(--color-gold)' }}>TAZAARI15</strong> FOR 15% OFF YOUR FIRST ORDER</span>
              <span>•</span>
              <span className="tazaari-marquee-item">
                <Sparkles size={11} style={{ color: 'var(--color-gold)' }} />
                HANDCRAFTED ARTISANAL LUXURY & ETHICAL COUTURE
              </span>
              <span>•</span>
            </div>
            <div className="tazaari-marquee-group">
              <span className="tazaari-marquee-item">
                <Sparkles size={11} style={{ color: 'var(--color-gold)' }} />
                COMPLIMENTARY EXPRESS All India SHIPPING OVER ₹2,500
              </span>
              <span>•</span>
              <span>USE CODE: <strong style={{ color: 'var(--color-gold)' }}>TAZAARI15</strong> FOR 15% OFF YOUR FIRST ORDER</span>
              <span>•</span>
              <span className="tazaari-marquee-item">
                <Sparkles size={11} style={{ color: 'var(--color-gold)' }} />
                HANDCRAFTED ARTISANAL LUXURY & ETHICAL COUTURE
              </span>
              <span>•</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Luxury Navigation Bar */}
      <nav
        className="tazaari-nav-wrapper"
        style={{
          backgroundColor: (activePage === 'home' && !isScrolled) ? 'rgba(18, 18, 20, 0.35)' : 'rgba(18, 18, 20, 0.95)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: isScrolled ? '0 10px 30px rgba(0, 0, 0, 0.25)' : 'none',
          padding: isScrolled ? '12px 0' : '18px 0',
        }}
      >
        <div className="tazaari-nav-container">
          {/* LEFT: Navigation Links (Desktop) */}
          <div className="tazaari-nav-left">
            {/* Direct Home Link */}
            <button
              onClick={() => handleNavClick('home')}
              className={`tazaari-nav-link ${activePage === 'home' ? 'active' : ''}`}
            >
              Home
            </button>

            {/* Shop (Mega Dropdown Trigger) */}
            <div
              className="tazaari-dropdown-trigger"
              onMouseEnter={() => setIsShopDropdownOpen(true)}
              onMouseLeave={() => setIsShopDropdownOpen(false)}
            >
              <button
                onClick={() => handleCategorySelect('all')}
                className={`tazaari-nav-link ${activePage === 'shop' ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <span>Shop</span>
                <ChevronDown size={14} style={{ transition: 'transform 0.3s ease', transform: isShopDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </button>

              {/* Shop Mega Dropdown Card */}
              {isShopDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 12px)',
                    left: '-80px',
                    width: '920px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid rgba(18, 18, 20, 0.08)',
                    boxShadow: '0 24px 60px rgba(0, 0, 0, 0.22)',
                    padding: '32px 36px 24px',
                    zIndex: 1000,
                    animation: 'dropdownFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                  }}
                >
                  {/* 5 Category Columns + Featured Promo Grid (6 columns total) */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '20px' }}>
                    {NAVIGATION_CATEGORIES.map((cat) => (
                      <div key={cat.slug} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {/* Category Title Header with Gold Accent Underline */}
                        <button
                          onClick={() => handleCategorySelect(cat.slug)}
                          className="mega-title-btn"
                        >
                          {cat.title}
                        </button>

                        {/* Sub-items List */}
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', padding: 0, margin: 0 }}>
                          {cat.items.map((item) => (
                            <li key={item}>
                              <button
                                onClick={() => handleCategorySelect(cat.slug)}
                                className="mega-sub-btn"
                              >
                                {item}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    {/* Column 6: Featured Image Banner */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', gridColumn: 'span 1' }}>
                      <div style={{
                        position: 'relative',
                        height: '100%',
                        minHeight: '150px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        cursor: 'pointer'
                      }}
                        onClick={() => handleCategorySelect('all')}
                      >
                        <img
                          src="/images/23.avif"
                          alt="Luxury Streetwear Collection"
                          className="mega-promo-img"
                        />
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(to top, rgba(18, 18, 20, 0.8) 0%, rgba(18, 18, 20, 0.2) 60%, transparent 100%)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-end',
                          padding: '12px',
                          color: '#FFFFFF'
                        }}>
                          <span style={{ fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.2em', color: '#D4AF37', textTransform: 'uppercase', marginBottom: '2px' }}>
                            SEASON ESSENTIALS
                          </span>
                          <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-serif)', fontWeight: 600, letterSpacing: '0.05em' }}>
                            STREETWEAR '26
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Luxury Dark Bottom Banner Bar */}
                  <div
                    style={{
                      marginTop: '28px',
                      padding: '14px 20px',
                      backgroundColor: '#121214',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Sparkles size={14} style={{ color: '#D4AF37' }} />
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', color: '#FFFFFF', textTransform: 'uppercase' }}>
                        TAZAARI ARTISANAL COUTURE DISCOVERIES
                      </span>
                    </div>

                    <button
                      onClick={() => handleCategorySelect('new-arrivals')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#D4AF37',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        letterSpacing: '0.1em',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        textTransform: 'uppercase',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                      onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                    >
                      <span>EXPLORE ALL</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Direct About Us Link (No Dropdown) */}
            <button
              onClick={() => handleNavClick('about')}
              className={`tazaari-nav-link ${activePage === 'about' ? 'active' : ''}`}
            >
              About Us
            </button>

            {/* Direct Contact Us Link (No Dropdown) */}
            <button
              onClick={() => handleNavClick('contact')}
              className={`tazaari-nav-link ${activePage === 'contact' ? 'active' : ''}`}
            >
              Contact Us
            </button>
          </div>

          {/* Mobile Menu Icon Toggle */}
          <div className="tazaari-mobile-toggle">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ background: 'transparent', border: 0, padding: '6px', color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* CENTER: Logo */}
          <div className="tazaari-nav-center">
            <button
              onClick={() => handleNavClick('home')}
              style={{ background: 'transparent', border: 0, padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              title="TAZAARI Home"
            >
              <img
                src="/logo-white-transparent.png"
                alt="TAZAARI"
                style={{
                  height: isScrolled ? '26px' : '32px',
                  maxWidth: '160px',
                  objectFit: 'contain',
                  display: 'block',
                  transition: 'height 0.3s ease'
                }}
              />
            </button>
          </div>

          {/* RIGHT: Actions */}
          <div className="tazaari-nav-right">
            {/* Search Toggle */}
            <div style={{ position: 'relative' }}>
              {isSearchOpen ? (
                <form
                  onSubmit={handleSearchSubmit}
                  className="tazaari-search-form"
                >
                  <Search size={14} style={{ color: '#121214', flexShrink: 0 }} />
                  <input
                    type="text"
                    placeholder="Search our collections..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (window.location.pathname !== '/shop') {
                        router.push('/shop');
                        setActivePage('shop');
                      }
                    }}
                    className="tazaari-search-input"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchOpen(false);
                    }}
                    className="tazaari-search-close"
                    aria-label="Close search"
                  >
                    <X size={14} />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="tazaari-action-btn"
                  title="Search"
                >
                  <Search size={20} />
                </button>
              )}
            </div>

            {/* Account Account Login (Hidden on Mobile) */}
            <button
              onClick={() => {
                if (isAuthenticated) {
                  router.push('/account');
                } else {
                  setModalError('');
                  setModalSuccess('');
                  setIsUserModalOpen(true);
                }
              }}
              className="tazaari-action-btn tazaari-desktop-action"
              title="Account"
            >
              <User size={20} color="#FFFFFF" />
            </button>

            {/* Wishlist Link (Hidden on Mobile) */}
            <button
              onClick={() => handleCategorySelect('all')}
              className="tazaari-action-btn tazaari-desktop-action"
              title="Wishlist"
            >
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="tazaari-badge tazaari-badge-gold">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Drawer Toggle */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="tazaari-action-btn"
              title="Bag"
            >
              <ShoppingBag size={20} />
              <span className="tazaari-badge tazaari-badge-white">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── MOBILE DRAWER OVERLAY & MENU ── */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '100%',
            height: 'calc(100vh - 100%)',
            maxHeight: 'calc(100vh - 120px)',
            backgroundColor: '#FFFFFF',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '3px solid #5c81b3',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.12)',
            padding: '24px 20px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            zIndex: 999,
            overflowY: 'auto',
            animation: 'dropdownFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            color: '#111111',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {/* Mobile Integrated Search Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsMobileMenuOpen(false);
              router.push('/shop');
              setActivePage('shop');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#F4F4F6',
              borderRadius: '8px',
              border: '1px solid #5c81b3',
              padding: '10px 14px',
              gap: '10px',
            }}
          >
            <Search size={16} style={{ color: '#5c81b3' }} />
            <input
              type="text"
              placeholder="Search streetwear, tees, apparel..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (window.location.pathname !== '/shop') {
                  router.push('/shop');
                  setActivePage('shop');
                }
              }}
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                outline: 'none',
                color: '#111111',
                fontSize: '0.85rem',
                fontFamily: 'inherit',
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', padding: 0 }}
              >
                <X size={14} />
              </button>
            )}
          </form>

          {/* Primary Mobile Navigation Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderBottom: '1px solid #EAE6E1', paddingBottom: '16px' }}>
            <button
              onClick={() => handleNavClick('home')}
              style={{
                textAlign: 'left',
                fontSize: '1rem',
                fontWeight: 800,
                letterSpacing: '0.15em',
                color: activePage === 'home' ? '#5c81b3' : '#111111',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>HOME</span>
              {activePage === 'home' && <span style={{ color: '#5c81b3', fontSize: '0.8rem' }}>●</span>}
            </button>

            {/* Shop Collections Grid Accordion */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
              <span style={{ fontSize: '0.725rem', fontWeight: 800, letterSpacing: '0.18em', color: '#5c81b3', textTransform: 'uppercase' }}>
                SHOP COLLECTIONS
              </span>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {NAVIGATION_CATEGORIES.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => handleCategorySelect(cat.slug)}
                    style={{
                      padding: '12px 14px',
                      backgroundColor: '#F8F9FA',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      color: '#111111',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span>{cat.title}</span>
                    <span style={{ fontSize: '0.75rem', color: '#5c81b3' }}>→</span>
                  </button>
                ))}

                <button
                  onClick={() => handleCategorySelect('all')}
                  style={{
                    gridColumn: 'span 2',
                    padding: '12px 14px',
                    backgroundColor: 'rgba(92, 129, 179, 0.12)',
                    border: '1px solid #5c81b3',
                    borderRadius: '8px',
                    color: '#5c81b3',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    textAlign: 'center',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                  }}
                >
                  EXPLORE ALL PRODUCTS →
                </button>
              </div>
            </div>

            <button
              onClick={() => handleNavClick('about')}
              style={{
                textAlign: 'left',
                fontSize: '1rem',
                fontWeight: 800,
                letterSpacing: '0.15em',
                color: activePage === 'about' ? '#5c81b3' : '#111111',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textTransform: 'uppercase',
                marginTop: '8px',
              }}
            >
              ABOUT US
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              style={{
                textAlign: 'left',
                fontSize: '1rem',
                fontWeight: 800,
                letterSpacing: '0.15em',
                color: activePage === 'contact' ? '#5c81b3' : '#111111',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textTransform: 'uppercase',
              }}
            >
              CONTACT US
            </button>
          </div>

          {/* Account & Wishlist Action Footer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '4px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              {/* Account Button */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (isAuthenticated) {
                    router.push('/account');
                  } else {
                    setModalError('');
                    setModalSuccess('');
                    setIsUserModalOpen(true);
                  }
                }}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  backgroundColor: '#F4F4F6',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  color: '#111111',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <User size={16} style={{ color: '#5c81b3' }} />
                <span>{isAuthenticated ? 'MY ACCOUNT' : 'LOG IN'}</span>
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleCategorySelect('all');
                }}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  backgroundColor: '#F4F4F6',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  color: '#111111',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <Heart size={16} style={{ color: '#5c81b3' }} />
                <span>WISHLIST ({wishlist.length})</span>
              </button>
            </div>

            {/* Bottom Promo Note */}
            <div style={{ textAlign: 'center', marginTop: '6px' }}>
              <span style={{ fontSize: '0.675rem', color: '#5c81b3', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>
                ✨ COMPLIMENTARY EXPRESS SHIPPING OVER ₹2,500
              </span>
            </div>
          </div>
        </div>
      )}

      {/* User Login Popover / Modal */}
      {isUserModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          {/* Blur Overlay */}
          <div
            onClick={() => setIsUserModalOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)',
              cursor: 'pointer'
            }}
          />

          {/* Modal Container */}
          <div style={{
            position: 'relative',
            backgroundColor: '#FFFFFF',
            width: '100%',
            maxWidth: '420px',
            borderRadius: '8px',
            padding: '40px 36px 36px',
            zIndex: 1101,
            boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
            color: '#111111',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            fontFamily: 'var(--font-sans)'
          }}>

            {/* Logo and Close Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ transform: 'scale(0.85)', transformOrigin: 'left center' }}>
                <TazaariLogo color="#121214" height={36} />
              </div>
              <button
                onClick={() => setIsUserModalOpen(false)}
                style={{
                  border: 0,
                  background: 'transparent',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  color: '#999999',
                  transition: 'color 0.2s ease',
                  padding: '4px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#111111'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#999999'}
              >
                ✕
              </button>
            </div>

            {/* Tabs for Login / Register */}
            <div style={{ display: 'flex', borderBottom: '1px solid #E8E2D9', marginBottom: '4px' }}>
              <button
                type="button"
                onClick={() => { setModalTab('login'); setModalError(''); setModalSuccess(''); }}
                style={{
                  flex: 1,
                  paddingBottom: '12px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  border: 0,
                  borderBottom: modalTab === 'login' ? '2px solid #121214' : '2px solid transparent',
                  color: modalTab === 'login' ? '#121214' : '#999999',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: 'transparent',
                  fontFamily: 'inherit'
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setModalTab('register'); setModalError(''); setModalSuccess(''); }}
                style={{
                  flex: 1,
                  paddingBottom: '12px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  border: 0,
                  borderBottom: modalTab === 'register' ? '2px solid #121214' : '2px solid transparent',
                  color: modalTab === 'register' ? '#121214' : '#999999',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: 'transparent',
                  fontFamily: 'inherit'
                }}
              >
                Register
              </button>
            </div>

            {/* Notifications */}
            {modalError && (
              <div style={{
                padding: '12px',
                backgroundColor: '#FFF0F0',
                border: '1px solid #FFCDD2',
                color: '#C62828',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: 600
              }}>
                {modalError}
              </div>
            )}
            {modalSuccess && (
              <div style={{
                padding: '12px',
                backgroundColor: '#E8F5E9',
                border: '1px solid #C8E6C9',
                color: '#2E7D32',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: 600
              }}>
                {modalSuccess}
              </div>
            )}

            {/* Modal Form */}
            <form onSubmit={handleModalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {modalTab === 'register' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '6px', color: '#666666', textTransform: 'uppercase' }}>First Name</label>
                    <input
                      type="text"
                      value={modalFirstName}
                      onChange={(e) => setModalFirstName(e.target.value)}
                      placeholder="Sumit"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #E8E2D9',
                        borderRadius: '4px',
                        outline: 'none',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '6px', color: '#666666', textTransform: 'uppercase' }}>Last Name</label>
                    <input
                      type="text"
                      value={modalLastName}
                      onChange={(e) => setModalLastName(e.target.value)}
                      placeholder="Nayak"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #E8E2D9',
                        borderRadius: '4px',
                        outline: 'none',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '6px', color: '#666666', textTransform: 'uppercase' }}>Email Address</label>
                <input
                  type="email"
                  required
                  value={modalEmail}
                  onChange={(e) => setModalEmail(e.target.value)}
                  placeholder="vip@tazaari.com"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #E8E2D9',
                    borderRadius: '4px',
                    outline: 'none',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '6px', color: '#666666', textTransform: 'uppercase' }}>Password</label>
                <input
                  type="password"
                  required
                  value={modalPassword}
                  onChange={(e) => setModalPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #E8E2D9',
                    borderRadius: '4px',
                    outline: 'none',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={modalLoading}
                style={{
                  width: '100%',
                  height: '46px',
                  marginTop: '10px',
                  backgroundColor: '#121214',
                  color: '#FFFFFF',
                  border: 0,
                  borderRadius: '4px',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#C5A059'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#121214'}
              >
                {modalLoading ? 'PROCESSING...' : modalTab === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Global Embedded Keyframes & Media Styles */}
      <style>{`
        /* Tazaari custom classes to bypass Tailwind loading issues */
        .tazaari-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          margin-bottom: 0;
        }

        .tazaari-announcement-bar {
          background-color: #121214;
          color: #ffffff;
          font-size: 0.65rem;
          padding: 6px 0;
          height: 28px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          letter-spacing: 0.12em;
          overflow: hidden;
          white-space: nowrap;
          width: 100%;
        }

        .tazaari-announcement-container {
          width: 100%;
          overflow: hidden;
          padding: 0;
        }

        .tazaari-marquee {
          display: inline-flex;
          animation: marquee 25s linear infinite;
        }

        .tazaari-marquee-group {
          display: inline-flex;
          align-items: center;
          gap: 48px;
          padding-right: 48px;
          font-weight: 600;
          color: #ffffff;
        }

        .tazaari-marquee-item {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .tazaari-nav-wrapper {
          backdrop-filter: blur(16px);
          WebkitBackdropFilter: blur(16px);
          transition: all 0.3s ease-in-out;
        }

        .tazaari-nav-container {
          max-width: 1380px;
          margin: 0 auto;
          padding: 0 24px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 20px;
        }

        .tazaari-nav-left {
          display: flex;
          align-items: center;
          gap: 24px;
          justify-self: start;
        }

        .tazaari-nav-center {
          display: flex;
          justify-content: center;
          align-items: center;
          justify-self: center;
        }

        .tazaari-nav-link {
          font-family: var(--font-sans);
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #ffffff;
          background: transparent;
          border: 0;
          cursor: pointer;
          padding-bottom: 4px;
          transition: all 0.25s ease-in-out;
          border-bottom: 2px solid transparent;
          opacity: 0.85;
          text-decoration: none;
        }

        .tazaari-nav-link:hover {
          opacity: 1;
          color: #ffffff;
        }

        .tazaari-nav-link.active {
          opacity: 1;
          border-bottom: 2px solid #D4AF37;
        }

        .tazaari-dropdown-trigger {
          position: relative;
        }

        /* Bridge the hover gap to prevent dropdown closing when moving mouse downwards */
        .tazaari-dropdown-trigger::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          height: 20px;
          background: transparent;
          z-index: 999;
        }

        .tazaari-mobile-toggle {
          display: none;
          justify-self: start;
        }

        .tazaari-nav-right {
          display: flex;
          align-items: center;
          gap: 16px;
          justify-self: end;
        }

        .tazaari-action-btn {
          background: transparent;
          border: 0;
          color: #ffffff;
          padding: 6px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          position: relative;
          transition: opacity 0.2s ease;
        }

        .tazaari-action-btn:hover {
          opacity: 0.8;
        }

        .tazaari-badge {
          position: absolute;
          top: 0;
          right: 0;
          font-size: 0.6rem;
          font-weight: 900;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .tazaari-badge-gold {
          background-color: var(--color-gold);
          color: #121214;
        }

        .tazaari-badge-white {
          background-color: #ffffff;
          color: #121214;
        }

        .tazaari-desktop-action {
          display: inline-flex;
        }

        /* Mega dropdown elements */
        .mega-title-btn {
          font-family: var(--font-sans);
          font-size: 0.725rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          color: #121214;
          text-align: left;
          background: none;
          border: none;
          cursor: pointer;
          padding-bottom: 8px;
          border-bottom: 2px solid #C5A059;
          text-transform: uppercase;
          transition: color 0.2s ease;
        }

        .mega-title-btn:hover {
          color: #C5A059;
        }

        .mega-sub-btn {
          background: none;
          border: none;
          padding: 0;
          font-size: 0.75rem;
          font-weight: 500;
          color: #555555;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
        }

        .mega-sub-btn:hover {
          color: #C5A059;
          transform: translateX(4px);
        }

        .mega-promo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .mega-promo-img:hover {
          transform: scale(1.06);
        }

        .tazaari-search-form {
          display: flex;
          align-items: center;
          gap: 10px;
          background-color: #ffffff;
          border-radius: 9999px;
          border: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          width: 320px;
          padding: 8px 18px;
          animation: searchExpand 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .tazaari-search-input {
          border: 0;
          outline: none;
          font-size: 0.8rem;
          width: 100%;
          color: #121214;
          font-family: var(--font-sans);
          background: transparent;
        }

        .tazaari-search-close {
          border: 0;
          background: transparent;
          color: #999999;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
        }

        .tazaari-search-close:hover {
          color: #121214;
        }

        /* Animations */
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes dropdownFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes searchExpand {
          from { width: 40px; opacity: 0; }
          to { width: 320px; opacity: 1; }
        }

        /* Responsive Rules */
        @media (max-width: 1024px) {
          .tazaari-nav-left {
            display: none !important;
          }
          .tazaari-mobile-toggle {
            display: flex !important;
          }
        }

        @media (max-width: 768px) {
          .tazaari-desktop-action {
            display: none !important;
          }
          @keyframes searchExpand {
            from { width: 40px; opacity: 0; }
            to { width: 200px; opacity: 1; }
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;


