"use client";

import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2 } from 'lucide-react';
import DriftWall from './DriftWall';

export const Testimonials: React.FC = () => {
  const [testimonialSet, setTestimonialSet] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const testimonialsList = [
    // Set 0 (3 Segment Cards)
    [
      {
        quote: "The 300 GSM heavyweight cotton tee has an unbelievable drape and structural weight. Easily my go-to staple piece now.",
        author: "Ananya Roy",
        location: "Mumbai",
        verified: true,
        rating: 5
      },
      {
        quote: "Pure luxury without being loud. The minimalist aesthetic, precise tailoring, and subtle tactile depth are world class.",
        author: "Karan Sharma",
        location: "New Delhi",
        verified: true,
        rating: 5
      },
      {
        quote: "Fast express delivery, exquisite eco-conscious packaging, and the clothing quality looks even better in person. 10/10!",
        author: "Siddharth Mehta",
        location: "Bengaluru",
        verified: true,
        rating: 5
      }
    ],
    // Set 1 (3 Segment Cards - Opposite Direction Slide)
    [
      {
        quote: "The oversized silhouette fits like a dream. Perfectly boxy without losing shape after multiple washes.",
        author: "Natasha Kapoor",
        location: "Hyderabad",
        verified: true,
        rating: 5
      },
      {
        quote: "Incredible craftsmanship and premium fabric weight. Tazaari has redefined everyday streetwear luxury in India.",
        author: "Dev Patel",
        location: "Pune",
        verified: true,
        rating: 5
      },
      {
        quote: "Breathable, structured, and effortlessly chic. I'm constantly getting asked where I bought this outfit from.",
        author: "Rhea Nair",
        location: "Chennai",
        verified: true,
        rating: 5
      }
    ]
  ];

  const handleTestimonialSwitch = (dir: 'left' | 'right') => {
    if (isTransitioning) return;
    setSlideDirection(dir);
    setIsTransitioning(true);
    setTimeout(() => {
      setTestimonialSet(prev => (prev === 0 ? 1 : 0));
      setIsTransitioning(false);
    }, 380);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      handleTestimonialSwitch(testimonialSet === 0 ? 'right' : 'left');
    }, 4500);
    return () => clearInterval(timer);
  }, [testimonialSet, isTransitioning]);

  return (
    <section style={{ padding: '90px 0', backgroundColor: '#FAF8F5', overflow: 'hidden' }}>
      <div className="container">
        
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '48px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#8B4A47', display: 'block', marginBottom: '10px' }}>
              WHAT OUR CLIENTS SAY • VERIFIED REVIEWS
            </span>
            <h2 style={{ fontFamily: "var(--font-serif, 'Playfair Display', serif)", fontSize: '2.6rem', fontWeight: 500, color: '#111111', margin: 0 }}>
              Loved by Fashion Enthusiasts
            </h2>
          </div>

          {/* Slider Indicators */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {[0, 1].map((setIdx) => (
              <button
                key={setIdx}
                onClick={() => handleTestimonialSwitch(setIdx > testimonialSet ? 'right' : 'left')}
                style={{
                  width: setIdx === testimonialSet ? '32px' : '10px',
                  height: '4px',
                  backgroundColor: setIdx === testimonialSet ? '#111111' : '#D0D0D0',
                  border: 'none',
                  borderRadius: '100px',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                aria-label={`Go to review set ${setIdx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Testimonial 3-Card Segment with Smooth Slide-To-Opposite Animation */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          position: 'relative'
        }}>
          {testimonialsList[testimonialSet].map((review, idx) => (
            <div 
              key={idx} 
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '36px 32px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
                border: '1px solid rgba(17, 17, 17, 0.06)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                opacity: isTransitioning ? 0 : 1,
                transform: isTransitioning 
                  ? (slideDirection === 'right' ? 'translateX(-40px) scale(0.97)' : 'translateX(40px) scale(0.97)') 
                  : 'translateX(0px) scale(1)',
                transition: `transform 0.38s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.06}s, opacity 0.35s ease ${idx * 0.06}s`
              }}
            >
              <div>
                {/* Rating Stars */}
                <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={16} style={{ color: '#D4AF37', fill: '#D4AF37' }} />
                  ))}
                </div>

                <p style={{
                  fontSize: '0.95rem',
                  color: '#333333',
                  lineHeight: 1.7,
                  fontWeight: 400,
                  fontStyle: 'italic',
                  marginBottom: '28px'
                }}>
                  “{review.quote}”
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid rgba(17,17,17,0.06)' }}>
                <div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#111111', display: 'block' }}>{review.author}</span>
                  <span style={{ fontSize: '0.75rem', color: '#777777' }}>{review.location}</span>
                </div>
                {review.verified && (
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2E7D32', backgroundColor: 'rgba(46, 125, 50, 0.08)', padding: '4px 10px', borderRadius: '100px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={12} /> Verified Buyer
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 3D Interactive Drifting Perspective Wall for Client & Lookbook Stories */}
        <div style={{
          height: '500px',
          marginTop: '48px',
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1px solid rgba(17, 17, 17, 0.08)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
          backgroundColor: '#FAF8F5'
        }}>
          <DriftWall
            columns={5}
            tileWidth={210}
            tileHeight={136}
            gap={16}
            tilt={14}
            turn={-12}
            perspective={1200}
            depth={100}
            speed={28}
            direction="up"
            variance={0.4}
            parallax={0.6}
            lift={54}
            fade={0.5}
            dim={0.7}
            overlayColor="#FAF8F5"
            radius={12}
          />
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
