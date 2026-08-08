"use client";

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

export interface DriftWallItem {
  image: string;
  title?: string;
  author?: string;
  quote?: string;
  rating?: number;
  href?: string;
}

export interface DriftWallProps {
  items?: DriftWallItem[];
  columns?: number;
  tileWidth?: number;
  tileHeight?: number;
  gap?: number;
  radius?: number;
  tilt?: number;
  turn?: number;
  roll?: number;
  perspective?: number;
  depth?: number;
  speed?: number;
  direction?: 'up' | 'down';
  variance?: number;
  parallax?: number;
  pauseOnHover?: boolean;
  lift?: number;
  fade?: number;
  dim?: number;
  grayscale?: boolean;
  overlayColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

const DEFAULT_ITEMS: DriftWallItem[] = [
  {
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600',
    title: '300 GSM Heavyweight Fit',
    author: 'Ananya Roy',
    quote: 'The heavyweight cotton tee has an unbelievable drape.'
  },
  {
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=600',
    title: 'Pure Luxury Tailoring',
    author: 'Karan Sharma',
    quote: 'Minimalist aesthetic and world class tactile depth.'
  },
  {
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=600',
    title: 'Express Delivery 10/10',
    author: 'Siddharth Mehta',
    quote: 'Exquisite eco-conscious packaging and quality.'
  },
  {
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600',
    title: 'Perfect Boxy Cut',
    author: 'Natasha Kapoor',
    quote: 'Oversized silhouette fits like a dream.'
  },
  {
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
    title: 'Redefined Indian Streetwear',
    author: 'Dev Patel',
    quote: 'Incredible craftsmanship and premium fabric weight.'
  },
  {
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
    title: 'Effortlessly Chic',
    author: 'Rhea Nair',
    quote: 'Breathable, structured, and constantly complimented.'
  },
  {
    image: '/images/pexels-pavel-danilyuk-5789582.jpg',
    title: 'Tactile Excellence',
    author: 'Kabir Varma',
    quote: 'Clean architecture and flawless drape.'
  },
  {
    image: '/images/pexels-cottonbro-6153374.jpg',
    title: 'Urban Essentials',
    author: 'Meera Sengupta',
    quote: 'Heavyweight cotton that stays structured.'
  },
  {
    image: '/images/pexels-tima-miroshnichenko-5560195.jpg',
    title: 'Bespoke Couture',
    author: 'Aarav Shah',
    quote: 'Quiet luxury done right.'
  },
  {
    image: '/images/pexels-godisable-jacob-226636-896289.jpg',
    title: 'Ethical Quality',
    author: 'Priya Iyer',
    quote: 'Love the sustainable craft promise.'
  },
  {
    image: '/images/pexels-michael-obstoj-1772571864-33549629.jpg',
    title: 'Maison Standard',
    author: 'Rohan Joshi',
    quote: 'Impeccable fitting and premium fabric.'
  },
  {
    image: '/images/23.avif',
    title: 'Black Edition',
    author: 'Zain Khan',
    quote: 'Monochrome techwear at its finest.'
  },
  {
    image: '/images/about-hero-full.jpg',
    title: 'Quiet Confidence',
    author: 'Tanya Malik',
    quote: 'Sophisticated silhouettes for modern wardrobe.'
  },
  {
    image: '/images/about-hero-editorial.png',
    title: 'Summer-Style Look',
    author: 'Esha Malhotra',
    quote: 'Outstanding back detail and finish.'
  },
  {
    image: '/images/about-hero-group.jpg',
    title: 'Maison Crew Vibe',
    author: 'Aditya Rao',
    quote: 'Minimalist street aesthetic done right.'
  }
];

const cx = (...parts: (string | boolean | undefined | null)[]) => parts.filter(Boolean).join(' ');

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const columnFactor = (index: number, variance: number) => {
  const pseudo = ((index * 0.6180339887 + 0.35) % 1) * 2 - 1;
  return 1 + variance * pseudo;
};

export const DriftWall: React.FC<DriftWallProps> = ({
  items = DEFAULT_ITEMS,
  columns = 5,
  tileWidth = 200,
  tileHeight = 132,
  gap = 18,
  radius = 14,
  tilt = 16,
  turn = -14,
  roll = 0,
  perspective = 1200,
  depth = 120,
  speed = 36,
  direction = 'up',
  variance = 0.45,
  parallax = 0.6,
  pauseOnHover = false,
  lift = 64,
  fade = 0.55,
  dim = 0.65,
  grayscale = false,
  overlayColor = '#121214',
  className = '',
  style
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const planeRef = useRef<HTMLDivElement | null>(null);
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);

  const offsetsRef = useRef<number[]>([]);
  const velocitiesRef = useRef<number[]>([]);
  const hoveredColRef = useRef<number>(-1);
  const wallHoveredRef = useRef<boolean>(false);
  const pointerRef = useRef({ x: 0, y: 0 });
  const pointerDampedRef = useRef({ x: 0, y: 0 });
  const lastTsRef = useRef<number | null>(null);

  const [containerHeight, setContainerHeight] = useState(600);
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeIdRef = useRef<string | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const columnItems = useMemo(() => {
    const cols: DriftWallItem[][] = Array.from({ length: columns }, () => []);
    items.forEach((item, i) => cols[i % columns].push(item));
    return cols.map(col => (col.length ? col : items.slice(0, 1)));
  }, [items, columns]);

  const columnMeta = useMemo(() => {
    const unit = tileHeight + gap;
    return columnItems.map(col => {
      const copyHeight = Math.max(unit, col.length * unit);
      const copies = Math.max(2, Math.ceil((containerHeight * 1.6) / copyHeight) + 1);
      return { copyHeight, copies };
    });
  }, [columnItems, tileHeight, gap, containerHeight]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerHeight(entry.contentRect.height || 600);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const baseVelocities = useMemo(() => {
    const dirSign = direction === 'up' ? 1 : -1;
    return columnItems.map((_, c) => {
      const altSign = c % 2 === 0 ? 1 : -1;
      return speed * columnFactor(c, variance) * dirSign * altSign;
    });
  }, [columnItems, speed, direction, variance]);

  useEffect(() => {
    offsetsRef.current = columnMeta.map((meta, c) => meta.copyHeight * ((c * 0.37) % 1));
    velocitiesRef.current = columnItems.map(() => 0);
  }, [columnMeta, columnItems]);

  const applyPlaneTransform = useCallback(
    (px: number, py: number) => {
      const plane = planeRef.current;
      if (!plane) return;
      plane.style.transform =
        `translate(-50%, -50%) scale(1.15) ` +
        `rotateX(${tilt + py}deg) rotateY(${turn + px}deg) rotateZ(${roll}deg) ` +
        `translateZ(${-depth}px)`;
    },
    [tilt, turn, roll, depth]
  );

  useEffect(() => {
    const animate = (ts: number) => {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = Math.min(0.05, Math.max(0, ts - lastTsRef.current) / 1000);
      lastTsRef.current = ts;

      const maxTilt = parallax * 8;
      const targetX = pointerRef.current.x * maxTilt;
      const targetY = -pointerRef.current.y * maxTilt;
      const damp = 1 - Math.exp(-dt / 0.12);
      pointerDampedRef.current.x += (targetX - pointerDampedRef.current.x) * damp;
      pointerDampedRef.current.y += (targetY - pointerDampedRef.current.y) * damp;
      applyPlaneTransform(pointerDampedRef.current.x, pointerDampedRef.current.y);

      if (!reduced) {
        for (let c = 0; c < trackRefs.current.length; c++) {
          const meta = columnMeta[c];
          if (!meta) continue;
          const paused = wallHoveredRef.current && pauseOnHover;
          const factor = paused || hoveredColRef.current === c ? 0 : 1;
          const target = baseVelocities[c] * factor;

          const ease = 1 - Math.exp(-dt / (target === 0 ? 0.16 : 0.28));
          velocitiesRef.current[c] += (target - velocitiesRef.current[c]) * ease;
          let next = (offsetsRef.current[c] ?? 0) + velocitiesRef.current[c] * dt;
          next = ((next % meta.copyHeight) + meta.copyHeight) % meta.copyHeight;
          offsetsRef.current[c] = next;

          const el = trackRefs.current[c];
          if (el) el.style.transform = `translate3d(0, ${-next}px, 0)`;
        }
      } else {
        for (let c = 0; c < trackRefs.current.length; c++) {
          const el = trackRefs.current[c];
          const meta = columnMeta[c];
          if (el && meta) el.style.transform = `translate3d(0, ${-(offsetsRef.current[c] ?? 0)}px, 0)`;
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [baseVelocities, columnMeta, pauseOnHover, parallax, reduced, applyPlaneTransform]);

  const activate = useCallback((id: string, index: number) => {
    activeIdRef.current = id;
    hoveredColRef.current = index;
    setActiveId(id);
  }, []);

  const release = useCallback(() => {
    activeIdRef.current = null;
    hoveredColRef.current = -1;
    setActiveId(null);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      if (parallax > 0 && !reduced) {
        pointerRef.current = {
          x: (e.clientX - rect.left) / rect.width - 0.5,
          y: (e.clientY - rect.top) / rect.height - 0.5
        };
      }
      const hit = document.elementFromPoint(e.clientX, e.clientY);
      const tile = hit && hit.closest ? (hit.closest('[data-tile-id]') as HTMLElement | null) : null;
      if (!tile) return;
      const id = tile.dataset.tileId;
      if (!id || id === activeIdRef.current) return;
      activeIdRef.current = id;
      hoveredColRef.current = Number(tile.dataset.col);
      setActiveId(id);
    },
    [parallax, reduced]
  );

  const handlePointerLeaveWall = useCallback(() => {
    wallHoveredRef.current = false;
    pointerRef.current = { x: 0, y: 0 };
    release();
  }, [release]);

  const maskStyle =
    'radial-gradient(ellipse 78% 82% at 50% 46%, #000 var(--dw-edge), transparent 100%), ' +
    'linear-gradient(to top, #000 var(--dw-edge), transparent 100%)';

  const cssVars = useMemo(
    () => ({
      '--dw-tile-w': `${tileWidth}px`,
      '--dw-tile-h': `${tileHeight}px`,
      '--dw-gap': `${gap}px`,
      '--dw-radius': `${radius}px`,
      '--dw-lift': `${lift}px`,
      '--dw-dim': dim,
      '--dw-gray': grayscale ? 1 : 0,
      '--dw-overlay': overlayColor,
      '--dw-edge': `${Math.max(0, (1 - fade) * 100)}%`,
      perspective: `${perspective}px`,
      perspectiveOrigin: '50% 50%',
      WebkitMaskImage: maskStyle,
      maskImage: maskStyle,
      WebkitMaskComposite: 'source-in',
      maskComposite: 'intersect',
      ...style
    }) as React.CSSProperties,
    [tileWidth, tileHeight, gap, radius, lift, dim, grayscale, overlayColor, fade, perspective, maskStyle, style]
  );

  const renderTile = (item: DriftWallItem, id: string, colIndex: number) => {
    const isActive = activeId === id;
    
    const tileStyle: React.CSSProperties = {
      position: 'relative',
      display: 'block',
      flex: 'none',
      cursor: 'pointer',
      outline: 'none',
      width: '100%',
      height: 'calc(var(--dw-tile-h) + var(--dw-gap))',
      transformStyle: 'preserve-3d'
    };

    const innerStyle: React.CSSProperties = {
      pointerEvents: 'none',
      position: 'absolute',
      inset: 'calc(var(--dw-gap)/2)',
      display: 'block',
      overflow: 'hidden',
      backgroundColor: '#0b0b12',
      borderRadius: 'var(--dw-radius)',
      opacity: isActive ? 1 : dim,
      transform: isActive ? 'translateZ(var(--dw-lift))' : 'translateZ(0px)',
      boxShadow: isActive ? '0 24px 60px -18px rgba(0,0,0,0.85), 0 0 20px rgba(212, 175, 55, 0.3)' : '0 10px 30px rgba(0,0,0,0.2)',
      transition: 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1), opacity 420ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 420ms cubic-bezier(0.22, 1, 0.36, 1)'
    };

    const imgStyle: React.CSSProperties = {
      display: 'block',
      height: '100%',
      width: '100%',
      userSelect: 'none',
      objectFit: 'cover',
      filter: isActive ? 'grayscale(0) saturate(1.08)' : (grayscale ? 'grayscale(1) saturate(0.8)' : 'grayscale(0) saturate(0.95)'),
      transition: 'filter 420ms cubic-bezier(0.22, 1, 0.36, 1)'
    };

    const overlayStyle: React.CSSProperties = {
      pointerEvents: 'none',
      position: 'absolute',
      inset: 0,
      backgroundColor: overlayColor,
      opacity: isActive ? 0 : 0.42,
      transition: 'opacity 420ms cubic-bezier(0.22, 1, 0.36, 1)'
    };

    const captionStyle: React.CSSProperties = {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: '12px 14px',
      background: 'linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.85) 100%)',
      color: '#FFFFFF',
      opacity: isActive ? 1 : 0.75,
      transition: 'opacity 300ms ease'
    };

    const inner = (
      <span style={innerStyle}>
        <img
          src={item.image}
          alt={item.title ?? ''}
          loading="lazy"
          decoding="async"
          draggable={false}
          style={imgStyle}
        />
        <span style={overlayStyle} aria-hidden="true" />
        
        {(item.title || item.author || item.quote) && (
          <div style={captionStyle}>
            {item.title && (
              <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2 }}>
                {item.title}
              </span>
            )}
            {item.author && (
              <span style={{ display: 'block', fontSize: '0.7rem', color: '#D4AF37', fontWeight: 700, marginTop: '2px' }}>
                ★ ★ ★ ★ ★ — {item.author}
              </span>
            )}
          </div>
        )}
      </span>
    );

    const commonProps = {
      style: tileStyle,
      'data-tile-id': id,
      'data-col': colIndex,
      onFocus: () => activate(id, colIndex),
      onBlur: release
    };

    if (item.href) {
      return (
        <a key={id} href={item.href} target="_blank" rel="noreferrer noopener" {...commonProps}>
          {inner}
        </a>
      );
    }
    return (
      <div key={id} tabIndex={0} role="button" aria-label={item.title ?? 'tile'} {...commonProps}>
        {inner}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={cx('relative h-full w-full overflow-hidden', className)}
      style={cssVars}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => {
        wallHoveredRef.current = true;
      }}
      onPointerLeave={handlePointerLeaveWall}
      role="group"
      aria-label="Drifting wall of tiles"
    >
      <div
        ref={planeRef}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          display: 'flex',
          flexDirection: 'row',
          cursor: 'pointer',
          transformStyle: 'preserve-3d',
          transformOrigin: '50% 50%',
          willChange: 'transform'
        }}
      >
        {columnItems.map((col, c) => {
          const meta = columnMeta[c];
          const copies = Array.from({ length: meta.copies });
          return (
            <div
              key={`col-${c}`}
              style={{
                position: 'relative',
                width: 'calc(var(--dw-tile-w) + var(--dw-gap))',
                transformStyle: 'preserve-3d'
              }}
            >
              <div
                ref={el => { trackRefs.current[c] = el; }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  transformStyle: 'preserve-3d',
                  willChange: 'transform'
                }}
              >
                {copies.map((_, copyIndex) =>
                  col.map((item, itemIndex) => renderTile(item, `${c}-${copyIndex}-${itemIndex}`, c))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DriftWall;
