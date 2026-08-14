"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

const usePageMeta = (title: string, description: string) => {
  useEffect(() => {
    document.title = title;
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = description;
  }, [title, description]);
};

export const PrivacyPolicyPage: React.FC = () => {
  const { setActivePage } = useCart();
  const router = useRouter();

  usePageMeta(
    'Privacy Policy | Tazaari',
    'Read Tazaari’s official Privacy Policy detailing how we collect, use, and protect your personal information.'
  );

  const [commentData, setCommentData] = useState({
    comment: '',
    name: '',
    email: '',
    website: '',
    saveInfo: false
  });
  const [submitted, setSubmitted] = useState(false);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', color: '#111111', fontFamily: '"Plus Jakarta Sans", sans-serif', minHeight: '100vh', paddingTop: '140px', paddingBottom: '100px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Back Link */}
        <button
          onClick={() => {
            setActivePage('home');
            router.push('/');
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: '#666666',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            cursor: 'pointer',
            marginBottom: '32px',
            textTransform: 'uppercase'
          }}
        >
          <ArrowLeft size={15} /> Back to Home
        </button>

        {/* Clean Page Title */}
        <h1 style={{
          fontFamily: "var(--font-serif, 'Playfair Display', serif)",
          fontSize: 'clamp(2.4rem, 5vw, 3.5rem)',
          fontWeight: 400,
          color: '#111111',
          margin: '0 0 8px',
          letterSpacing: '-0.02em'
        }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#777777', marginBottom: '48px' }}>
          Last updated: 3 September 2025
        </p>

        {/* Clean Document Sections */}
        <div style={{ fontSize: '0.95rem', color: '#333333', lineHeight: 1.85 }}>
          
          <h2 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.5rem', fontWeight: 500, color: '#111111', marginTop: '40px', marginBottom: '16px', borderBottom: '1px solid #EAE6E1', paddingBottom: '8px' }}>
            1) Overview
          </h2>
          <p style={{ marginBottom: '20px' }}>
            Your privacy is important to us. When you share information with Tazaari, we use it responsibly to process orders, provide customer support, and improve your experience. This Policy explains what we collect, how we use it, and your choices.
          </p>

          <h2 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.5rem', fontWeight: 500, color: '#111111', marginTop: '40px', marginBottom: '16px', borderBottom: '1px solid #EAE6E1', paddingBottom: '8px' }}>
            2) Information We Collect
          </h2>
          <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            <li style={{ marginBottom: '8px' }}><strong>Information you provide:</strong> name, email, phone number, billing &amp; shipping address, order details, messages to support, and optional gift messages.</li>
            <li style={{ marginBottom: '8px' }}><strong>Payment details:</strong> processed by secure third-party gateways; we do not store full card details on our servers.</li>
            <li style={{ marginBottom: '8px' }}><strong>Usage &amp; technical data:</strong> device/browser type, IP address, pages viewed, and interactions collected via cookies or similar technologies.</li>
          </ul>

          <h2 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.5rem', fontWeight: 500, color: '#111111', marginTop: '40px', marginBottom: '16px', borderBottom: '1px solid #EAE6E1', paddingBottom: '8px' }}>
            3) How We Use Your Information
          </h2>
          <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            <li style={{ marginBottom: '8px' }}>To process and deliver orders, including shipping updates and order-related communications.</li>
            <li style={{ marginBottom: '8px' }}>To respond to queries, returns/claims, and provide customer support.</li>
            <li style={{ marginBottom: '8px' }}>To operate, maintain, and improve our website and user experience.</li>
            <li style={{ marginBottom: '8px' }}>To send optional marketing (with your consent or as permitted by law). You can unsubscribe anytime.</li>
            <li style={{ marginBottom: '8px' }}>To comply with legal obligations and prevent fraud.</li>
          </ul>

          <h2 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.5rem', fontWeight: 500, color: '#111111', marginTop: '40px', marginBottom: '16px', borderBottom: '1px solid #EAE6E1', paddingBottom: '8px' }}>
            4) Cookies &amp; Tracking
          </h2>
          <p style={{ marginBottom: '20px' }}>
            We use cookies and similar technologies to run the site, remember preferences, and analyze performance. You can control cookies via your browser settings; disabling some cookies may impact site functionality.
          </p>

          <h2 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.5rem', fontWeight: 500, color: '#111111', marginTop: '40px', marginBottom: '16px', borderBottom: '1px solid #EAE6E1', paddingBottom: '8px' }}>
            5) Sharing of Information
          </h2>
          <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            <li style={{ marginBottom: '8px' }}><strong>Service providers:</strong> We may share necessary data with trusted partners (e.g., payment gateways, analytics, couriers) to fulfil orders and operate the site.</li>
            <li style={{ marginBottom: '8px' }}><strong>Legal &amp; compliance:</strong> We may disclose information if required by law or to protect our rights, users, or the public.</li>
            <li style={{ marginBottom: '8px' }}>We do not sell your personal information.</li>
          </ul>

          <h2 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.5rem', fontWeight: 500, color: '#111111', marginTop: '40px', marginBottom: '16px', borderBottom: '1px solid #EAE6E1', paddingBottom: '8px' }}>
            6) Data Security
          </h2>
          <p style={{ marginBottom: '20px' }}>
            We implement reasonable technical and organizational measures to protect your information. However, no method of transmission or storage is completely secure.
          </p>

          <h2 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.5rem', fontWeight: 500, color: '#111111', marginTop: '40px', marginBottom: '16px', borderBottom: '1px solid #EAE6E1', paddingBottom: '8px' }}>
            7) Data Retention
          </h2>
          <p style={{ marginBottom: '20px' }}>
            We retain personal data for as long as necessary to fulfil the purposes outlined in this Policy, comply with legal obligations, resolve disputes, and enforce agreements.
          </p>

          <h2 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.5rem', fontWeight: 500, color: '#111111', marginTop: '40px', marginBottom: '16px', borderBottom: '1px solid #EAE6E1', paddingBottom: '8px' }}>
            8) Your Choices
          </h2>
          <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            <li style={{ marginBottom: '8px' }}>Access, update, or request deletion of certain information by contacting us.</li>
            <li style={{ marginBottom: '8px' }}>Opt out of marketing emails using the unsubscribe link or by writing to us.</li>
            <li style={{ marginBottom: '8px' }}>Manage cookies through your browser settings.</li>
          </ul>

          <h2 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.5rem', fontWeight: 500, color: '#111111', marginTop: '40px', marginBottom: '16px', borderBottom: '1px solid #EAE6E1', paddingBottom: '8px' }}>
            9) Children’s Privacy
          </h2>
          <p style={{ marginBottom: '20px' }}>
            Our website is not intended for children under 13. We do not knowingly collect personal information from children.
          </p>

          <h2 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.5rem', fontWeight: 500, color: '#111111', marginTop: '40px', marginBottom: '16px', borderBottom: '1px solid #EAE6E1', paddingBottom: '8px' }}>
            10) International Transfers
          </h2>
          <p style={{ marginBottom: '20px' }}>
            While we primarily operate in India, some service providers may process data outside India. By using the site, you consent to such transfers subject to appropriate safeguards.
          </p>

          <h2 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.5rem', fontWeight: 500, color: '#111111', marginTop: '40px', marginBottom: '16px', borderBottom: '1px solid #EAE6E1', paddingBottom: '8px' }}>
            11) Changes to this Policy
          </h2>
          <p style={{ marginBottom: '20px' }}>
            We may update this Privacy Policy from time to time. Changes are effective when posted on this page. Please check back periodically.
          </p>

          <h2 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.5rem', fontWeight: 500, color: '#111111', marginTop: '40px', marginBottom: '16px', borderBottom: '1px solid #EAE6E1', paddingBottom: '8px' }}>
            12) Contact Us
          </h2>
          <p style={{ marginBottom: '32px' }}>
            For privacy queries or requests, write to: &nbsp;
            <a href="mailto:info@tazaari.com" style={{ color: '#111111', fontWeight: 700, textDecoration: 'underline' }}>
              info@tazaari.com
            </a>
          </p>

        </div>

        {/* Simple Leave a Reply Form */}
        <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '2px solid #111111' }}>
          <h3 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.6rem', fontWeight: 500, margin: '0 0 6px' }}>
            Leave a Reply
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#666666', marginBottom: '32px' }}>
            Your email address will not be published. Required fields are marked *
          </p>

          {submitted ? (
            <div style={{ padding: '24px', border: '1px solid #111111', backgroundColor: '#FAFAFA' }}>
              <p style={{ fontSize: '0.95rem', color: '#111111', margin: 0, fontWeight: 600 }}>
                Thank you. Your comment has been submitted.
              </p>
            </div>
          ) : (
            <form onSubmit={handleCommentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#111111', marginBottom: '8px' }}>
                  Comment *
                </label>
                <textarea
                  required
                  rows={5}
                  value={commentData.comment}
                  onChange={e => setCommentData({ ...commentData, comment: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '1px solid #CCCCCC',
                    borderRadius: '0px',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    outline: 'none',
                    backgroundColor: '#FAFAFA'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#111111', marginBottom: '8px' }}>
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={commentData.name}
                    onChange={e => setCommentData({ ...commentData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '1px solid #CCCCCC',
                      borderRadius: '0px',
                      fontSize: '0.95rem',
                      fontFamily: 'inherit',
                      outline: 'none',
                      backgroundColor: '#FAFAFA'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#111111', marginBottom: '8px' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={commentData.email}
                    onChange={e => setCommentData({ ...commentData, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '1px solid #CCCCCC',
                      borderRadius: '0px',
                      fontSize: '0.95rem',
                      fontFamily: 'inherit',
                      outline: 'none',
                      backgroundColor: '#FAFAFA'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#111111', marginBottom: '8px' }}>
                    Website
                  </label>
                  <input
                    type="url"
                    value={commentData.website}
                    onChange={e => setCommentData({ ...commentData, website: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '1px solid #CCCCCC',
                      borderRadius: '0px',
                      fontSize: '0.95rem',
                      fontFamily: 'inherit',
                      outline: 'none',
                      backgroundColor: '#FAFAFA'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                <input
                  type="checkbox"
                  id="saveInfo"
                  checked={commentData.saveInfo}
                  onChange={e => setCommentData({ ...commentData, saveInfo: e.target.checked })}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
                <label htmlFor="saveInfo" style={{ fontSize: '0.85rem', color: '#555555', cursor: 'pointer' }}>
                  Save my name, email, and website in this browser for the next time I comment.
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#111111',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '14px 28px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    cursor: 'pointer'
                  }}
                >
                  Post Comment
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
