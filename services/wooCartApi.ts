// ============================================================
// WooCommerce Store API v1 – Cart & Checkout Service Layer
// All requests proxied via Next.js rewrites: /wc-api → tazaari.com
// ============================================================

const BASE_URL = '/wc-api';

// ---------------------------------------------------------------------------
// Session Management (Nonce + Cart-Token)
// ---------------------------------------------------------------------------

/** Module-level nonce — refreshed from every API response */
let _nonce: string = '';

/** Cart-Token persisted in localStorage for headless session identity */
function getCartToken(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('wc_cart_token') || '';
}

function saveCartToken(token: string): void {
  if (typeof window !== 'undefined' && token) {
    localStorage.setItem('wc_cart_token', token);
  }
}

/** Clear the cart token (call after successful order placement) */
export function clearCartToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('wc_cart_token');
  }
}

/** Build common headers for every request */
function baseHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
  const token = getCartToken();
  console.log('[wooCartApi] Using Cart-Token for request:', token);
  if (token) headers['Cart-Token'] = token;
  if (_nonce) headers['Nonce'] = _nonce;
  return headers;
}

/** Extract and store the nonce and cart token from every response */
function captureHeaders(response: Response): void {
  const nonce = response.headers.get('Nonce') || response.headers.get('nonce');
  console.log('[wooCartApi] Captured Nonce:', nonce);
  if (nonce) {
    _nonce = nonce;
  }
  const cartToken = response.headers.get('Cart-Token') || response.headers.get('cart-token');
  console.log('[wooCartApi] Captured Cart-Token:', cartToken);
  if (cartToken) {
    saveCartToken(cartToken);
  }
}

// ---------------------------------------------------------------------------
// Generic request wrapper with auto-retry on nonce expiry
// ---------------------------------------------------------------------------

interface WcApiError {
  code: string;
  message: string;
  data?: { status?: number };
}

