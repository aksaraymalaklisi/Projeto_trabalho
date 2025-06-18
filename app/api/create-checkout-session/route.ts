import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest) {
  try {
    const { amount, currency, mode } = await req.json();

    if (!amount || !currency) {
      return NextResponse.json({ error: 'Dados insuficientes.' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: 'Pacote de Logo',
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: mode || 'payment',
      success_url: process.env.NEXT_PUBLIC_SUCCESS_URL || 'http://localhost:3000/congratulations',
      cancel_url: process.env.NEXT_PUBLIC_CANCEL_URL || 'http://localhost:3000/',
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error('Erro ao criar sessão de checkout:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 