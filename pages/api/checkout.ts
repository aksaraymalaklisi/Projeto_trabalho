import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { amount, currency = 'brl' } = req.body;

    // 🛡️ Validação
    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: 'Valor (amount) inválido ou não fornecido' });
    }

    const amountInCents = Math.round(Number(amount) * 100); // Ex: 10.00 => 1000

    // 🔑 Use apenas STRIPE_SECRET_KEY, que já deve estar correta no .env
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      throw new Error('Stripe secret key não configurada.');
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-05-28.basil',
    });

    // 🖥️ Base URL (para redirecionamento)
    const baseUrl = req.headers.origin || 'http://localhost:3000';

    // 🧾 Criação da sessão de checkout
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

    // ✅ Resposta: redirecionar via frontend
    return res.status(200).json({ sessionId: session.id, url: session.url });

  } catch (err: any) {
    console.error('Erro no Stripe Checkout:', err);
    return res.status(500).json({
      error: err.message,
      ...(process.env.NODE_ENV === 'development' && { details: err }),
    });
  }
}