async function wcFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  _retried = false
): Promise<T> {
  // Cache-busting for GET requests to bypass LiteSpeed/CDN cache
  const isGet = !options.method || options.method.toUpperCase() === 'GET';
  const cacheBuster = isGet ? `${endpoint.includes('?') ? '&' : '?'}nocache=${Date.now()}` : '';
  const url = `${BASE_URL}${endpoint}${cacheBuster}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...baseHeaders(),
      ...(options.headers as Record<string, string> || {}),
    },
    // Never cache cart/checkout requests locally
    cache: 'no-store',
    // Send cookies (required for WC sessions)
    credentials: 'include',
  });

  captureHeaders(response);

  if (!response.ok) {
    // On 403 nonce-expired, refresh nonce and retry once
    if (response.status === 403 && !_retried) {
      // Fetch cart to get a fresh nonce
      const refreshRes = await fetch(`${BASE_URL}/cart?nocache=${Date.now()}`, {
        headers: baseHeaders(),
        cache: 'no-store',
        credentials: 'include',
      });
      captureHeaders(refreshRes);
      // Retry the original request
      return wcFetch<T>(endpoint, options, true);
    }

    let errorBody: WcApiError;
    try {
      errorBody = await response.json();
    } catch {
      errorBody = { code: 'unknown', message: response.statusText };
    }
    throw new WooCommerceCartError(
      errorBody.message || `API error: ${response.status}`,
      errorBody.code,
      response.status
    );
  }

  return response.json();
}

/** Typed error class for WooCommerce API failures */
export class WooCommerceCartError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = 'WooCommerceCartError';
    this.code = code;
    this.status = status;
  }
}

// ---------------------------------------------------------------------------
// WooCommerce Cart Types
// ---------------------------------------------------------------------------

export interface WcCartItemImage {
  id: number;
  src: string;
  thumbnail: string;
  name: string;
  alt: string;
}

export interface WcCartItemPrices {
  price: string;
  regular_price: string;
  sale_price: string;
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
  currency_prefix: string;
  currency_suffix: string;
}

export interface WcCartItem {
  key: string;
  id: number;
  quantity: number;
  name: string;
  short_description: string;
  sku: string;
  permalink: string;
  images: WcCartItemImage[];
  prices: WcCartItemPrices;
  totals: {
    line_subtotal: string;
    line_total: string;
    currency_code: string;
    currency_minor_unit: number;
  };
  variation: Array<{ attribute: string; value: string }>;
  item_data: Array<{ name: string; value: string }>;
}

export interface WcCoupon {
  code: string;
  discount_type: string;
  totals: {
    total_discount: string;
    currency_code: string;
    currency_minor_unit: number;
  };
}

export interface WcShippingRate {
  rate_id: string;
  name: string;
  description: string;
  price: string;
  currency_code: string;
  currency_minor_unit: number;
  selected: boolean;
  method_id: string;
  instance_id: number;
}

export interface WcShippingPackage {
  package_id: number;
  name: string;
  destination: {
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  items: Array<{ key: string; name: string; quantity: number }>;
  shipping_rates: WcShippingRate[];
}

export interface WcCartTotals {
  total_items: string;
  total_items_tax: string;
  total_shipping: string;
  total_shipping_tax: string;
  total_discount: string;
  total_discount_tax: string;
  total_tax: string;
  total_price: string;
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
  currency_prefix: string;
  currency_suffix: string;
}

export interface WcCart {
  items: WcCartItem[];
  coupons: WcCoupon[];
  shipping_rates: WcShippingPackage[];
  totals: WcCartTotals;
  items_count: number;
  items_weight: number;
  needs_payment: boolean;
  needs_shipping: boolean;
}

// ---------------------------------------------------------------------------
// Cart API Functions
// ---------------------------------------------------------------------------

/** GET /cart — Fetch the full cart state */
export async function getCart(): Promise<WcCart> {
  return wcFetch<WcCart>('/cart');
}

/** POST /cart/add-item — Add a product to the cart */
export async function addItem(
  id: number,
  quantity: number = 1,
  variation?: Array<{ attribute: string; value: string }>
): Promise<WcCart> {
  const body: Record<string, unknown> = { id, quantity };
  if (variation && variation.length > 0) {
    body.variation = variation;
  }
  return wcFetch<WcCart>('/cart/add-item', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/** POST /cart/remove-item — Remove an item from the cart by its key */
export async function removeItem(key: string): Promise<WcCart> {
  return wcFetch<WcCart>('/cart/remove-item', {
    method: 'POST',
    body: JSON.stringify({ key }),
  });
}

/** POST /cart/update-item — Update quantity of a cart item */
export async function updateItem(key: string, quantity: number): Promise<WcCart> {
  return wcFetch<WcCart>('/cart/update-item', {
    method: 'POST',
    body: JSON.stringify({ key, quantity }),
  });
}

/** POST /cart/apply-coupon — Apply a coupon code */
export async function applyCoupon(code: string): Promise<WcCart> {
  return wcFetch<WcCart>('/cart/apply-coupon', {
    method: 'POST',
    body: JSON.stringify({ code: code.trim().toUpperCase() }),
  });
}

/** POST /cart/remove-coupon — Remove an applied coupon */
export async function removeCoupon(code: string): Promise<WcCart> {
  return wcFetch<WcCart>('/cart/remove-coupon', {
    method: 'POST',
    body: JSON.stringify({ code }),
  });
}

// ---------------------------------------------------------------------------
// Address Types
// ---------------------------------------------------------------------------

export interface WcAddress {
  first_name: string;
  last_name: string;
  company?: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email?: string;
  phone?: string;
}

/** POST /cart/update-customer — Set billing/shipping addresses */
export async function updateCustomer(
  billing: WcAddress,
  shipping?: WcAddress
): Promise<WcCart> {
  return wcFetch<WcCart>('/cart/update-customer', {
    method: 'POST',
    body: JSON.stringify({
      billing_address: billing,
      shipping_address: shipping || billing,
    }),
  });
}

/** POST /cart/select-shipping-rate — Choose a shipping method */
export async function selectShippingRate(
  packageId: number,
  rateId: string
): Promise<WcCart> {
  return wcFetch<WcCart>('/cart/select-shipping-rate', {
    method: 'POST',
    body: JSON.stringify({
      package_id: packageId,
      rate_id: rateId,
    }),
  });
}

// ---------------------------------------------------------------------------
// Checkout Types & Functions
// ---------------------------------------------------------------------------

export interface WcPaymentMethod {
  id: string;
  title: string;
  description: string;
}

export interface WcCheckoutResponse {
  order_id: number;
  status: string;
  order_key: string;
  customer_note: string;
  billing_address: WcAddress;
  shipping_address: WcAddress;
  payment_method: string;
  payment_result?: {
    payment_status: string;
    payment_details: Array<{ key: string; value: string }>;
    redirect_url?: string;
  };
}

export interface WcCheckoutDraft {
  order_id: number;
  status: string;
  billing_address: WcAddress;
  shipping_address: WcAddress;
  payment_methods: WcPaymentMethod[];
}

/** GET /checkout — Get draft order data and available payment methods */
export async function getCheckout(): Promise<WcCheckoutDraft> {
  return wcFetch<WcCheckoutDraft>('/checkout');
}

export interface CheckoutPayload {
  billing_address: WcAddress;
  shipping_address: WcAddress;
  payment_method: string;
  create_account?: boolean;
  customer_note?: string;
  payment_data?: Array<{ key: string; value: string }>;
}

/** POST /checkout — Process checkout and place the order */
export async function processCheckout(payload: CheckoutPayload): Promise<WcCheckoutResponse> {
  return wcFetch<WcCheckoutResponse>('/checkout', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ---------------------------------------------------------------------------
// Helper: Convert minor-unit string to major-unit number
// ---------------------------------------------------------------------------

/** Convert a WooCommerce price string (in minor units) to a display number */
export function wcPriceToNumber(priceStr: string, minorUnit: number): number {
  const num = parseInt(priceStr || '0', 10);
  return num / Math.pow(10, minorUnit);
}
