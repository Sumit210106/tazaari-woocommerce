// ============================================================
// WooCommerce Store API v1 – Service Layer
// Base: https://tazaari.com/wp-json/wc/store/v1
// ============================================================

import type { WooProduct, NormalizedProduct } from '../types/product';
import { normalizeProduct } from '../types/product';

// In dev, Vite proxies /wc-api → https://tazaari.com/wp-json/wc/store/v1
// In production, call the real URL directly (CORS is allowed from the same domain)
const BASE_URL = import.meta.env.DEV
  ? '/wc-api'
  : 'https://tazaari.com/wp-json/wc/store/v1';

/** Query params accepted by the products endpoint */
export interface FetchProductsParams {
  /** Page number (1-indexed) */
  page?: number;
  /** Number of products per page (max 100) */
  per_page?: number;
  /** Category slug to filter by */
  category?: string;
  /** Search query string */
  search?: string;
  /** Sort field: 'date' | 'rating' | 'popularity' | 'price' */
  orderby?: 'date' | 'rating' | 'popularity' | 'price';
  /** Sort direction */
  order?: 'asc' | 'desc';
  /** Tag slug to filter by */
  tag?: string;
  /** Comma-separated product IDs to fetch */
  include?: string;
}

/** Response returned by fetchProducts */
export interface ProductsResponse {
  products: NormalizedProduct[];
  total: number;
  totalPages: number;
  currentPage: number;
}

/** Build query string from params object */
function buildQuery(params: Record<string, string | number | undefined>): string {
  const q = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
  return q ? `?${q}` : '';
}

/** Fetch a paginated, filtered list of products */
export async function fetchProducts(params: FetchProductsParams = {}): Promise<ProductsResponse> {
  const {
    page = 1,
    per_page = 12,
    category,
    search,
    orderby,
    order,
    tag,
    include,
  } = params;

  const query = buildQuery({ page, per_page, category, search, orderby, order, tag, include });
  const url = `${BASE_URL}/products${query}`;

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
    },
    // cache for 5 minutes to avoid spamming the API on rapid tab switches
    cache: 'default',
  });

  if (!response.ok) {
    throw new Error(`WooCommerce API error: ${response.status} ${response.statusText}`);
  }

  const total = parseInt(response.headers.get('X-WP-Total') || '0', 10);
  const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1', 10);

  const raw: WooProduct[] = await response.json();
  const products = raw.map(normalizeProduct);

  return { products, total, totalPages, currentPage: page };
}

/** Fetch a single product by numeric ID */
export async function fetchProduct(id: number | string): Promise<NormalizedProduct> {
  const url = `${BASE_URL}/products/${id}`;
  const response = await fetch(url, {
    headers: { 'Accept': 'application/json' },
    cache: 'default',
  });

  if (!response.ok) {
    throw new Error(`WooCommerce API error: ${response.status} ${response.statusText}`);
  }

  const raw: WooProduct = await response.json();
  return normalizeProduct(raw);
}

/** Fetch all product categories */
export interface WooStoreCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent: number;
  count: number;
}

export async function fetchCategories(): Promise<WooStoreCategory[]> {
  const url = `${BASE_URL}/product-categories?per_page=100&hide_empty=true`;
  const response = await fetch(url, {
    headers: { 'Accept': 'application/json' },
    cache: 'default',
  });

  if (!response.ok) {
    throw new Error(`WooCommerce API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
