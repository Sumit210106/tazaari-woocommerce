"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import type { PageType } from '../context/CartContext';
import { ShoppingBag, Heart, Search, ChevronDown, Menu, X, User, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

  const handleCategorySelect = (catSlug: string) => {
    setActiveCategory(catSlug);
    setActivePage('shop');
    setIsShopDropdownOpen(false);
    setIsMobileMenuOpen(false);
    router.push('/shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
                <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-[30px] shadow-[0_4px_15px_rgba(0,0,0,0.1)] animate-[searchExpand_0.25s_ease] absolute right-0 top-1/2 -translate-y-1/2 z-10 w-[180px] sm:w-[240px]">
                  <Search size={14} className="text-[var(--color-primary)]" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (activePage !== 'shop') setActivePage('shop');
                    }}
                    className="border-0 outline-none text-[0.8rem] w-full text-[#111111] font-[family:var(--font-sans)]"
                    autoFocus
                  />
                  <button 
                    onClick={() => setIsSearchOpen(false)} 
                    className="border-0 bg-transparent text-[#888888] text-[0.75rem] cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
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
              onClick={() => setIsUserModalOpen(true)}
              className="hidden md:inline-flex bg-transparent border-0 text-white p-1.5 cursor-pointer"
              title="Account"
            >
              <User size={20} />
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
              onClick={() => { setIsMobileMenuOpen(false); setIsUserModalOpen(true); }}
              className="text-left text-[0.9rem] font-extrabold text-[#111111] border-0 bg-transparent tracking-[0.12em] uppercase flex items-center gap-2"
            >
              <User size={16} /> My Account
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
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-5">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-[4px]" onClick={() => setIsUserModalOpen(false)} />

          <div className="relative bg-white w-full max-w-[400px] rounded-none p-9 z-[1101] shadow-[0_16px_40px_rgba(0,0,0,0.12)] text-[#111111]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-[family:var(--font-serif)] text-[1.5rem] font-semibold">VIP Client Login</h3>
              <button onClick={() => setIsUserModalOpen(false)} className="border-0 bg-transparent text-[1.1rem] cursor-pointer">✕</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setIsUserModalOpen(false); }} className="flex flex-col gap-4">
              <div>
                <label className="block text-[0.75rem] font-bold uppercase tracking-[0.08em] mb-1.5">Email Address</label>
                <input type="email" required placeholder="vip@tazaari.com" className="w-full p-3 border border-[var(--color-border)] outline-none font-[family:var(--font-sans)] text-sm" />
              </div>
              <div>
                <label className="block text-[0.75rem] font-bold uppercase tracking-[0.08em] mb-1.5">Password</label>
                <input type="password" required placeholder="••••••••" className="w-full p-3 border border-[var(--color-border)] outline-none font-[family:var(--font-sans)] text-sm" />
              </div>
              <button type="submit" className="w-full h-12 mt-2.5 bg-[#111111] text-white border-0 font-extrabold text-[0.8rem] tracking-[0.12em] cursor-pointer hover:bg-[var(--color-gold)] hover:text-[#111111] transition-colors duration-300">
                SIGN IN
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


