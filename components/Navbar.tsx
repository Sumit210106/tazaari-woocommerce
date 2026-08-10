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
    <header className="fixed top-0 left-0 right-0 z-[1000] transition-all duration-[350ms] ease-[cubic-bezier(0.25,0.8,0.25,1)] mb-0">
      {/* Top running marquee announcement bar */}
      <div className="bg-[#121214] text-white text-[0.65rem] py-[6px] h-[28px] flex items-center border-b border-white/8 tracking-[0.12em] overflow-hidden whitespace-nowrap">
        <div className="w-full overflow-hidden" style={{ padding: 0 }}>
          <div className="inline-flex animate-[marquee_25s_linear_infinite]" style={{ gap: '0px' }}>
            <div className="inline-flex items-center gap-[48px] pr-[48px] font-semibold">
              <span className="inline-flex items-center gap-[6px]">
                <Sparkles size={11} className="text-[var(--color-gold)]" />
                COMPLIMENTARY EXPRESS WORLDWIDE SHIPPING OVER ₹2,500
              </span>
              <span>•</span>
              <span>USE CODE: <strong className="text-[var(--color-gold)]">TAZAARI15</strong> FOR 15% OFF YOUR FIRST ORDER</span>
              <span>•</span>
              <span className="inline-flex items-center gap-[6px]">
                <Sparkles size={11} className="text-[var(--color-gold)]" />
                HANDCRAFTED ARTISANAL LUXURY & ETHICAL COUTURE
              </span>
              <span>•</span>
            </div>
            <div className="inline-flex items-center gap-[48px] pr-[48px] font-semibold">
              <span className="inline-flex items-center gap-[6px]">
                <Sparkles size={11} className="text-[var(--color-gold)]" />
                COMPLIMENTARY EXPRESS WORLDWIDE SHIPPING OVER ₹2,500
              </span>
              <span>•</span>
              <span>USE CODE: <strong className="text-[var(--color-gold)]">TAZAARI15</strong> FOR 15% OFF YOUR FIRST ORDER</span>
              <span>•</span>
              <span className="inline-flex items-center gap-[6px]">
                <Sparkles size={11} className="text-[var(--color-gold)]" />
                HANDCRAFTED ARTISANAL LUXURY & ETHICAL COUTURE
              </span>
              <span>•</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Luxury Navigation Bar */}
      <nav
        className="backdrop-blur-[12px] transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.8,0.25,1)]"
        style={{
          backgroundColor: (activePage === 'home' && !isScrolled) ? 'rgba(18, 18, 20, 0.2)' : 'rgba(92, 129, 179, 0.95)',
          borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid transparent',
          boxShadow: isScrolled ? '0 10px 30px rgba(0, 0, 0, 0.08)' : 'none',
          padding: isScrolled ? '12px 0' : '18px 0',
        }}
      >
        <div className="container flex items-center justify-between gap-5">
          {/* LEFT: Navigation Links (Desktop) */}
          <div className="hidden min-[869px]:flex items-center gap-8">
            {/* Direct Home Link */}
            <button
              onClick={() => handleNavClick('home')}
              className={`
                font-[family:var(--font-sans)] text-[0.85rem] font-bold tracking-[0.15em] uppercase text-white bg-transparent border-0 cursor-pointer pb-1 transition-all duration-250 ease-in-out
                ${activePage === 'home' ? 'opacity-100 border-b-2 border-white' : 'opacity-80 border-b-2 border-transparent hover:opacity-100'}
              `}
            >
              Home
            </button>

            {/* Shop (Mega Dropdown Trigger) */}
            <div
              className="relative"
              onMouseEnter={() => setIsShopDropdownOpen(true)}
              onMouseLeave={() => setIsShopDropdownOpen(false)}
            >
              <button
                onClick={() => handleCategorySelect('all')}
                className={`
                  flex items-center gap-1 font-[family:var(--font-sans)] text-[0.85rem] font-bold tracking-[0.15em] uppercase text-white bg-transparent border-0 cursor-pointer pb-1 transition-all duration-250 ease-in-out
                  ${activePage === 'shop' ? 'opacity-100 border-b-2 border-white' : 'opacity-80 border-b-2 border-transparent hover:opacity-100'}
                `}
              >
                <span>Shop</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isShopDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Shop Mega Dropdown Card */}
              {isShopDropdownOpen && (
                <div className="absolute top-full left-[-40px] w-[680px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-black/5 rounded-none p-9 grid grid-cols-3 gap-7 z-50 animate-[dropdownFadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)] text-[var(--color-primary)]">
                  {NAVIGATION_CATEGORIES.map(cat => (
                    <div key={cat.slug} className="flex flex-col gap-3.5">
                      <button
                        onClick={() => handleCategorySelect(cat.slug)}
                        className="font-[family:var(--font-sans)] text-[0.8rem] font-extrabold tracking-[0.12em] text-[#111111] text-left border-0 bg-transparent cursor-pointer border-b border-[var(--color-border)] pb-1.5 uppercase"
                      >
                        {cat.title}
                      </button>
                      <ul className="list-none flex flex-col gap-2 p-0 m-0">
                        {cat.items.map(item => (
                          <li key={item}>
                            <button
                              onClick={() => handleCategorySelect(cat.slug)}
                              className="border-0 bg-transparent p-0 text-[0.85rem] font-medium text-[var(--color-text-muted)] cursor-pointer transition-all duration-200 ease-in-out text-left hover:text-[var(--color-gold)] hover:translate-x-1"
                            >
                              {item}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  
                  {/* Decorative Brand promo in Mega Dropdown */}
                  <div className="col-span-3 mt-3 p-4 bg-[#FAF8F5] flex items-center justify-between">
                    <span className="text-[0.75rem] font-bold tracking-[0.08em] text-[#111111]">
                      NEW SEASON COUTURE DISCOVERIES
                    </span>
                    <button 
                      onClick={() => handleCategorySelect('new-arrivals')}
                      className="border-0 bg-transparent text-[var(--color-gold)] text-[0.75rem] font-extrabold tracking-[0.05em] cursor-pointer underline"
                    >
                      EXPLORE ALL
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Direct About Us Link (No Dropdown) */}
            <button
              onClick={() => handleNavClick('about')}
              className={`
                font-[family:var(--font-sans)] text-[0.85rem] font-bold tracking-[0.15em] uppercase text-white bg-transparent border-0 cursor-pointer pb-1 transition-all duration-250 ease-in-out
                ${activePage === 'about' ? 'opacity-100 border-b-2 border-white' : 'opacity-80 border-b-2 border-transparent hover:opacity-100'}
              `}
            >
              About Us
            </button>

            {/* Direct Contact Us Link (No Dropdown) */}
            <button
              onClick={() => handleNavClick('contact')}
              className={`
                font-[family:var(--font-sans)] text-[0.85rem] font-bold tracking-[0.15em] uppercase text-white bg-transparent border-0 cursor-pointer pb-1 transition-all duration-250 ease-in-out
                ${activePage === 'contact' ? 'opacity-100 border-b-2 border-white' : 'opacity-80 border-b-2 border-transparent hover:opacity-100'}
              `}
            >
              Contact Us
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <div className="min-[869px]:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="bg-transparent border-0 p-1.5 text-white cursor-pointer flex items-center"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* CENTER: Logo */}
          <div className="flex justify-center items-center">
            <button
              onClick={() => handleNavClick('home')}
              className="bg-transparent border-0 p-0 cursor-pointer flex items-center"
              title="TAZAARI Home"
            >
              <img
                src="/logo-white-transparent.png"
                alt="TAZAARI"
                style={{
                  height: isScrolled ? '32px' : '40px',
                  maxWidth: '180px',
                  objectFit: 'contain',
                  display: 'block',
                  transition: 'height 0.3s ease'
                }}
              />
            </button>
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-5">
            {/* Search Toggle */}
            <div className="relative">
              {isSearchOpen ? (
                <form 
                  onSubmit={handleSearchSubmit}
                  className="flex items-center gap-2.5 bg-white rounded-full border border-black/5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] animate-[searchExpand_0.25s_cubic-bezier(0.16,1,0.3,1)] absolute right-0 top-1/2 -translate-y-1/2 z-10 w-[200px] sm:w-[320px]"
                  style={{ padding: '8px 18px' }}
                >
                  <Search size={14} className="text-[#121214] shrink-0" />
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
                    className="border-0 outline-none text-[0.8rem] w-full text-[#121214] font-[family:var(--font-sans)] bg-transparent placeholder-gray-400"
                    style={{ paddingLeft: '8px', paddingRight: '8px' }}
                    autoFocus
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchOpen(false);
                    }} 
                    className="border-0 bg-transparent text-gray-400 hover:text-[#121214] text-[0.75rem] cursor-pointer flex items-center justify-center p-0.5"
                    aria-label="Close search"
                  >
                    <X size={14} />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="bg-transparent border-0 text-white p-1.5 cursor-pointer"
                  title="Search"
                >
                  <Search size={20} />
                </button>
              )}
            </div>

            {/* Account Account Login (Hidden on Mobile, shown in mobile drawer) */}
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
              className="hidden md:inline-flex bg-transparent border-0 text-white p-1.5 cursor-pointer"
              title="Account"
            >
              <User size={20} color="#FFFFFF" />
            </button>

            {/* Wishlist Link (Hidden on Mobile, shown in mobile drawer) */}
            <button
              onClick={() => handleCategorySelect('all')}
              className="hidden md:inline-flex relative bg-transparent border-0 text-white p-1.5 cursor-pointer"
              title="Wishlist"
            >
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 bg-[var(--color-gold)] text-[#121214] text-[0.6rem] font-black w-[15px] h-[15px] rounded-full flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Drawer Toggle */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-transparent border-0 text-white p-1.5 cursor-pointer"
              title="Bag"
            >
              <ShoppingBag size={20} />
              <span className="absolute top-0 right-0 bg-white text-[#121214] text-[0.6rem] font-black w-[15px] h-[15px] rounded-full flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className={`fixed left-0 right-0 bg-white border-b border-black/8 shadow-[0_20px_40px_rgba(0,0,0,0.1)] flex flex-col px-5 py-6 gap-4 z-50 animate-[dropdownFadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)] ${isScrolled ? 'top-[84px]' : 'top-[104px]'}`}>
          <button 
            onClick={() => handleNavClick('home')} 
            className="text-left text-[0.9rem] font-extrabold text-[#111111] border-0 bg-transparent tracking-[0.12em] uppercase"
          >
            Home
          </button>
          
          {/* Shop Accordion for Mobile */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[0.9rem] font-extrabold text-[#111111] tracking-[0.12em] uppercase">
              Shop Collections
            </span>
            <div className="grid grid-cols-2 gap-2 pl-3">
              {NAVIGATION_CATEGORIES.map(cat => (
                <button 
                  key={cat.slug} 
                  onClick={() => handleCategorySelect(cat.slug)} 
                  className="text-left text-[0.85rem] text-[var(--color-text-muted)] border-0 bg-transparent py-1 cursor-pointer"
                >
                  {cat.title}
                </button>
              ))}
              <button 
                onClick={() => handleCategorySelect('all')} 
                className="text-left text-[0.85rem] text-[var(--color-gold)] font-bold border-0 bg-transparent py-1 col-span-2"
              >
                View All products
              </button>
            </div>
          </div>

          <button 
            onClick={() => handleNavClick('about')} 
            className="text-left text-[0.9rem] font-extrabold text-[#111111] border-0 bg-transparent tracking-[0.12em] uppercase"
          >
            About Us
          </button>
          <button 
            onClick={() => handleNavClick('contact')} 
            className="text-left text-[0.9rem] font-extrabold text-[#111111] border-0 bg-transparent tracking-[0.12em] uppercase"
          >
            Contact Us
          </button>

          {/* Account and Wishlist options for mobile viewports */}
          <div className="border-t border-gray-100 pt-4 flex flex-col gap-4 md:hidden">
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
              className="text-left text-[0.9rem] font-extrabold text-[#111111] border-0 bg-transparent tracking-[0.12em] uppercase flex items-center gap-2"
            >
              <User size={16} /> {isAuthenticated ? 'My Account' : 'Log In'}
            </button>
            <button 
              onClick={() => handleCategorySelect('all')} 
              className="text-left text-[0.9rem] font-extrabold text-[#111111] border-0 bg-transparent tracking-[0.12em] uppercase flex items-center gap-2"
            >
              <Heart size={16} /> Wishlist ({wishlist.length})
            </button>
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
          to { width: 100%; opacity: 1; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;


