// ============================================================
// WooCommerce Store API v1 – Product Types
// https://tazaari.com/wp-json/wc/store/v1/products
// ============================================================

/** Raw image shape from the API */
export interface WooImage {
  id: number;
  src: string;
  thumbnail: string;
  srcset: string;
  sizes: string;
  name: string;
  alt: string;
}

/** Raw category from the API */
export interface WooCategory {
  id: number;
  name: string;
  slug: string;
  link: string;
}

/** Raw attribute term (e.g. Size: S, M, L) */
export interface WooAttributeTerm {
  id: number;
  name: string;
  slug: string;
}

/** Raw attribute from the API */
export interface WooAttribute {
  id: number;
  name: string;
  taxonomy: string;
  has_variations: boolean;
  terms: WooAttributeTerm[];
}

/** Raw prices block from the API (amounts are in smallest currency unit, i.e. paise) */
export interface WooPrices {
  price: string;
  regular_price: string;
  sale_price: string;
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
  currency_prefix: string;
  currency_suffix: string;
}

/** The raw product shape returned by `wc/store/v1/products` */
export interface WooProduct {
  id: number;
  name: string;
  slug: string;
  parent: number;
  type: string;
  permalink: string;
  sku: string;
  short_description: string;
  description: string;
  on_sale: boolean;
  prices: WooPrices;
  price_html: string;
  average_rating: string;
  review_count: number;
  images: WooImage[];
  categories: WooCategory[];
  attributes: WooAttribute[];
  is_purchasable: boolean;
  is_in_stock: boolean;
  is_on_backorder: boolean;
  low_stock_remaining: number | null;
}

// ============================================================
// Normalized product – the internal shape used by the app
// ============================================================

export interface NormalizedProduct {
  id: string;           // stringified numeric id
  name: string;
  slug: string;
  category: string;     // first category slug
  categories: WooCategory[];
  price: number;        // in major currency unit (₹)
  originalPrice: number;
  onSale: boolean;
  rating: number;
  reviewsCount: number;
  images: string[];     // array of src URLs
  thumbnails: string[]; // array of thumbnail URLs
  imageSrcsets: string[]; // for SEO / responsive loading
  imageAlts: string[];
  sizes: string[];
  description: string;
  shortDescription: string;
  permalink: string;
  sku: string;
  inStock: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
}

// ============================================================
// Mapper function: WooProduct → NormalizedProduct
// ============================================================

/** Decode HTML entities (like &#8211;, &amp;, etc.) to standard text characters */
const decodeHtml = (str: string): string => {
  if (!str) return '';
  return str
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec))
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
};

/** Strip HTML tags from a string and decode entities */
const stripHtml = (html: string): string => {
  if (!html) return '';
  const clean = html.replace(/<[^>]*>/g, '').trim();
  return decodeHtml(clean);
};

/** Convert paise string to rupee number */
const parsePaise = (paise: string, minorUnit: number): number => {
  const num = parseInt(paise || '0', 10);
  return num / Math.pow(10, minorUnit);
};

export function normalizeProduct(raw: WooProduct): NormalizedProduct {
  const minorUnit = raw.prices.currency_minor_unit ?? 2;

  // Parse sizes from attributes
  const sizeAttr = raw.attributes.find(a => a.name.toLowerCase() === 'size');
  const sizes = sizeAttr ? sizeAttr.terms.map(t => t.name.toUpperCase()) : [];

  // Derive category slug (first category)
  const primaryCategorySlug = raw.categories.length > 0
    ? raw.categories[0].slug
    : 'all';

  // Determine if new arrival by category slug
  const isNewArrival = raw.categories.some(c => c.slug === 'new-arrivals');

  return {
    id: String(raw.id),
    name: decodeHtml(raw.name),
    slug: raw.slug,
    category: primaryCategorySlug,
    categories: raw.categories,
    price: parsePaise(raw.prices.price, minorUnit),
    originalPrice: parsePaise(raw.prices.regular_price, minorUnit),
    onSale: raw.on_sale,
    rating: parseFloat(raw.average_rating) || 0,
    reviewsCount: raw.review_count,
    images: raw.images.map(img => img.src),
    thumbnails: raw.images.map(img => img.thumbnail),
    imageSrcsets: raw.images.map(img => img.srcset),
    imageAlts: raw.images.map(img => img.alt || raw.name),
    sizes,
    description: raw.description,
    shortDescription: stripHtml(raw.short_description),
    permalink: raw.permalink,
    sku: raw.sku,
    inStock: raw.is_in_stock,
    isNewArrival,
    isBestSeller: false, // not available from store API; can be tagged in WP
  };
}

// Re-export as Product alias for backward compatibility in CartContext
export type Product = NormalizedProduct;
