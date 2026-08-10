import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const formData = new URLSearchParams();
    formData.append('log', email);
    formData.append('pwd', password);
    formData.append('rememberme', 'forever');

    // Attempt to log into WordPress natively
    const wpResponse = await fetch('https://tazaari.com/wp-login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
      redirect: 'manual', // Prevent following the 302 redirect so we can read the cookies
      cache: 'no-store'
    });

    // Check if WordPress issued a login cookie
    const setCookieHeaders = wpResponse.headers.getSetCookie();
    
    // Look for the primary wordpress_logged_in cookie
    const loggedInCookieStr = setCookieHeaders.find(c => c.startsWith('wordpress_logged_in_'));

    if (!loggedInCookieStr) {
      // If no cookie was issued, the login failed (likely invalid credentials)
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // Parse the cookie string to extract just the name and value
    // e.g. "wordpress_logged_in_xyz=abc; path=/; secure; HttpOnly"
    const [cookieKeyValue] = loggedInCookieStr.split(';');
    const separatorIdx = cookieKeyValue.indexOf('=');
    const cookieName = cookieKeyValue.slice(0, separatorIdx).trim();
    const cookieValue = cookieKeyValue.slice(separatorIdx + 1).trim();

    // Create the successful response
    const response = NextResponse.json({ success: true }, { status: 200 });

    // Apply the exact WordPress session cookie to the user's browser securely
    response.cookies.set({
      name: cookieName,
      value: cookieValue,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 14, // 14 days
    });

    return response;

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
