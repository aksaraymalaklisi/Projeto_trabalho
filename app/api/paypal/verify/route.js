import { NextRequest, NextResponse } from 'next/server';

export async function POST(req) {
  const body = await req.json();
  const { orderID } = body;
  if (!orderID) {
    return NextResponse.json({ error: 'Missing orderID' }, { status: 400 });
  }

  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const base = process.env.PAYPAL_API_BASE || 'https://api-m.sandbox.paypal.com';

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: 'PayPal credentials not set' }, { status: 500 });
  }

  // Get access token
  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  let accessToken;
  try {
    const tokenRes = await fetch(`${base}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    const tokenData = await tokenRes.json();
    accessToken = tokenData.access_token;
  } catch (err) {
    return NextResponse.json({ error: 'Failed to get PayPal access token' }, { status: 500 });
  }

  // Verify order
  try {
    const verifyRes = await fetch(`${base}/v2/checkout/orders/${orderID}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    const orderData = await verifyRes.json();
    if (orderData.status === 'COMPLETED') {
      return NextResponse.json({ verified: true, order: orderData });
    } else {
      return NextResponse.json({ verified: false, order: orderData });
    }
  } catch (err) {
    return NextResponse.json({ error: 'Failed to verify order' }, { status: 500 });
  }
}
