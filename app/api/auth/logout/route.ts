import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  
  // Find the WordPress logged-in cookie
  const wpCookie = allCookies.find(c => c.name.startsWith('wordpress_logged_in_'));

  const response = NextResponse.json({ success: true }, { status: 200 });

  if (wpCookie) {
    // Delete the cookie by setting it with an expired maxAge
    response.cookies.delete(wpCookie.name);
  }

  return response;
}
