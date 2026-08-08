"use client";

import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  ChevronDown, 
  Sparkles, 
  Send, 
  Clock, 
  ArrowRight, 
  X 
} from 'lucide-react';

const InstagramIcon: React.FC<{ size?: number; style?: React.CSSProperties }> = ({ size = 14, style }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={style}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'general',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Styling Session Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    date: '',
    time: '14:00',
    location: 'virtual',
    notes: ''
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Accordion open states
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
  };

  const faqs = [
    {
      q: 'How long does a custom bridal or couture order take?',
      a: 'Custom bridal lehengas and hand-embroidered couture garments typically require 6 to 12 weeks of meticulous craftsmanship by our master artisans in Mumbai.'
    },
    {
      q: 'What is TAZAARI’s global shipping policy?',
      a: 'We offer complimentary express courier shipping on all international orders over $250. Express delivery takes 3 to 7 business days via DHL Express.'
    },
    {
      q: 'Can I request complimentary size adjustments?',
      a: 'Yes! Every TAZAARI purchase includes one complimentary fitting alteration at any of our flagship boutiques or via our white-glove mail-in service.'
    },
    {
      q: 'What is your return and exchange policy?',
      a: 'We accept global returns and exchanges within 14 days of delivery for all standard-sized items in original unworn condition with security tags attached.'
    }
  ];

  return (
    <div style={{ backgroundColor: '#FAF8F5', color: '#111111', fontFamily: '"Plus Jakarta Sans", sans-serif', minHeight: '100vh' }}>
      
      {/* Minimal Line Input & Un-boxed Styles */}
      <style>{`
        .tz-line-input {
          width: 100%;
          padding: 12px 0 16px;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(17, 17, 17, 0.35);
          font-size: 1rem;
          color: #111111;
          font-family: inherit;
          outline: none;
          border-radius: 0px;
          transition: border-color 0.3s ease;
        }

        .tz-line-input:focus {
          border-bottom-color: #111111;
        }

        .tz-line-input::placeholder {
          color: #888888;
          font-size: 0.95rem;
        }

        .tz-minimal-btn {
          background: #111111;
          color: #FFFFFF;
          border: none;
          padding: 16px 36px;
          border-radius: 0px;
          font-size: 0.8125rem;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .tz-minimal-btn:hover {
          background: #D4AF37;
          color: #111111;
        }
      `}</style>

      {/* Editorial Vogue-Style Hero Header */}
      <section style={{
        position: 'relative',
        width: '100%',
        minHeight: '60vh',
        backgroundImage: 'linear-gradient(180deg, rgba(17, 17, 17, 0.45) 0%, rgba(10, 10, 10, 0.78) 100%), url("/images/pexels-pavel-danilyuk-5789582.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center 30%',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '140px 24px 80px',
        textAlign: 'center',
        color: '#FFFFFF'
      }}>
        <div style={{ maxWidth: '840px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          
          {/* Maison Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 20px',
            borderRadius: '0px',
            background: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(10px)',
            marginBottom: '24px'
          }}>
            <Sparkles size={14} style={{ color: '#D4AF37' }} />
            <span style={{ fontSize: '0.75rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#FFFFFF', fontWeight: 800 }}>
              MAISON CONCIERGE & ADVISORY
            </span>
          </div>

          <h1 style={{
            fontFamily: "var(--font-serif, 'Playfair Display', serif)",
            fontSize: 'clamp(2.6rem, 5.2vw, 4.5rem)',
            fontWeight: 500,
            lineHeight: 1.12,
            letterSpacing: '-0.02em',
            margin: '0 0 20px',
            color: '#FFFFFF'
          }}>
            At Your Service.
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 1.6vw, 1.15rem)',
            color: 'rgba(255, 255, 255, 0.9)',
            lineHeight: 1.7,
            fontWeight: 400,
            maxWidth: '680px',
            margin: '0 auto'
          }}>
            Whether you desire a private 1-on-1 styling consultation, bridal couture customization, or bespoke order assistance, our senior advisors are ready to assist.
          </p>
        </div>
      </section>

      {/* Combined Single Glassmorphism Concierge Bar */}
      <section style={{ padding: '0 24px', marginTop: '-55px', position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '-55px auto 60px' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: '0px',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.06), 0 2px 10px rgba(0,0,0,0.03)',
          padding: '28px 36px',
          transition: 'all 0.35s ease'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '32px',
            alignItems: 'center'
          }}>
            
            {/* Channel 1: Phone / WhatsApp */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '0px', background: 'rgba(212, 175, 55, 0.14)', border: '1px solid rgba(212, 175, 55, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Phone size={22} style={{ color: '#D4AF37' }} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#777777', display: 'block' }}>CLIENT CONCIERGE</span>
                <a href="tel:+918591908733" style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111111', textDecoration: 'none', display: 'block', marginTop: '2px' }}>
                  +91 8591 9087 33
                </a>
                <span style={{ fontSize: '0.75rem', color: '#888888', display: 'block', marginTop: '2px' }}>Mon - Sun: 10 AM - 8 PM IST</span>
              </div>
            </div>

            {/* Channel 2: Digital Email */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '0px', background: 'rgba(92, 129, 179, 0.14)', border: '1px solid rgba(92, 129, 179, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Mail size={22} style={{ color: '#5c81b3' }} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#777777', display: 'block' }}>EMAIL SUPPORT</span>
                <a href="mailto:info@tazaari.com" style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111111', textDecoration: 'none', display: 'block', marginTop: '2px' }}>
                  info@tazaari.com
                </a>
                <span style={{ fontSize: '0.75rem', color: '#888888', display: 'block', marginTop: '2px' }}>24/7 Digital Desk Response</span>
              </div>
            </div>

            {/* Channel 3: Private Session */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '0px', background: 'rgba(212, 175, 55, 0.14)', border: '1px solid rgba(212, 175, 55, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Calendar size={22} style={{ color: '#D4AF37' }} />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#777777', display: 'block' }}>VIP STYLING</span>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#111111', display: 'block', marginTop: '2px' }}>Private Salon Session</span>
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  style={{ background: 'none', border: 'none', padding: 0, color: '#111111', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}
                >
                  <span>BOOK NOW</span>
                  <ArrowRight size={14} style={{ color: '#D4AF37' }} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Form & Atelier Information Section (No Card Boxes) */}
      <section style={{ padding: '0 24px 100px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '60px' }}>
          
          {/* Left Column: Line-Input Transmission Form (7 Cols) */}
          <div style={{ gridColumn: 'span 7' }} className="mobile-col-12">
            
            <div style={{ marginBottom: '40px' }}>
              <span style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#5c81b3', fontWeight: 800, display: 'block', marginBottom: '8px' }}>
                DIRECT ADVISORY MESSAGE
              </span>
              <h2 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '2.4rem', fontWeight: 400, color: '#111111', margin: 0 }}>
                Send Us A Message
              </h2>
              <p style={{ fontSize: '0.9rem', color: '#666666', marginTop: '8px' }}>
                Fill out the form below and our concierge team will respond within 12 hours.
              </p>
            </div>

            {formSubmitted ? (
              <div style={{ padding: '40px 0', borderTop: '1px solid #111111', textAlign: 'left' }}>
                <CheckCircle2 size={48} style={{ color: '#2E7D32', marginBottom: '16px' }} />
                <h3 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.8rem', color: '#111111', margin: '0 0 10px' }}>
                  Transmission Received
                </h3>
                <p style={{ fontSize: '0.95rem', color: '#555555', lineHeight: 1.6, maxWidth: '440px', margin: '0 0 24px' }}>
                  Thank you, <strong>{formData.name}</strong>. A TAZAARI senior advisor will respond to <strong>{formData.email}</strong> shortly.
                </p>
                <button
                  onClick={() => { setFormSubmitted(false); setFormData({ name: '', email: '', phone: '', inquiryType: 'general', message: '' }); }}
                  className="tz-minimal-btn"
                >
                  SEND ANOTHER MESSAGE
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                
                {/* Name & Email Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#333333', marginBottom: '4px' }}>
                      Enter your name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Victoria Sterling"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="tz-line-input"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#333333', marginBottom: '4px' }}>
                      Email address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="victoria@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="tz-line-input"
                    />
                  </div>
                </div>

                {/* Phone & Inquiry Type Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#333333', marginBottom: '4px' }}>
                      Phone number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="tz-line-input"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#333333', marginBottom: '4px' }}>
                      Select your inquiry type
                    </label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="tz-line-input"
                      style={{ cursor: 'pointer', backgroundColor: 'transparent' }}
                    >
                      <option value="general">General Advisory & Orders</option>
                      <option value="bridal">Bespoke Bridal / Couture Order</option>
                      <option value="styling">Private VIP Styling Appointment</option>
                      <option value="press">Press & PR Relations</option>
                    </select>
                  </div>
                </div>

                {/* Message Details */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#333333', marginBottom: '4px' }}>
                    Project description / Message details *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your requirements, sizing preferences, or event dates..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="tz-line-input"
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <div>
                  <button type="submit" className="tz-minimal-btn" style={{ marginTop: '12px' }}>
                    <Send size={16} />
                    <span>TRANSMIT MESSAGE</span>
                  </button>
                </div>

              </form>
            )}

          </div>

          {/* Right Column: Atelier Locations & VIP Session (5 Cols - Unboxed) */}
          <div style={{ gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: '40px' }} className="mobile-col-12">
            
            {/* VIP Styling CTA */}
            <div style={{ paddingBottom: '32px', borderBottom: '1px solid rgba(17, 17, 17, 0.12)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Sparkles size={18} style={{ color: '#D4AF37' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#D4AF37' }}>
                  PRIVATE STYLING SALON
                </span>
              </div>

              <h3 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.8rem', fontWeight: 400, color: '#111111', margin: '0 0 12px' }}>
                1-on-1 Wardrobe Consultation
              </h3>

              <p style={{ fontSize: '0.9rem', color: '#666666', lineHeight: 1.6, margin: '0 0 24px' }}>
                Experience one-on-one private couture curation with senior Tazaari stylists in our flagship salons or via 4K Video Stream.
              </p>

              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="tz-minimal-btn"
                style={{ width: '100%' }}
              >
                <Calendar size={16} />
                <span>RESERVE VIP SESSION</span>
              </button>
            </div>

            {/* Atelier Locations */}
            <div>
              <h3 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.6rem', fontWeight: 400, color: '#111111', marginBottom: '24px' }}>
                Flagship Atelier Locations
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Mumbai Salon */}
                <div style={{ display: 'flex', gap: '14px', borderBottom: '1px solid rgba(17, 17, 17, 0.08)', paddingBottom: '18px' }}>
                  <MapPin size={20} style={{ color: '#D4AF37', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111111', margin: '0 0 4px' }}>
                      Mumbai Flagship Atelier
                    </h4>
                    <p style={{ fontSize: '0.825rem', color: '#666666', lineHeight: 1.5, margin: 0 }}>
                      Palladium Mall, Level 3, Lower Parel, Mumbai, Maharashtra 400013
                    </p>
                  </div>
                </div>

                {/* New Delhi Boutique */}
                <div style={{ display: 'flex', gap: '14px', borderBottom: '1px solid rgba(17, 17, 17, 0.08)', paddingBottom: '18px' }}>
                  <MapPin size={20} style={{ color: '#5c81b3', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111111', margin: '0 0 4px' }}>
                      New Delhi Luxury Salon
                    </h4>
                    <p style={{ fontSize: '0.825rem', color: '#666666', lineHeight: 1.5, margin: 0 }}>
                      Kalka Das Marg, Mehrauli Luxury District, New Delhi 110030
                    </p>
                  </div>
                </div>

                {/* Social & Hours */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={16} style={{ color: '#888888' }} />
                    <span style={{ fontSize: '0.8rem', color: '#666666', fontWeight: 600 }}>10 AM - 8 PM IST</span>
                  </div>
                  <a
                    href="https://www.instagram.com/tazaariofficial/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.8rem', fontWeight: 800, color: '#5c81b3', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <InstagramIcon size={14} />
                    <span>@tazaariofficial</span>
                  </a>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section style={{ padding: '60px 24px 100px', maxWidth: '920px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#5c81b3', fontWeight: 800, display: 'block', marginBottom: '10px' }}>
            CLIENT INQUIRIES & POLICIES
          </span>
          <h2 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '2.4rem', fontWeight: 400, color: '#111111', margin: 0 }}>
            Frequently Asked Questions
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              style={{
                borderBottom: '1px solid rgba(17, 17, 17, 0.15)',
                overflow: 'hidden'
              }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                style={{
                  width: '100%',
                  padding: '20px 0',
                  textAlign: 'left',
                  backgroundColor: 'transparent',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontFamily: "var(--font-serif, 'Playfair Display', serif)",
                  fontSize: '1.2rem',
                  fontWeight: 400,
                  color: '#111111',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <span>{faq.q}</span>
                <ChevronDown size={20} style={{ transform: openFaq === idx ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease', color: '#D4AF37' }} />
              </button>

              {openFaq === idx && (
                <div style={{ padding: '0 0 20px', fontSize: '0.925rem', color: '#555555', lineHeight: 1.7 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Private Styling Reservation Modal */}
      {isBookingModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div 
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }} 
            onClick={() => setIsBookingModalOpen(false)} 
          />

          <div 
            className="animate-fade-in" 
            style={{ 
              position: 'relative', 
              backgroundColor: '#FFFFFF', 
              width: '100%', 
              maxWidth: '540px', 
              borderRadius: '0px', 
              padding: '40px 36px', 
              zIndex: 1051,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#D4AF37', display: 'block' }}>VIP RESERVATION</span>
                <h3 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.65rem', margin: '4px 0 0', fontWeight: 500 }}>
                  Book Styling Session
                </h3>
              </div>
              <button 
                onClick={() => setIsBookingModalOpen(false)} 
                style={{ width: '36px', height: '36px', borderRadius: '0px', border: '1px solid rgba(17,17,17,0.1)', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>
            </div>

            {bookingSuccess ? (
              <div style={{ padding: '32px 24px', backgroundColor: '#F4F9F4', borderRadius: '0px', textAlign: 'center' }}>
                <CheckCircle2 size={48} style={{ color: '#2E7D32', margin: '0 auto 12px' }} />
                <h4 style={{ color: '#1B5E20', fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.5rem', margin: '0 0 8px' }}>
                  Reservation Confirmed
                </h4>
                <p style={{ fontSize: '0.875rem', color: '#2E7D32', margin: '0 0 20px', lineHeight: 1.6 }}>
                  A confirmation invite and calendar reminder have been transmitted to <strong>{bookingData.email}</strong>.
                </p>
                <button onClick={() => { setIsBookingModalOpen(false); setBookingSuccess(false); }} className="tz-minimal-btn">
                  CLOSE RESERVATION
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#333', marginBottom: '4px' }}>Full Name *</label>
                  <input type="text" required value={bookingData.name} onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })} className="tz-line-input" placeholder="e.g. Victoria Sterling" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#333', marginBottom: '4px' }}>Email Address *</label>
                  <input type="email" required value={bookingData.email} onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })} className="tz-line-input" placeholder="victoria@example.com" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#333', marginBottom: '4px' }}>Preferred Date *</label>
                    <input type="date" required value={bookingData.date} onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })} className="tz-line-input" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#333', marginBottom: '4px' }}>Session Format</label>
                    <select value={bookingData.location} onChange={(e) => setBookingData({ ...bookingData, location: e.target.value })} className="tz-line-input">
                      <option value="virtual">4K Virtual Video Session</option>
                      <option value="mumbai">Mumbai Flagship Salon</option>
                      <option value="delhi">New Delhi Boutique</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="tz-minimal-btn" style={{ marginTop: '12px' }}>
                  CONFIRM RESERVATION
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
