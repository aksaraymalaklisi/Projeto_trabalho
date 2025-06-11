import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

// Removido: chamada inválida de await stripe.checkout.sessions.create fora do handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { amount, currency = 'brl' } = req.body;
    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: 'Valor (amount) inválido ou não fornecido' });
    }
    const amountInCents = Math.round(Number(amount) * 100);

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) throw new Error('Stripe secret key não configurada.');

    const stripe = new Stripe(stripeSecretKey, { apiVersion: '2025-05-28.basil' });

    const baseUrl = req.headers.origin || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: { name: 'Pacote Personalizado' },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cancel`,
    });

    return res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (err: any) {
    console.error('Erro no Stripe Checkout:', err);
    return res.status(500).json({
      error: err.message,
      ...(process.env.NODE_ENV === 'development' && { details: err }),
      });
    }
  }