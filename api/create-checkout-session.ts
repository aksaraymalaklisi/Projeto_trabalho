import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { amount, currency = 'brl', test_mode = false } = req.body;

    // Validação básica
    if (!amount || isNaN(amount)) {
      throw new Error('Valor (amount) inválido ou não fornecido');
    }

    const amountInCents = Math.round(amount * 100); // Converte para centavos

    // Seleciona a chave correta
    const stripeSecretKey = test_mode
      ? process.env.STRIPE_SECRET_KEY_TEST
      : process.env.STRIPE_SECRET_KEY_LIVE;

    if (!stripeSecretKey) {
      throw new Error(`STRIPE_SECRET_KEY_${test_mode ? 'TEST' : 'LIVE'} não configurada`);
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-04-10', // Versão estável mais recente
    });

    const baseUrl = req.headers.origin || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: 'Pacote Personalizado',
            },
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