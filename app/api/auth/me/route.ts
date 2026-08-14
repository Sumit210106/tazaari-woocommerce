import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    
    // Find the WordPress logged-in cookie
    const wpCookie = allCookies.find(c => c.name.startsWith('wordpress_logged_in_'));

    if (!wpCookie) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Format the cookie to send back to WordPress REST API
    const cookieHeader = `${wpCookie.name}=${wpCookie.value}`;

    // Fetch the user's profile from WooCommerce API
    // We use the standard /wp/v2/users/me endpoint which requires cookie auth
    // Wait, the REST API requires a nonce for cookie auth if the request is not GET, 
    // but for GET /wp/v2/users/me it might work. If it requires a nonce, we can also use /wc-api/cart to check session.
    // Actually, WooCommerce Store API /wc/store/v1/cart/update-customer or similar can fetch customer details if logged in.
    // Let's just fetch the standard WooCommerce Store API cart and see the billing_address!
    
    const wpResponse = await fetch('https://tazaari.com/wp-json/wp/v2/users/me?context=edit', {
      headers: {
        'Cookie': cookieHeader,
        // The REST API uses X-WP-Nonce for CSRF. Without a nonce, cookie auth is often rejected.
        // If it is rejected, we will fallback to fetching from /wc/store/v1/cart.
      },
      cache: 'no-store'
    });

    if (!wpResponse.ok) {
      // Fallback: The REST API might block cookie auth without a nonce.
      // The Store API doesn't require a nonce for GET requests!
      const storeResponse = await fetch('https://tazaari.com/wp-json/wc/store/v1/cart', {
        headers: { 'Cookie': cookieHeader },
        cache: 'no-store'
      });
      
      if (!storeResponse.ok) {
         return NextResponse.json({ authenticated: false }, { status: 401 });
      }

      const storeData = await storeResponse.json();
      
      // If the cart doesn't have an email in the billing address, we might not have full user details,
      // but if the cart session is recognized, they are logged in.
      // We can just return basic data.
      return NextResponse.json({
        authenticated: true,
        user: {
          id: storeData.billing_address?.email || 'user',
          email: storeData.billing_address?.email || '',
          first_name: storeData.billing_address?.first_name || '',
          last_name: storeData.billing_address?.last_name || '',
          billing: storeData.billing_address,
          shipping: storeData.shipping_address,
        }
      });
    }

    const userData = await wpResponse.json();

    return NextResponse.json({
      authenticated: true,
      user: {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        avatar: userData.avatar_urls?.['96'],
      }
    });

  } catch (error) {
    return NextResponse.json({ authenticated: false, error: 'Internal server error.' }, { status: 500 });
  }
}
