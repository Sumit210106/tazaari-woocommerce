import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const consumerKey = process.env.WC_CONSUMER_KEY;
    const consumerSecret = process.env.WC_CONSUMER_SECRET;

    if (!consumerKey || !consumerSecret) {
      return NextResponse.json(
        { error: 'Registration is currently unavailable (API keys missing on server).' },
        { status: 500 }
      );
    }

    // Prepare WooCommerce customer data
    const customerData = {
      email,
      password,
      first_name: firstName || '',
      last_name: lastName || '',
      username: email.split('@')[0], // Generate a default username from email
    };

    // Authenticate with WooCommerce REST API using Consumer Key & Secret (Basic Auth)
    const authHeader = 'Basic ' + Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

    const response = await fetch('https://tazaari.com/wp-json/wc/v3/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(customerData),
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to create account.' },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, customerId: data.id }, { status: 201 });

  } catch (error) {
    console.error('Registration API error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
