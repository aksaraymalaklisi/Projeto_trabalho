import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { amount, currency, test_mode } = req.body;

      // Escolhe a chave correta
      const stripeSecretKey = test_mode
        ? process.env.STRIPE_SECRET_KEY_TEST
        : process.env.STRIPE_SECRET_KEY_LIVE;

      if (!stripeSecretKey) {
        throw new Error(`STRIPE_SECRET_KEY_${test_mode ? 'TEST' : 'LIVE'} não configurada`);
      }

      // Cria instância do Stripe com a chave correta
      const stripe = new Stripe(stripeSecretKey, {
        apiVersion: '2025-05-28.basil',
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency,
              product_data: {
                name: 'Pacote Personalizado',
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/cancel`,
      });

      // Retorna sessionId para uso no frontend
      res.status(200).json({ sessionId: session.id, url: session.url });

    } catch (err: any) {
      console.error('Erro ao criar sessão de checkout:', err);
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
