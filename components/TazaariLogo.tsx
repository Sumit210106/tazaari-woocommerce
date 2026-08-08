"use client";

import React from 'react';

interface TazaariLogoProps {
  color?: string; // e.g. '#FFFFFF' or '#5c81b3' or '#121214'
  height?: number; // height in px
  className?: string;
}

export const TazaariLogo: React.FC<TazaariLogoProps> = ({
  color = 'currentColor',
  height = 36,
  className = ''
}) => {
  // Aspect ratio is roughly 4.2:1 (width: 500, height: 120)
  const width = Math.round(height * 4.2);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 520 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'block' }}
    >
      {/* 1. EMBLEM (Circular Geometric Icon) */}
      <g fill={color}>
        {/* Outer Circle Container */}
        <circle cx="60" cy="60" r="56" fill={color} />
        
        {/* Cutouts in Emblem (rendering negative space) */}
        {/* Background mask effect */}
        <path
          d="M 60 8 C 88.7 8 112 31.3 112 60 C 112 88.7 88.7 112 60 112 C 31.3 112 8 88.7 8 60 C 8 31.3 31.3 8 60 8 Z"
          fill={color}
        />
        
        {/* Inner White/Contrast Geometric Engraving */}
        {/* Top Dot in Emblem */}
        <circle cx="60" cy="23" r="4.5" fill="var(--logo-bg-cutout, #FFFFFF)" />
        
        {/* Horizon Arc */}
        <path
          d="M 14 55 Q 60 28 106 55"
          stroke="var(--logo-bg-cutout, #FFFFFF)"
          strokeWidth="4.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Diamond Apex Weave Lines */}
        <path
          d="M 60 108 L 19 55 L 60 24 L 101 55 Z"
          stroke="var(--logo-bg-cutout, #FFFFFF)"
          strokeWidth="4.5"
          fill="none"
          strokeLinejoin="round"
        />

        {/* Center Vertical Axis Line */}
        <line
          x1="60"
          y1="24"
          x2="60"
          y2="108"
          stroke="var(--logo-bg-cutout, #FFFFFF)"
          strokeWidth="4"
        />

        {/* Inner Diagonal Lattice */}
        <line x1="39.5" y1="39.5" x2="80.5" y2="81.5" stroke="var(--logo-bg-cutout, #FFFFFF)" strokeWidth="3.5" />
        <line x1="80.5" y1="39.5" x2="39.5" y2="81.5" stroke="var(--logo-bg-cutout, #FFFFFF)" strokeWidth="3.5" />
      </g>

      {/* 2. TYPOGRAPHY: TAZAARI */}
      <g fill={color}>
        {/* Top Devanagari Style Shirorekha Bar */}
        <rect x="142" y="22" width="340" height="8" rx="2" />

        {/* Letter 'T' (Devanagari Blend 'त') */}
        <path d="M 142 30 V 98 H 158 V 56 Q 170 56 182 66 Q 194 76 194 98 H 210 Q 210 70 192 54 Q 176 40 158 40 V 30 Z" />

        {/* Letter 'Z' (Stylized sharp diagonal) */}
        <path d="M 204 30 H 286 L 214 90 H 290 V 98 H 204 L 276 38 H 204 Z" />

        {/* Letter 'A' (First) */}
        <path d="M 292 98 L 324 30 H 336 L 368 98 H 350 L 342 80 H 318 L 310 98 Z M 322 70 H 338 L 330 50 Z" />

        {/* Letter 'A' (Second) */}
        <path d="M 370 98 L 402 30 H 414 L 446 98 H 428 L 420 80 H 396 L 388 98 Z M 400 70 H 416 L 408 50 Z" />

        {/* Letter 'R' */}
        <path d="M 448 30 H 478 Q 494 30 494 48 Q 494 62 480 66 L 498 98 H 480 L 464 68 H 464 V 98 H 448 Z M 464 42 V 58 H 476 Q 482 58 482 50 Q 482 42 476 42 Z" />

        {/* Letter 'I' */}
        <path d="M 488 30 H 508 V 98 H 488 Z" />

        {/* Dot over 'I' */}
        <circle cx="498" cy="11" r="9" />
      </g>
    </svg>
  );
};
