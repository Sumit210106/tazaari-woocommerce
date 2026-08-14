"use client";

import React, { useEffect } from 'react';
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

export const FabricStoryPage: React.FC = () => {
  const { setActivePage } = useCart();
  const router = useRouter();

  usePageMeta(
    'The Fabric Story | Tazaari',
    'Discover the Tazaari Fabric Story. Uncompromising heavyweight cotton, architectural drape, and luxury craftsmanship.'
  );

  return (
    <div style={{ backgroundColor: '#FFFFFF', color: '#111111', fontFamily: '"Plus Jakarta Sans", sans-serif', minHeight: '100vh', paddingTop: '140px', paddingBottom: '100px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
        
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

        {/* Clean Editorial Title */}
        <h1 style={{
          fontFamily: "var(--font-serif, 'Playfair Display', serif)",
          fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
          fontWeight: 400,
          color: '#111111',
          margin: '0 0 12px',
          letterSpacing: '-0.02em',
          lineHeight: 1.15
        }}>
          The Fabric Story
        </h1>
        <p style={{
          fontFamily: "var(--font-serif, 'Playfair Display', serif)",
          fontSize: '1.25rem',
          color: '#555555',
          fontStyle: 'italic',
          marginBottom: '40px',
          lineHeight: 1.5
        }}>
          The Fabric That Speaks Before You Do
        </p>

        {/* Full Hero Image */}
        <div style={{ width: '100%', height: '480px', overflow: 'hidden', marginBottom: '56px', backgroundColor: '#FAF8F5' }}>
          <img
            src="https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&q=80&w=1200"
            alt="Tazaari Premium Heavyweight Cotton"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Article Body */}
        <div style={{ fontSize: '1rem', color: '#333333', lineHeight: 1.9 }}>
          
          <p style={{ fontSize: '1.15rem', color: '#111111', lineHeight: 1.8, marginBottom: '28px' }}>
            There are garments that fill a wardrobe, and then there are garments that become part of your identity. At Tazaari, every collection begins not with a sketch or a trend forecast, but with a question: <em>How should clothing make you feel?</em>
          </p>

          <p style={{ marginBottom: '28px' }}>
            Our answer has always been the same—effortless, confident, and undeniably comfortable.
          </p>

          <p style={{ marginBottom: '28px' }}>
            That philosophy led us to spend months searching for a fabric worthy of becoming the foundation of Tazaari. We weren’t interested in the lightest fabric or the heaviest. We weren’t chasing trends or marketing buzzwords. We were looking for something rarer: a premium cotton fabric that looked luxurious, felt exceptional against the skin, and maintained its integrity through years of wear.
          </p>

          {/* Pull Quote */}
          <div style={{
            margin: '48px 0',
            padding: '24px 32px',
            borderLeft: '2px solid #111111',
            fontFamily: "var(--font-serif, 'Playfair Display', serif)",
            fontSize: '1.4rem',
            fontStyle: 'italic',
            color: '#111111',
            lineHeight: 1.6
          }}>
            “Luxury is restraint. It is selecting a fabric because every thread serves a purpose—because it drapes naturally instead of clinging, and breathes as beautifully as it holds its shape.”
          </div>

          <h2 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.75rem', fontWeight: 500, color: '#111111', marginTop: '48px', marginBottom: '20px' }}>
            A Fabric Chosen, Never Compromised
          </h2>
          
          <p style={{ marginBottom: '28px' }}>
            Every Tazaari T-shirt is crafted from a premium heavyweight cotton blend, designed to achieve the perfect balance between structure, softness, and breathability. Whether it’s our oversized T-shirts or women’s fitted silhouettes, every garment begins with the same uncompromising textile.
          </p>

          <p style={{ marginBottom: '28px' }}>
            The fabric carries presence without unnecessary weight. It has a smooth, refined surface that catches light softly rather than reflecting it harshly. The hand feel is rich, dense, and unmistakably elevated.
          </p>

          <h2 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.75rem', fontWeight: 500, color: '#111111', marginTop: '48px', marginBottom: '20px' }}>
            Weight That Feels Intentional
          </h2>

          <p style={{ marginBottom: '28px' }}>
            Many heavyweight cotton T-shirts sacrifice comfort for structure. Ours refuses to choose. Engineered to provide the confidence of a structured silhouette while remaining breathable enough for everyday wear, it offers the reassuring weight associated with luxury essentials without ever feeling bulky.
          </p>

          {/* Inline Image Break */}
          <div style={{ width: '100%', height: '400px', overflow: 'hidden', margin: '48px 0', backgroundColor: '#FAF8F5' }}>
            <img
              src="https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=1200"
              alt="Heavyweight Cotton Weave Close-up"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <h2 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.75rem', fontWeight: 500, color: '#111111', marginTop: '48px', marginBottom: '20px' }}>
            The Architecture of Everyday Luxury
          </h2>

          <p style={{ marginBottom: '28px' }}>
            The difference between an ordinary T-shirt and an exceptional one often lies in what isn’t immediately visible. Our fabric has been carefully knitted to achieve a naturally smooth finish with exceptional dimensional stability.
          </p>

          <p style={{ marginBottom: '28px' }}>
            The structure provides gentle support, helping the garment maintain its silhouette instead of losing shape after repeated wear. Because true luxury should never require delicate handling.
          </p>

          <h2 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.75rem', fontWeight: 500, color: '#111111', marginTop: '48px', marginBottom: '20px' }}>
            Made to Move With You
          </h2>

          <p style={{ marginBottom: '28px' }}>
            Life rarely stays still. Neither should the clothing you depend on. Every movement, every commute, every flight becomes part of the life of a garment. Our breathable cotton blend fabric has been selected to adapt to that rhythm.
          </p>

          <h2 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.75rem', fontWeight: 500, color: '#111111', marginTop: '48px', marginBottom: '20px' }}>
            Softness, Refined Over Time
          </h2>

          <p style={{ marginBottom: '28px' }}>
            Some fabrics offer immediate softness only to lose their character after a handful of washes. We wanted the opposite. Our premium cotton fabric has been developed to become increasingly personal with time, growing softer through repeated wear while preserving the structure that defines the silhouette.
          </p>

          <h2 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.75rem', fontWeight: 500, color: '#111111', marginTop: '48px', marginBottom: '20px' }}>
            Designed Beyond Seasons
          </h2>

          <p style={{ marginBottom: '28px' }}>
            Fashion moves quickly. Style never needs to. Tazaari was created with permanence in mind. Our luxury streetwear essentials, timeless colours, and modern silhouettes are intentionally understated, allowing the focus to remain on craftsmanship rather than trends.
          </p>

          {/* Closing Section */}
          <div style={{ marginTop: '48px', padding: '36px', backgroundColor: '#FAF8F5', border: '1px solid #EAE6E1' }}>
            <h3 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '1.5rem', fontWeight: 500, color: '#111111', margin: '0 0 12px' }}>
              Because Luxury Begins With What You Feel
            </h3>
            <p style={{ fontSize: '0.95rem', color: '#555555', lineHeight: 1.8, margin: 0 }}>
              Before anyone notices the silhouette… Before they admire the artwork… Before they ask where it’s from… You feel it. The weight. The softness. The confidence. That feeling is where every Tazaari garment begins.
            </p>
          </div>

          {/* Shop Button */}
          <div style={{ marginTop: '48px', textAlign: 'center' }}>
            <button
              onClick={() => {
                setActivePage('shop');
                router.push('/shop');
              }}
              style={{
                backgroundColor: '#111111',
                color: '#FFFFFF',
                border: 'none',
                padding: '16px 36px',
                fontSize: '0.8rem',
                fontWeight: 800,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                cursor: 'pointer'
              }}
            >
              Shop the Collection
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default FabricStoryPage;
