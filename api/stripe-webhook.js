// pages/api/stripe-webhook.js
import { buffer } from 'micro';
import Stripe from 'stripe';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-05-28.basil',
});

export const config = {
  api: { bodyParser: false },
};

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  let event;

  try {
    const sig = req.headers['stripe-signature'];
    const buf = await buffer(req);

    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Só processa evento de sucesso de pagamento
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Você pode salvar os dados do formulário do cliente nos campos "metadata" da sessão Stripe
    // Exemplo: session.metadata.nome, session.metadata.email, etc.
    // Aqui, só usamos o email e nome se estiverem lá:
    const email = session.customer_details?.email || session.customer_email;
    const name = session.metadata?.name || 'Cliente';

    // Monta o corpo do e-mail
    const html = `
      <p>Olá <strong>${name}</strong>!</p>
      <p>Seu pagamento foi confirmado com sucesso!</p>
      <p>Recebemos seu pedido e já estamos começando a produção do seu logo.</p>
      <p>Em breve você receberá o contato do designer.</p>
      <br/>
      <p><small>(Esse e-mail foi gerado automaticamente após o pagamento no Stripe.)</small></p>
    `;

    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Pagamento confirmado! Pedido recebido',
        html,
      });

      // (Opcional) envie para você mesmo também:
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'marciovinicius1021@gmail.com',
        subject: 'Novo pedido confirmado',
        html: `<p>Novo pedido recebido de: <b>${name}</b> - <a href="mailto:${email}">${email}</a></p>`
      });

      return res.status(200).json({ received: true });
    } catch (e) {
      console.error('Erro ao enviar e-mail:', e);
      // Retorna OK para outros eventos Stripe
      res.status(200).json({ received: true });
    }
  }

  // Retorna OK para outros eventos Stripe que não são 'checkout.session.completed'
  res.status(200).json({ received: true });
}
